'use client';

import { use } from 'react';
import { useSSE } from '@/hooks/use-sse';
import { useLocale } from '@/lib/i18n/context';
import { ScanProgress } from '@/components/scan-progress';
import { ComplianceLabel } from '@/components/results/compliance-label';
import { SummaryCard } from '@/components/results/summary-card';
import { CMPSection } from '@/components/results/cmp-section';
import { GTMSection } from '@/components/results/gtm-section';
import { ProvidersTable } from '@/components/results/providers-table';
import { ConsentComparison } from '@/components/results/consent-comparison';
import { ComplianceIndicators } from '@/components/results/compliance-indicators';
import { CookiesTable } from '@/components/results/cookies-table';
import { DataLayerViewer } from '@/components/results/datalayer-viewer';
import { NetworkRequestsTable } from '@/components/results/network-requests-table';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import type { ScanResults } from '@/lib/types/scan';

function downloadJSON(results: ScanResults, scanId: string) {
  const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `scan-${scanId}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ScanPage({
  params,
  searchParams,
}: {
  params: Promise<{ scanId: string }>;
  searchParams: Promise<{ url?: string }>;
}) {
  const { scanId } = use(params);
  const { url: scanUrl } = use(searchParams);
  const { status, progress, currentStep, results, error } = useSSE(scanId, scanUrl ?? null);
  const { t, locale } = useLocale();

  if (status !== 'completed' || !results) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" />
          {t('results.back')}
        </Link>
        <ScanProgress status={status} progress={progress} currentStep={currentStep} error={error} />
      </div>
    );
  }

  const dateLocale = locale === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <div id="scan-results" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-start gap-6">
        {results.screenshot && (
          <div className="hidden sm:block shrink-0">
            <img
              src={results.screenshot}
              alt={results.url}
              className="w-48 h-auto rounded-lg border border-gray-200 shadow-sm object-cover"
            />
          </div>
        )}
        <div className="flex-1 flex items-start justify-between">
          <div>
            <Link href="/" className="mb-2 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              {t('results.newAnalysis')}
            </Link>
            <h2 id="scan-url-title" className="text-2xl font-bold">{results.url}</h2>
            <p className="text-sm text-gray-500">
              {t('results.scannedOn')} {new Date(results.scannedAt).toLocaleString(dateLocale)} &mdash; {(results.duration / 1000).toFixed(1)}s
            </p>
          </div>
          <button
            id="export-json-btn"
            onClick={() => downloadJSON(results, scanId)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            JSON
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <ComplianceLabel flags={results.analysis.complianceFlags} />
        <SummaryCard results={results} />
        <ComplianceIndicators flags={results.analysis.complianceFlags} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <CMPSection cmp={results.cmp} consent={results.consent} />
          <GTMSection gtm={results.gtm} />
        </div>

        <ProvidersTable providers={results.analysis.providerSummary} />
        <ConsentComparison diffs={results.analysis.consentDiffs} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <CookiesTable
            preConsentCookies={results.preConsent.cookies}
            postConsentCookies={results.postConsent.cookies}
          />
          <DataLayerViewer dataLayer={results.preConsent.dataLayer} />
        </div>

        <NetworkRequestsTable
          preConsentRequests={results.preConsent.classifiedRequests}
          postConsentRequests={results.postConsent.classifiedRequests}
        />
      </div>
    </div>
  );
}
