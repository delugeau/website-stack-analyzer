export type ProviderCategory = 'analytics' | 'advertising' | 'tag-manager' | 'experience' | 'privacy' | 'other';

export interface ProviderDefinition {
  id: string;
  name: string;
  category: ProviderCategory;
  urlPatterns: Array<{ pattern: RegExp; label: string }>;
  scriptPatterns?: RegExp[];
  parseRequest?: (request: CapturedRequest) => ParsedProviderHit;
  icon?: string;
}

export interface CapturedRequest {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  postData: string | null;
  resourceType: string;
  timestamp: number;
  status: number | null;
  responseHeaders: Record<string, string> | null;
  error?: string;
}

export interface ParsedProviderHit {
  providerId: string;
  providerName: string;
  category: ProviderCategory;
  tagId: string | null;
  eventName: string | null;
  params: Record<string, string | string[]>;
  request: {
    url: string;
    method: string;
    timestamp: number;
    status: number | null;
  };
}
