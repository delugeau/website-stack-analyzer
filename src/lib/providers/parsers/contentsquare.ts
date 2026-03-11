import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseContentsquare(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  const projectId = params['pid'] || params['c0'] || null;
  return {
    providerId: 'contentsquare',
    providerName: 'Contentsquare',
    category: 'experience',
    tagId: projectId,
    eventName: null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const contentsquareProvider: ProviderDefinition = {
  id: 'contentsquare',
  name: 'Contentsquare',
  category: 'experience',
  urlPatterns: [
    { pattern: /t\.contentsquare\.net/i, label: 'Contentsquare tracking' },
    { pattern: /c\.contentsquare\.net/i, label: 'Contentsquare collect' },
    { pattern: /contentsquare\.net/i, label: 'Contentsquare net' },
    { pattern: /app\.contentsquare\.com/i, label: 'Contentsquare app' },
    { pattern: /contentsquare\.com\/tag/i, label: 'Contentsquare tag' },
    { pattern: /csq\.io/i, label: 'Contentsquare (csq.io)' },
  ],
  parseRequest: parseContentsquare,
};
