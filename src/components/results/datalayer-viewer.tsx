'use client';

import { useState } from 'react';
import { Database, ChevronDown, ChevronRight } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';

interface DataLayerViewerProps {
  dataLayer: Record<string, unknown>[];
}

export function DataLayerViewer({ dataLayer }: DataLayerViewerProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const { t } = useLocale();

  const toggle = (index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div id="datalayer-viewer" className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Database className="h-5 w-5 text-indigo-600" />
          {t('datalayer.title', { count: dataLayer.length })}
        </h3>
      </div>
      <div className="max-h-64 overflow-y-auto p-3">
        {dataLayer.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">{t('datalayer.noEntries')}</p>
        ) : (
          <div className="space-y-1">
            {dataLayer.map((entry, i) => {
              const event = (entry as Record<string, unknown>).event as string | undefined;
              const isExpanded = expandedItems.has(i);
              return (
                <div key={i} className="rounded border border-gray-100">
                  <button
                    onClick={() => toggle(i)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-gray-50"
                  >
                    {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    <span className="font-mono font-medium">[{i}]</span>
                    {event && <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-indigo-700">{event}</span>}
                  </button>
                  {isExpanded && (
                    <pre className="border-t border-gray-100 bg-gray-50 p-3 text-xs overflow-x-auto">
                      {JSON.stringify(entry, null, 2)}
                    </pre>
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
