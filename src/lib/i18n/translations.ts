export type Locale = 'fr' | 'en';

export const translations = {
  // ─── Header ──────────────────────────────────────
  'app.title': {
    fr: 'Website Stack Analyzer',
    en: 'Website Stack Analyzer',
  },

  // ─── Home Page ───────────────────────────────────
  'home.heading': {
    fr: 'Analysez le stack tracking de n\'importe quel site',
    en: 'Analyze the tracking stack of any website',
  },
  'home.subheading': {
    fr: 'CMP, GTM, pixels, tags — obtenez un rapport complet en quelques secondes.',
    en: 'CMP, GTM, pixels, tags — get a complete report in seconds.',
  },
  'home.placeholder': {
    fr: 'https://www.example.com',
    en: 'https://www.example.com',
  },
  'home.analyze': {
    fr: 'Analyser',
    en: 'Analyze',
  },
  'home.scanning': {
    fr: 'Analyse en cours...',
    en: 'Scanning...',
  },
  'home.feature.cmp.title': {
    fr: 'Détection CMP',
    en: 'CMP Detection',
  },
  'home.feature.cmp.desc': {
    fr: 'Didomi, OneTrust, Axeptio, Cookiebot et 6 autres',
    en: 'Didomi, OneTrust, Axeptio, Cookiebot and 6 more',
  },
  'home.feature.gtm.title': {
    fr: 'Analyse GTM',
    en: 'GTM Analysis',
  },
  'home.feature.gtm.desc': {
    fr: 'Containers, proxy, dataLayer, détection server-side',
    en: 'Containers, proxy, dataLayer, server-side detection',
  },
  'home.feature.providers.title': {
    fr: '46+ Providers',
    en: '46+ Providers',
  },
  'home.feature.providers.desc': {
    fr: 'GA4, Meta, TikTok, Criteo, Kameleoon, The Trade Desk...',
    en: 'GA4, Meta, TikTok, Criteo, Kameleoon, The Trade Desk...',
  },
  'home.feature.compliance.title': {
    fr: 'Conformité',
    en: 'Compliance',
  },
  'home.feature.compliance.desc': {
    fr: 'Comparaison avant / après consentement',
    en: 'Before / after consent comparison',
  },

  // ─── Scan Progress ──────────────────────────────
  'progress.failed': {
    fr: 'Le scan a échoué',
    en: 'Scan failed',
  },
  'progress.unknownError': {
    fr: 'Une erreur inconnue est survenue',
    en: 'An unknown error occurred',
  },
  'progress.scanning': {
    fr: 'Scan en cours...',
    en: 'Scan in progress...',
  },
  'progress.step.navigation': {
    fr: 'Navigation',
    en: 'Navigation',
  },
  'progress.step.cmp': {
    fr: 'Détection CMP',
    en: 'CMP Detection',
  },
  'progress.step.consent': {
    fr: 'Consentement',
    en: 'Consent',
  },
  'progress.step.postConsent': {
    fr: 'Scan post-consentement',
    en: 'Post-consent scan',
  },
  'progress.step.analysis': {
    fr: 'Analyse',
    en: 'Analysis',
  },

  // ─── Scan Results Page ──────────────────────────
  'results.back': {
    fr: 'Retour',
    en: 'Back',
  },
  'results.newAnalysis': {
    fr: 'Nouvelle analyse',
    en: 'New analysis',
  },
  'results.scannedOn': {
    fr: 'Scanné le',
    en: 'Scanned on',
  },

  // ─── Compliance Label ───────────────────────────
  'compliance.compliant': {
    fr: 'Conforme',
    en: 'Compliant',
  },
  'compliance.compliant.desc': {
    fr: 'Aucun tracking détecté avant le consentement. Le setup semble correct.',
    en: 'No tracking detected before user consent. Setup looks good.',
  },
  'compliance.needsAttention': {
    fr: 'À vérifier',
    en: 'Needs attention',
  },
  'compliance.needsAttention.desc': {
    fr: '{count} avertissement(s) détecté(s) — vérification recommandée.',
    en: '{count} warning(s) detected — review recommended.',
  },
  'compliance.nonCompliant': {
    fr: 'Non conforme',
    en: 'Non-compliant',
  },
  'compliance.nonCompliant.desc': {
    fr: '{count} problème(s) critique(s) détecté(s) — du tracking se déclenche avant le consentement.',
    en: '{count} critical issue(s) detected — tracking fires before user consent.',
  },

  // ─── Summary Cards ──────────────────────────────
  'summary.cmp': {
    fr: 'CMP',
    en: 'CMP',
  },
  'summary.detected': {
    fr: 'Détectée',
    en: 'Detected',
  },
  'summary.notDetected': {
    fr: 'Non détectée',
    en: 'Not detected',
  },
  'summary.gtm': {
    fr: 'GTM',
    en: 'GTM',
  },
  'summary.containers': {
    fr: '{count} container(s)',
    en: '{count} container(s)',
  },
  'summary.proxyDetected': {
    fr: 'Proxy détecté',
    en: 'Proxy detected',
  },
  'summary.sgtmDetected': {
    fr: 'Server-Side GTM détecté',
    en: 'Server-Side GTM detected',
  },
  'summary.providers': {
    fr: 'Providers',
    en: 'Providers',
  },
  'summary.providersDetected': {
    fr: '{count} détecté(s)',
    en: '{count} detected',
  },
  'summary.requests': {
    fr: '{count} requêtes',
    en: '{count} requests',
  },
  'summary.compliance': {
    fr: 'Conformité',
    en: 'Compliance',
  },
  'summary.ok': {
    fr: 'OK',
    en: 'OK',
  },
  'summary.alerts': {
    fr: '{count} alerte(s)',
    en: '{count} alert(s)',
  },

  // ─── CMP Section ────────────────────────────────
  'cmp.title': {
    fr: 'Consent Management Platform',
    en: 'Consent Management Platform',
  },
  'cmp.noCmp': {
    fr: 'Aucune CMP détectée sur ce site.',
    en: 'No CMP detected on this site.',
  },
  'cmp.type': {
    fr: 'Type',
    en: 'Type',
  },
  'cmp.version': {
    fr: 'Version',
    en: 'Version',
  },
  'cmp.tcf': {
    fr: 'TCF v2',
    en: 'TCF v2',
  },
  'cmp.tcfActive': {
    fr: 'Actif (CMP ID : {id})',
    en: 'Active (CMP ID: {id})',
  },
  'cmp.tcfNotDetected': {
    fr: 'Non détecté',
    en: 'Not detected',
  },
  'cmp.consentAccepted': {
    fr: 'Consentement accepté',
    en: 'Consent accepted',
  },
  'cmp.yes': {
    fr: 'Oui',
    en: 'Yes',
  },
  'cmp.noFailed': {
    fr: 'Non (échec)',
    en: 'No (failed)',
  },
  'cmp.categories': {
    fr: 'Catégories :',
    en: 'Categories:',
  },
  'cmp.unknown': {
    fr: 'Inconnu',
    en: 'Unknown',
  },

  // ─── GTM Section ────────────────────────────────
  'gtm.title': {
    fr: 'Google Tag Manager',
    en: 'Google Tag Manager',
  },
  'gtm.noGtm': {
    fr: 'Aucun GTM détecté sur ce site. Aucun container ni dataLayer trouvé.',
    en: 'No GTM detected on this site. No GTM container or dataLayer found.',
  },
  'gtm.containers': {
    fr: 'Containers ({count})',
    en: 'Containers ({count})',
  },
  'gtm.proxiedVia': {
    fr: 'Proxifié via',
    en: 'Proxied via',
  },
  'gtm.proxyDetected': {
    fr: 'Proxy détecté',
    en: 'Proxy detected',
  },
  'gtm.domains': {
    fr: 'Domaine(s) :',
    en: 'Domain(s):',
  },
  'gtm.dataLayer': {
    fr: 'dataLayer :',
    en: 'dataLayer:',
  },
  'gtm.entries': {
    fr: '{count} entrée(s)',
    en: '{count} entry(ies)',
  },
  'gtm.empty': {
    fr: 'Vide',
    en: 'Empty',
  },
  'gtm.sgtm.title': {
    fr: 'Server-Side GTM détecté',
    en: 'Server-Side GTM detected',
  },
  'gtm.sgtm.domains': {
    fr: 'Domaine(s) sGTM :',
    en: 'sGTM domain(s):',
  },
  'gtm.sgtm.hits': {
    fr: '{count} requête(s) server-side détectée(s)',
    en: '{count} server-side request(s) detected',
  },
  'gtm.sgtm.subdomain': {
    fr: 'Sous-domaine',
    en: 'Subdomain',
  },
  'gtm.sgtm.endpoint': {
    fr: 'Endpoint',
    en: 'Endpoint',
  },

  // ─── Providers Table ────────────────────────────
  'providers.title': {
    fr: 'Providers détectés ({count})',
    en: 'Detected providers ({count})',
  },
  'providers.provider': {
    fr: 'Provider',
    en: 'Provider',
  },
  'providers.category': {
    fr: 'Catégorie',
    en: 'Category',
  },
  'providers.tagId': {
    fr: 'Tag ID',
    en: 'Tag ID',
  },
  'providers.requests': {
    fr: 'Requêtes',
    en: 'Requests',
  },
  'providers.preConsent': {
    fr: 'Pré-consentement',
    en: 'Pre-consent',
  },
  'providers.cat.analytics': {
    fr: 'Analytics',
    en: 'Analytics',
  },
  'providers.cat.advertising': {
    fr: 'Publicité',
    en: 'Advertising',
  },
  'providers.cat.tag-manager': {
    fr: 'Tag Manager',
    en: 'Tag Manager',
  },
  'providers.cat.experience': {
    fr: 'Expérience',
    en: 'Experience',
  },
  'providers.cat.privacy': {
    fr: 'Vie privée',
    en: 'Privacy',
  },
  'providers.cat.other': {
    fr: 'Autre',
    en: 'Other',
  },

  // ─── Consent Comparison ─────────────────────────
  'consent.title': {
    fr: 'Comparaison avant / après consentement',
    en: 'Before / after consent comparison',
  },
  'consent.provider': {
    fr: 'Provider',
    en: 'Provider',
  },
  'consent.before': {
    fr: 'Avant consentement',
    en: 'Before consent',
  },
  'consent.after': {
    fr: 'Après consentement',
    en: 'After consent',
  },

  // ─── Compliance Indicators ──────────────────────
  'indicators.noIssues': {
    fr: 'Aucun problème de conformité détecté.',
    en: 'No compliance issues detected.',
  },

  // ─── Cookies Table ──────────────────────────────
  'cookies.title': {
    fr: 'Cookies ({before} avant, {after} après)',
    en: 'Cookies ({before} before, {after} after)',
  },
  'cookies.newAfter': {
    fr: '+{count} nouveau(x) après consentement',
    en: '+{count} new after consent',
  },
  'cookies.before': {
    fr: 'Avant ({count})',
    en: 'Before ({count})',
  },
  'cookies.after': {
    fr: 'Après ({count})',
    en: 'After ({count})',
  },
  'cookies.name': {
    fr: 'Nom',
    en: 'Name',
  },
  'cookies.domain': {
    fr: 'Domaine',
    en: 'Domain',
  },
  'cookies.noCookies': {
    fr: 'Aucun cookie',
    en: 'No cookies',
  },
  'cookies.unknownProvider': {
    fr: 'Non défini',
    en: 'Unknown',
  },

  // ─── Network Requests Table ─────────────────────
  'network.title': {
    fr: 'Requêtes tracking ({before} avant, {after} après)',
    en: 'Tracking requests ({before} before, {after} after)',
  },
  'network.before': {
    fr: 'Avant ({count})',
    en: 'Before ({count})',
  },
  'network.after': {
    fr: 'Après ({count})',
    en: 'After ({count})',
  },
  'network.noRequests': {
    fr: 'Aucune requête tracking',
    en: 'No tracking requests',
  },

  // ─── DataLayer Viewer ───────────────────────────
  'datalayer.title': {
    fr: 'dataLayer ({count} entrées)',
    en: 'dataLayer ({count} entries)',
  },
  'datalayer.noEntries': {
    fr: 'Aucune entrée dataLayer',
    en: 'No dataLayer entries',
  },

  // ─── Compliance flags (generated) ───────────────
  'flag.firesBeforeConsent': {
    fr: '{name} se déclenche avant le consentement',
    en: '{name} fires before consent',
  },
  'flag.firesBeforeConsent.detail': {
    fr: '{count} requête(s) détectée(s) avant le consentement. Cela peut violer le RGPD et la directive ePrivacy.',
    en: '{count} request(s) detected before user gave consent. This may violate GDPR/ePrivacy regulations.',
  },
  'flag.toleratedBeforeConsent': {
    fr: '{name} se charge avant le consentement (configuration)',
    en: '{name} loads before consent (configuration)',
  },
  'flag.toleratedBeforeConsent.detail': {
    fr: '{count} requête(s) détectée(s) avant le consentement. Ce sont des chargements de configuration/scripts qui ne collectent pas nécessairement de données personnelles.',
    en: '{count} request(s) detected before consent. These are configuration/script loads that do not necessarily collect personal data.',
  },
  'flag.pianoEssential': {
    fr: '{name} se déclenche avant le consentement (mode essential)',
    en: '{name} fires before consent (essential mode)',
  },
  'flag.pianoEssential.detail': {
    fr: '{count} requête(s) détectée(s) avant le consentement, mais pa.consent.getMode() retourne "essential". Piano Analytics est configuré en mesure essentielle, ce qui est acceptable sous certaines conditions.',
    en: '{count} request(s) detected before consent, but pa.consent.getMode() returns "essential". Piano Analytics is configured in essential measurement mode, which is acceptable under certain conditions.',
  },
  'flag.pianoPostConsent': {
    fr: 'Piano Analytics en mode "{mode}" après consentement',
    en: 'Piano Analytics consent mode is "{mode}" after consent',
  },
  'flag.pianoPostConsent.detail': {
    fr: 'Après acceptation du consentement, pa.consent.getMode() devrait retourner "opt-in" mais retourne "{mode}". L\'intégration du consentement peut ne pas fonctionner correctement.',
    en: 'After consent acceptance, pa.consent.getMode() should return "opt-in" but returns "{mode}". The consent integration may not be working correctly.',
  },
  'flag.cookiesBefore': {
    fr: '{count} cookie(s) déposé(s) avant le consentement',
    en: '{count} cookie(s) set before consent',
  },
  'flag.cookiesBefore.detail': {
    fr: 'Des cookies ont été détectés avant le consentement de l\'utilisateur.',
    en: 'Cookies detected before user consent was given.',
  },
  'flag.cookiesAfter': {
    fr: '{count} nouveau(x) cookie(s) après consentement',
    en: '{count} new cookie(s) after consent',
  },
  'flag.cookiesAfter.detail': {
    fr: 'De nouveaux cookies ont été déposés après l\'acceptation du consentement, ce qui est un comportement attendu.',
    en: 'New cookies were set after consent was accepted, which is expected behavior.',
  },

  // ─── AI Summary ───────────────────────────────
  'ai.summary.title': {
    fr: 'Résumé IA',
    en: 'AI Summary',
  },
  'ai.summary.loading': {
    fr: 'Génération du résumé en cours...',
    en: 'Generating summary...',
  },
  'ai.summary.error': {
    fr: 'Impossible de générer le résumé IA.',
    en: 'Unable to generate AI summary.',
  },
  'ai.summary.noKey': {
    fr: 'Clé API OpenAI non configurée.',
    en: 'OpenAI API key not configured.',
  },
} as const;

export type TranslationKey = keyof typeof translations;

/**
 * Get a translated string, optionally replacing {placeholders}
 */
export function t(key: TranslationKey, locale: Locale, params?: Record<string, string | number>): string {
  const entry = translations[key];
  let text: string = entry[locale];
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}
