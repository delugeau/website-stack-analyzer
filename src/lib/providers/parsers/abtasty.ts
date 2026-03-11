import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseABTasty(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  const accountId = url.pathname.match(/\/(\w+)\.js/)?.[1] || null;
  return {
    providerId: 'abtasty',
    providerName: 'AB Tasty',
    category: 'experience',
    tagId: accountId,
    eventName: null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const abtastyProvider: ProviderDefinition = {
  id: 'abtasty',
  name: 'AB Tasty',
  category: 'experience',
  urlPatterns: [
    { pattern: /try\.abtasty\.com/i, label: 'AB Tasty' },
    { pattern: /abtasty\.com\/events/i, label: 'AB Tasty events' },
  ],
  parseRequest: parseABTasty,
};
