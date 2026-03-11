import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseTravelAudience(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'travel-audience',
    providerName: 'Travel Audience',
    category: 'advertising',
    tagId: params['id'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const travelAudienceProvider: ProviderDefinition = {
  id: 'travel-audience',
  name: 'Travel Audience',
  category: 'advertising',
  urlPatterns: [
    { pattern: /cdn\.travelaudience\.com/i, label: 'Travel Audience CDN' },
    { pattern: /travelaudience\.com/i, label: 'Travel Audience request' },
  ],
  parseRequest: parseTravelAudience,
};
