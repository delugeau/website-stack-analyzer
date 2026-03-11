'use client';

import { useState, useMemo } from 'react';
import { BarChart3, ChevronDown, ChevronRight, AlertTriangle, Check, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { ProviderSummary } from '@/lib/types/analysis';
import { useLocale } from '@/lib/i18n/context';

interface ProvidersTableProps {
  providers: ProviderSummary[];
}

// Providers allowed before consent — green "Non" (CMPs, tag managers)
const ALLOWED_PRE_CONSENT_IDS = ['gtm-load', 'didomi'];
const ALLOWED_PRE_CONSENT_CATEGORIES = ['privacy'];

// Providers tolerated before consent — orange "Oui" (config loading, no PII)
const TOLERATED_PRE_CONSENT_IDS = ['kameleoon'];

type SortKey = 'name' | 'category' | 'tagId' | 'requests' | 'preConsent';
type SortDir = 'asc' | 'desc';

export function ProvidersTable({ providers }: ProvidersTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const { t } = useLocale();

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    return [...providers].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = a.providerName.localeCompare(b.providerName);
          break;
        case 'category':
          cmp = a.category.localeCompare(b.category);
          break;
        case 'tagId':
          cmp = (a.tagIds[0] || '').localeCompare(b.tagIds[0] || '');
          break;
        case 'requests':
          cmp = a.requestCount - b.requestCount;
          break;
        case 'preConsent': {
          const aAllowed = ALLOWED_PRE_CONSENT_IDS.includes(a.providerId) || ALLOWED_PRE_CONSENT_CATEGORIES.includes(a.category);
          const bAllowed = ALLOWED_PRE_CONSENT_IDS.includes(b.providerId) || ALLOWED_PRE_CONSENT_CATEGORIES.includes(b.category);
          const aTolerated = TOLERATED_PRE_CONSENT_IDS.includes(a.providerId);
          const bTolerated = TOLERATED_PRE_CONSENT_IDS.includes(b.providerId);
          const aScore = a.firesBeforeConsent ? (aAllowed ? 0 : aTolerated ? 1 : 2) : 0;
          const bScore = b.firesBeforeConsent ? (bAllowed ? 0 : bTolerated ? 1 : 2) : 0;
          cmp = aScore - bScore;
          break;
        }
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [providers, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="inline h-3 w-3 ml-1 text-gray-400" />;
    return sortDir === 'asc'
      ? <ArrowUp className="inline h-3 w-3 ml-1 text-blue-600" />
      : <ArrowDown className="inline h-3 w-3 ml-1 text-blue-600" />;
  };

  const categoryColors: Record<string, string> = {
    analytics: 'bg-blue-100 text-blue-700',
    advertising: 'bg-purple-100 text-purple-700',
    'tag-manager': 'bg-green-100 text-green-700',
    experience: 'bg-orange-100 text-orange-700',
    privacy: 'bg-teal-100 text-teal-700',
    other: 'bg-gray-100 text-gray-700',
  };

  const getCategoryLabel = (cat: string) => {
    const key = `providers.cat.${cat}` as Parameters<typeof t>[0];
    try {
      return t(key);
    } catch {
      return cat;
    }
  };

  return (
    <div id="providers-table" className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          {t('providers.title', { count: providers.length })}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('name')}>
                {t('providers.provider')} <SortIcon col="name" />
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('category')}>
                {t('providers.category')} <SortIcon col="category" />
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('tagId')}>
                {t('providers.tagId')} <SortIcon col="tagId" />
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('requests')}>
                {t('providers.requests')} <SortIcon col="requests" />
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('preConsent')}>
                {t('providers.preConsent')} <SortIcon col="preConsent" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((provider) => {
              const isAllowed = ALLOWED_PRE_CONSENT_IDS.includes(provider.providerId) || ALLOWED_PRE_CONSENT_CATEGORIES.includes(provider.category);
              const isTolerated = TOLERATED_PRE_CONSENT_IDS.includes(provider.providerId);
              const isProblematic = provider.firesBeforeConsent && !isAllowed && !isTolerated;
              return (
                <tr
                  key={provider.providerId}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggle(provider.providerId)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {expanded.has(provider.providerId) ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="font-medium">{provider.providerName}</span>
                    </div>
                    {expanded.has(provider.providerId) && provider.eventNames.length > 0 && (
                      <div className="mt-2 ml-6 flex flex-wrap gap-1">
                        {provider.eventNames.map((e) => (
                          <span key={e} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">
                            {e}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${categoryColors[provider.category] || categoryColors.other}`}>
                      {getCategoryLabel(provider.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {provider.tagIds.length > 0 ? provider.tagIds.join(', ') : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">{provider.requestCount}</td>
                  <td className="px-4 py-3 text-center">
                    {isProblematic ? (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-700">
                        Oui
                      </span>
                    ) : isTolerated && provider.firesBeforeConsent ? (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700">
                        Oui
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700">
                        Non
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
