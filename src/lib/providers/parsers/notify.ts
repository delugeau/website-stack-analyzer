import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseNotify(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'notify',
    providerName: 'Notify',
    category: 'other',
    tagId: params['id'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const notifyProvider: ProviderDefinition = {
  id: 'notify',
  name: 'Notify',
  category: 'other',
  urlPatterns: [
    { pattern: /cdn\.notify\.com/i, label: 'Notify CDN' },
    { pattern: /notify\.com/i, label: 'Notify request' },
  ],
  parseRequest: parseNotify,
};
