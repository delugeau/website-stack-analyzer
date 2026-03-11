export interface CMPDetector {
  id: string;
  name: string;
  detect: (context: CMPDetectionContext) => Promise<CMPDetectorResult | null>;
}

export interface CMPDetectionContext {
  evaluate: <T>(fn: string | ((...args: unknown[]) => T)) => Promise<T>;
  querySelectorAll: (selector: string) => Promise<string[]>;
  getScriptSrcs: () => Promise<string[]>;
}

export interface CMPDetectorResult {
  type: string;
  name: string;
  version: string | null;
  categories: string[];
  rawDetails: Record<string, unknown>;
}
