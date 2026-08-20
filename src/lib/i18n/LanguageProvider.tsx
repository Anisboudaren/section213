"use client";

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
  getDir,
  isValidLocale,
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

function readStoredLocale(fallback: Locale): Locale {
  if (typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  return isValidLocale(stored) ? stored : fallback;
}

function readHasChosenLocale(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(LOCALE_CHOSEN_KEY) === "1";
}

function applyDocumentLocale(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = getDir(locale);
}

type LanguageProviderProps = {
  children: ReactNode;
  /**
   * Locale used before the visitor's stored preference is read, and as the
   * fallback when they have never picked one. Sourced from site settings
   * (`defaultLocale`) so the admin-configured default is the single source of
   * truth. Falls back to DEFAULT_LOCALE when not supplied.
   */
  initialLocale?: Locale;
};

export function LanguageProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [hasChosenLocale, setHasChosenLocale] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readStoredLocale(initialLocale);
    setLocaleState(stored);
    setHasChosenLocale(readHasChosenLocale());
    applyDocumentLocale(stored);
    setReady(true);
  }, [initialLocale]);

  useEffect(() => {
    if (!ready) return;
    applyDocumentLocale(locale);
  }, [locale, ready]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_STORAGE_KEY, next);
    localStorage.setItem(LOCALE_CHOSEN_KEY, "1");
    setHasChosenLocale(true);
    applyDocumentLocale(next);
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
