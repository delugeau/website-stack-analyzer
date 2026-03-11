'use client';

import { useState, useMemo } from 'react';
import { Network, ChevronDown, ChevronRight } from 'lucide-react';
import type { ParsedProviderHit } from '@/lib/types/provider';
import { useLocale } from '@/lib/i18n/context';

interface NetworkRequestsTableProps {
  preConsentRequests: ParsedProviderHit[];
  postConsentRequests: ParsedProviderHit[];
}

// Stable color palette for provider badges
const PROVIDER_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-purple-100 text-purple-800',
  'bg-green-100 text-green-800',
  'bg-orange-100 text-orange-800',
  'bg-pink-100 text-pink-800',
  'bg-teal-100 text-teal-800',
  'bg-indigo-100 text-indigo-800',
  'bg-red-100 text-red-800',
  'bg-yellow-100 text-yellow-800',
  'bg-cyan-100 text-cyan-800',
  'bg-lime-100 text-lime-800',
  'bg-amber-100 text-amber-800',
  'bg-emerald-100 text-emerald-800',
  'bg-rose-100 text-rose-800',
  'bg-violet-100 text-violet-800',
  'bg-fuchsia-100 text-fuchsia-800',
  'bg-sky-100 text-sky-800',
  'bg-stone-100 text-stone-800',
];

function buildProviderColorMap(requests: ParsedProviderHit[]): Map<string, string> {
  const names = [...new Set(requests.map((r) => r.providerName))].sort();
  const map = new Map<string, string>();
  names.forEach((name, i) => {
    map.set(name, PROVIDER_COLORS[i % PROVIDER_COLORS.length]);
  });
  return map;
}

export function NetworkRequestsTable({ preConsentRequests, postConsentRequests }: NetworkRequestsTableProps) {
  const [tab, setTab] = useState<'pre' | 'post'>('pre');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const { t } = useLocale();

  const colorMap = useMemo(
    () => buildProviderColorMap([...preConsentRequests, ...postConsentRequests]),
    [preConsentRequests, postConsentRequests]
  );

  const rawRequests = tab === 'pre' ? preConsentRequests : postConsentRequests;

  // Sort requests alphabetically by provider name (A → Z)
  const requests = useMemo(
    () => [...rawRequests].sort((a, b) => a.providerName.localeCompare(b.providerName)),
    [rawRequests]
  );

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div id="network-requests-table" className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Network className="h-5 w-5 text-cyan-600" />
          {t('network.title', { before: preConsentRequests.length, after: postConsentRequests.length })}
        </h3>
      </div>
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setTab('pre')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${tab === 'pre' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          {t('network.before', { count: preConsentRequests.length })}
        </button>
        <button
          onClick={() => setTab('post')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${tab === 'post' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
        >
          {t('network.after', { count: postConsentRequests.length })}
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {requests.length === 0 ? (
          <p className="p-4 text-center text-sm text-gray-400">{t('network.noRequests')}</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {requests.map((req, i) => {
              const key = `${tab}-${i}`;
              const isExpanded = expanded.has(key);
              const shortUrl = req.request.url.length > 80 ? req.request.url.slice(0, 80) + '...' : req.request.url;
              const providerColor = colorMap.get(req.providerName) || 'bg-gray-100 text-gray-800';
              return (
                <div key={key}>
                  <button
                    onClick={() => toggle(key)}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs hover:bg-gray-50"
                  >
                    {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    <span className={`rounded px-1.5 py-0.5 font-medium ${providerColor}`}>{req.providerName}</span>
                    {req.eventName && (
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-gray-600">{req.eventName}</span>
                    )}
                    <span className="truncate font-mono text-gray-500">{shortUrl}</span>
                    <span className={`ml-auto shrink-0 rounded px-1.5 py-0.5 text-xs ${
                      req.request.status && req.request.status >= 200 && req.request.status < 300
                        ? 'bg-green-100 text-green-700'
                        : req.request.status && req.request.status >= 400
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {req.request.status || '?'}
                    </span>
                  </button>
                  {isExpanded && Object.keys(req.params).length > 0 && (
                    <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                      <table className="w-full text-xs">
                        <tbody>
                          {Object.entries(req.params).slice(0, 20).map(([k, v]) => (
                            <tr key={k} className="border-b border-gray-100 last:border-0">
                              <td className="py-1 pr-3 font-mono font-medium text-gray-600 align-top">{k}</td>
                              <td className="py-1 font-mono text-gray-800 break-all">{String(v)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
