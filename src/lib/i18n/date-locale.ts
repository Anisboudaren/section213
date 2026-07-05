import { ar as arLocale } from "date-fns/locale/ar";
import { fr } from "date-fns/locale";

import type { Locale } from "@/lib/i18n/types";

export function getDateFnsLocale(locale: Locale) {
  if (locale === "fr") return fr;
  if (locale === "ar") return arLocale;
  return undefined;
}
