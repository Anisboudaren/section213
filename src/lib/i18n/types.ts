export type Locale = "en" | "fr" | "ar";

export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALE_STORAGE_KEY = "section213-locale";
export const LOCALE_CHOSEN_KEY = "section213-locale-chosen";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export const LOCALE_CODES: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  ar: "AR",
};

export function isRtl(locale: Locale): boolean {
  return locale === "ar";
}

export function getDir(locale: Locale): "ltr" | "rtl" {
  return isRtl(locale) ? "rtl" : "ltr";
}

export function isValidLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "fr" || value === "ar";
}
