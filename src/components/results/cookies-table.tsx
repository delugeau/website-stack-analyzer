'use client';

import { useState, useMemo } from 'react';
import { Cookie, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { CookieData } from '@/lib/types/scan';
import { useLocale } from '@/lib/i18n/context';
import { matchCookieToProvider } from '@/lib/utils/cookie-provider-map';

interface CookiesTableProps {
  preConsentCookies: CookieData[];
  postConsentCookies: CookieData[];
}

type SortKey = 'name' | 'domain' | 'provider' | 'secure' | 'httpOnly';
type SortDir = 'asc' | 'desc';

export function CookiesTable({ preConsentCookies, postConsentCookies }: CookiesTableProps) {
  const [tab, setTab] = useState<'pre' | 'post'>('pre');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const { t } = useLocale();

  const rawCookies = tab === 'pre' ? preConsentCookies : postConsentCookies;
  const preNames = new Set(preConsentCookies.map((c) => c.name));
  const newCookies = postConsentCookies.filter((c) => !preNames.has(c.name));

  // Pre-compute provider for each cookie
  const cookiesWithProvider = useMemo(() => {
    return rawCookies.map((cookie) => ({
      ...cookie,
      provider: matchCookieToProvider(cookie.domain, cookie.name) || t('cookies.unknownProvider'),
    }));
  }, [rawCookies, t]);

  const cookies = useMemo(() => {
    return [...cookiesWithProvider].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'domain') cmp = a.domain.localeCompare(b.domain);
      else if (sortKey === 'provider') cmp = a.provider.localeCompare(b.provider);
      else if (sortKey === 'secure') cmp = (a.secure ? 1 : 0) - (b.secure ? 1 : 0);
      else if (sortKey === 'httpOnly') cmp = (a.httpOnly ? 1 : 0) - (b.httpOnly ? 1 : 0);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [cookiesWithProvider, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="inline h-3 w-3 ml-1 text-gray-400" />;
    return sortDir === 'asc'
      ? <ArrowUp className="inline h-3 w-3 ml-1 text-blue-600" />
      : <ArrowDown className="inline h-3 w-3 ml-1 text-blue-600" />;
  };

  return (
    <div id="cookies-table" className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Cookie className="h-5 w-5 text-amber-600" />
          {t('cookies.title', { before: preConsentCookies.length, after: postConsentCookies.length })}
        </h3>
        {newCookies.length > 0 && (
          <p className="mt-1 text-xs text-green-600">{t('cookies.newAfter', { count: newCookies.length })}</p>
        )}
      </div>
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setTab('pre')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${tab === 'pre' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          {t('cookies.before', { count: preConsentCookies.length })}
        </button>
        <button
          onClick={() => setTab('post')}
          className={`flex-1 px-4 py-2 text-sm font-medium ${tab === 'post' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          {t('cookies.after', { count: postConsentCookies.length })}
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('name')}>
                {t('cookies.name')} <SortIcon col="name" />
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('domain')}>
                {t('cookies.domain')} <SortIcon col="domain" />
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('provider')}>
                Provider <SortIcon col="provider" />
              </th>
              <th className="px-3 py-2 text-center font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('secure')}>
                Secure <SortIcon col="secure" />
              </th>
              <th className="px-3 py-2 text-center font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => handleSort('httpOnly')}>
                HttpOnly <SortIcon col="httpOnly" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cookies.map((cookie, i) => {
              const isNew = tab === 'post' && !preNames.has(cookie.name);
              const isUnknown = cookie.provider === t('cookies.unknownProvider');
              return (
                <tr key={i} className={isNew ? 'bg-green-50' : ''}>
                  <td className="px-3 py-2 font-mono">{cookie.name}</td>
                  <td className="px-3 py-2 text-gray-600">{cookie.domain}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                      isUnknown
                        ? 'bg-gray-100 text-gray-500 italic'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {cookie.provider}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">{cookie.secure ? 'Y' : '-'}</td>
                  <td className="px-3 py-2 text-center">{cookie.httpOnly ? 'Y' : '-'}</td>
                </tr>
              );
            })}
            {cookies.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-4 text-center text-gray-400">{t('cookies.noCookies')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
