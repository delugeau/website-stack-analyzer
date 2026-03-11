export type ProviderCategory = 'analytics' | 'advertising' | 'tag-manager' | 'experience' | 'privacy' | 'other';

export interface ProviderDefinition {
  id: string;
  name: string;
  category: ProviderCategory;
  urlPatterns: Array<{ pattern: RegExp; label: string }>;
  scriptPatterns?: RegExp[];
  parseRequest?: (request: import('./network').CapturedRequest) => ParsedProviderHit;
  icon?: string;
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
