import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseFlashtalking(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'flashtalking',
    providerName: 'Flashtalking',
    category: 'advertising',
    tagId: params['spotId'] || params['id'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const flashtalkingProvider: ProviderDefinition = {
  id: 'flashtalking',
  name: 'Flashtalking',
  category: 'advertising',
  urlPatterns: [
    { pattern: /servedby\.flashtalking\.com/i, label: 'Flashtalking served' },
    { pattern: /flashtalking\.com/i, label: 'Flashtalking request' },
  ],
  parseRequest: parseFlashtalking,
};
