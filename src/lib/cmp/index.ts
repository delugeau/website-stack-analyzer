import type { Page } from 'playwright';
import type { CMPDetectionResult } from '../types/cmp';
import type { CMPDetector, CMPDetectionContext } from './types';
import { didomiDetector } from './detectors/didomi';
import { onetrustDetector } from './detectors/onetrust';
import { axeptioDetector } from './detectors/axeptio';
import { cookiebotDetector } from './detectors/cookiebot';
import { trustCommanderDetector } from './detectors/trust-commander';
import { quantcastDetector } from './detectors/quantcast';
import { usercentricsDetector } from './detectors/usercentrics';
import { iubendaDetector } from './detectors/iubenda';
import { sirdataDetector } from './detectors/sirdata';
import { hubspotCmpDetector } from './detectors/hubspot-cmp';
import { detectTCF } from './tcf';

const CMP_DETECTORS: CMPDetector[] = [
  didomiDetector,
  onetrustDetector,
  axeptioDetector,
  cookiebotDetector,
  trustCommanderDetector,
  quantcastDetector,
  usercentricsDetector,
  iubendaDetector,
  sirdataDetector,
  hubspotCmpDetector,
];

function createContext(page: Page): CMPDetectionContext {
  return {
    evaluate: (fn: any) => page.evaluate(fn),
    querySelectorAll: async (selector: string) => {
      return page.evaluate((sel) => {
        return Array.from(document.querySelectorAll(sel)).map((el) => el.outerHTML.slice(0, 200));
      }, selector);
    },
    getScriptSrcs: async () => {
      return page.evaluate(() => {
        return Array.from(document.querySelectorAll('script[src]')).map((s) => (s as HTMLScriptElement).src);
      });
    },
  };
}

export async function detectCMP(page: Page): Promise<CMPDetectionResult> {
  const ctx = createContext(page);

  for (const detector of CMP_DETECTORS) {
    try {
      const result = await detector.detect(ctx);
      if (result) {
        const tcf = await detectTCF(page);
        return {
          detected: true,
          type: result.type as any,
          name: result.name,
          version: result.version,
          tcf,
          categories: result.categories,
          rawDetails: result.rawDetails,
        };
      }
    } catch {
      continue;
    }
  }

  // No specific CMP found, still check for TCF
  const tcf = await detectTCF(page);
  if (tcf) {
    return {
      detected: true,
      type: 'unknown',
      name: 'Unknown (TCF detected)',
      version: null,
      tcf,
      categories: [],
      rawDetails: {},
    };
  }

  return {
    detected: false,
    type: null,
    name: null,
    version: null,
    tcf: null,
    categories: [],
    rawDetails: {},
  };
}
