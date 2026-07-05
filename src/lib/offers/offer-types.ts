import { pickLocaleField } from "@/lib/i18n/locale-field";
import type { Locale } from "@/lib/i18n/types";
import type { Offer } from "@/lib/types/admin";

export type OfferValueRow = { label: string; value: string };

export type OfferMetadata = {
  valueBreakdownFr?: OfferValueRow[];
  valueBreakdownEn?: OfferValueRow[];
  totalValueFr?: string;
  totalValueEn?: string;
};

/** Normalized pack view for homepage + booking UI */
export type OfferPackView = {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  nameAr?: string;
  taglineFr: string;
  taglineEn: string;
  priceFrom?: number;
  priceLabelFr?: string;
  priceLabelEn?: string;
  studyOnly: boolean;
  recommended: boolean;
  featuresFr: string[];
  featuresEn: string[];
  valueBreakdownFr?: OfferValueRow[];
  valueBreakdownEn?: OfferValueRow[];
  totalValueFr?: string;
  totalValueEn?: string;
  noteFr?: string;
  noteEn?: string;
  ctaFr: string;
  ctaEn: string;
};

export type OfferAlaCarteView = {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  nameAr?: string;
  priceFr: string;
  priceEn: string;
  priceAr: string;
  price?: number;
  studyOnly: boolean;
};

function parseMetadata(raw: unknown): OfferMetadata | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  return raw as OfferMetadata;
}

function formatAlaCartePrice(offer: Offer, locale: Locale): string {
  if (offer.studyOnly || offer.priceLabel || offer.priceLabelFr) {
    if (locale === "fr") {
      return offer.priceLabelFr ?? offer.priceLabel ?? "Sur étude";
    }
    if (locale === "ar") {
      return offer.priceLabel ?? offer.priceLabelFr ?? "حسب الدراسة";
    }
    return offer.priceLabel ?? offer.priceLabelFr ?? "On request";
  }
  if (offer.price) {
    const localeTag = locale === "fr" ? "fr-DZ" : locale === "ar" ? "ar-DZ" : "en-US";
    const formatted = offer.price.toLocaleString(localeTag);
    if (locale === "fr") return `${formatted} DA`;
    if (locale === "ar") return `${formatted} د.ج`;
    return `${formatted} DZD`;
  }
  if (locale === "fr") return "Sur devis";
  if (locale === "ar") return "حسب العرض";
  return "On quote";
}

export function offerToPackView(offer: Offer): OfferPackView {
  const meta = parseMetadata(offer.metadata);

  return {
    id: offer.id,
    slug: offer.slug,
    nameFr: offer.nameFr ?? offer.name,
    nameEn: offer.name,
    nameAr: offer.nameAr ?? undefined,
    taglineFr: offer.descriptionFr ?? offer.description,
    taglineEn: offer.description,
    priceFrom: offer.studyOnly ? undefined : offer.price,
    priceLabelFr: offer.studyOnly ? offer.priceLabelFr ?? offer.priceLabel : undefined,
    priceLabelEn: offer.studyOnly ? offer.priceLabel ?? offer.priceLabelFr : undefined,
    studyOnly: offer.studyOnly ?? false,
    recommended: offer.featured,
    featuresFr: offer.featuresFr?.length ? offer.featuresFr : offer.features,
    featuresEn: offer.features,
    valueBreakdownFr: meta?.valueBreakdownFr,
    valueBreakdownEn: meta?.valueBreakdownEn,
    totalValueFr: meta?.totalValueFr,
    totalValueEn: meta?.totalValueEn,
    noteFr: offer.noteFr,
    noteEn: offer.noteEn,
    ctaFr: offer.ctaFr ?? offer.cta ?? "Choisir",
    ctaEn: offer.cta ?? offer.ctaFr ?? "Choose",
  };
}

export function offerToAlaCarteView(offer: Offer): OfferAlaCarteView {
  return {
    id: offer.id,
    slug: offer.slug,
    nameFr: offer.nameFr ?? offer.name,
    nameEn: offer.name,
    nameAr: offer.nameAr ?? undefined,
    priceFr: formatAlaCartePrice(offer, "fr"),
    priceEn: formatAlaCartePrice(offer, "en"),
    priceAr: formatAlaCartePrice(offer, "ar"),
    price: offer.studyOnly ? undefined : offer.price,
    studyOnly: offer.studyOnly ?? false,
  };
}

export function getPackName(pack: OfferPackView, locale: Locale): string {
  return pickLocaleField(locale, {
    en: pack.nameEn,
    fr: pack.nameFr,
    ar: pack.nameAr,
  });
}

export function getPackTagline(pack: OfferPackView, locale: Locale): string {
  return pickLocaleField(locale, {
    en: pack.taglineEn,
    fr: pack.taglineFr,
  });
}

export function getPackFeatures(pack: OfferPackView, locale: Locale): string[] {
  return pickLocaleField(locale, {
    en: pack.featuresEn,
    fr: pack.featuresFr,
  });
}

export function getPackCta(pack: OfferPackView, locale: Locale): string {
  return pickLocaleField(locale, {
    en: pack.ctaEn,
    fr: pack.ctaFr,
  });
}

export function getPackNote(pack: OfferPackView, locale: Locale): string | undefined {
  return pickLocaleField(locale, {
    en: pack.noteEn ?? "",
    fr: pack.noteFr ?? "",
  }) || undefined;
}

export function getAlaCarteName(item: OfferAlaCarteView, locale: Locale): string {
  return pickLocaleField(locale, {
    en: item.nameEn,
    fr: item.nameFr,
    ar: item.nameAr,
  });
}

export function getAlaCartePriceDisplay(item: OfferAlaCarteView, locale: Locale): string {
  return pickLocaleField(locale, {
    en: item.priceEn,
    fr: item.priceFr,
    ar: item.priceAr,
  });
}

export function partitionOffers(offers: Offer[]) {
  const active = offers.filter((o) => o.active);
  const packs = active
    .filter((o) => o.category === "pack")
    .sort((a, b) => a.order - b.order)
    .map(offerToPackView);
  const alaCarte = active
    .filter((o) => o.category === "ala_carte")
    .sort((a, b) => a.order - b.order)
    .map(offerToAlaCarteView);

  return { packs, alaCarte };
}

export function findPackView(packs: OfferPackView[], slugOrId?: string) {
  if (!slugOrId) return undefined;
  return packs.find((p) => p.slug === slugOrId || p.id === slugOrId);
}

export function formatPriceFrom(amount: number, locale: Locale): string {
  const localeTag = locale === "fr" ? "fr-DZ" : locale === "ar" ? "ar-DZ" : "en-US";
  const formatted = amount.toLocaleString(localeTag);
  if (locale === "fr") return `${formatted} DA`;
  if (locale === "ar") return `${formatted} د.ج`;
  return `${formatted} DZD`;
}

export type BookingPriceLine = {
  label: string;
  display: string;
  amount: number | null;
};

export function computeBookingTotal(
  pack: OfferPackView | undefined,
  alaCarte: OfferAlaCarteView[],
  selectedAlaCarteSlugs: string[],
  locale: Locale,
): { lines: BookingPriceLine[]; total: number | null; totalDisplay: string | null } {
  const lines: BookingPriceLine[] = [];
  let total = 0;
  let hasNumeric = false;

  if (pack) {
    const name = getPackName(pack, locale);
    if (pack.studyOnly || pack.priceFrom == null) {
      const display =
        locale === "fr"
          ? (pack.priceLabelFr ?? "Sur étude")
          : locale === "ar"
            ? (pack.priceLabelEn ?? "حسب الدراسة")
            : (pack.priceLabelEn ?? "On request");
      lines.push({
        label: name,
        amount: null,
        display,
      });
    } else {
      hasNumeric = true;
      total += pack.priceFrom;
      lines.push({
        label: name,
        amount: pack.priceFrom,
        display: formatPriceFrom(pack.priceFrom, locale),
      });
    }
  }

  for (const slug of selectedAlaCarteSlugs) {
    const item = alaCarte.find((i) => i.slug === slug);
    if (!item) continue;
    const name = getAlaCarteName(item, locale);
    if (item.studyOnly || item.price == null) {
      lines.push({
        label: name,
        amount: null,
        display: getAlaCartePriceDisplay(item, locale),
      });
    } else {
      hasNumeric = true;
      total += item.price;
      lines.push({
        label: name,
        amount: item.price,
        display: getAlaCartePriceDisplay(item, locale),
      });
    }
  }

  if (!hasNumeric) {
    return { lines, total: null, totalDisplay: null };
  }

  return { lines, total, totalDisplay: formatPriceFrom(total, locale) };
}
