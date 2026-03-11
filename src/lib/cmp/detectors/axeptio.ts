import type { CMPDetector } from '../types';

export const axeptioDetector: CMPDetector = {
  id: 'axeptio',
  name: 'Axeptio',
  detect: async (ctx) => {
    const result = await ctx.evaluate(() => {
      const w = window as any;
      if (!w.axeptioSettings && !w._axcb) return null;
      return {
        clientId: w.axeptioSettings?.clientId || null,
        cookiesVersion: w.axeptioSettings?.cookiesVersion || null,
      };
    });
    if (!result) {
      const scripts = await ctx.getScriptSrcs();
      const axeptioScript = scripts.find((s) => s.includes('axeptio') || s.includes('static.axept.io'));
      if (!axeptioScript) return null;
      return {
        type: 'axeptio',
        name: 'Axeptio',
        version: null,
        categories: [],
        rawDetails: { detectedVia: 'script' },
      };
    }
    return {
      type: 'axeptio',
      name: 'Axeptio',
      version: result.cookiesVersion,
      categories: [],
      rawDetails: result,
    };
  },
};
