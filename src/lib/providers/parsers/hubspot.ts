import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseHubspot(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  const portalId = url.pathname.match(/\/(\d+)\//)?.[1] || null;
  return {
    providerId: 'hubspot',
    providerName: 'HubSpot',
    category: 'analytics',
    tagId: portalId,
    eventName: null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const hubspotProvider: ProviderDefinition = {
  id: 'hubspot',
  name: 'HubSpot',
  category: 'analytics',
  urlPatterns: [
    { pattern: /js\.hs-scripts\.com/i, label: 'HubSpot scripts' },
    { pattern: /js\.hs-analytics\.net/i, label: 'HubSpot analytics' },
    { pattern: /js\.hsadspixel\.net/i, label: 'HubSpot ads pixel' },
    { pattern: /js\.hscollectedforms\.net/i, label: 'HubSpot forms' },
    { pattern: /js\.usemessages\.com/i, label: 'HubSpot messages' },
    { pattern: /track\.hubspot\.com/i, label: 'HubSpot tracking' },
  ],
  parseRequest: parseHubspot,
};
