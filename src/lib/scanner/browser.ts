import type { Browser, BrowserContext } from 'playwright';
import type { ScanOptions } from '../types/scan';

const REALISTIC_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

export class BrowserManager {
  private browser: Browser | null = null;

  private async getChromium() {
    // Netlify functions need the browser stored with the app bundle, not in ~/.cache.
    process.env.PLAYWRIGHT_BROWSERS_PATH ??= '0';
    const { chromium } = await import('playwright');
    return chromium;
  }

  async getBrowser(): Promise<Browser> {
    if (!this.browser || !this.browser.isConnected()) {
      const chromium = await this.getChromium();
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--disable-blink-features=AutomationControlled',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
      });
    }
    return this.browser;
  }

  async createContext(options?: ScanOptions): Promise<BrowserContext> {
    const browser = await this.getBrowser();
    return browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: options?.userAgent || REALISTIC_USER_AGENT,
      locale: 'fr-FR',
      timezoneId: 'Europe/Paris',
      geolocation: { latitude: 48.8566, longitude: 2.3522 },
      permissions: ['geolocation'],
      serviceWorkers: 'block',
    });
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const browserManager = new BrowserManager();
