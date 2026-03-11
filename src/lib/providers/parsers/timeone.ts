import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseTimeOne(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  return {
    providerId: 'timeone',
    providerName: 'TimeOne',
    category: 'advertising',
    tagId: params['campaign'] || params['id'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const timeoneProvider: ProviderDefinition = {
  id: 'timeone',
  name: 'TimeOne',
  category: 'advertising',
  urlPatterns: [
    { pattern: /logbor\.com/i, label: 'TimeOne Logbor' },
    { pattern: /timeonegroup\.com/i, label: 'TimeOne Group' },
    { pattern: /tracking\.timeone/i, label: 'TimeOne tracking' },
    { pattern: /timeone\.[a-z]+/i, label: 'TimeOne request' },
  ],
  parseRequest: parseTimeOne,
};
