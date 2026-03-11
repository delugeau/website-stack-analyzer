import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseDidomi(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'didomi',
    providerName: 'Didomi',
    category: 'privacy',
    tagId: null,
    eventName: null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const didomiProvider: ProviderDefinition = {
  id: 'didomi',
  name: 'Didomi',
  category: 'privacy',
  urlPatterns: [
    { pattern: /sdk\.privacy-center\.org/i, label: 'Didomi SDK' },
    { pattern: /api\.privacy-center\.org/i, label: 'Didomi API' },
    { pattern: /cdn\.didomi\.io/i, label: 'Didomi CDN' },
    { pattern: /sdk\.didomi\.io/i, label: 'Didomi SDK' },
    { pattern: /api\.didomi\.io/i, label: 'Didomi API' },
  ],
  parseRequest: parseDidomi,
};
