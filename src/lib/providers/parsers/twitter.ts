import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseTwitter(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  const pixelId = params['txn_id'] || params['id'] || null;
  return {
    providerId: 'twitter',
    providerName: 'X (Twitter) Pixel',
    category: 'advertising',
    tagId: pixelId,
    eventName: params['events'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const twitterProvider: ProviderDefinition = {
  id: 'twitter',
  name: 'X (Twitter) Pixel',
  category: 'advertising',
  urlPatterns: [
    { pattern: /analytics\.twitter\.com\/i\/adsct/i, label: 'Twitter Ads' },
    { pattern: /t\.co\/i\/adsct/i, label: 'Twitter tracking' },
    { pattern: /ads-api\.twitter\.com/i, label: 'Twitter Ads API' },
    { pattern: /static\.ads-twitter\.com/i, label: 'Twitter Ads static' },
  ],
  parseRequest: parseTwitter,
};
