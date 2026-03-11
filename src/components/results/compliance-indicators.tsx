'use client';

import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import type { ComplianceFlag } from '@/lib/types/analysis';
import { useLocale } from '@/lib/i18n/context';
import type { TranslationKey } from '@/lib/i18n/translations';

interface ComplianceIndicatorsProps {
  flags: ComplianceFlag[];
}

export function ComplianceIndicators({ flags }: ComplianceIndicatorsProps) {
  const { t } = useLocale();

  if (flags.length === 0) {
    return (
      <div id="compliance-indicators" className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        {t('indicators.noIssues')}
      </div>
    );
  }

  const iconMap = {
    critical: <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
  };

  const bgMap = {
    critical: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const getTranslated = (key: string | undefined, fallback: string, params?: Record<string, string | number>) => {
    if (!key) return fallback;
    try {
      return t(key as TranslationKey, params);
    } catch {
      return fallback;
    }
  };

  return (
    <div id="compliance-indicators" className="space-y-3">
      {flags.map((flag, i) => (
        <div key={i} className={`flex items-start gap-3 rounded-lg border p-4 ${bgMap[flag.severity]}`}>
          {iconMap[flag.severity]}
          <div>
            <p className="font-medium text-sm">
              {getTranslated(flag.messageKey, flag.message, flag.messageParams)}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              {getTranslated(flag.detailKey, flag.detail, flag.messageParams)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
