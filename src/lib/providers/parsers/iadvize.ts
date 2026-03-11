import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseIAdvize(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'iadvize',
    providerName: 'iAdvize',
    category: 'experience',
    tagId: params['sid'] || null,
    eventName: null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const iadvizeProvider: ProviderDefinition = {
  id: 'iadvize',
  name: 'iAdvize',
  category: 'experience',
  urlPatterns: [
    { pattern: /lc\.iadvize\.com/i, label: 'iAdvize live chat' },
    { pattern: /iadvize\.com/i, label: 'iAdvize request' },
  ],
  parseRequest: parseIAdvize,
};
