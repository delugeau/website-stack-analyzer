import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseMixpanel(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  let token: string | null = null;
  if (params['data']) {
    try {
      const decoded = JSON.parse(atob(params['data']));
      token = decoded?.properties?.token || null;
    } catch {}
  }
  return {
    providerId: 'mixpanel',
    providerName: 'Mixpanel',
    category: 'analytics',
    tagId: token,
    eventName: null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const mixpanelProvider: ProviderDefinition = {
  id: 'mixpanel',
  name: 'Mixpanel',
  category: 'analytics',
  urlPatterns: [
    { pattern: /cdn\.mxpnl\.com/i, label: 'Mixpanel CDN' },
    { pattern: /api\.mixpanel\.com/i, label: 'Mixpanel API' },
    { pattern: /api-js\.mixpanel\.com/i, label: 'Mixpanel JS API' },
  ],
  parseRequest: parseMixpanel,
};
