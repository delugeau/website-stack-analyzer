import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseLeadinfo(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'leadinfo',
    providerName: 'Leadinfo',
    category: 'analytics',
    tagId: params['id'] || null,
    eventName: null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const leadinfoProvider: ProviderDefinition = {
  id: 'leadinfo',
  name: 'Leadinfo',
  category: 'analytics',
  urlPatterns: [
    { pattern: /script\.leadinfo\.net/i, label: 'Leadinfo script' },
    { pattern: /leadinfo\.net/i, label: 'Leadinfo request' },
  ],
  parseRequest: parseLeadinfo,
};
