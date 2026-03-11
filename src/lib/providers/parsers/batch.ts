import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseBatch(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'batch',
    providerName: 'Batch',
    category: 'other',
    tagId: params['apiKey'] || null,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const batchProvider: ProviderDefinition = {
  id: 'batch',
  name: 'Batch',
  category: 'other',
  urlPatterns: [
    { pattern: /cdn\.batch\.com/i, label: 'Batch CDN' },
    { pattern: /batch\.com/i, label: 'Batch request' },
    { pattern: /batch-sdk/i, label: 'Batch SDK' },
  ],
  parseRequest: parseBatch,
};
