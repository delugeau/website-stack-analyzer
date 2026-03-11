# Website Stack Analyzer

Analyse the marketing and analytics stack of any website — detects tracking providers, consent management platforms (CMP), Google Tag Manager, and checks GDPR compliance by comparing pre- and post-consent behavior.

## Features

- **CMP Detection** — Identifies 10 consent platforms: Didomi, OneTrust, Axeptio, Cookiebot, Trust Commander, Quantcast, Usercentrics, Iubenda, Sirdata, HubSpot CMP
- **TCF v2 Support** — Reads IAB Transparency & Consent Framework signal
- **Provider Detection** — Classifies network requests across 50+ providers in 3 categories:
  - *Analytics*: GA4, Piano Analytics, Matomo, Hotjar, Clarity, Contentsquare, Amplitude, Mixpanel, Segment…
  - *Advertising*: Meta Pixel, Google Ads, DoubleClick, TikTok, LinkedIn, Criteo, RTB House, The Trade Desk…
  - *Experience*: AB Tasty, Kameleoon, iAdvize
- **GTM Detection** — Detects Google Tag Manager containers including proxy/custom domain setups
- **2-pass scan** — Loads the page before and after accepting consent to diff behavior
- **Compliance analysis** — Flags providers firing before consent, missing CMP, cookie drops before consent
- **Screenshot** — Captures the post-consent page state
- **JSON export** — Full scan results downloadable as JSON
- **Real-time progress** — SSE streaming with step-by-step progress bar
- **i18n** — French / English UI

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Playwright](https://playwright.dev/) — headless browser scanning
- [Zod v4](https://zod.dev/) — input validation
- [@sparticuz/chromium](https://github.com/Sparticuz/chromium) — Chromium binary for serverless environments

## Getting Started

```bash
npm install
npx playwright install chromium
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), enter a URL and click **Analyze**.

## Architecture

```
src/
├── app/
│   ├── page.tsx                          # Home — URL input form
│   ├── scan/[scanId]/page.tsx            # Results page (SSE consumer)
│   └── api/
│       └── scan/
│           ├── route.ts                  # POST — validates URL, returns scanId
│           └── [scanId]/stream/route.ts  # GET  — runs scan inline, streams SSE
├── lib/
│   ├── scanner/        # Core Playwright engine (2-pass scan, consent handler, GTM)
│   ├── providers/      # 50+ provider parsers with registry pattern
│   ├── cmp/            # 10 CMP detectors + TCF v2
│   └── analysis/       # Compliance analysis, consent diff
└── hooks/
    └── use-sse.ts      # EventSource hook for real-time progress
```

### Scan flow

1. Client `POST /api/scan` → validates URL, returns `{ scanId, url }`
2. Client navigates to `/scan/[scanId]?url=...`
3. Page opens SSE connection to `GET /api/scan/[scanId]/stream?url=...`
4. Stream endpoint runs the full Playwright scan and emits SSE events:
   - `progress` — status + percentage at each step
   - `complete` — full results payload
   - `error` — error message

This single-function design works on serverless platforms (no shared in-memory state between invocations).

### Adding a provider

Create `src/lib/providers/parsers/my-provider.ts`:

```typescript
import type { ProviderDefinition } from '../types';

export const myProvider: ProviderDefinition = {
  id: 'my-provider',
  name: 'My Provider',
  category: 'analytics', // 'analytics' | 'advertising' | 'experience' | 'privacy' | 'other'
  urlPatterns: [{ pattern: /my-provider\.com\/collect/ }],
};
```

Then add it to the registry in `src/lib/providers/index.ts`.

### Adding a CMP detector

Create `src/lib/cmp/detectors/my-cmp.ts` implementing the `CMPDetector` interface from `src/lib/cmp/types.ts`, then register it in `src/lib/cmp/index.ts`.

## Deployment

### Netlify

The project is configured for Netlify via `netlify.toml`. The `@sparticuz/chromium` binary is automatically bundled with the serverless function.

> **Note:** Netlify functions have a 26-second maximum timeout. Scans on complex or slow sites may occasionally timeout. For reliable long-running scans, consider a platform with persistent servers (Railway, Render, Fly.io).

```bash
# Deploy via Netlify CLI
netlify deploy --prod
```

### Self-hosted

```bash
npm run build
npm start
```

Requires Node.js 18+ and a standard server environment where `npx playwright install chromium` can be run.
