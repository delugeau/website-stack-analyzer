'use client';

import { useLocale } from '@/lib/i18n/context';
import type { Locale } from '@/lib/i18n/translations';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  const options: { value: Locale; label: string; flagCode: string }[] = [
    { value: 'fr', label: 'FR', flagCode: 'fr' },
    { value: 'en', label: 'EN', flagCode: 'gb' },
  ];

  return (
    <div id="language-switcher" className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLocale(opt.value)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
            locale === opt.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-label={`Switch to ${opt.label}`}
        >
          <img
            src={`https://flagcdn.com/20x15/${opt.flagCode}.png`}
            width={20}
            height={15}
            alt={opt.label}
            className="rounded-sm"
          />
          <span>{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
