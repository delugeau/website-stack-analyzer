import type { CMPDetector } from '../types';

export const usercentricsDetector: CMPDetector = {
  id: 'usercentrics',
  name: 'Usercentrics',
  detect: async (ctx) => {
    const result = await ctx.evaluate(() => {
      const w = window as any;
      if (!w.UC_UI && !w.usercentrics) return null;
      return {
        version: w.UC_UI?.getVersion?.() || null,
        isInitialized: w.UC_UI?.isInitialized?.() || false,
        services: w.UC_UI?.getServicesBaseInfo?.()?.map((s: any) => s.name) || [],
      };
    });
    if (!result) return null;
    return {
      type: 'usercentrics',
      name: 'Usercentrics',
      version: result.version,
      categories: result.services || [],
      rawDetails: result,
    };
  },
};
