import type { CapturedRequest } from './network';
import type { CMPDetectionResult, ConsentResult } from './cmp';
import type { GTMResult } from './gtm';
import type { ParsedProviderHit } from './provider';
import type { AnalysisReport } from './analysis';

export type ScanStatus =
  | 'queued'
  | 'scanning_pre_consent'
  | 'detecting_cmp'
  | 'accepting_consent'
  | 'scanning_post_consent'
  | 'analyzing'
  | 'completed'
  | 'error';

export interface ScanOptions {
  timeout?: number;
  waitAfterLoad?: number;
  userAgent?: string;
}

export interface CookieData {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly: boolean;
  secure: boolean;
  sameSite: string;
}

export interface PassResults {
  networkRequests: CapturedRequest[];
  classifiedRequests: ParsedProviderHit[];
  cookies: CookieData[];
  dataLayer: Record<string, unknown>[];
}

export interface ScanResults {
  scanId: string;
  url: string;
  scannedAt: string;
  duration: number;
  screenshot: string | null;
  cmp: CMPDetectionResult;
  consent: ConsentResult;
  gtm: GTMResult;
  preConsent: PassResults;
  postConsent: PassResults;
  analysis: AnalysisReport;
}

export interface ScanState {
  scanId: string;
  url: string;
  status: ScanStatus;
  progress: number;
  currentStep: string;
  results: ScanResults | null;
  error: string | null;
  startedAt: number;
  completedAt: number | null;
}
