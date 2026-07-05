import type { Locale } from "@/lib/i18n/types";

type LocaleFields<T> = {
  en: T;
  fr: T;
  ar?: T;
};

export function pickLocaleField<T>(locale: Locale, fields: LocaleFields<T>): T {
  if (locale === "fr") return fields.fr;
  if (locale === "ar") return fields.ar ?? fields.en;
  return fields.en;
}

export function pickLocaleTriple<T>(
  locale: Locale,
  en: T,
  fr: T,
  ar?: T,
): T {
  return pickLocaleField(locale, { en, fr, ar });
}
