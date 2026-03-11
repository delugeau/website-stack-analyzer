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
