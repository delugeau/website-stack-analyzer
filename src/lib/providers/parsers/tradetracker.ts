import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseTradetracker(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  return {
    providerId: 'tradetracker',
    providerName: 'TradeTracker',
    category: 'advertising',
    tagId: params['campaignID'] || params['cid'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const tradetrackerProvider: ProviderDefinition = {
  id: 'tradetracker',
  name: 'TradeTracker',
  category: 'advertising',
  urlPatterns: [
    { pattern: /tradetracker\.net/i, label: 'TradeTracker request' },
    { pattern: /ts\.tradetracker/i, label: 'TradeTracker tracking' },
    { pattern: /tc\.tradetracker/i, label: 'TradeTracker conversion' },
  ],
  parseRequest: parseTradetracker,
};
