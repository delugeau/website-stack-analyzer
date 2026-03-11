import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseHotjar(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  const siteId = url.pathname.match(/\/(\d+)\//)?.[1] || params['sv'] || null;
  return {
    providerId: 'hotjar',
    providerName: 'Hotjar',
    category: 'experience',
    tagId: siteId,
    eventName: null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const hotjarProvider: ProviderDefinition = {
  id: 'hotjar',
  name: 'Hotjar',
  category: 'experience',
  urlPatterns: [
    { pattern: /static\.hotjar\.com/i, label: 'Hotjar static' },
    { pattern: /script\.hotjar\.com/i, label: 'Hotjar script' },
    { pattern: /vars\.hotjar\.com/i, label: 'Hotjar vars' },
    { pattern: /in\.hotjar\.com/i, label: 'Hotjar data' },
    { pattern: /insights\.hotjar\.com/i, label: 'Hotjar insights' },
  ],
  parseRequest: parseHotjar,
};
