import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseKameleoon(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });

  // Extract site code from URL path (e.g. /kameleoon.js or /siteCode/kameleoon.js)
  const siteCodeMatch = url.pathname.match(/\/([a-z0-9]+)\/kameleoon/i);
  const tagId = siteCodeMatch?.[1] || params['siteCode'] || null;

  return {
    providerId: 'kameleoon',
    providerName: 'Kameleoon',
    category: 'experience',
    tagId,
    eventName: null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const kameleoonProvider: ProviderDefinition = {
  id: 'kameleoon',
  name: 'Kameleoon',
  category: 'experience',
  urlPatterns: [
    { pattern: /kameleoon\.eu/i, label: 'Kameleoon script' },
    { pattern: /kameleoon\.io/i, label: 'Kameleoon IO' },
    { pattern: /cdn\.kameleoon\.com/i, label: 'Kameleoon CDN' },
    { pattern: /kameleoon\.com\/kameleoon/i, label: 'Kameleoon SDK' },
    { pattern: /data\.kameleoon/i, label: 'Kameleoon data' },
  ],
  parseRequest: parseKameleoon,
};
