import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parsePianoAnalytics(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  const siteId = params['s'] || params['idsite'] || null;

  // For the script load, there's no event — mark it as script_load
  const isScriptLoad = /piano-analytics\.js/i.test(req.url) || /smarttag/i.test(req.url);
  const eventName = isScriptLoad ? 'script_load' : (params['p'] || params['page'] || params['events'] || null);

  return {
    providerId: 'piano-analytics',
    providerName: 'Piano Analytics (AT Internet)',
    category: 'analytics',
    tagId: siteId,
    eventName,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const pianoAnalyticsProvider: ProviderDefinition = {
  id: 'piano-analytics',
  name: 'Piano Analytics (AT Internet)',
  category: 'analytics',
  urlPatterns: [
    { pattern: /tag\.aticdn\.net\/piano-analytics\.js/i, label: 'Piano Analytics SDK script' },
    { pattern: /tag\.aticdn\.net\/smarttag/i, label: 'Piano Analytics SmartTag script' },
    { pattern: /tag\.aticdn\.net/i, label: 'Piano Analytics CDN (aticdn)' },
    { pattern: /collect-eu\.piano\.io/i, label: 'Piano collect EU' },
    { pattern: /piano\.io\/api\/v3/i, label: 'Piano API' },
    { pattern: /piano\.io/i, label: 'Piano IO' },
    { pattern: /collection\.piano\.io/i, label: 'Piano collection' },
    { pattern: /xiti\.com\/hit/i, label: 'AT Internet (Xiti)' },
    { pattern: /pa-cdn\.com/i, label: 'Piano Analytics CDN' },
    { pattern: /at-o\.net/i, label: 'AT Internet collect' },
    { pattern: /logs\d*\.xiti\.com/i, label: 'Xiti logs' },
  ],
  parseRequest: parsePianoAnalytics,
};
