import { NextRequest } from 'next/server';
import { runScan } from '@/lib/scanner';
import type { ScanStatus } from '@/lib/types/scan';

// Allow up to 25 seconds on platforms that support maxDuration (e.g. Vercel)
export const maxDuration = 25;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ scanId: string }> }
) {
  const { scanId } = await params;
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return new Response('Missing url parameter', { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          // Stream already closed
        }
      }

      send('progress', { status: 'scanning_pre_consent', progress: 0, currentStep: 'Starting scan...' });

      try {
        const results = await runScan(
          scanId,
          url,
          undefined,
          (status: ScanStatus, progress: number, currentStep: string) => {
            send('progress', { status, progress, currentStep });
          }
        );
        send('complete', { results });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        send('error', { message });
      } finally {
        try {
          controller.close();
        } catch {
          // Already closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
