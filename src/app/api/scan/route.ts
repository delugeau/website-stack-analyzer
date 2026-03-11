import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod/v4';
import { normalizeUrl } from '@/lib/utils/url';

const scanRequestSchema = z.object({
  url: z.string().min(1, 'URL is required'),
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

    const { url: rawUrl } = parsed.data;
    const url = normalizeUrl(rawUrl);

    try {
      const parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return NextResponse.json({ error: 'URL must use HTTP or HTTPS protocol' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const scanId = uuidv4();

    return NextResponse.json({ scanId, url }, { status: 200 });
  } catch (error) {
    console.error('Failed to initiate scan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
