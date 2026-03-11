import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseGA4(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  // Also parse POST body if present (GA4 sends via POST)
  if (req.postData) {
    req.postData.split('&').forEach((pair) => {
      const [k, ...vParts] = pair.split('=');
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(vParts.join('=') || '');
    });
  }

  // For gtag/js?id=G-xxx loads, use the G- ID as measurement ID
  const gTagId = params['id'] && params['id'].startsWith('G-') ? params['id'] : null;
  const measurementId = gTagId || params['tid'] || null;
  const eventName = gTagId ? 'script_load' : (params['en'] || params['t'] || null);

  return {
    providerId: 'ga4',
    providerName: 'Google Analytics 4',
    category: 'analytics',
    tagId: measurementId,
    eventName,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const ga4Provider: ProviderDefinition = {
  id: 'ga4',
  name: 'Google Analytics 4',
  category: 'analytics',
  urlPatterns: [
    // gtag/js with G- ID = GA4 measurement stream, not GTM
    { pattern: /googletagmanager\.com\/gtag\/js\?[^"]*id=G-/i, label: 'GA4 gtag.js load' },
    { pattern: /google-analytics\.com\/g\/collect/i, label: 'GA4 collect' },
    { pattern: /analytics\.google\.com\/g\/collect/i, label: 'GA4 collect (alt)' },
    { pattern: /google-analytics\.com\/collect/i, label: 'GA Universal/GA4 collect' },
    { pattern: /www\.google-analytics\.com\/j\/collect/i, label: 'GA4 j/collect' },
    { pattern: /region\d+\.google-analytics\.com/i, label: 'GA4 regional endpoint' },
  ],
  parseRequest: parseGA4,
};
