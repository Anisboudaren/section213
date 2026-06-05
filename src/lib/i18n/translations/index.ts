import type { Locale } from "@/lib/i18n/types";
import { en, type Translations } from "@/lib/i18n/translations/en";
import { fr } from "@/lib/i18n/translations/fr";

export type { Translations };

const translations: Record<Locale, Translations> = {
  en,
  fr,
};

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? en;
}
