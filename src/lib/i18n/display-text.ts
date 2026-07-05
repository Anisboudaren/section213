import type { Locale } from "@/lib/i18n/types";

/** Uppercase display labels for EN/FR; preserve Arabic casing and diacritics. */
export function formatDisplayText(text: string, locale: Locale): string {
  return locale === "ar" ? text : text.toUpperCase();
}
