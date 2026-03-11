import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseKwanko(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  return {
    providerId: 'kwanko',
    providerName: 'Kwanko',
    category: 'advertising',
    tagId: params['mclic'] || params['argmon'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const kwankoProvider: ProviderDefinition = {
  id: 'kwanko',
  name: 'Kwanko',
  category: 'advertising',
  urlPatterns: [
    { pattern: /action\.metaffiliation\.com/i, label: 'Kwanko conversion' },
    { pattern: /track\.kwanko\.com/i, label: 'Kwanko tracking' },
    { pattern: /kwanko\.com/i, label: 'Kwanko request' },
    { pattern: /netlead\.fr/i, label: 'Kwanko Netlead' },
    { pattern: /[a-z0-9]+\.cgm\.[a-z]/i, label: 'Kwanko CGM' },
    { pattern: /cgm\.netaffiliation/i, label: 'Kwanko CGM Netaffiliation' },
  ],
  parseRequest: parseKwanko,
};
