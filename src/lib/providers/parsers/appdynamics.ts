import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseAppDynamics(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  return {
    providerId: 'appdynamics',
    providerName: 'AppDynamics',
    category: 'analytics',
    tagId: params['appKey'] || null,
    eventName: null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const appdynamicsProvider: ProviderDefinition = {
  id: 'appdynamics',
  name: 'AppDynamics',
  category: 'analytics',
  urlPatterns: [
    { pattern: /cdn\.appdynamics\.com/i, label: 'AppDynamics CDN' },
    { pattern: /adrum\.js/i, label: 'AppDynamics ADRUM' },
    { pattern: /col\.eum-appdynamics\.com/i, label: 'AppDynamics collect' },
  ],
  parseRequest: parseAppDynamics,
};
