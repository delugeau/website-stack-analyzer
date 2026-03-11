import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseMetaPixel(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  const pixelId = params['id'] || null;
  const eventName = params['ev'] || null;
  return {
    providerId: 'meta-pixel',
    providerName: 'Meta Pixel (Facebook)',
    category: 'advertising',
    tagId: pixelId,
    eventName,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const metaPixelProvider: ProviderDefinition = {
  id: 'meta-pixel',
  name: 'Meta Pixel (Facebook)',
  category: 'advertising',
  urlPatterns: [
    { pattern: /connect\.facebook\.net\/.*\/fbevents\.js/i, label: 'Meta Pixel SDK' },
    { pattern: /facebook\.com\/tr\/?(\?|$)/i, label: 'Meta Pixel tracking' },
    { pattern: /connect\.facebook\.net\/signals/i, label: 'Meta signals' },
    { pattern: /facebook\.com\/ajax\/bz/i, label: 'Meta beacon' },
    { pattern: /www\.facebook\.com\/tr/i, label: 'Meta Pixel' },
  ],
  parseRequest: parseMetaPixel,
};
