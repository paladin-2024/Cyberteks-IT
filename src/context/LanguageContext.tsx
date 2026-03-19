import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Language } from './translations';

type AnyTranslations = typeof translations[Language];

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: AnyTranslations;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: translations['en'] as AnyTranslations,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cyberteks-lang') as Language | null;
      if (saved === 'en' || saved === 'fr') {
        setLangState(saved);
      }
    } catch {
      // localStorage unavailable — ignore
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    try {
      localStorage.setItem('cyberteks-lang', l);
    } catch { /* ignore */ }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] as AnyTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
