import type { Page } from 'playwright';
import type { CookieData } from '../types/scan';

export async function collectCookies(page: Page): Promise<CookieData[]> {
  const context = page.context();
  const cookies = await context.cookies();
  return cookies.map((c) => ({
    name: c.name,
    value: c.value,
    domain: c.domain,
    path: c.path,
    expires: c.expires,
    httpOnly: c.httpOnly,
    secure: c.secure,
    sameSite: c.sameSite,
  }));
}
