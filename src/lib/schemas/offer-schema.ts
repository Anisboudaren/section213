import { z } from "zod";

import type { OfferMetadata } from "@/lib/offers/offer-types";

export const offerCategoryEnum = z.enum(["pack", "ala_carte"]);

export const createOfferSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9_]+$/, "Slug: lowercase letters, numbers, underscores"),
  name: z.string().min(1),
  nameAr: z.string().optional(),
  nameFr: z.string().optional(),
  category: offerCategoryEnum,
  description: z.string().min(1),
  descriptionFr: z.string().optional(),
  features: z.array(z.string()).default([]),
  featuresFr: z.array(z.string()).optional(),
  price: z.number().int().positive().optional(),
  priceLabel: z.string().optional(),
  priceLabelFr: z.string().optional(),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  studyOnly: z.boolean().default(false),
  order: z.number().int().default(0),
  cta: z.string().optional(),
  ctaFr: z.string().optional(),
  noteEn: z.string().optional(),
  noteFr: z.string().optional(),
  metadata: z.custom<OfferMetadata>().optional(),
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>;

export const updateOfferSchema = createOfferSchema.partial();

export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;

export type OfferFormPayload = CreateOfferInput;

export function offerFormValuesToInput(values: {
  slug: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  category: z.infer<typeof offerCategoryEnum>;
  description: string;
  descriptionFr?: string;
  features: { value: string }[];
  featuresFr?: { value: string }[];
  priceMode: "fixed" | "label" | "study";
  price?: number;
  priceLabel?: string;
  priceLabelFr?: string;
  active: boolean;
  featured: boolean;
  studyOnly: boolean;
  order: number;
  cta?: string;
  ctaFr?: string;
  noteEn?: string;
  noteFr?: string;
}): OfferFormPayload {
  const studyOnly = values.studyOnly || values.priceMode === "study";

  return {
    slug: values.slug.trim(),
    name: values.name.trim(),
    nameAr: values.nameAr?.trim() || undefined,
    nameFr: values.nameFr?.trim() || undefined,
    category: values.category,
    description: values.description.trim(),
    descriptionFr: values.descriptionFr?.trim() || undefined,
    features: values.features.map((f) => f.value.trim()).filter(Boolean),
    featuresFr: values.featuresFr?.map((f) => f.value.trim()).filter(Boolean),
    price: values.priceMode === "fixed" ? values.price : undefined,
    priceLabel:
      values.priceMode === "label" || values.priceMode === "study"
        ? values.priceLabel?.trim() || undefined
        : undefined,
    priceLabelFr:
      values.priceMode === "label" || values.priceMode === "study"
        ? values.priceLabelFr?.trim() || undefined
        : undefined,
    active: values.active,
    featured: values.featured,
    studyOnly,
    order: values.order,
    cta: values.cta?.trim() || undefined,
    ctaFr: values.ctaFr?.trim() || undefined,
    noteEn: values.noteEn?.trim() || undefined,
    noteFr: values.noteFr?.trim() || undefined,
  };
}
