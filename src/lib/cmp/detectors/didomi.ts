import type { CMPDetector } from '../types';

export const didomiDetector: CMPDetector = {
  id: 'didomi',
  name: 'Didomi',
  detect: async (ctx) => {
    const result = await ctx.evaluate(() => {
      const w = window as any;
      if (!w.Didomi && !w.__didomi) return null;
      const didomi = w.Didomi || w.__didomi;
      return {
        version: didomi?.version || null,
        purposes: didomi?.getUserConsentStatusForAll?.()?.purposes || {},
        isConsentRequired: didomi?.isConsentRequired?.() ?? null,
      };
    });
    if (!result) return null;
    return {
      type: 'didomi',
      name: 'Didomi',
      version: result.version,
      categories: Object.keys(result.purposes || {}),
      rawDetails: result,
    };
  },
};
