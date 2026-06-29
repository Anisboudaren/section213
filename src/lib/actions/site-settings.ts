"use server";

import { revalidatePath } from "next/cache";

import type { SiteSettings as PrismaSiteSettings } from "@/generated/prisma/client";
import { ACCENT_PRESETS } from "@/lib/accent-presets";
import { prisma } from "@/lib/prisma";
import type { UpdateSiteSettingsInput } from "@/lib/schemas/site-settings-schema";
import {
  DEFAULT_ENABLED_ACCENT_IDS,
  DEFAULT_SITE_SETTINGS,
  SITE_SETTINGS_ID,
  type SiteSettingsDto,
} from "@/lib/site-settings-defaults";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

function toDto(row: PrismaSiteSettings): SiteSettingsDto {
  return {
    id: row.id,
    siteName: row.siteName,
    siteTitle: row.siteTitle,
    siteDescription: row.siteDescription,
    accentPresetId: row.accentPresetId,
    enabledAccentPresetIds:
      row.enabledAccentPresetIds.length > 0
        ? row.enabledAccentPresetIds
        : DEFAULT_ENABLED_ACCENT_IDS,
    defaultLocale: row.defaultLocale as "fr" | "en",
    contactEmail: row.contactEmail ?? undefined,
    contactPhone: row.contactPhone ?? undefined,
    contactAddress: row.contactAddress ?? undefined,
    contactCity: row.contactCity ?? undefined,
    contactHoursFr: row.contactHoursFr ?? undefined,
    contactHoursEn: row.contactHoursEn ?? undefined,
    whatsappNumber: row.whatsappNumber ?? undefined,
    instagramHandle: row.instagramHandle ?? undefined,
    facebookUrl: row.facebookUrl ?? undefined,
    tiktokHandle: row.tiktokHandle ?? undefined,
    youtubeUrl: row.youtubeUrl ?? undefined,
    linkedinUrl: row.linkedinUrl ?? undefined,
    mapsUrl: row.mapsUrl ?? undefined,
    ogImageUrl: row.ogImageUrl ?? undefined,
    logoUrl: row.logoUrl ?? undefined,
    faviconUrl: row.faviconUrl ?? undefined,
    bookingEnabled: row.bookingEnabled,
    maintenanceMode: row.maintenanceMode,
    updatedAt: row.updatedAt.toISOString(),
  };
}

function defaultSettingsData() {
  return {
    id: SITE_SETTINGS_ID,
    siteName: DEFAULT_SITE_SETTINGS.siteName,
    siteTitle: DEFAULT_SITE_SETTINGS.siteTitle,
    siteDescription: DEFAULT_SITE_SETTINGS.siteDescription,
    accentPresetId: DEFAULT_SITE_SETTINGS.accentPresetId,
    enabledAccentPresetIds: DEFAULT_SITE_SETTINGS.enabledAccentPresetIds,
    defaultLocale: DEFAULT_SITE_SETTINGS.defaultLocale,
    contactEmail: DEFAULT_SITE_SETTINGS.contactEmail || null,
    contactPhone: DEFAULT_SITE_SETTINGS.contactPhone || null,
    contactAddress: DEFAULT_SITE_SETTINGS.contactAddress || null,
    contactCity: DEFAULT_SITE_SETTINGS.contactCity || null,
    contactHoursFr: DEFAULT_SITE_SETTINGS.contactHoursFr || null,
    contactHoursEn: DEFAULT_SITE_SETTINGS.contactHoursEn || null,
    whatsappNumber: DEFAULT_SITE_SETTINGS.whatsappNumber || null,
    instagramHandle: DEFAULT_SITE_SETTINGS.instagramHandle || null,
    facebookUrl: DEFAULT_SITE_SETTINGS.facebookUrl || null,
    tiktokHandle: DEFAULT_SITE_SETTINGS.tiktokHandle || null,
    youtubeUrl: DEFAULT_SITE_SETTINGS.youtubeUrl || null,
    linkedinUrl: DEFAULT_SITE_SETTINGS.linkedinUrl || null,
    mapsUrl: DEFAULT_SITE_SETTINGS.mapsUrl || null,
    ogImageUrl: DEFAULT_SITE_SETTINGS.ogImageUrl || null,
    logoUrl: DEFAULT_SITE_SETTINGS.logoUrl || null,
    faviconUrl: DEFAULT_SITE_SETTINGS.faviconUrl || null,
    bookingEnabled: DEFAULT_SITE_SETTINGS.bookingEnabled,
    maintenanceMode: DEFAULT_SITE_SETTINGS.maintenanceMode,
  };
}

export async function getSiteSettings(): Promise<SiteSettingsDto> {
  const row = await prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    create: defaultSettingsData(),
    update: {},
  });

  return toDto(row);
}

export async function updateSiteSettings(
  data: UpdateSiteSettingsInput,
): Promise<ActionResult<SiteSettingsDto>> {
  try {
    const validIds = new Set(ACCENT_PRESETS.map((p) => p.id));
    if (!validIds.has(data.accentPresetId)) {
      return { success: false, error: "Invalid accent preset" };
    }

    const enabled = data.enabledAccentPresetIds.filter((id) => validIds.has(id));
    if (!enabled.includes(data.accentPresetId)) {
      enabled.unshift(data.accentPresetId);
    }

    const row = await prisma.siteSettings.upsert({
      where: { id: SITE_SETTINGS_ID },
      create: {
        id: SITE_SETTINGS_ID,
        siteName: data.siteName,
        siteTitle: data.siteTitle,
        siteDescription: data.siteDescription,
        accentPresetId: data.accentPresetId,
        enabledAccentPresetIds: enabled,
        defaultLocale: data.defaultLocale,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        contactAddress: data.contactAddress || null,
        contactCity: data.contactCity || null,
        contactHoursFr: data.contactHoursFr || null,
        contactHoursEn: data.contactHoursEn || null,
        whatsappNumber: data.whatsappNumber || null,
        instagramHandle: data.instagramHandle || null,
        facebookUrl: data.facebookUrl || null,
        tiktokHandle: data.tiktokHandle || null,
        youtubeUrl: data.youtubeUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        mapsUrl: data.mapsUrl || null,
        ogImageUrl: data.ogImageUrl || null,
        logoUrl: data.logoUrl || null,
        faviconUrl: data.faviconUrl || null,
        bookingEnabled: data.bookingEnabled,
        maintenanceMode: data.maintenanceMode,
      },
      update: {
        siteName: data.siteName,
        siteTitle: data.siteTitle,
        siteDescription: data.siteDescription,
        accentPresetId: data.accentPresetId,
        enabledAccentPresetIds: enabled,
        defaultLocale: data.defaultLocale,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        contactAddress: data.contactAddress || null,
        contactCity: data.contactCity || null,
        contactHoursFr: data.contactHoursFr || null,
        contactHoursEn: data.contactHoursEn || null,
        whatsappNumber: data.whatsappNumber || null,
        instagramHandle: data.instagramHandle || null,
        facebookUrl: data.facebookUrl || null,
        tiktokHandle: data.tiktokHandle || null,
        youtubeUrl: data.youtubeUrl || null,
        linkedinUrl: data.linkedinUrl || null,
        mapsUrl: data.mapsUrl || null,
        ogImageUrl: data.ogImageUrl || null,
        logoUrl: data.logoUrl || null,
        faviconUrl: data.faviconUrl || null,
        bookingEnabled: data.bookingEnabled,
        maintenanceMode: data.maintenanceMode,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/icon");
    revalidatePath("/apple-icon");
    revalidatePath("/contact");
    revalidatePath("/admin/settings/platform");

    return { success: true, data: toDto(row) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update settings",
    };
  }
}
