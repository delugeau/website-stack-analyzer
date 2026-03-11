import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseTikTok(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  const pixelId = params['sdkid'] || params['pixel_code'] || null;
  const eventName = params['event'] || null;
  return {
    providerId: 'tiktok',
    providerName: 'TikTok Pixel',
    category: 'advertising',
    tagId: pixelId,
    eventName,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const tiktokProvider: ProviderDefinition = {
  id: 'tiktok',
  name: 'TikTok Pixel',
  category: 'advertising',
  urlPatterns: [
    { pattern: /analytics\.tiktok\.com/i, label: 'TikTok analytics' },
    { pattern: /business-api\.tiktok\.com\/open_api/i, label: 'TikTok Business API' },
  ],
  parseRequest: parseTikTok,
};
