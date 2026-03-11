'use client';

import { Shield, Layers, BarChart3, Globe } from 'lucide-react';
import type { ScanResults } from '@/lib/types/scan';
import { useLocale } from '@/lib/i18n/context';

interface SummaryCardProps {
  results: ScanResults;
}

export function SummaryCard({ results }: SummaryCardProps) {
  const { t } = useLocale();
  const { cmp, gtm, analysis } = results;
  const criticalFlags = analysis.complianceFlags.filter((f) => f.severity === 'critical').length;

  return (
    <div id="summary-cards" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        id="summary-cmp"
        icon={<Shield className="h-5 w-5 text-blue-600" />}
        label={t('summary.cmp')}
        value={cmp.detected ? cmp.name || t('summary.detected') : t('summary.notDetected')}
        variant={cmp.detected ? 'success' : 'warning'}
      />
      <StatCard
        id="summary-gtm"
        icon={<Layers className="h-5 w-5 text-green-600" />}
        label={t('summary.gtm')}
        value={gtm.detected ? t('summary.containers', { count: gtm.containers.length }) : t('summary.notDetected')}
        variant={gtm.detected ? 'success' : 'neutral'}
        detail={[
          gtm.proxy?.detected ? t('summary.proxyDetected') : null,
          gtm.serverSide?.detected ? t('summary.sgtmDetected') : null,
        ].filter(Boolean).join(' · ') || undefined}
      />
      <StatCard
        id="summary-providers"
        icon={<BarChart3 className="h-5 w-5 text-purple-600" />}
        label={t('summary.providers')}
        value={t('summary.providersDetected', { count: analysis.providerSummary.length })}
        variant="neutral"
        detail={t('summary.requests', { count: analysis.trackingRequestsPreConsent + analysis.trackingRequestsPostConsent })}
      />
      <StatCard
        id="summary-compliance"
        icon={<Globe className="h-5 w-5 text-orange-600" />}
        label={t('summary.compliance')}
        value={criticalFlags === 0 ? t('summary.ok') : t('summary.alerts', { count: criticalFlags })}
        variant={criticalFlags === 0 ? 'success' : 'danger'}
      />
    </div>
  );
}

function StatCard({
  id,
  icon,
  label,
  value,
  variant,
  detail,
}: {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  variant: 'success' | 'warning' | 'danger' | 'neutral';
  detail?: string;
}) {
  const borderColors = {
    success: 'border-green-200',
    warning: 'border-yellow-200',
    danger: 'border-red-200',
    neutral: 'border-gray-200',
  };

  return (
    <div id={id} className={`rounded-lg border ${borderColors[variant]} bg-white p-4 shadow-sm`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <p className="mt-2 text-lg font-bold">{value}</p>
      {detail && <p className="text-xs text-gray-500">{detail}</p>}
    </div>
  );
}
