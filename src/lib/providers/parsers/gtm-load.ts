import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseGTMLoad(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const containerId = url.searchParams.get('id') || null;
  return {
    providerId: 'gtm-load',
    providerName: 'Google Tag Manager',
    category: 'tag-manager',
    tagId: containerId,
    eventName: 'script_load',
    params: { id: containerId || '' },
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const gtmLoadProvider: ProviderDefinition = {
  id: 'gtm-load',
  name: 'Google Tag Manager',
  category: 'tag-manager',
  urlPatterns: [
    // Only gtm.js is GTM — gtag/js with AW- IDs is Google Ads, with G- is GA4
    { pattern: /googletagmanager\.com\/gtm\.js/i, label: 'GTM script load' },
  ],
  parseRequest: parseGTMLoad,
};
