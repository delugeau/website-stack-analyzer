/**
 * Map cookie domains AND cookie names to known provider names.
 * Two matching strategies:
 * 1. Domain suffix matching: cookie domain ".doubleclick.net" matches entry "doubleclick.net"
 * 2. Cookie name matching: cookie name "_ga" matches GA4
 */

// ─── Domain-based matching ────────────────────────────────
const COOKIE_DOMAIN_MAP: [string, string][] = [
  // Analytics
  ['google-analytics.com', 'GA4'],
  ['analytics.google.com', 'GA4'],
  ['piano.io', 'Piano Analytics'],
  ['aticdn.net', 'Piano Analytics'],
  ['xiti.com', 'Piano Analytics'],
  ['matomo.cloud', 'Matomo'],
  ['hotjar.com', 'Hotjar'],
  ['clarity.ms', 'Clarity'],
  ['contentsquare.net', 'Contentsquare'],
  ['contentsquare.com', 'Contentsquare'],
  ['csq.io', 'Contentsquare'],
  ['amplitude.com', 'Amplitude'],
  ['mixpanel.com', 'Mixpanel'],
  ['segment.io', 'Segment'],
  ['segment.com', 'Segment'],
  ['hubspot.com', 'HubSpot'],
  ['hs-analytics.net', 'HubSpot'],
  ['hsforms.com', 'HubSpot'],
  ['appdynamics.com', 'AppDynamics'],
  ['leadinfo.net', 'Leadinfo'],

  // Advertising
  ['doubleclick.net', 'DoubleClick'],
  ['googlesyndication.com', 'Google Ads'],
  ['googleadservices.com', 'Google Ads'],
  ['google.com', 'Google'],
  ['googleapis.com', 'Google'],
  ['facebook.com', 'Meta Pixel'],
  ['facebook.net', 'Meta Pixel'],
  ['fbcdn.net', 'Meta Pixel'],
  ['tiktok.com', 'TikTok'],
  ['linkedin.com', 'LinkedIn'],
  ['licdn.com', 'LinkedIn'],
  ['snapchat.com', 'Snapchat'],
  ['sc-static.net', 'Snapchat'],
  ['pinterest.com', 'Pinterest'],
  ['pinimg.com', 'Pinterest'],
  ['twitter.com', 'Twitter / X'],
  ['ads-twitter.com', 'Twitter / X'],
  ['bing.com', 'Bing Ads'],
  ['bat.bing.net', 'Bing Ads'],
  ['criteo.com', 'Criteo'],
  ['criteo.net', 'Criteo'],
  ['teads.tv', 'Teads'],
  ['rtbhouse.com', 'RTB House'],
  ['creativecdn.com', 'RTB House'],
  ['adsrvr.org', 'The Trade Desk'],
  ['tradetracker.net', 'TradeTracker'],
  ['kwanko.com', 'Kwanko'],
  ['logbor.com', 'TimeOne'],
  ['timeone.io', 'TimeOne'],
  ['imagino.com', 'Imagino'],
  ['imagino.eu', 'Imagino'],
  ['adotmob.com', 'Adotmob'],
  ['asklocala.com', 'AskLocala'],
  ['eloqua.com', 'Eloqua'],
  ['flashtalking.com', 'Flashtalking'],
  ['invibes.com', 'InVibes'],
  ['ogury.io', 'Ogury'],
  ['ogury.com', 'Ogury'],
  ['outbrain.com', 'Outbrain / Zemanta'],
  ['zemanta.com', 'Outbrain / Zemanta'],
  ['travelaudience.com', 'Travel Audience'],
  ['adnxs.com', 'Xandr (AppNexus)'],

  // Experience / A-B testing
  ['abtasty.com', 'AB Tasty'],
  ['kameleoon.com', 'Kameleoon'],
  ['kameleoon.io', 'Kameleoon'],
  ['iadvize.com', 'iAdvize'],

  // Tag Manager
  ['googletagmanager.com', 'GTM'],

  // CMP
  ['didomi.io', 'Didomi'],
  ['privacy-center.org', 'Didomi'],
  ['onetrust.com', 'OneTrust'],
  ['cookielaw.org', 'OneTrust'],
  ['cookiepro.com', 'OneTrust'],
  ['axeptio.eu', 'Axeptio'],
  ['cookiebot.com', 'Cookiebot'],
  ['consentmanager.net', 'Consent Manager'],
  ['quantcast.com', 'Quantcast'],
  ['usercentrics.eu', 'Usercentrics'],
  ['iubenda.com', 'Iubenda'],
  ['sirdata.com', 'Sirdata'],

  // Other
  ['batch.com', 'Batch'],
  ['e-novate.be', 'E-novate'],
  ['notifyvisitors.com', 'Notify'],
];

// ─── Cookie name-based matching ───────────────────────────
// Each entry: [regex pattern, provider name]
// Checked when domain matching fails
const COOKIE_NAME_MAP: [RegExp, string][] = [
  // GA4
  [/^_ga($|_)/, 'GA4'],
  [/^_gid$/, 'GA4'],
  [/^_gat/, 'GA4'],

  // Google Ads
  [/^_gcl_au$/, 'Google Ads'],
  [/^_gcl_aw$/, 'Google Ads'],
  [/^_gac_/, 'Google Ads'],

  // Meta Pixel / Facebook
  [/^_fbp$/, 'Meta Pixel'],
  [/^_fbc$/, 'Meta Pixel'],

  // TikTok
  [/^ttcsid/, 'TikTok'],
  [/^_ttp$/, 'TikTok'],
  [/^tt_/, 'TikTok'],

  // Piano Analytics
  [/^_pcid$/, 'Piano Analytics'],
  [/^_pctx$/, 'Piano Analytics'],
  [/^_pprv$/, 'Piano Analytics'],
  [/^pa_/, 'Piano Analytics'],
  [/^atuserid/, 'Piano Analytics'],

  // Kameleoon
  [/^kameleoonVisitorCode/, 'Kameleoon'],

  // Didomi
  [/didomi/i, 'Didomi'],
  [/^euconsent-v2$/, 'Didomi'],

  // Snapchat
  [/^_scid/, 'Snapchat'],
  [/^sc_at$/, 'Snapchat'],

  // Pinterest
  [/^_pin_unauth$/, 'Pinterest'],
  [/^_pinterest_/, 'Pinterest'],

  // Contentsquare
  [/^_cs_/, 'Contentsquare'],

  // Criteo
  [/^cto_bundle$/, 'Criteo'],
  [/^cto_tld_test$/, 'Criteo'],

  // Hotjar
  [/^_hj/, 'Hotjar'],

  // HubSpot
  [/^__hs/, 'HubSpot'],
  [/^hubspotutk$/, 'HubSpot'],

  // LinkedIn
  [/^li_sugr$/, 'LinkedIn'],
  [/^bcookie$/, 'LinkedIn'],
  [/^lidc$/, 'LinkedIn'],

  // AB Tasty
  [/^ABTasty/, 'AB Tasty'],

  // Clarity
  [/^_clck$/, 'Clarity'],
  [/^_clsk$/, 'Clarity'],

  // OneTrust
  [/^OptanonConsent$/, 'OneTrust'],
  [/^OptanonAlertBoxClosed$/, 'OneTrust'],

  // Axeptio
  [/^axeptio_/, 'Axeptio'],

  // Cookiebot
  [/^CookieConsent$/, 'Cookiebot'],
];

/**
 * Match a cookie to a known provider by domain first, then by name.
 * Returns the provider name or null if not found.
 */
export function matchCookieToProvider(cookieDomain: string, cookieName?: string): string | null {
  // 1. Try domain-based matching first
  const domain = cookieDomain.replace(/^\./, '').toLowerCase();

  for (const [pattern, provider] of COOKIE_DOMAIN_MAP) {
    if (domain === pattern || domain.endsWith('.' + pattern)) {
      return provider;
    }
  }

  // 2. Try cookie name-based matching
  if (cookieName) {
    for (const [pattern, provider] of COOKIE_NAME_MAP) {
      if (pattern.test(cookieName)) {
        return provider;
      }
    }
  }

  return null;
}
