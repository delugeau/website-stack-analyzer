import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseRTBHouse(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  return {
    providerId: 'rtb-house',
    providerName: 'RTB House',
    category: 'advertising',
    tagId: params['id'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const rtbHouseProvider: ProviderDefinition = {
  id: 'rtb-house',
  name: 'RTB House',
  category: 'advertising',
  urlPatterns: [
    { pattern: /creativecdn\.com/i, label: 'RTB House creative' },
    { pattern: /rtbhouse\.com/i, label: 'RTB House request' },
    { pattern: /dc\.rtbhouse\.com/i, label: 'RTB House data collection' },
  ],
  parseRequest: parseRTBHouse,
};
