'use client';

import { useLocale } from '@/lib/i18n/context';
import type { Locale } from '@/lib/i18n/translations';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  const options: { value: Locale; label: string; flag: string }[] = [
    { value: 'fr', label: 'FR', flag: '🇫🇷' },
    { value: 'en', label: 'EN', flag: '🇬🇧' },
  ];

  return (
    <div id="language-switcher" className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLocale(opt.value)}
          className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${
            locale === opt.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-label={`Switch to ${opt.label}`}
        >
          <span>{opt.flag}</span>
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
