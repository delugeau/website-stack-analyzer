import type { Page } from 'playwright';
import type { TCFData } from '../types/cmp';

export async function detectTCF(page: Page): Promise<TCFData | null> {
  return page.evaluate(() => {
    return new Promise<any>((resolve) => {
      const w = window as any;
      if (typeof w.__tcfapi !== 'function') {
        resolve(null);
        return;
      }
      const timeout = setTimeout(() => resolve(null), 3000);
      w.__tcfapi('addEventListener', 2, (tcData: any, success: boolean) => {
        clearTimeout(timeout);
        if (success && tcData) {
          resolve({
            cmpId: tcData.cmpId || 0,
            cmpVersion: tcData.cmpVersion || 0,
            gdprApplies: tcData.gdprApplies ?? false,
            tcString: tcData.tcString || '',
            purpose: tcData.purpose || {},
            vendor: tcData.vendor || {},
            eventStatus: tcData.eventStatus || '',
          });
        } else {
          resolve(null);
        }
      });
    });
  });
}
