import { v4 as uuidv4 } from 'uuid';
import type { Page } from 'playwright';
import type { CapturedRequest } from '../types/network';

export class NetworkCapture {
  private requests: CapturedRequest[] = [];

  attach(page: Page): void {
    page.on('request', (request) => {
      this.requests.push({
        id: uuidv4(),
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData() || null,
        resourceType: request.resourceType(),
        timestamp: Date.now(),
        status: null,
        responseHeaders: null,
      });
    });

    page.on('response', (response) => {
      const matching = this.requests.find(
        (r) => r.url === response.url() && r.status === null
      );
      if (matching) {
        matching.status = response.status();
        matching.responseHeaders = response.headers();
      }
    });

    page.on('requestfailed', (request) => {
      const matching = this.requests.find(
        (r) => r.url === request.url() && r.status === null
      );
      if (matching) {
        matching.status = -1;
        matching.error = request.failure()?.errorText;
      }
    });
  }

  snapshot(): CapturedRequest[] {
    return [...this.requests];
  }

  clear(): void {
    this.requests = [];
  }
}
