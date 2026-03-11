import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseDoubleClick(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  // Try to extract a meaningful event from the URL path
  let eventName: string | null = null;
  if (url.pathname.includes('/pagead/')) eventName = 'pagead';
  else if (url.pathname.includes('/ad_status')) eventName = 'ad_status';
  else if (url.pathname.includes('/activity')) eventName = 'activity';
  else if (url.pathname.includes('/ddm/')) eventName = 'Floodlight';

  return {
    providerId: 'doubleclick',
    providerName: 'DoubleClick (Google)',
    category: 'advertising',
    tagId: params['dc_rdid'] || params['src'] || null,
    eventName,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const doubleclickProvider: ProviderDefinition = {
  id: 'doubleclick',
  name: 'DoubleClick (Google)',
  category: 'advertising',
  urlPatterns: [
    { pattern: /doubleclick\.net/i, label: 'DoubleClick request' },
    { pattern: /ad\.doubleclick/i, label: 'DoubleClick ad' },
    { pattern: /fls\.doubleclick/i, label: 'DoubleClick Floodlight' },
    { pattern: /stats\.g\.doubleclick/i, label: 'DoubleClick stats' },
    { pattern: /cm\.g\.doubleclick/i, label: 'DoubleClick cookie matching' },
  ],
  parseRequest: parseDoubleClick,
};
