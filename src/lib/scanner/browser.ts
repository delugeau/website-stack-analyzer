import { chromium, type Browser, type BrowserContext } from 'playwright';
import type { ScanOptions } from '../types/scan';

const REALISTIC_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const isServerless = !!(
  process.env.NETLIFY ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT
);

export class BrowserManager {
  private browser: Browser | null = null;

  async getBrowser(): Promise<Browser> {
    if (!this.browser || !this.browser.isConnected()) {
      let executablePath: string | undefined;
      let extraArgs: string[] = [];

      if (isServerless) {
        const sparticuz = await import('@sparticuz/chromium');
        executablePath = await sparticuz.default.executablePath();
        extraArgs = sparticuz.default.args;
      }

      this.browser = await chromium.launch({
        executablePath,
        headless: true,
        args: [
          '--disable-blink-features=AutomationControlled',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          ...extraArgs,
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
