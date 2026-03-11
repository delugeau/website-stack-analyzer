import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseAmplitude(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  const apiKey = params['client'] || null;
  return {
    providerId: 'amplitude',
    providerName: 'Amplitude',
    category: 'analytics',
    tagId: apiKey,
    eventName: null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const amplitudeProvider: ProviderDefinition = {
  id: 'amplitude',
  name: 'Amplitude',
  category: 'analytics',
  urlPatterns: [
    { pattern: /cdn\.amplitude\.com/i, label: 'Amplitude CDN' },
    { pattern: /api\.amplitude\.com/i, label: 'Amplitude API' },
    { pattern: /api2\.amplitude\.com/i, label: 'Amplitude API v2' },
  ],
  parseRequest: parseAmplitude,
};
