'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, Sparkles, Loader2 } from 'lucide-react';
import type { ComplianceFlag } from '@/lib/types/analysis';
import { useLocale } from '@/lib/i18n/context';

interface ComplianceLabelProps {
  flags: ComplianceFlag[];
}

export function ComplianceLabel({ flags }: ComplianceLabelProps) {
  const { t, locale } = useLocale();
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(false);

  const criticalCount = flags.filter((f) => f.severity === 'critical').length;
  const warningCount = flags.filter((f) => f.severity === 'warning').length;

  let level: 'green' | 'orange' | 'red';
  let label: string;
  let description: string;
  let Icon: typeof ShieldCheck;
  let colors: string;

  if (criticalCount > 0) {
    level = 'red';
    label = t('compliance.nonCompliant');
    description = t('compliance.nonCompliant.desc', { count: criticalCount });
    Icon = ShieldX;
    colors = 'border-red-300 bg-red-50 text-red-900';
  } else if (warningCount > 0) {
    level = 'orange';
    label = t('compliance.needsAttention');
    description = t('compliance.needsAttention.desc', { count: warningCount });
    Icon = ShieldAlert;
    colors = 'border-orange-300 bg-orange-50 text-orange-900';
  } else {
    level = 'green';
    label = t('compliance.compliant');
    description = t('compliance.compliant.desc');
    Icon = ShieldCheck;
    colors = 'border-green-300 bg-green-50 text-green-900';
  }

  const iconColors = {
    green: 'text-green-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
  };

  const badgeColors = {
    green: 'bg-green-600',
    orange: 'bg-orange-600',
    red: 'bg-red-600',
  };

  // Fetch AI summary when flags are available
  useEffect(() => {
    if (flags.length === 0) return;

    setAiLoading(true);
    setAiError(false);
    setAiSummary(null);

    const flagsData = flags.map((f) => ({
      severity: f.severity,
      message: f.message,
      detail: f.detail,
    }));

    fetch('/api/ai-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flags: flagsData, locale }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          console.error('AI summary API error:', data);
          throw new Error(data.detail || data.error || 'API error');
        }
        return data;
      })
      .then((data) => {
        if (data.summary) {
          setAiSummary(data.summary);
        }
      })
      .catch((err) => {
        console.error('AI summary fetch error:', err);
        setAiError(true);
      })
      .finally(() => {
        setAiLoading(false);
      });
  }, [flags, locale]);

  return (
    <div id="compliance-label" className="space-y-3">
      <div className={`flex items-center gap-4 rounded-xl border-2 p-5 ${colors}`}>
        <Icon className={`h-10 w-10 shrink-0 ${iconColors[level]}`} />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-0.5 text-sm font-bold text-white ${badgeColors[level]}`}>
              {label}
            </span>
          </div>
          <p className="mt-1 text-sm">{description}</p>
        </div>
      </div>

      {/* AI Summary */}
      {flags.length > 0 && (
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-800">{t('ai.summary.title')}</span>
          </div>
          {aiLoading && (
            <div className="flex items-center gap-2 text-sm text-purple-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('ai.summary.loading')}
            </div>
          )}
          {aiError && (
            <p className="text-sm text-purple-500 italic">{t('ai.summary.error')}</p>
          )}
          {aiSummary && (
            <div className="text-sm text-purple-900 leading-relaxed space-y-1">
              {aiSummary.split('\n').filter(Boolean).map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
