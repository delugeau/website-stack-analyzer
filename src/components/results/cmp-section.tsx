'use client';

import { Shield, Check, X } from 'lucide-react';
import type { CMPDetectionResult, ConsentResult } from '@/lib/types/cmp';
import { useLocale } from '@/lib/i18n/context';

interface CMPSectionProps {
  cmp: CMPDetectionResult;
  consent: ConsentResult;
}

export function CMPSection({ cmp, consent }: CMPSectionProps) {
  const { t } = useLocale();

  return (
    <div id="cmp-section" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <Shield className="h-5 w-5 text-blue-600" />
        {t('cmp.title')}
      </h3>

      {!cmp.detected ? (
        <div className="mt-4 rounded-md bg-yellow-50 p-4 text-sm text-yellow-800">
          {t('cmp.noCmp')}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <InfoRow label={t('cmp.type')} value={cmp.name || cmp.type || t('cmp.unknown')} />
          {cmp.version && <InfoRow label={t('cmp.version')} value={cmp.version} />}
          <InfoRow
            label={t('cmp.tcf')}
            value={
              cmp.tcf ? (
                <span className="inline-flex items-center gap-1 text-green-700">
                  <Check className="h-4 w-4" /> {t('cmp.tcfActive', { id: cmp.tcf.cmpId })}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-gray-500">
                  <X className="h-4 w-4" /> {t('cmp.tcfNotDetected')}
                </span>
              )
            }
          />
          <InfoRow
            label={t('cmp.consentAccepted')}
            value={
              consent.accepted ? (
                <span className="inline-flex items-center gap-1 text-green-700">
                  <Check className="h-4 w-4" /> {t('cmp.yes')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-red-600">
                  <X className="h-4 w-4" /> {t('cmp.noFailed')}
                </span>
              )
            }
          />
          {cmp.categories.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-600">{t('cmp.categories')}</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {cmp.categories.map((cat) => (
                  <span key={cat} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between text-sm">
      <span className="font-medium text-gray-600">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
