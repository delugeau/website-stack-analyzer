import { v4 as uuidv4 } from 'uuid';
import type { Page } from 'playwright';
import { browserManager } from './browser';
import { NetworkCapture } from './network-capture';
import { collectCookies } from './cookie-collector';
import { getDataLayer } from './page-evaluator';
import { handleConsent } from './consent-handler';
import { detectGTM } from './gtm-detector';
import { detectCMP } from '../cmp';
import { classifyAllRequests } from '../providers';
import { analyzeResults } from '../analysis';
import type { ScanOptions, ScanResults, ScanStatus, PassResults } from '../types/scan';
import type { CapturedRequest } from '../types/network';

const DEFAULT_WAIT_AFTER_LOAD = 5000;
const DEFAULT_TIMEOUT = 60000;
const WAIT_BEFORE_RELOAD = 3000;

/**
 * Resilient page navigation: tries `networkidle` first, falls back to
 * `domcontentloaded` + extra wait if the site keeps firing requests and
 * never becomes truly idle (e.g. ad-heavy pages like garnier.fr).
 */
async function resilientGoto(page: Page, url: string, timeout: number, extraWait: number): Promise<void> {
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout });
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('Timeout') || msg.includes('timeout')) {
      // networkidle timed out — the page loaded but network is still busy.
      // Fall back to domcontentloaded + a generous wait for tags to fire.
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout });
      await page.waitForTimeout(extraWait);
    } else {
      throw err;
    }
  }
}

/**
 * Resilient page reload with the same fallback strategy.
 */
async function resilientReload(page: Page, timeout: number, extraWait: number): Promise<void> {
  try {
    await page.reload({ waitUntil: 'networkidle', timeout });
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('Timeout') || msg.includes('timeout')) {
      await page.reload({ waitUntil: 'domcontentloaded', timeout });
      await page.waitForTimeout(extraWait);
    } else {
      throw err;
    }
  }
}

export async function runScan(
  scanId: string,
  url: string,
  options?: ScanOptions,
  onProgress?: (status: ScanStatus, progress: number, currentStep: string) => void
): Promise<ScanResults> {
  const timeout = options?.timeout || DEFAULT_TIMEOUT;
  const waitAfterLoad = options?.waitAfterLoad || DEFAULT_WAIT_AFTER_LOAD;
  const startedAt = Date.now();

  let context;
  try {
    // Phase 1: Browser setup
    onProgress?.('scanning_pre_consent', 5, 'Launching browser...');
    context = await browserManager.createContext(options);
    const page = await context.newPage();

    // Phase 2: Pre-consent scan
    onProgress?.('scanning_pre_consent', 10, 'Navigating to URL...');
    const preConsentCapture = new NetworkCapture();
    preConsentCapture.attach(page);

    await resilientGoto(page, url, timeout, 8000);

    onProgress?.('scanning_pre_consent', 25, 'Waiting for late-firing tags...');
    await page.waitForTimeout(waitAfterLoad);

    // Snapshot pre-consent state
    onProgress?.('scanning_pre_consent', 35, 'Capturing pre-consent state...');
    const preConsentRequests = preConsentCapture.snapshot();
    const preConsentCookies = await collectCookies(page);
    const preConsentDataLayer = await getDataLayer(page);

    // Detect CMP
    onProgress?.('detecting_cmp', 40, 'Detecting CMP...');
    const cmpResult = await detectCMP(page);

    // Detect GTM
    onProgress?.('detecting_cmp', 45, 'Detecting GTM...');
    const gtmResult = await detectGTM(page, preConsentRequests as CapturedRequest[]);

    // Classify pre-consent requests
    const preConsentClassified = classifyAllRequests(preConsentRequests as CapturedRequest[]);

    // Detect Piano Analytics consent mode before consent
    // The PA SDK may take a moment to initialise — poll for up to 3 s.
    let pianoConsentModePre: string | undefined;
    try {
      pianoConsentModePre = await page.evaluate(async () => {
        const MAX_WAIT = 3000;
        const INTERVAL = 200;
        const getMode = (): string | undefined => {
          try {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const w = window as any;
            // Modern consent API (SDK ≥ 6.8)
            if (w.pa?.consent?.getMode) return String(w.pa.consent.getMode());
            // Legacy privacy API
            if (w.pa?.privacy?.getMode) return String(w.pa.privacy.getMode());
            // Some setups expose PA in uppercase
            if (w.PA?.consent?.getMode) return String(w.PA.consent.getMode());
            if (w.PA?.privacy?.getMode) return String(w.PA.privacy.getMode());
            // pianoAnalytics alias used by some implementations
            if (w.pianoAnalytics?.consent?.getMode) return String(w.pianoAnalytics.consent.getMode());
            /* eslint-enable @typescript-eslint/no-explicit-any */
          } catch { /* ignore */ }
          return undefined;
        };
        // Try immediately first
        const immediate = getMode();
        if (immediate) return immediate;
        // Poll until the SDK is ready
        let elapsed = 0;
        while (elapsed < MAX_WAIT) {
          await new Promise((r) => setTimeout(r, INTERVAL));
          elapsed += INTERVAL;
          const result = getMode();
          if (result) return result;
        }
        return undefined;
      }) as string | undefined;
    } catch {
      // Piano Analytics not present, ignore
    }

    const preConsent: PassResults = {
      networkRequests: preConsentRequests as CapturedRequest[],
      classifiedRequests: preConsentClassified.classified,
      cookies: preConsentCookies,
      dataLayer: preConsentDataLayer,
    };

    // Phase 3: Accept consent
    onProgress?.('accepting_consent', 50, 'Accepting consent...');
    const consentResult = await handleConsent(page);

    // Phase 4: Post-consent scan
    onProgress?.('scanning_post_consent', 60, 'Reloading page after consent...');
    const postConsentCapture = new NetworkCapture();

    // Wait for dynamic tag firing after consent
    await page.waitForTimeout(WAIT_BEFORE_RELOAD);

    // Clear and re-attach for fresh capture
    postConsentCapture.attach(page);

    // Reload page to capture full post-consent behavior
    await resilientReload(page, timeout, 8000);

    onProgress?.('scanning_post_consent', 75, 'Waiting for post-consent tags...');
    await page.waitForTimeout(waitAfterLoad);

    // Capture screenshot after consent (CMP banner is dismissed)
    let screenshot: string | null = null;
    try {
      const screenshotBuffer = await page.screenshot({ type: 'jpeg', quality: 70, fullPage: false });
      screenshot = `data:image/jpeg;base64,${screenshotBuffer.toString('base64')}`;
    } catch {
      // Screenshot failed, non-critical
    }

    // Snapshot post-consent state
    onProgress?.('scanning_post_consent', 85, 'Capturing post-consent state...');
    const postConsentRequests = postConsentCapture.snapshot();
    const postConsentCookies = await collectCookies(page);
    const postConsentDataLayer = await getDataLayer(page);

    const postConsentClassified = classifyAllRequests(postConsentRequests as CapturedRequest[]);

    const postConsent: PassResults = {
      networkRequests: postConsentRequests as CapturedRequest[],
      classifiedRequests: postConsentClassified.classified,
      cookies: postConsentCookies,
      dataLayer: postConsentDataLayer,
    };

    // Detect Piano Analytics consent mode after consent
    // Post-consent the SDK should already be loaded — poll briefly.
    let pianoConsentModePost: string | undefined;
    try {
      pianoConsentModePost = await page.evaluate(async () => {
        const MAX_WAIT = 3000;
        const INTERVAL = 200;
        const getMode = (): string | undefined => {
          try {
            /* eslint-disable @typescript-eslint/no-explicit-any */
            const w = window as any;
            if (w.pa?.consent?.getMode) return String(w.pa.consent.getMode());
            if (w.pa?.privacy?.getMode) return String(w.pa.privacy.getMode());
            if (w.PA?.consent?.getMode) return String(w.PA.consent.getMode());
            if (w.PA?.privacy?.getMode) return String(w.PA.privacy.getMode());
            if (w.pianoAnalytics?.consent?.getMode) return String(w.pianoAnalytics.consent.getMode());
            /* eslint-enable @typescript-eslint/no-explicit-any */
          } catch { /* ignore */ }
          return undefined;
        };
        const immediate = getMode();
        if (immediate) return immediate;
        let elapsed = 0;
        while (elapsed < MAX_WAIT) {
          await new Promise((r) => setTimeout(r, INTERVAL));
          elapsed += INTERVAL;
          const result = getMode();
          if (result) return result;
        }
        return undefined;
      }) as string | undefined;
    } catch {
      // Piano Analytics not present, ignore
    }

    // Phase 5: Analysis
    onProgress?.('analyzing', 90, 'Analyzing results...');
    const analysis = analyzeResults(preConsent, postConsent, {
      pianoConsentModePre,
      pianoConsentModePost,
    });

    const results: ScanResults = {
      scanId,
      url,
      scannedAt: new Date().toISOString(),
      duration: Date.now() - startedAt,
      screenshot,
      cmp: cmpResult,
      consent: consentResult,
      gtm: gtmResult,
      preConsent,
      postConsent,
      analysis,
    };

    return results;
  } finally {
    if (context) {
      await context.close().catch(() => {});
    }
  }
}

export { uuidv4 as generateScanId };
