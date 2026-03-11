import { NextRequest } from 'next/server';
import { scanStore } from '@/lib/store/scan-store';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ scanId: string }> }
) {
  const { scanId } = await params;

  const scan = scanStore.get(scanId);
  if (!scan) {
    return new Response('Scan not found', { status: 404 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      function send(event: string, data: unknown) {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      }

      // Send current state immediately
      send('progress', {
        status: scan.status,
        progress: scan.progress,
        currentStep: scan.currentStep,
      });

      // If already completed, send results and close
      if (scan.status === 'completed') {
        send('complete', { results: scan.results });
        controller.close();
        return;
      }

      if (scan.status === 'error') {
        send('error', { message: scan.error });
        controller.close();
        return;
      }

      // Listen for progress updates
      const onProgress = (data: { status: string; progress: number; currentStep: string }) => {
        try {
          send('progress', data);
        } catch {
          cleanup();
        }
      };

      const onComplete = (results: unknown) => {
        try {
          send('complete', { results });
          controller.close();
        } catch {
          // Stream already closed
        }
        cleanup();
      };

      const onError = (message: string) => {
        try {
          send('error', { message });
          controller.close();
        } catch {
          // Stream already closed
        }
        cleanup();
      };

      function cleanup() {
        scanStore.removeListener(`progress:${scanId}`, onProgress);
        scanStore.removeListener(`complete:${scanId}`, onComplete);
        scanStore.removeListener(`error:${scanId}`, onError);
      }

      scanStore.on(`progress:${scanId}`, onProgress);
      scanStore.on(`complete:${scanId}`, onComplete);
      scanStore.on(`error:${scanId}`, onError);

      // Cleanup on abort
      _request.signal.addEventListener('abort', cleanup);
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
