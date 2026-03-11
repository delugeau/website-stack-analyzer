import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseGoogleAds(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  // For gtag/js?id=AW-xxx loads, the tag ID is the AW-xxx container
  const awId = params['id'] && params['id'].startsWith('AW-') ? params['id'] : null;
  const conversionId = awId || params['label'] || params['conversion_id'] || null;

  return {
    providerId: 'google-ads',
    providerName: 'Google Ads',
    category: 'advertising',
    tagId: conversionId,
    eventName: awId ? 'script_load' : (params['event'] || 'conversion'),
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const googleAdsProvider: ProviderDefinition = {
  id: 'google-ads',
  name: 'Google Ads',
  category: 'advertising',
  urlPatterns: [
    // gtag/js with AW- ID = Google Ads tag, not GTM
    { pattern: /googletagmanager\.com\/gtag\/js\?[^"]*id=AW-/i, label: 'Google Ads gtag.js load' },
    { pattern: /googleads\.g\.doubleclick\.net\/pagead/i, label: 'Google Ads conversion (DC)' },
    { pattern: /googleadservices\.com\/pagead/i, label: 'Google Ads pagead' },
    { pattern: /google\.com\/ads\/ga-audiences/i, label: 'Google Ads audiences' },
  ],
  parseRequest: parseGoogleAds,
};
