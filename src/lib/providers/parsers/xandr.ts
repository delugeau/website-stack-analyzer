import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseXandr(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'xandr',
    providerName: 'Xandr (AppNexus)',
    category: 'advertising',
    tagId: params['id'] || params['member'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const xandrProvider: ProviderDefinition = {
  id: 'xandr',
  name: 'Xandr (AppNexus)',
  category: 'advertising',
  urlPatterns: [
    { pattern: /secure\.adnxs\.com/i, label: 'Xandr secure' },
    { pattern: /adnxs\.com/i, label: 'Xandr (AppNexus)' },
    { pattern: /ib\.adnxs\.com/i, label: 'Xandr impression bus' },
  ],
  parseRequest: parseXandr,
};
