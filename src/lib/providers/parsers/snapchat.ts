import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseSnapchat(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  const pixelId = params['pid'] || params['pixel_id'] || null;
  return {
    providerId: 'snapchat',
    providerName: 'Snapchat Pixel',
    category: 'advertising',
    tagId: pixelId,
    eventName: params['ev'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const snapchatProvider: ProviderDefinition = {
  id: 'snapchat',
  name: 'Snapchat Pixel',
  category: 'advertising',
  urlPatterns: [
    { pattern: /sc-static\.net\/scevent/i, label: 'Snap Pixel' },
    { pattern: /tr\.snapchat\.com/i, label: 'Snapchat tracking' },
  ],
  parseRequest: parseSnapchat,
};
