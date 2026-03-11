import type { CMPDetector } from '../types';

export const iubendaDetector: CMPDetector = {
  id: 'iubenda',
  name: 'iubenda',
  detect: async (ctx) => {
    const result = await ctx.evaluate(() => {
      const w = window as any;
      if (!w._iub && !w.iubenda) return null;
      return {
        csConfiguration: w._iub?.csConfiguration || null,
        siteId: w._iub?.csConfiguration?.siteId || null,
        cookiePolicyId: w._iub?.csConfiguration?.cookiePolicyId || null,
        purposes: w._iub?.csConfiguration?.purposes || null,
      };
    });
    if (!result) return null;
    return {
      type: 'iubenda',
      name: 'iubenda',
      version: null,
      categories: result.purposes ? Object.keys(result.purposes) : [],
      rawDetails: result,
    };
  },
};
