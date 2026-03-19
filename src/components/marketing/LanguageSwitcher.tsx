import { useLanguage } from '@/context/LanguageContext';
import type { Language } from '@/context/translations';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
      {(['en', 'fr'] as Language[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
            lang === l
              ? 'bg-primary-blue text-white'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
