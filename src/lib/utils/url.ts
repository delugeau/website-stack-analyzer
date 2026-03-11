import { z } from 'zod/v4';

export const urlSchema = z.url().refine(
  (url) => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  },
  { message: 'Must be a valid HTTP or HTTPS URL' }
);

export function normalizeUrl(input: string): string {
  let url = input.trim();

  // Add scheme if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }

  try {
    const parsed = new URL(url);

    // Lowercase hostname
    parsed.hostname = parsed.hostname.toLowerCase();

    // Add www. if bare domain (e.g. "walibi.fr" → "www.walibi.fr")
    const parts = parsed.hostname.split('.');
    if (parts.length === 2) {
      parsed.hostname = 'www.' + parsed.hostname;
    }

    // Rebuild without trailing slash on root path
    const path = parsed.pathname === '/' ? '' : parsed.pathname;
    return `${parsed.protocol}//${parsed.hostname}${parsed.port ? ':' + parsed.port : ''}${path}${parsed.search}${parsed.hash}`;
  } catch {
    return url;
  }
}
