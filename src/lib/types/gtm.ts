export interface GTMResult {
  detected: boolean;
  containers: GTMContainer[];
  dataLayer: DataLayerEntry[];
  proxy: ProxyInfo | null;
  serverSide: ServerSideGTMInfo | null;
}

export interface GTMContainer {
  containerId: string;
  type: 'gtm' | 'gtag';
  loadUrl: string;
  isProxied: boolean;
  proxyDomain: string | null;
}

export interface DataLayerEntry {
  index: number;
  data: Record<string, unknown>;
}

export interface ProxyInfo {
  detected: boolean;
  proxyDomains: string[];
}

export interface ServerSideGTMHit {
  url: string;
  matchType: 'subdomain' | 'endpoint';
  matchDetail: string; // e.g. "sst" or "/metrics"
  hostname: string;
}

export interface ServerSideGTMInfo {
  detected: boolean;
  hits: ServerSideGTMHit[];
  domains: string[];
}
