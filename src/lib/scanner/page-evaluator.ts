import type { Page } from 'playwright';

export async function getDataLayer(page: Page): Promise<Record<string, unknown>[]> {
  return page.evaluate(() => {
    const w = window as unknown as Record<string, unknown>;
    if (Array.isArray(w.dataLayer)) {
      return (w.dataLayer as Record<string, unknown>[]).slice(0, 100);
    }
    return [];
  });
}

export async function evaluateWindowObject(page: Page, path: string): Promise<unknown> {
  return page.evaluate((p) => {
    const parts = p.split('.');
    let current: unknown = window;
    for (const part of parts) {
      if (current == null || typeof current !== 'object') return undefined;
      current = (current as Record<string, unknown>)[part];
    }
    return current;
  }, path);
}
