import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseOgury(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'ogury',
    providerName: 'Ogury',
    category: 'advertising',
    tagId: params['id'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const oguryProvider: ProviderDefinition = {
  id: 'ogury',
  name: 'Ogury',
  category: 'advertising',
  urlPatterns: [
    { pattern: /cdn\.ogury\.io/i, label: 'Ogury CDN' },
    { pattern: /ogury\.com/i, label: 'Ogury request' },
    { pattern: /ogury\.io/i, label: 'Ogury IO' },
  ],
  parseRequest: parseOgury,
};
