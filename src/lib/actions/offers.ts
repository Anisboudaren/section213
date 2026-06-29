"use server";

import { revalidatePath } from "next/cache";

import type { Offer as PrismaOffer, OfferCategory, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { OfferMetadata } from "@/lib/offers/offer-types";
import { V1_OFFER_SEED } from "@/lib/offers/v1-seed-data";
import type { CreateOfferInput, UpdateOfferInput } from "@/lib/schemas/offer-schema";
import type { Offer, OfferCategory as OfferCategoryType } from "@/lib/types/admin";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export type OfferDto = Offer;

function toOfferDto(offer: PrismaOffer): OfferDto {
  return {
    id: offer.id,
    slug: offer.slug,
    name: offer.name,
    nameAr: offer.nameAr ?? undefined,
    nameFr: offer.nameFr ?? undefined,
    category: offer.category as OfferCategoryType,
    description: offer.description,
    descriptionFr: offer.descriptionFr ?? undefined,
    features: offer.features,
    featuresFr: offer.featuresFr.length ? offer.featuresFr : undefined,
    price: offer.price ?? undefined,
    priceLabel: offer.priceLabel ?? undefined,
    priceLabelFr: offer.priceLabelFr ?? undefined,
    active: offer.active,
    featured: offer.featured,
    studyOnly: offer.studyOnly,
    order: offer.sortOrder,
    cta: offer.cta ?? undefined,
    ctaFr: offer.ctaFr ?? undefined,
    noteEn: offer.noteEn ?? undefined,
    noteFr: offer.noteFr ?? undefined,
    metadata: (offer.metadata as OfferMetadata | null) ?? undefined,
  };
}

function offerCreateData(data: CreateOfferInput) {
  return {
    slug: data.slug,
    name: data.name,
    nameAr: data.nameAr || null,
    nameFr: data.nameFr || null,
    category: data.category as OfferCategory,
    description: data.description,
    descriptionFr: data.descriptionFr || null,
    features: data.features ?? [],
    featuresFr: data.featuresFr ?? [],
    price: data.price ?? null,
    priceLabel: data.priceLabel || null,
    priceLabelFr: data.priceLabelFr || null,
    active: data.active ?? true,
    featured: data.featured ?? false,
    studyOnly: data.studyOnly ?? false,
    sortOrder: data.order ?? 0,
    cta: data.cta || null,
    ctaFr: data.ctaFr || null,
    noteEn: data.noteEn || null,
    noteFr: data.noteFr || null,
    metadata: (data.metadata ?? undefined) as Prisma.InputJsonValue | undefined,
  };
}

export type OfferFilters = {
  category?: OfferCategory;
  activeOnly?: boolean;
};

export async function getOffers(
  filters?: OfferFilters,
): Promise<ActionResult<OfferDto[]>> {
  try {
    const rows = await prisma.offer.findMany({
      where: {
        ...(filters?.category ? { category: filters.category } : {}),
        ...(filters?.activeOnly ? { active: true } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return { success: true, data: rows.map(toOfferDto) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch offers",
    };
  }
}

export async function getOffer(id: string): Promise<ActionResult<OfferDto>> {
  try {
    const row = await prisma.offer.findUnique({ where: { id } });
    if (!row) return { success: false, error: "Offer not found" };
    return { success: true, data: toOfferDto(row) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch offer",
    };
  }
}

export async function getOfferLabel(slugOrId: string): Promise<string> {
  const row = await prisma.offer.findFirst({
    where: { OR: [{ slug: slugOrId }, { id: slugOrId }] },
    select: { name: true, nameFr: true },
  });
  if (!row) return slugOrId;
  return row.nameFr ?? row.name;
}

export async function resetOffersToV1(): Promise<ActionResult<OfferDto[]>> {
  try {
    await prisma.offer.deleteMany();

    for (const offer of V1_OFFER_SEED) {
      await prisma.offer.create({ data: offerCreateData(offer) });
    }

    revalidateOfferPaths();
    const rows = await prisma.offer.findMany({ orderBy: { sortOrder: "asc" } });
    return { success: true, data: rows.map(toOfferDto) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reset offers",
    };
  }
}

export async function createOffer(data: CreateOfferInput): Promise<ActionResult<OfferDto>> {
  try {
    const row = await prisma.offer.create({ data: offerCreateData(data) });
    revalidateOfferPaths();
    return { success: true, data: toOfferDto(row) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create offer",
    };
  }
}

export async function updateOffer(
  id: string,
  data: UpdateOfferInput,
): Promise<ActionResult<OfferDto>> {
  try {
    const row = await prisma.offer.update({
      where: { id },
      data: {
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.nameAr !== undefined ? { nameAr: data.nameAr || null } : {}),
        ...(data.nameFr !== undefined ? { nameFr: data.nameFr || null } : {}),
        ...(data.category !== undefined ? { category: data.category } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.descriptionFr !== undefined ? { descriptionFr: data.descriptionFr || null } : {}),
        ...(data.features !== undefined ? { features: data.features } : {}),
        ...(data.featuresFr !== undefined ? { featuresFr: data.featuresFr } : {}),
        ...(data.price !== undefined ? { price: data.price ?? null } : {}),
        ...(data.priceLabel !== undefined ? { priceLabel: data.priceLabel || null } : {}),
        ...(data.priceLabelFr !== undefined ? { priceLabelFr: data.priceLabelFr || null } : {}),
        ...(data.active !== undefined ? { active: data.active } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
        ...(data.studyOnly !== undefined ? { studyOnly: data.studyOnly } : {}),
        ...(data.order !== undefined ? { sortOrder: data.order } : {}),
        ...(data.cta !== undefined ? { cta: data.cta || null } : {}),
        ...(data.ctaFr !== undefined ? { ctaFr: data.ctaFr || null } : {}),
        ...(data.noteEn !== undefined ? { noteEn: data.noteEn || null } : {}),
        ...(data.noteFr !== undefined ? { noteFr: data.noteFr || null } : {}),
        ...(data.metadata !== undefined
          ? { metadata: data.metadata as Prisma.InputJsonValue }
          : {}),
      },
    });

    revalidateOfferPaths();
    return { success: true, data: toOfferDto(row) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update offer",
    };
  }
}

export async function deleteOffer(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    await prisma.offer.delete({ where: { id } });
    revalidateOfferPaths();
    return { success: true, data: { id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete offer",
    };
  }
}

function revalidateOfferPaths() {
  revalidatePath("/admin/offers");
  revalidatePath("/book");
  revalidatePath("/contact");
  revalidatePath("/");
}
