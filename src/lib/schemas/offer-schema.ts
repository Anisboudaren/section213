import { z } from "zod";

export const offerCategoryEnum = z.enum([
  "media",
  "brand_content",
  "websites_apps",
  "automations",
]);

export const createOfferSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens"),
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
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  cta: z.string().optional(),
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>;

export const updateOfferSchema = createOfferSchema.partial();

export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;

export type OfferFormPayload = {
  slug: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  category: z.infer<typeof offerCategoryEnum>;
  description: string;
  descriptionFr?: string;
  features: string[];
  featuresFr?: string[];
  price?: number;
  priceLabel?: string;
  active: boolean;
  featured: boolean;
  order: number;
  cta?: string;
};

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
  priceMode: "fixed" | "label";
  price?: number;
  priceLabel?: string;
  active: boolean;
  featured: boolean;
  order: number;
  cta?: string;
}): OfferFormPayload {
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
    priceLabel: values.priceMode === "label" ? values.priceLabel?.trim() || undefined : undefined,
    active: values.active,
    featured: values.featured,
    order: values.order,
    cta: values.cta?.trim() || undefined,
  };
}
