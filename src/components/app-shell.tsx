'use client';

import { LocaleProvider } from '@/lib/i18n/context';
import { LanguageSwitcher } from './language-switcher';
import { useLocale } from '@/lib/i18n/context';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <AppHeader />
      <main id="app-main">{children}</main>
    </LocaleProvider>
  );
}

function AppHeader() {
  const { t } = useLocale();
  return (
    <header id="app-header" className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              SA
            </div>
            <h1 className="text-lg font-semibold">{t('app.title')}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
