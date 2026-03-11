'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Globe, Shield, BarChart3, Layers } from 'lucide-react';
import { useLocale } from '@/lib/i18n/context';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useLocale();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to start scan');
      }

      const data = await response.json();
      router.push(`/scan/${data.scanId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div id="home-page" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t('home.heading')}
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          {t('home.subheading')}
        </p>
      </div>

      <form id="scan-form" onSubmit={handleSubmit} className="mt-10">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="scan-url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('home.placeholder')}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-base shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              disabled={isLoading}
            />
          </div>
          <button
            id="scan-submit-btn"
            type="submit"
            disabled={isLoading || !url.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Search className="h-5 w-5" />
            {isLoading ? t('home.scanning') : t('home.analyze')}
          </button>
        </div>
        {error && (
          <p id="scan-error" className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </form>

      <div id="features-grid" className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={<Shield className="h-6 w-6 text-blue-600" />}
          title={t('home.feature.cmp.title')}
          description={t('home.feature.cmp.desc')}
        />
        <FeatureCard
          icon={<Layers className="h-6 w-6 text-green-600" />}
          title={t('home.feature.gtm.title')}
          description={t('home.feature.gtm.desc')}
        />
        <FeatureCard
          icon={<BarChart3 className="h-6 w-6 text-purple-600" />}
          title={t('home.feature.providers.title')}
          description={t('home.feature.providers.desc')}
        />
        <FeatureCard
          icon={<Search className="h-6 w-6 text-orange-600" />}
          title={t('home.feature.compliance.title')}
          description={t('home.feature.compliance.desc')}
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
}
