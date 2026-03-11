import type { PassResults } from '../types/scan';
import type { AnalysisReport, ProviderSummary, ConsentDiff, ComplianceFlag } from '../types/analysis';

// Providers that are 100% expected before consent — no flag, green badge
// Includes CMPs (they ARE the consent mechanism) and tag managers
const ALLOWED_PRE_CONSENT_PROVIDERS = [
  'gtm-load',
  'didomi',       // CMP
  // OneTrust, Axeptio, Cookiebot etc. are detected via CMP system, not provider registry
  // If they appear as providers, they should be allowed too
];

// Providers that fire before consent but it's acceptable/tolerated — info flag, orange badge
// These load config/scripts without necessarily collecting personal data
const TOLERATED_PRE_CONSENT_PROVIDERS = [
  'kameleoon',    // A/B testing: engine.js + config.js load config, no PII collection
];

// Piano Analytics special case: check pianoConsentMode in scan context
// If pa.consent.getMode() === 'exempt', it's tolerated before consent

export function analyzeResults(
  preConsent: PassResults,
  postConsent: PassResults,
  context?: { pianoConsentModePre?: string; pianoConsentModePost?: string }
): AnalysisReport {
  const complianceFlags = generateComplianceFlags(preConsent, postConsent, context);
  const consentDiffs = generateConsentDiffs(preConsent, postConsent);
  const providerSummary = generateProviderSummary(preConsent, postConsent);

  return {
    complianceFlags,
    consentDiffs,
    providerSummary,
    totalRequestsPreConsent: preConsent.networkRequests.length,
    totalRequestsPostConsent: postConsent.networkRequests.length,
    trackingRequestsPreConsent: preConsent.classifiedRequests.length,
    trackingRequestsPostConsent: postConsent.classifiedRequests.length,
  };
}

function generateProviderSummary(pre: PassResults, post: PassResults): ProviderSummary[] {
  const providerMap = new Map<string, ProviderSummary>();

  const allHits = [...pre.classifiedRequests, ...post.classifiedRequests];
  const preProviderIds = new Set(pre.classifiedRequests.map((r) => r.providerId));

  for (const hit of allHits) {
    const existing = providerMap.get(hit.providerId);
    if (existing) {
      existing.requestCount++;
      if (hit.tagId && !existing.tagIds.includes(hit.tagId)) {
        existing.tagIds.push(hit.tagId);
      }
      if (hit.eventName && !existing.eventNames.includes(hit.eventName)) {
        existing.eventNames.push(hit.eventName);
      }
    } else {
      providerMap.set(hit.providerId, {
        providerId: hit.providerId,
        providerName: hit.providerName,
        category: hit.category,
        tagIds: hit.tagId ? [hit.tagId] : [],
        eventNames: hit.eventName ? [hit.eventName] : [],
        requestCount: 1,
        firesBeforeConsent: preProviderIds.has(hit.providerId),
      });
    }
  }

  return Array.from(providerMap.values()).sort((a, b) => b.requestCount - a.requestCount);
}

function generateConsentDiffs(pre: PassResults, post: PassResults): ConsentDiff[] {
  const allProviderIds = new Set([
    ...pre.classifiedRequests.map((r) => r.providerId),
    ...post.classifiedRequests.map((r) => r.providerId),
  ]);

  const diffs: ConsentDiff[] = [];

  for (const providerId of allProviderIds) {
    const preHits = pre.classifiedRequests.filter((r) => r.providerId === providerId);
    const postHits = post.classifiedRequests.filter((r) => r.providerId === providerId);

    const preEvents = new Set(preHits.map((h) => h.eventName).filter(Boolean));
    const postEvents = new Set(postHits.map((h) => h.eventName).filter(Boolean));

    const newEventsAfterConsent = [...postEvents].filter((e) => !preEvents.has(e)) as string[];

    const providerName = preHits[0]?.providerName || postHits[0]?.providerName || providerId;

    diffs.push({
      providerId,
      providerName,
      preConsentHits: preHits.length,
      postConsentHits: postHits.length,
      firesBeforeConsent: preHits.length > 0,
      newEventsAfterConsent,
    });
  }

  return diffs.sort((a, b) => {
    if (a.firesBeforeConsent !== b.firesBeforeConsent) return a.firesBeforeConsent ? -1 : 1;
    return b.preConsentHits - a.preConsentHits;
  });
}

function generateComplianceFlags(
  pre: PassResults,
  post: PassResults,
  context?: { pianoConsentModePre?: string; pianoConsentModePost?: string }
): ComplianceFlag[] {
  const flags: ComplianceFlag[] = [];

  // Check for tracking that fires before consent
  const preProviders = new Map<string, { name: string; count: number }>();
  for (const hit of pre.classifiedRequests) {
    const existing = preProviders.get(hit.providerId);
    if (existing) {
      existing.count++;
    } else {
      preProviders.set(hit.providerId, { name: hit.providerName, count: 1 });
    }
  }

  for (const [providerId, { name, count }] of preProviders) {
    // Skip providers that are fully allowed before consent (CMPs, GTM)
    if (ALLOWED_PRE_CONSENT_PROVIDERS.includes(providerId)) continue;

    // Also skip any provider with category 'privacy' (CMP providers)
    const providerHit = pre.classifiedRequests.find((r) => r.providerId === providerId);
    if (providerHit?.category === 'privacy') continue;

    // Piano Analytics special case: if consent mode is "essential", it's tolerated
    if (providerId === 'piano-analytics' && context?.pianoConsentModePre === 'essential') {
      flags.push({
        severity: 'info',
        providerId,
        providerName: name,
        message: `${name} fires before consent (essential mode)`,
        detail: `${count} request(s) detected before consent, but pa.consent.getMode() returns "essential". Piano Analytics is configured in essential measurement mode, which is acceptable under certain conditions.`,
        messageKey: 'flag.pianoEssential',
        detailKey: 'flag.pianoEssential.detail',
        messageParams: { name, count },
      });
      continue;
    }

    // Tolerated providers: info-level flag (not critical)
    if (TOLERATED_PRE_CONSENT_PROVIDERS.includes(providerId)) {
      flags.push({
        severity: 'info',
        providerId,
        providerName: name,
        message: `${name} loads before consent (configuration)`,
        detail: `${count} request(s) detected before consent. These are configuration/script loads that do not necessarily collect personal data.`,
        messageKey: 'flag.toleratedBeforeConsent',
        detailKey: 'flag.toleratedBeforeConsent.detail',
        messageParams: { name, count },
      });
      continue;
    }

    // All other providers: critical flag
    flags.push({
      severity: 'critical',
      providerId,
      providerName: name,
      message: `${name} fires before consent`,
      detail: `${count} request(s) detected before user gave consent. This may violate GDPR/ePrivacy regulations.`,
      messageKey: 'flag.firesBeforeConsent',
      detailKey: 'flag.firesBeforeConsent.detail',
      messageParams: { name, count },
    });
  }

  // Check for cookies set before consent
  const thirdPartyCookiesPre = pre.cookies.filter((c) => {
    return !c.domain.includes('localhost');
  });

  if (thirdPartyCookiesPre.length > 0) {
    flags.push({
      severity: 'warning',
      providerId: 'cookies',
      providerName: 'Cookies',
      message: `${thirdPartyCookiesPre.length} cookie(s) set before consent`,
      detail: `Cookies detected before user consent was given.`,
      messageKey: 'flag.cookiesBefore',
      detailKey: 'flag.cookiesBefore.detail',
      messageParams: { count: thirdPartyCookiesPre.length },
    });
  }

  // Check for new cookies after consent
  const preNames = new Set(pre.cookies.map((c) => c.name));
  const newCookies = post.cookies.filter((c) => !preNames.has(c.name));
  if (newCookies.length > 0) {
    flags.push({
      severity: 'info',
      providerId: 'cookies',
      providerName: 'Cookies',
      message: `${newCookies.length} new cookie(s) after consent`,
      detail: `New cookies were set after consent was accepted, which is expected behavior.`,
      messageKey: 'flag.cookiesAfter',
      detailKey: 'flag.cookiesAfter.detail',
      messageParams: { count: newCookies.length },
    });
  }

  // Piano Analytics post-consent check
  if (context?.pianoConsentModePost && context.pianoConsentModePost !== 'opt-in') {
    flags.push({
      severity: 'warning',
      providerId: 'piano-analytics',
      providerName: 'Piano Analytics',
      message: `Piano Analytics consent mode is "${context.pianoConsentModePost}" after consent`,
      detail: `After consent acceptance, pa.consent.getMode() should return "opt-in" but returns "${context.pianoConsentModePost}". The consent integration may not be working correctly.`,
      messageKey: 'flag.pianoPostConsent',
      detailKey: 'flag.pianoPostConsent.detail',
      messageParams: { mode: context.pianoConsentModePost },
    });
  }

  return flags.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}
