import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getTranslations, type Translations } from "@/lib/i18n/translations";
import {
  DEFAULT_LOCALE,
  LOCALE_CHOSEN_KEY,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/lib/i18n/types";

type LanguageContextValue = {
  locale: Locale;
  translations: Translations;
  setLocale: (locale: Locale) => void;
  hasChosenLocale: boolean;
  markLocaleChosen: () => void;
  ready: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === "fr" ? "fr" : DEFAULT_LOCALE;
}

function readHasChosenLocale(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(LOCALE_CHOSEN_KEY) === "1";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [hasChosenLocale, setHasChosenLocale] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(readStoredLocale());
    setHasChosenLocale(readHasChosenLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
  }, [locale, ready]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
    localStorage.setItem(LOCALE_CHOSEN_KEY, "1");
    setHasChosenLocale(true);
    document.documentElement.lang = next;
  }, []);

  const markLocaleChosen = useCallback(() => {
    localStorage.setItem(LOCALE_CHOSEN_KEY, "1");
    setHasChosenLocale(true);
  }, []);

  const value = useMemo(
    () => ({
      locale,
      translations: getTranslations(locale),
      setLocale,
      hasChosenLocale,
      markLocaleChosen,
      ready,
    }),
    [locale, setLocale, hasChosenLocale, markLocaleChosen, ready],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
