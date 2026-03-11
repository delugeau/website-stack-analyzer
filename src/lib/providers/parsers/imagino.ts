import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseImagino(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  return {
    providerId: 'imagino',
    providerName: 'Imagino',
    category: 'advertising',
    tagId: params['id'] || params['cid'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const imaginoProvider: ProviderDefinition = {
  id: 'imagino',
  name: 'Imagino',
  category: 'advertising',
  urlPatterns: [
    { pattern: /imagino\.eu/i, label: 'Imagino EU' },
    { pattern: /cdn\.imagino\.eu/i, label: 'Imagino CDN' },
    { pattern: /imagino\.com/i, label: 'Imagino request' },
    { pattern: /cdn\.imagino\.com/i, label: 'Imagino CDN (com)' },
    { pattern: /track\.imagino\.com/i, label: 'Imagino tracking' },
  ],
  parseRequest: parseImagino,
};
