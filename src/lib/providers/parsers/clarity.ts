import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseClarity(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  const projectId = url.pathname.split('/')[1] || null;
  return {
    providerId: 'clarity',
    providerName: 'Microsoft Clarity',
    category: 'experience',
    tagId: projectId,
    eventName: null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const clarityProvider: ProviderDefinition = {
  id: 'clarity',
  name: 'Microsoft Clarity',
  category: 'experience',
  urlPatterns: [
    { pattern: /clarity\.ms/i, label: 'Clarity' },
    { pattern: /www\.clarity\.ms/i, label: 'Clarity (www)' },
  ],
  parseRequest: parseClarity,
};
