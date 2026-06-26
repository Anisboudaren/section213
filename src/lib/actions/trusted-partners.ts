"use server";

import { revalidatePath } from "next/cache";

import type { TrustedPartner as PrismaTrustedPartner } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  trustedPartnerSchema,
  trustedSectionCopySchema,
  updateTrustedPartnerSchema,
  type TrustedPartnerInput,
  type TrustedSectionCopyInput,
  type UpdateTrustedPartnerInput,
} from "@/lib/schemas/trusted-partner-schema";
import { DEFAULT_TRUSTED_PARTNERS } from "@/lib/trusted-partners-defaults";
import { SITE_SETTINGS_ID } from "@/lib/site-settings-defaults";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export type TrustedPartnerDto = {
  id: string;
  name: string;
  imageUrl: string;
  linkUrl?: string;
  whiteFilter: boolean;
  sortOrder: number;
  active: boolean;
};

export type TrustedSectionCopyDto = {
  index: string;
  en: { title: string; titleHighlight: string; subtitle: string };
  fr: { title: string; titleHighlight: string; subtitle: string };
};

function toPartnerDto(row: PrismaTrustedPartner): TrustedPartnerDto {
  return {
    id: row.id,
    name: row.name,
    imageUrl: row.imageUrl,
    linkUrl: row.linkUrl ?? undefined,
    whiteFilter: row.whiteFilter,
    sortOrder: row.sortOrder,
    active: row.active,
  };
}

async function ensureDefaultTrustedPartners() {
  const count = await prisma.trustedPartner.count();
  if (count > 0) return;

  await prisma.trustedPartner.createMany({
    data: DEFAULT_TRUSTED_PARTNERS,
  });
}

export async function getTrustedPartnersAdmin(): Promise<ActionResult<TrustedPartnerDto[]>> {
  try {
    await ensureDefaultTrustedPartners();
    const rows = await prisma.trustedPartner.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return { success: true, data: rows.map(toPartnerDto) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch trusted partners",
    };
  }
}

export async function getTrustedPartnersPublic(): Promise<TrustedPartnerDto[]> {
  try {
    await ensureDefaultTrustedPartners();
    const rows = await prisma.trustedPartner.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return rows.map(toPartnerDto);
  } catch {
    return [];
  }
}

export async function createTrustedPartner(
  input: TrustedPartnerInput,
): Promise<ActionResult<TrustedPartnerDto>> {
  try {
    const data = trustedPartnerSchema.parse(input);
    const row = await prisma.trustedPartner.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl || null,
        whiteFilter: data.whiteFilter,
        sortOrder: data.sortOrder,
        active: data.active,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/trusted");
    return { success: true, data: toPartnerDto(row) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create partner",
    };
  }
}

export async function updateTrustedPartner(
  id: string,
  input: UpdateTrustedPartnerInput,
): Promise<ActionResult<TrustedPartnerDto>> {
  try {
    const data = updateTrustedPartnerSchema.parse(input);
    const row = await prisma.trustedPartner.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
        ...(data.linkUrl !== undefined ? { linkUrl: data.linkUrl || null } : {}),
        ...(data.whiteFilter !== undefined ? { whiteFilter: data.whiteFilter } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
        ...(data.active !== undefined ? { active: data.active } : {}),
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/trusted");
    return { success: true, data: toPartnerDto(row) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update partner",
    };
  }
}

export async function deleteTrustedPartner(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.trustedPartner.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/trusted");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete partner",
    };
  }
}

export async function getTrustedSectionCopyAdmin(): Promise<ActionResult<TrustedSectionCopyDto>> {
  try {
    const row = await prisma.siteSettings.upsert({
      where: { id: SITE_SETTINGS_ID },
      create: { id: SITE_SETTINGS_ID },
      update: {},
    });

    const { en } = await import("@/lib/i18n/translations/en");
    const { fr } = await import("@/lib/i18n/translations/fr");

    return {
      success: true,
      data: {
        index: row.trustedSectionIndex,
        en: {
          title: row.trustedTitleEn ?? en.homeV2.trusted.title,
          titleHighlight: row.trustedTitleHighlightEn ?? en.homeV2.trusted.titleHighlight,
          subtitle: row.trustedSubtitleEn ?? en.homeV2.trusted.subtitle,
        },
        fr: {
          title: row.trustedTitleFr ?? fr.homeV2.trusted.title,
          titleHighlight: row.trustedTitleHighlightFr ?? fr.homeV2.trusted.titleHighlight,
          subtitle: row.trustedSubtitleFr ?? fr.homeV2.trusted.subtitle,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch section copy",
    };
  }
}

export async function updateTrustedSectionCopy(
  input: TrustedSectionCopyInput,
): Promise<ActionResult<TrustedSectionCopyDto>> {
  try {
    const data = trustedSectionCopySchema.parse(input);
    await prisma.siteSettings.upsert({
      where: { id: SITE_SETTINGS_ID },
      create: {
        id: SITE_SETTINGS_ID,
        trustedSectionIndex: data.index,
        trustedTitleEn: data.titleEn,
        trustedTitleHighlightEn: data.titleHighlightEn,
        trustedSubtitleEn: data.subtitleEn,
        trustedTitleFr: data.titleFr,
        trustedTitleHighlightFr: data.titleHighlightFr,
        trustedSubtitleFr: data.subtitleFr,
      },
      update: {
        trustedSectionIndex: data.index,
        trustedTitleEn: data.titleEn,
        trustedTitleHighlightEn: data.titleHighlightEn,
        trustedSubtitleEn: data.subtitleEn,
        trustedTitleFr: data.titleFr,
        trustedTitleHighlightFr: data.titleHighlightFr,
        trustedSubtitleFr: data.subtitleFr,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/trusted");

    return getTrustedSectionCopyAdmin();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update section copy",
    };
  }
}

export async function resetTrustedPartnersToDefaults(): Promise<ActionResult<TrustedPartnerDto[]>> {
  try {
    await prisma.trustedPartner.deleteMany();
    await prisma.trustedPartner.createMany({ data: DEFAULT_TRUSTED_PARTNERS });
    const rows = await prisma.trustedPartner.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    revalidatePath("/");
    revalidatePath("/admin/trusted");
    return { success: true, data: rows.map(toPartnerDto) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reset partners",
    };
  }
}
