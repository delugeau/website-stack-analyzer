import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseEloqua(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'eloqua',
    providerName: 'Oracle Eloqua',
    category: 'advertising',
    tagId: params['elqSiteId'] || params['siteId'] || null,
    eventName: null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const eloquaProvider: ProviderDefinition = {
  id: 'eloqua',
  name: 'Oracle Eloqua',
  category: 'advertising',
  urlPatterns: [
    { pattern: /eloqua\.com/i, label: 'Eloqua request' },
    { pattern: /elqCfg\.min\.js/i, label: 'Eloqua config script' },
    { pattern: /elqImg\.gif/i, label: 'Eloqua tracking pixel' },
    { pattern: /tracking\.eloqua\.com/i, label: 'Eloqua tracking' },
  ],
  parseRequest: parseEloqua,
};
