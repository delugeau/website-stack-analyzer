import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseEnovate(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'enovate',
    providerName: 'E-novate',
    category: 'other',
    tagId: params['id'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const enovateProvider: ProviderDefinition = {
  id: 'enovate',
  name: 'E-novate',
  category: 'other',
  urlPatterns: [
    { pattern: /cdn\.e-novate\.io/i, label: 'E-novate CDN' },
    { pattern: /e-novate\.io/i, label: 'E-novate request' },
  ],
  parseRequest: parseEnovate,
};
