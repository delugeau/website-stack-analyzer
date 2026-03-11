import { NextRequest, NextResponse } from 'next/server';
import { scanStore } from '@/lib/store/scan-store';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ scanId: string }> }
) {
  const { scanId } = await params;

  const scan = scanStore.get(scanId);

  if (!scan) {
    return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
  }

  if (scan.status === 'completed' && scan.results) {
    return NextResponse.json({
      scanId: scan.scanId,
      status: scan.status,
      progress: scan.progress,
      currentStep: scan.currentStep,
      results: scan.results,
      completedAt: scan.completedAt ? new Date(scan.completedAt).toISOString() : null,
    });
  }

  if (scan.status === 'error') {
    return NextResponse.json({
      scanId: scan.scanId,
      status: scan.status,
      progress: scan.progress,
      error: scan.error,
    });
  }

  return NextResponse.json({
    scanId: scan.scanId,
    status: scan.status,
    progress: scan.progress,
    currentStep: scan.currentStep,
  });
}
