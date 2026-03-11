import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseTeads(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  return {
    providerId: 'teads',
    providerName: 'Teads',
    category: 'advertising',
    tagId: params['pid'] || params['tag'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const teadsProvider: ProviderDefinition = {
  id: 'teads',
  name: 'Teads',
  category: 'advertising',
  urlPatterns: [
    { pattern: /teads\.tv/i, label: 'Teads request' },
    { pattern: /a\.teads\.tv/i, label: 'Teads analytics' },
    { pattern: /t\.teads\.tv/i, label: 'Teads tracking' },
    { pattern: /sync\.teads\.tv/i, label: 'Teads sync' },
  ],
  parseRequest: parseTeads,
};
