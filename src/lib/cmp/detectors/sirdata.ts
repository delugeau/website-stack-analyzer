import type { CMPDetector } from '../types';

export const sirdataDetector: CMPDetector = {
  id: 'sirdata',
  name: 'Sirdata',
  detect: async (ctx) => {
    const result = await ctx.evaluate(() => {
      const w = window as any;
      if (!w.Sddan && !w.sddan) return null;
      return { hasSddan: true };
    });
    if (!result) {
      const scripts = await ctx.getScriptSrcs();
      const sirdataScript = scripts.find((s) => s.includes('sirdata') || s.includes('sddan'));
      if (!sirdataScript) return null;
      return { type: 'sirdata', name: 'Sirdata', version: null, categories: [], rawDetails: { detectedVia: 'script' } };
    }
    return { type: 'sirdata', name: 'Sirdata', version: null, categories: [], rawDetails: result };
  },
};
