import type { CMPDetector } from '../types';

export const quantcastDetector: CMPDetector = {
  id: 'quantcast',
  name: 'Quantcast Choice',
  detect: async (ctx) => {
    const result = await ctx.evaluate(() => {
      const w = window as any;
      if (!w.__cmp && !w.quantserve) return null;
      return {
        hasQcCmp: !!w.__cmp,
        version: null,
      };
    });
    if (!result) {
      const scripts = await ctx.getScriptSrcs();
      const qcScript = scripts.find((s) => s.includes('quantcast') || s.includes('choice.'));
      if (!qcScript) return null;
      return { type: 'quantcast', name: 'Quantcast Choice', version: null, categories: [], rawDetails: { detectedVia: 'script' } };
    }
    return { type: 'quantcast', name: 'Quantcast Choice', version: null, categories: [], rawDetails: result };
  },
};
