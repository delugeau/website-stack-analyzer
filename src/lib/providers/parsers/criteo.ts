import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseCriteo(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'criteo',
    providerName: 'Criteo',
    category: 'advertising',
    tagId: params['account'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const criteoProvider: ProviderDefinition = {
  id: 'criteo',
  name: 'Criteo',
  category: 'advertising',
  urlPatterns: [
    { pattern: /static\.criteo\.net/i, label: 'Criteo script' },
    { pattern: /dis\.criteo\.com/i, label: 'Criteo display' },
    { pattern: /sslwidget\.criteo\.com/i, label: 'Criteo widget' },
  ],
  parseRequest: parseCriteo,
};
