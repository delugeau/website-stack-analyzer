import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod/v4';
import { scanStore } from '@/lib/store/scan-store';
import { runScan } from '@/lib/scanner';
import { normalizeUrl } from '@/lib/utils/url';

const scanRequestSchema = z.object({
  url: z.string().min(1, 'URL is required'),
  options: z
    .object({
      timeout: z.number().min(5000).max(60000).optional(),
      waitAfterLoad: z.number().min(1000).max(15000).optional(),
      userAgent: z.string().optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = scanRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { url: rawUrl, options } = parsed.data;
    const url = normalizeUrl(rawUrl);

    // Validate URL
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return NextResponse.json({ error: 'URL must use HTTP or HTTPS protocol' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const scanId = uuidv4();
    scanStore.create(scanId, url);

    // Fire and forget - scan runs in background
    runScan(scanId, url, options).catch((error) => {
      console.error(`Scan ${scanId} failed:`, error);
      scanStore.setError(scanId, error instanceof Error ? error.message : 'Unknown error');
    });

    return NextResponse.json(
      {
        scanId,
        status: 'queued',
        url,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('Failed to initiate scan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
