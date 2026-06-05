export type Locale = "en" | "fr";

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "section213-locale";
export const LOCALE_CHOSEN_KEY = "section213-locale-chosen";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};
