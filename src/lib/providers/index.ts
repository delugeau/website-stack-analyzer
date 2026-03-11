import type { CapturedRequest, ParsedProviderHit, ProviderDefinition } from './types';
// Analytics
import { ga4Provider } from './parsers/ga4';
import { pianoAnalyticsProvider } from './parsers/piano-analytics';
import { matomoProvider } from './parsers/matomo';
import { hotjarProvider } from './parsers/hotjar';
import { clarityProvider } from './parsers/clarity';
import { contentsquareProvider } from './parsers/contentsquare';
import { amplitudeProvider } from './parsers/amplitude';
import { mixpanelProvider } from './parsers/mixpanel';
import { segmentProvider } from './parsers/segment';
import { hubspotProvider } from './parsers/hubspot';
import { appdynamicsProvider } from './parsers/appdynamics';
import { leadinfoProvider } from './parsers/leadinfo';
// Advertising
import { googleAdsProvider } from './parsers/google-ads';
import { doubleclickProvider } from './parsers/doubleclick';
import { metaPixelProvider } from './parsers/meta-pixel';
import { tiktokProvider } from './parsers/tiktok';
import { linkedinProvider } from './parsers/linkedin';
import { snapchatProvider } from './parsers/snapchat';
import { pinterestProvider } from './parsers/pinterest';
import { twitterProvider } from './parsers/twitter';
import { bingProvider } from './parsers/bing';
import { criteoProvider } from './parsers/criteo';
import { teadsProvider } from './parsers/teads';
import { rtbHouseProvider } from './parsers/rtb-house';
import { tradeDeskProvider } from './parsers/trade-desk';
import { tradetrackerProvider } from './parsers/tradetracker';
import { kwankoProvider } from './parsers/kwanko';
import { timeoneProvider } from './parsers/timeone';
import { imaginoProvider } from './parsers/imagino';
import { adotmobProvider } from './parsers/adotmob';
import { asklocalaProvider } from './parsers/asklocala';
import { eloquaProvider } from './parsers/eloqua';
import { flashtalkingProvider } from './parsers/flashtalking';
import { invibesProvider } from './parsers/invibes';
import { oguryProvider } from './parsers/ogury';
import { outbrainProvider } from './parsers/outbrain';
import { travelAudienceProvider } from './parsers/travel-audience';
import { xandrProvider } from './parsers/xandr';
// Experience / A-B testing
import { abtastyProvider } from './parsers/abtasty';
import { kameleoonProvider } from './parsers/kameleoon';
import { iadvizeProvider } from './parsers/iadvize';
// Privacy / CMP
import { didomiProvider } from './parsers/didomi';
// Other
import { batchProvider } from './parsers/batch';
import { enovateProvider } from './parsers/enovate';
import { notifyProvider } from './parsers/notify';
// Tag Manager
import { gtmLoadProvider } from './parsers/gtm-load';

const PROVIDER_REGISTRY: ProviderDefinition[] = [
  // Analytics
  ga4Provider,
  pianoAnalyticsProvider,
  matomoProvider,
  hotjarProvider,
  clarityProvider,
  contentsquareProvider,
  amplitudeProvider,
  mixpanelProvider,
  segmentProvider,
  hubspotProvider,
  appdynamicsProvider,
  leadinfoProvider,
  // Advertising — specific providers before generic ones
  googleAdsProvider,
  doubleclickProvider,
  metaPixelProvider,
  tiktokProvider,
  linkedinProvider,
  snapchatProvider,
  pinterestProvider,
  twitterProvider,
  bingProvider,
  criteoProvider,
  teadsProvider,
  rtbHouseProvider,
  tradeDeskProvider,
  tradetrackerProvider,
  kwankoProvider,
  timeoneProvider,
  imaginoProvider,
  adotmobProvider,
  asklocalaProvider,
  eloquaProvider,
  flashtalkingProvider,
  invibesProvider,
  oguryProvider,
  outbrainProvider,
  travelAudienceProvider,
  xandrProvider,
  // Experience / A-B testing
  abtastyProvider,
  kameleoonProvider,
  iadvizeProvider,
  // Privacy / CMP
  didomiProvider,
  // Other
  batchProvider,
  enovateProvider,
  notifyProvider,
  // Tag Manager (last — catch-all for gtm.js)
  gtmLoadProvider,
];

export function classifyRequest(request: CapturedRequest): ParsedProviderHit | null {
  for (const provider of PROVIDER_REGISTRY) {
    for (const { pattern } of provider.urlPatterns) {
      if (pattern.test(request.url)) {
        if (provider.parseRequest) {
          try {
            return provider.parseRequest(request);
          } catch {
            return {
              providerId: provider.id,
              providerName: provider.name,
              category: provider.category,
              tagId: null,
              eventName: null,
              params: {},
              request: {
                url: request.url,
                method: request.method,
                timestamp: request.timestamp,
                status: request.status,
              },
            };
          }
        }
        return {
          providerId: provider.id,
          providerName: provider.name,
          category: provider.category,
          tagId: null,
          eventName: null,
          params: {},
          request: {
            url: request.url,
            method: request.method,
            timestamp: request.timestamp,
            status: request.status,
          },
        };
      }
    }
  }
  return null;
}

export function classifyAllRequests(requests: CapturedRequest[]): {
  classified: ParsedProviderHit[];
  unclassified: CapturedRequest[];
} {
  const classified: ParsedProviderHit[] = [];
  const unclassified: CapturedRequest[] = [];

  for (const req of requests) {
    const hit = classifyRequest(req);
    if (hit) {
      classified.push(hit);
    } else {
      unclassified.push(req);
    }
  }

  return { classified, unclassified };
}

export { PROVIDER_REGISTRY };
