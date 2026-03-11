import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parsePinterest(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  const tagId = params['tid'] || null;
  return {
    providerId: 'pinterest',
    providerName: 'Pinterest Tag',
    category: 'advertising',
    tagId,
    eventName: params['event'] || params['ed[event_name]'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const pinterestProvider: ProviderDefinition = {
  id: 'pinterest',
  name: 'Pinterest Tag',
  category: 'advertising',
  urlPatterns: [
    { pattern: /s\.pinimg\.com\/ct\/core\.js/i, label: 'Pinterest tag script' },
    { pattern: /ct\.pinterest\.com/i, label: 'Pinterest tracking' },
    { pattern: /analytics\.pinterest\.com/i, label: 'Pinterest analytics' },
  ],
  parseRequest: parsePinterest,
};
