import type { ParsedProviderHit } from './provider';

export interface ComplianceFlag {
  severity: 'critical' | 'warning' | 'info';
  providerId: string;
  providerName: string;
  message: string;
  detail: string;
  /** i18n translation key for message */
  messageKey?: string;
  /** i18n translation key for detail */
  detailKey?: string;
  /** Params for interpolation in translation keys */
  messageParams?: Record<string, string | number>;
}

export interface ConsentDiff {
  providerId: string;
  providerName: string;
  preConsentHits: number;
  postConsentHits: number;
  firesBeforeConsent: boolean;
  newEventsAfterConsent: string[];
}

export interface AnalysisReport {
  complianceFlags: ComplianceFlag[];
  consentDiffs: ConsentDiff[];
  providerSummary: ProviderSummary[];
  totalRequestsPreConsent: number;
  totalRequestsPostConsent: number;
  trackingRequestsPreConsent: number;
  trackingRequestsPostConsent: number;
}

export interface ProviderSummary {
  providerId: string;
  providerName: string;
  category: string;
  tagIds: string[];
  eventNames: string[];
  requestCount: number;
  firesBeforeConsent: boolean;
}
