import type { Page } from 'playwright';
import type { ConsentResult } from '../types/cmp';
import { detectCMP } from '../cmp';
import { acceptConsent } from '../cmp/consent-acceptor';

export async function handleConsent(page: Page): Promise<ConsentResult> {
  const cmpResult = await detectCMP(page);

  if (!cmpResult.detected) {
    return {
      detected: false,
      accepted: false,
      cmpType: null,
      cmpName: null,
      cmpVersion: null,
      tcf: null,
      categories: [],
    };
  }

  const accepted = await acceptConsent(page, cmpResult.type);

  // Wait for consent to propagate
  if (accepted) {
    await page.waitForTimeout(3000);
  }

  return {
    detected: true,
    accepted,
    cmpType: cmpResult.type,
    cmpName: cmpResult.name,
    cmpVersion: cmpResult.version,
    tcf: cmpResult.tcf,
    categories: cmpResult.categories,
  };
}
