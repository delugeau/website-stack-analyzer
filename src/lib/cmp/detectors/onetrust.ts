import type { CMPDetector } from '../types';

export const onetrustDetector: CMPDetector = {
  id: 'onetrust',
  name: 'OneTrust',
  detect: async (ctx) => {
    const result = await ctx.evaluate(() => {
      const w = window as any;

      // Strategy 1: Check window objects (OneTrust, OptanonActiveGroups, Optanon)
      const hasWindowObjects = !!(w.OneTrust || w.OptanonActiveGroups || w.Optanon);

      // Strategy 2: Check for the OneTrust accept button in the DOM
      const hasAcceptButton = !!document.querySelector('#onetrust-accept-btn-handler');

      // Strategy 3: Check for the OneTrust banner container
      const hasBanner = !!document.querySelector('#onetrust-banner-sdk');

      // Strategy 4: Check for OneTrust-specific scripts
      const hasScript = !!document.querySelector('script[src*="onetrust"], script[src*="optanon"], script[src*="cookielaw.org"], script[src*="cookiepro.com"]');

      if (!hasWindowObjects && !hasAcceptButton && !hasBanner && !hasScript) return null;

      return {
        version: w.OneTrust?.GetDomainData?.()?.CookieVersion || null,
        activeGroups: w.OptanonActiveGroups || null,
        groups: w.OneTrust?.GetDomainData?.()?.Groups?.map((g: any) => g.GroupName) || [],
        isOptanonPresent: !!w.Optanon,
        detectedVia: {
          windowObjects: hasWindowObjects,
          acceptButton: hasAcceptButton,
          banner: hasBanner,
          script: hasScript,
        },
      };
    });
    if (!result) return null;
    return {
      type: 'onetrust',
      name: 'OneTrust',
      version: result.version,
      categories: result.groups,
      rawDetails: result,
    };
  },
};
