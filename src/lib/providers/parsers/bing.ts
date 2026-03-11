import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseBing(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  const tagId = params['ti'] || null;
  return {
    providerId: 'bing',
    providerName: 'Microsoft Ads (Bing UET)',
    category: 'advertising',
    tagId,
    eventName: params['evt'] || params['ea'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const bingProvider: ProviderDefinition = {
  id: 'bing',
  name: 'Microsoft Ads (Bing UET)',
  category: 'advertising',
  urlPatterns: [
    { pattern: /bat\.bing\.com/i, label: 'Bing UET' },
    { pattern: /bat\.r\.msn\.com/i, label: 'Bing UET (alt)' },
  ],
  parseRequest: parseBing,
};
