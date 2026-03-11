import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseMatomo(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  const siteId = params['idsite'] || null;
  const action = params['action_name'] || null;
  return {
    providerId: 'matomo',
    providerName: 'Matomo',
    category: 'analytics',
    tagId: siteId,
    eventName: action,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const matomoProvider: ProviderDefinition = {
  id: 'matomo',
  name: 'Matomo',
  category: 'analytics',
  urlPatterns: [
    { pattern: /matomo\.php/i, label: 'Matomo tracking' },
    { pattern: /piwik\.php/i, label: 'Piwik tracking' },
    { pattern: /matomo\.js/i, label: 'Matomo script' },
    { pattern: /piwik\.js/i, label: 'Piwik script' },
  ],
  parseRequest: parseMatomo,
};
