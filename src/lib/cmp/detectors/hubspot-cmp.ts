import type { CMPDetector } from '../types';

export const hubspotCmpDetector: CMPDetector = {
  id: 'hubspot',
  name: 'HubSpot Cookie Banner',
  detect: async (ctx) => {
    const result = await ctx.evaluate(() => {
      const w = window as any;
      if (!w._hsp) return null;
      return { hasHsp: true };
    });
    if (!result) {
      const scripts = await ctx.getScriptSrcs();
      const hsScript = scripts.find((s) => s.includes('js.hs-banner.com'));
      if (!hsScript) return null;
      return { type: 'hubspot', name: 'HubSpot Cookie Banner', version: null, categories: [], rawDetails: { detectedVia: 'script' } };
    }
    return { type: 'hubspot', name: 'HubSpot Cookie Banner', version: null, categories: [], rawDetails: result };
  },
};
