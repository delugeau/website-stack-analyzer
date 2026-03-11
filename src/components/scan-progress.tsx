'use client';

import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';

interface ScanProgressProps {
  status: string;
  progress: number;
  currentStep: string;
  error: string | null;
}

export function ScanProgress({ status, progress, currentStep, error }: ScanProgressProps) {
  const { t } = useLocale();

  if (status === 'error') {
    return (
      <div id="scan-error-panel" className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <XCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-lg font-semibold text-red-800">{t('progress.failed')}</h3>
        <p className="mt-2 text-sm text-red-600">{error || t('progress.unknownError')}</p>
      </div>
    );
  }

  return (
    <div id="scan-progress-panel" className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
      <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
      <h3 className="mt-4 text-lg font-semibold">{t('progress.scanning')}</h3>
      <p className="mt-2 text-sm text-gray-600">{currentStep}</p>
      <div className="mt-6">
        <div className="mx-auto h-2 max-w-md overflow-hidden rounded-full bg-gray-200">
          <div
            id="scan-progress-bar"
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">{progress}%</p>
      </div>
      <div className="mt-6 space-y-2">
        <StepIndicator label={t('progress.step.navigation')} active={status === 'scanning_pre_consent'} done={progress > 35} />
        <StepIndicator label={t('progress.step.cmp')} active={status === 'detecting_cmp'} done={progress > 45} />
        <StepIndicator label={t('progress.step.consent')} active={status === 'accepting_consent'} done={progress > 55} />
        <StepIndicator label={t('progress.step.postConsent')} active={status === 'scanning_post_consent'} done={progress > 85} />
        <StepIndicator label={t('progress.step.analysis')} active={status === 'analyzing'} done={progress >= 100} />
      </div>
    </div>
  );
}

function StepIndicator({ label, active, done }: { label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm">
      {done ? (
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      ) : active ? (
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      ) : (
        <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
      )}
      <span className={done ? 'text-green-700' : active ? 'font-medium text-blue-700' : 'text-gray-400'}>
        {label}
      </span>
    </div>
  );
}
