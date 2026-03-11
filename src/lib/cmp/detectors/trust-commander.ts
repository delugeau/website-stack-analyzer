import type { CMPDetector } from '../types';

export const trustCommanderDetector: CMPDetector = {
  id: 'trust-commander',
  name: 'TrustCommander (Commanders Act)',
  detect: async (ctx) => {
    const result = await ctx.evaluate(() => {
      const w = window as any;
      if (!w.tC?.privacy && !w.cact) return null;
      return {
        categories: w.tC?.privacy?.getCategories?.() || [],
        vendors: w.tC?.privacy?.getVendors?.() || [],
        version: w.tC?.privacy?.version || null,
      };
    });
    if (!result) return null;
    return {
      type: 'trust-commander',
      name: 'TrustCommander (Commanders Act)',
      version: result.version,
      categories: Array.isArray(result.categories) ? result.categories.map((c: any) => c.name || String(c)) : [],
      rawDetails: result,
    };
  },
};
