import type { ProviderDefinition, CapturedRequest, ParsedProviderHit } from '../types';

function parseLinkedIn(req: CapturedRequest): ParsedProviderHit {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  url.searchParams.forEach((v, k) => { params[k] = v; });
  const partnerId = params['pid'] || null;
  const conversionId = params['conversionId'] || null;
  return {
    providerId: 'linkedin',
    providerName: 'LinkedIn Insight Tag',
    category: 'advertising',
    tagId: partnerId || conversionId,
    eventName: params['evt'] || null,
    params,
    request: { url: req.url, method: req.method, timestamp: req.timestamp, status: req.status },
  };
}

export const linkedinProvider: ProviderDefinition = {
  id: 'linkedin',
  name: 'LinkedIn Insight Tag',
  category: 'advertising',
  urlPatterns: [
    { pattern: /snap\.licdn\.com\/li\.lms-analytics/i, label: 'LinkedIn Insight' },
    { pattern: /px\.ads\.linkedin\.com/i, label: 'LinkedIn Ads pixel' },
    { pattern: /linkedin\.com\/px/i, label: 'LinkedIn pixel' },
    { pattern: /dc\.ads\.linkedin\.com/i, label: 'LinkedIn Ads' },
    { pattern: /www\.linkedin\.com\/li\/track/i, label: 'LinkedIn tracking' },
  ],
  parseRequest: parseLinkedIn,
};
