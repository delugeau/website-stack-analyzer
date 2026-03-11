import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseTradeDesk(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  // Extract advertiser ID from common TTD parameters
  const tagId = params['adv'] || params['advertiser_id'] || null;

  return {
    providerId: 'trade-desk',
    providerName: 'The Trade Desk',
    category: 'advertising',
    tagId,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const tradeDeskProvider: ProviderDefinition = {
  id: 'trade-desk',
  name: 'The Trade Desk',
  category: 'advertising',
  urlPatterns: [
    { pattern: /js\.adsrvr\.org/i, label: 'The Trade Desk JS' },
    { pattern: /match\.adsrvr\.org/i, label: 'The Trade Desk match' },
    { pattern: /insight\.adsrvr\.org/i, label: 'The Trade Desk insight' },
    { pattern: /thetradedesk\.com/i, label: 'The Trade Desk request' },
  ],
  parseRequest: parseTradeDesk,
};
