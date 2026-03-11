'use client';

import { useState, useMemo } from 'react';
import { ArrowRight, AlertTriangle, Check, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { ConsentDiff } from '@/lib/types/analysis';
import { useLocale } from '@/lib/i18n/context';

interface ConsentComparisonProps {
  diffs: ConsentDiff[];
}

type SortKey = 'provider' | 'before' | 'after';
type SortDir = 'asc' | 'desc';

export function ConsentComparison({ diffs }: ConsentComparisonProps) {
  const [sortKey, setSortKey] = useState<SortKey>('provider');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const { t } = useLocale();

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    return [...diffs].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'provider':
          cmp = a.providerName.localeCompare(b.providerName);
          break;
        case 'before':
          cmp = a.preConsentHits - b.preConsentHits;
          break;
        case 'after':
          cmp = a.postConsentHits - b.postConsentHits;
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [diffs, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="inline h-3 w-3 ml-1 text-gray-400" />;
    return sortDir === 'asc'
      ? <ArrowUp className="inline h-3 w-3 ml-1 text-blue-600" />
      : <ArrowDown className="inline h-3 w-3 ml-1 text-blue-600" />;
  };

  return (
    <div id="consent-comparison" className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <ArrowRight className="h-5 w-5 text-orange-600" />
          {t('consent.title')}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('provider')}>
                {t('consent.provider')} <SortIcon col="provider" />
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('before')}>
                {t('consent.before')} <SortIcon col="before" />
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('after')}>
                {t('consent.after')} <SortIcon col="after" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((diff) => (
              <tr key={diff.providerId} className={diff.firesBeforeConsent ? 'bg-red-50/50' : ''}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {diff.firesBeforeConsent ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                    <span className="font-medium">{diff.providerName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={diff.preConsentHits > 0 ? 'font-bold text-red-600' : 'text-gray-400'}>
                    {diff.preConsentHits}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-green-700">{diff.postConsentHits}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
