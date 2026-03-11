export type CMPType =
  | 'didomi'
  | 'onetrust'
  | 'axeptio'
  | 'cookiebot'
  | 'trust-commander'
  | 'quantcast'
  | 'usercentrics'
  | 'iubenda'
  | 'sirdata'
  | 'hubspot'
  | 'unknown';

export interface CMPDetectionResult {
  detected: boolean;
  type: CMPType | null;
  name: string | null;
  version: string | null;
  tcf: TCFData | null;
  categories: string[];
  rawDetails: Record<string, unknown>;
}

export interface TCFData {
  cmpId: number;
  cmpVersion: number;
  gdprApplies: boolean;
  tcString: string;
  purpose: Record<string, unknown>;
  vendor: Record<string, unknown>;
  eventStatus: string;
}

export interface ConsentResult {
  detected: boolean;
  accepted: boolean;
  cmpType: CMPType | null;
  cmpName: string | null;
  cmpVersion: string | null;
  tcf: TCFData | null;
  categories: string[];
}
