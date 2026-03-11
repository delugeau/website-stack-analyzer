'use client';

import { Layers, AlertTriangle, Server } from 'lucide-react';
import type { GTMResult } from '@/lib/types/gtm';
import { useLocale } from '@/lib/i18n/context';

interface GTMSectionProps {
  gtm: GTMResult;
}

export function GTMSection({ gtm }: GTMSectionProps) {
  const { t } = useLocale();

  return (
    <div id="gtm-section" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <Layers className="h-5 w-5 text-green-600" />
        {t('gtm.title')}
      </h3>

      {!gtm.detected ? (
        <div className="mt-4 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
          {t('gtm.noGtm')}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {gtm.containers.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700">{t('gtm.containers', { count: gtm.containers.length })}</h4>
              <div className="mt-2 space-y-2">
                {gtm.containers.map((container) => (
                  <div key={container.containerId} className="rounded-md bg-gray-50 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold">{container.containerId}</span>
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs">
                        {container.type.toUpperCase()}
                      </span>
                    </div>
                    {container.isProxied && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-orange-600">
                        <AlertTriangle className="h-3 w-3" />
                        {t('gtm.proxiedVia')} <span className="font-mono">{container.proxyDomain}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {gtm.proxy && (
            <div className="rounded-md border border-orange-200 bg-orange-50 p-3 text-sm">
              <div className="flex items-center gap-2 font-medium text-orange-800">
                <AlertTriangle className="h-4 w-4" />
                {t('gtm.proxyDetected')}
              </div>
              <p className="mt-1 text-orange-700">
                {t('gtm.domains')} {gtm.proxy.proxyDomains.join(', ')}
              </p>
            </div>
          )}

          {gtm.serverSide && (
            <div className="rounded-md border border-purple-200 bg-purple-50 p-3 text-sm">
              <div className="flex items-center gap-2 font-medium text-purple-800">
                <Server className="h-4 w-4" />
                {t('gtm.sgtm.title')}
              </div>
              <p className="mt-1 text-purple-700">
                {t('gtm.sgtm.domains')} <span className="font-mono">{gtm.serverSide.domains.join(', ')}</span>
              </p>
              <p className="mt-1 text-purple-600 text-xs">
                {t('gtm.sgtm.hits', { count: gtm.serverSide.hits.length })}
              </p>
              <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                {gtm.serverSide.hits.slice(0, 10).map((hit, i) => {
                  const shortUrl = hit.url.length > 80 ? hit.url.slice(0, 80) + '...' : hit.url;
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs text-purple-700">
                      <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        hit.matchType === 'subdomain'
                          ? 'bg-purple-200 text-purple-800'
                          : 'bg-indigo-200 text-indigo-800'
                      }`}>
                        {hit.matchType === 'subdomain' ? t('gtm.sgtm.subdomain') : t('gtm.sgtm.endpoint')}
                      </span>
                      <span className="font-mono text-purple-600">{hit.matchDetail}</span>
                      <span className="truncate font-mono text-purple-500">{shortUrl}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-sm">
            <span className="font-medium text-gray-600">{t('gtm.dataLayer')} </span>
            {gtm.dataLayer.length > 0 ? (
              <span className="text-green-700">{t('gtm.entries', { count: gtm.dataLayer.length })}</span>
            ) : (
              <span className="text-gray-500">{t('gtm.empty')}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
