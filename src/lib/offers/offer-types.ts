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
  priceFr: string;
  priceEn: string;
  studyOnly: boolean;
};

function parseMetadata(raw: unknown): OfferMetadata | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  return raw as OfferMetadata;
}

function formatAlaCartePrice(offer: Offer, locale: "fr" | "en"): string {
  if (offer.studyOnly || offer.priceLabel || offer.priceLabelFr) {
    return locale === "fr"
      ? offer.priceLabelFr ?? offer.priceLabel ?? "Sur étude"
      : offer.priceLabel ?? offer.priceLabelFr ?? "On request";
  }
  if (offer.price) {
    const formatted = offer.price.toLocaleString(locale === "fr" ? "fr-DZ" : "en-US");
    return locale === "fr" ? `${formatted} DA` : `${formatted} DZD`;
  }
  return locale === "fr" ? "Sur devis" : "On quote";
}

export function offerToPackView(offer: Offer): OfferPackView {
  const meta = parseMetadata(offer.metadata);

  return {
    id: offer.id,
    slug: offer.slug,
    nameFr: offer.nameFr ?? offer.name,
    nameEn: offer.name,
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
    priceFr: formatAlaCartePrice(offer, "fr"),
    priceEn: formatAlaCartePrice(offer, "en"),
    studyOnly: offer.studyOnly ?? false,
  };
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

export function formatPriceFrom(amount: number, locale: "fr" | "en"): string {
  const formatted = amount.toLocaleString(locale === "fr" ? "fr-DZ" : "en-US");
  return locale === "fr" ? `${formatted} DA` : `${formatted} DZD`;
}
