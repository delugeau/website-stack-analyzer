import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseOutbrain(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'outbrain',
    providerName: 'Outbrain / Zemanta',
    category: 'advertising',
    tagId: params['id'] || params['marketerId'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const outbrainProvider: ProviderDefinition = {
  id: 'outbrain',
  name: 'Outbrain / Zemanta',
  category: 'advertising',
  urlPatterns: [
    { pattern: /widgets\.outbrain\.com/i, label: 'Outbrain widget' },
    { pattern: /tr\.outbrain\.com/i, label: 'Outbrain tracking' },
    { pattern: /outbrain\.com/i, label: 'Outbrain request' },
    { pattern: /zemanta\.com/i, label: 'Zemanta request' },
  ],
  parseRequest: parseOutbrain,
};
