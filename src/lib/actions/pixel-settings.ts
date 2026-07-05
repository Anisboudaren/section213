"use server";

import { revalidatePath } from "next/cache";

import type { PixelSettings as PrismaPixelSettings } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_PIXEL_SETTINGS,
  normalizeActivePixels,
  PIXEL_SETTINGS_ID,
  toPublicPixelConfig,
  type PixelSettingsDto,
  type PublicPixelConfig,
} from "@/lib/pixel-settings-defaults";
import type { UpdatePixelSettingsInput } from "@/lib/schemas/pixel-settings-schema";
import type { PixelConfig } from "@/lib/types/admin";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

function toDto(row: PrismaPixelSettings): PixelSettingsDto {
  return {
    id: row.id,
    metaPixelId: row.metaPixelId ?? undefined,
    metaAccessToken: row.metaAccessToken ?? undefined,
    tiktokPixelId: row.tiktokPixelId ?? undefined,
    tiktokAccessToken: row.tiktokAccessToken ?? undefined,
    ga4MeasurementId: row.ga4MeasurementId ?? undefined,
    ga4ApiSecret: row.ga4ApiSecret ?? undefined,
    googleAdsConversionId: row.googleAdsConversionId ?? undefined,
    snapchatPixelId: row.snapchatPixelId ?? undefined,
    snapchatAccessToken: row.snapchatAccessToken ?? undefined,
    activePixels: normalizeActivePixels(row.activePixels),
    testMode: row.testMode,
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toPixelConfig(row: PrismaPixelSettings): PixelConfig {
  const dto = toDto(row);
  const { id: _id, updatedAt: _updatedAt, ...config } = dto;
  return config;
}

function defaultSettingsData() {
  return {
    id: PIXEL_SETTINGS_ID,
    metaPixelId: null,
    metaAccessToken: null,
    tiktokPixelId: null,
    tiktokAccessToken: null,
    ga4MeasurementId: null,
    ga4ApiSecret: null,
    googleAdsConversionId: null,
    snapchatPixelId: null,
    snapchatAccessToken: null,
    activePixels: DEFAULT_PIXEL_SETTINGS.activePixels,
    testMode: DEFAULT_PIXEL_SETTINGS.testMode,
  };
}

function mapUpdateInput(data: UpdatePixelSettingsInput) {
  return {
    metaPixelId: data.metaPixelId?.trim() || null,
    metaAccessToken: data.metaAccessToken?.trim() || null,
    tiktokPixelId: data.tiktokPixelId?.trim() || null,
    tiktokAccessToken: data.tiktokAccessToken?.trim() || null,
    ga4MeasurementId: data.ga4MeasurementId?.trim() || null,
    ga4ApiSecret: data.ga4ApiSecret?.trim() || null,
    googleAdsConversionId: data.googleAdsConversionId?.trim() || null,
    snapchatPixelId: data.snapchatPixelId?.trim() || null,
    snapchatAccessToken: data.snapchatAccessToken?.trim() || null,
    activePixels: data.activePixels,
    testMode: data.testMode,
  };
}

async function getOrCreateRow() {
  const existing = await prisma.pixelSettings.findUnique({
    where: { id: PIXEL_SETTINGS_ID },
  });
  if (existing) return existing;

  try {
    return await prisma.pixelSettings.create({
      data: defaultSettingsData(),
    });
  } catch (error) {
    const isUniqueViolation =
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002";

    if (isUniqueViolation) {
      return prisma.pixelSettings.findUniqueOrThrow({
        where: { id: PIXEL_SETTINGS_ID },
      });
    }

    throw error;
  }
}

export async function getPixelSettings(): Promise<PixelSettingsDto> {
  const row = await getOrCreateRow();
  return toDto(row);
}

export async function getPublicPixelSettings(): Promise<PublicPixelConfig> {
  const row = await getOrCreateRow();
  return toPublicPixelConfig(toPixelConfig(row));
}

/** Server-only config including access token — for CAPI and internal use. */
export async function getPixelSettingsForServer(): Promise<PixelConfig> {
  const row = await getOrCreateRow();
  return toPixelConfig(row);
}

export async function updatePixelSettings(
  data: UpdatePixelSettingsInput,
): Promise<ActionResult<PixelSettingsDto>> {
  try {
    const row = await prisma.pixelSettings.upsert({
      where: { id: PIXEL_SETTINGS_ID },
      create: {
        ...defaultSettingsData(),
        ...mapUpdateInput(data),
      },
      update: mapUpdateInput(data),
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/marketing/pixels");

    return { success: true, data: toDto(row) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update pixel settings",
    };
  }
}
