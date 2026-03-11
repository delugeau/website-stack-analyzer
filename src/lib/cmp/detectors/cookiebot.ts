import type { CMPDetector } from '../types';

export const cookiebotDetector: CMPDetector = {
  id: 'cookiebot',
  name: 'Cookiebot',
  detect: async (ctx) => {
    const result = await ctx.evaluate(() => {
      const w = window as any;
      if (!w.Cookiebot && !w.CookieConsent) return null;
      const cb = w.Cookiebot || w.CookieConsent;
      return {
        version: cb?.version || null,
        consent: cb?.consent || {},
        regulations: cb?.regulations || {},
      };
    });
    if (!result) return null;
    const categories = [];
    if (result.consent) {
      for (const [key, val] of Object.entries(result.consent)) {
        if (typeof val === 'boolean') categories.push(key);
      }
    }
    return {
      type: 'cookiebot',
      name: 'Cookiebot',
      version: result.version,
      categories,
      rawDetails: result,
    };
  },
};
