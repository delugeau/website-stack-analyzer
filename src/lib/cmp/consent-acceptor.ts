import type { Page } from 'playwright';

const ACCEPT_SELECTORS: Record<string, string[]> = {
  didomi: [
    '#didomi-notice-agree-button',
    '[data-testid="notice-agree-button"]',
    '.didomi-popup-notice-buttons button:first-child',
  ],
  onetrust: [
    '#onetrust-accept-btn-handler',
    '.onetrust-close-btn-handler',
    '[data-action="accept"]',
  ],
  axeptio: [
    '[data-axeptio-action="accept"]',
    '.axeptio_btn_accept',
    'button[aria-label*="accept"]',
  ],
  cookiebot: [
    '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
    '#CybotCookiebotDialogBodyButtonAccept',
    'a#CybotCookiebotDialogBodyLevelButtonAccept',
  ],
  'trust-commander': [
    '#popin_tc_privacy_button_2',
    '#popin_tc_privacy_button_3',
    '.tc-privacy-button-accept',
  ],
  quantcast: [
    '.qc-cmp2-summary-buttons button[mode="primary"]',
    '.qc-cmp-button[data-action="agree"]',
  ],
  usercentrics: [
    '[data-testid="uc-accept-all-button"]',
    '#uc-btn-accept-banner',
    'button.sc-eBMEME',
  ],
  iubenda: [
    '.iubenda-cs-accept-btn',
    '#iubenda-cs-banner .iubenda-cs-btn-primary',
  ],
  sirdata: [
    '.sd-cmp-2GBtn',
    'button[data-action="accept-all"]',
  ],
  hubspot: [
    '#hs-eu-confirmation-button',
  ],
};

const GENERIC_SELECTORS = [
  'button[id*="accept" i]',
  'button[class*="accept" i]',
  'a[id*="accept" i]',
  'button[aria-label*="accepter" i]',
  'button[aria-label*="accept all" i]',
  'button[aria-label*="tout accepter" i]',
  '[data-action="accept"]',
];

export async function acceptConsent(page: Page, cmpType: string | null): Promise<boolean> {
  // Try CMP-specific selectors first
  if (cmpType && ACCEPT_SELECTORS[cmpType]) {
    for (const selector of ACCEPT_SELECTORS[cmpType]) {
      try {
        const btn = page.locator(selector).first();
        if (await btn.isVisible({ timeout: 1000 })) {
          await btn.click({ timeout: 2000 });
          return true;
        }
      } catch {
        continue;
      }
    }
  }

  // Fallback to generic selectors
  for (const selector of GENERIC_SELECTORS) {
    try {
      const btn = page.locator(selector).first();
      if (await btn.isVisible({ timeout: 500 })) {
        await btn.click({ timeout: 2000 });
        return true;
      }
    } catch {
      continue;
    }
  }

  // Last resort: try TCF API programmatic consent
  try {
    const tcfAccepted = await page.evaluate(() => {
      const w = window as any;
      if (typeof w.__tcfapi === 'function') {
        return new Promise<boolean>((resolve) => {
          w.__tcfapi('setConsent', 2, (success: boolean) => resolve(success), { allConsent: true });
          setTimeout(() => resolve(false), 2000);
        });
      }
      return false;
    });
    if (tcfAccepted) return true;
  } catch {
    // ignore
  }

  return false;
}
