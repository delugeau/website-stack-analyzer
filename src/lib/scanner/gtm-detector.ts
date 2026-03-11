import type { Page } from 'playwright';
import type { GTMResult, GTMContainer, DataLayerEntry, ProxyInfo, ServerSideGTMInfo, ServerSideGTMHit } from '../types/gtm';
import type { CapturedRequest } from '../types/network';

export async function detectGTM(
  page: Page,
  networkRequests: CapturedRequest[]
): Promise<GTMResult> {
  // Strategy 1: Check network requests for gtm.js loads (NOT gtag/js — that's GA4 or Google Ads)
  const gtmNetworkLoads = findGTMNetworkLoads(networkRequests);

  // Strategy 2: In-page evaluation for dataLayer, google_tag_manager, inline GTM IDs
  const pageData = await evaluateGTMInPage(page);

  // Strategy 3: Detect proxy from network loads
  const proxyInfo = detectProxy(gtmNetworkLoads);

  // Strategy 4: Detect server-side GTM (sGTM)
  const serverSideInfo = detectServerSideGTM(networkRequests, page.url());

  // Merge all container IDs found across strategies
  const allContainerIds = new Set<string>();

  for (const load of gtmNetworkLoads) {
    if (load.containerId) allContainerIds.add(load.containerId);
  }
  for (const id of pageData.containerIds) {
    // Only include GTM- IDs, not G- (GA4) or AW- (Google Ads)
    if (id.startsWith('GTM-')) {
      allContainerIds.add(id);
    }
  }
  for (const id of pageData.inlineGTMIds) {
    allContainerIds.add(id);
  }

  // Build container list
  const containers: GTMContainer[] = [];
  for (const id of allContainerIds) {
    const networkLoad = gtmNetworkLoads.find((l) => l.containerId === id);
    containers.push({
      containerId: id,
      type: 'gtm',
      loadUrl: networkLoad?.url || '',
      isProxied: networkLoad?.isProxied || false,
      proxyDomain: networkLoad?.proxyDomain || null,
    });
  }

  // DataLayer entries
  const dataLayer: DataLayerEntry[] = pageData.dataLayerContents.map(
    (data: Record<string, unknown>, index: number) => ({ index, data })
  );

  return {
    detected: containers.length > 0 || pageData.dataLayerExists || (serverSideInfo?.detected ?? false),
    containers,
    dataLayer,
    proxy: proxyInfo,
    serverSide: serverSideInfo,
  };
}

interface GTMNetworkLoad {
  url: string;
  containerId: string | null;
  isStandard: boolean;
  isProxied: boolean;
  proxyDomain: string | null;
  type: 'gtm';
}

function findGTMNetworkLoads(requests: CapturedRequest[]): GTMNetworkLoad[] {
  const loads: GTMNetworkLoad[] = [];

  for (const req of requests) {
    const urlLower = req.url.toLowerCase();

    // Only detect gtm.js as GTM — gtag/js is GA4 (G-) or Google Ads (AW-), not GTM
    const isGtmJs = urlLower.includes('gtm.js') || urlLower.includes('/gtm/');
    if (!isGtmJs) continue;

    try {
      const url = new URL(req.url);
      const isStandard =
        url.hostname === 'www.googletagmanager.com' ||
        url.hostname === 'googletagmanager.com';
      const containerId =
        url.searchParams.get('id') || extractIdFromPath(url.pathname);

      // Skip if the container ID is not a GTM- ID (e.g. AW- or G-)
      if (containerId && !containerId.startsWith('GTM-')) continue;

      loads.push({
        url: req.url,
        containerId,
        isStandard,
        isProxied: !isStandard,
        proxyDomain: isStandard ? null : url.hostname,
        type: 'gtm',
      });
    } catch {
      continue;
    }
  }

  return loads;
}

function extractIdFromPath(pathname: string): string | null {
  // Match patterns like /gtm/GTM-XXXX or paths containing GTM-XXXX
  const match = pathname.match(/(GTM-[A-Z0-9]{4,10})/i);
  return match ? match[1].toUpperCase() : null;
}

async function evaluateGTMInPage(page: Page): Promise<{
  dataLayerExists: boolean;
  dataLayerContents: Record<string, unknown>[];
  containerIds: string[];
  inlineGTMIds: string[];
  googleTagManagerExists: boolean;
}> {
  return page.evaluate(() => {
    const w = window as any;
    const result = {
      dataLayerExists: typeof w.dataLayer !== 'undefined' && Array.isArray(w.dataLayer),
      dataLayerContents: [] as Record<string, unknown>[],
      containerIds: [] as string[],
      inlineGTMIds: [] as string[],
      googleTagManagerExists: typeof w.google_tag_manager !== 'undefined',
    };

    // Capture dataLayer contents (limit to 50 entries to avoid huge payloads)
    if (result.dataLayerExists) {
      result.dataLayerContents = w.dataLayer.slice(0, 50).map((entry: any) => {
        try {
          return JSON.parse(JSON.stringify(entry));
        } catch {
          return { _unparseable: true };
        }
      });
    }

    // Check google_tag_manager object for GTM container IDs only
    if (result.googleTagManagerExists) {
      result.containerIds = Object.keys(w.google_tag_manager).filter(
        (key: string) => /^GTM-/i.test(key)
      );
    }

    // Scan all script tags for GTM container IDs (only GTM- pattern, not G- or AW-)
    const gtmPattern = /GTM-[A-Z0-9]{4,10}/gi;
    const scripts = document.querySelectorAll('script');
    const foundIds = new Set<string>();

    scripts.forEach((script) => {
      const content = script.innerHTML || '';
      const src = script.src || '';
      const matches = (content + ' ' + src).match(gtmPattern);
      if (matches) {
        matches.forEach((m) => foundIds.add(m.toUpperCase()));
      }
    });

    // Also check noscript iframes for GTM
    const noscripts = document.querySelectorAll('noscript');
    noscripts.forEach((ns) => {
      const matches = ns.innerHTML.match(gtmPattern);
      if (matches) {
        matches.forEach((m) => foundIds.add(m.toUpperCase()));
      }
    });

    result.inlineGTMIds = Array.from(foundIds);
    return result;
  });
}

function detectProxy(loads: GTMNetworkLoad[]): ProxyInfo | null {
  const proxied = loads.filter((l) => l.isProxied);
  if (proxied.length === 0) return null;
  return {
    detected: true,
    proxyDomains: [...new Set(proxied.map((l) => l.proxyDomain!))],
  };
}

// ─── Server-Side GTM (sGTM) Detection ─────────────────────────────────

/**
 * Subdomains containing these tokens indicate a server-side GTM endpoint.
 * e.g. sgtm.example.com, sst.example.com, metrics.example.com
 */
const SGTM_SUBDOMAIN_TOKENS = ['sgtm', 'sst', 'server-gtm', 'ssgtm'];

/**
 * Pathname prefixes typical of sGTM endpoints.
 */
const SGTM_ENDPOINT_PATTERNS = ['/ssm', '/sst', '/metrics', '/g/collect'];

function detectServerSideGTM(
  requests: CapturedRequest[],
  pageUrl: string
): ServerSideGTMInfo | null {
  let pageDomain: string;
  try {
    pageDomain = new URL(pageUrl).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }

  const hits: ServerSideGTMHit[] = [];
  const seenUrls = new Set<string>();

  for (const req of requests) {
    // Skip duplicate URLs
    if (seenUrls.has(req.url)) continue;

    let parsed: URL;
    try {
      parsed = new URL(req.url);
    } catch {
      continue;
    }

    const hostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();

    // Only consider first-party or same-root-domain requests
    // (sGTM runs on a subdomain of the site's own domain)
    if (!isSameRootDomain(hostname, pageDomain)) continue;

    // Check 1: Subdomain contains sGTM token
    const subdomainParts = hostname.replace(pageDomain, '').split('.').filter(Boolean);
    for (const part of subdomainParts) {
      const partLower = part.toLowerCase();
      for (const token of SGTM_SUBDOMAIN_TOKENS) {
        if (partLower.includes(token)) {
          seenUrls.add(req.url);
          hits.push({
            url: req.url,
            matchType: 'subdomain',
            matchDetail: token,
            hostname,
          });
          break;
        }
      }
    }

    // Check 2: Endpoint path matches sGTM patterns (on first-party subdomains only)
    if (!seenUrls.has(req.url) && hostname !== pageDomain) {
      for (const endpoint of SGTM_ENDPOINT_PATTERNS) {
        if (pathname.startsWith(endpoint)) {
          seenUrls.add(req.url);
          hits.push({
            url: req.url,
            matchType: 'endpoint',
            matchDetail: endpoint,
            hostname,
          });
          break;
        }
      }
    }
  }

  if (hits.length === 0) return null;

  return {
    detected: true,
    hits,
    domains: [...new Set(hits.map((h) => h.hostname))],
  };
}

/**
 * Check if hostname belongs to the same root domain as the page.
 * e.g. sgtm.example.com → example.com  ✓
 *      analytics.google.com → example.com  ✗
 */
function isSameRootDomain(hostname: string, pageDomain: string): boolean {
  return hostname === pageDomain || hostname.endsWith('.' + pageDomain);
}
