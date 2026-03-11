import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseSegment(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  let writeKey: string | null = null;
  if (req.postData) {
    try {
      const body = JSON.parse(req.postData);
      writeKey = body.writeKey || null;
    } catch {}
  }
  return {
    providerId: 'segment',
    providerName: 'Segment',
    category: 'analytics',
    tagId: writeKey,
    eventName: params['event'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const segmentProvider: ProviderDefinition = {
  id: 'segment',
  name: 'Segment',
  category: 'analytics',
  urlPatterns: [
    { pattern: /cdn\.segment\.com/i, label: 'Segment CDN' },
    { pattern: /api\.segment\.io/i, label: 'Segment API' },
  ],
  parseRequest: parseSegment,
};
