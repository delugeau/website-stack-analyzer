import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseInVibes(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'invibes',
    providerName: 'InVibes',
    category: 'advertising',
    tagId: params['id'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const invibesProvider: ProviderDefinition = {
  id: 'invibes',
  name: 'InVibes',
  category: 'advertising',
  urlPatterns: [
    { pattern: /delivery\.invibes\.com/i, label: 'InVibes delivery' },
    { pattern: /invibes\.com/i, label: 'InVibes request' },
  ],
  parseRequest: parseInVibes,
};
