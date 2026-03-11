import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseAskLocala(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'asklocala',
    providerName: 'AskLocala',
    category: 'advertising',
    tagId: params['id'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const asklocalaProvider: ProviderDefinition = {
  id: 'asklocala',
  name: 'AskLocala',
  category: 'advertising',
  urlPatterns: [
    { pattern: /cdn\.asklocala\.com/i, label: 'AskLocala CDN' },
    { pattern: /asklocala\.com/i, label: 'AskLocala request' },
  ],
  parseRequest: parseAskLocala,
};
