import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseAdotmob(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'adotmob',
    providerName: 'Adotmob',
    category: 'advertising',
    tagId: params['id'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const adotmobProvider: ProviderDefinition = {
  id: 'adotmob',
  name: 'Adotmob',
  category: 'advertising',
  urlPatterns: [
    { pattern: /tag\.adotmob\.com/i, label: 'Adotmob tag' },
    { pattern: /adotmob\.com/i, label: 'Adotmob request' },
  ],
  parseRequest: parseAdotmob,
};
