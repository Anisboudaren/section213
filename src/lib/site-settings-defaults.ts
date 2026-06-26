import { ACCENT_PRESETS, DEFAULT_ACCENT_PRESET_ID } from "@/lib/accent-presets";

export const SITE_SETTINGS_ID = "default";

export const DEFAULT_ENABLED_ACCENT_IDS = ACCENT_PRESETS.map((p) => p.id);

export const DEFAULT_SITE_SETTINGS = {
  id: SITE_SETTINGS_ID,
  siteName: "Section 213",
  siteTitle: "Section 213",
  siteDescription:
    "Section 213 — based in Oran, Algeria. Photography, marketing, websites, apps, and business automations for modern brands.",
  accentPresetId: DEFAULT_ACCENT_PRESET_ID,
  enabledAccentPresetIds: DEFAULT_ENABLED_ACCENT_IDS,
  defaultLocale: "fr" as const,
  contactEmail: "",
  contactPhone: "",
  whatsappNumber: "",
  instagramHandle: "",
  ogImageUrl:
    "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/817cc14b-4e07-44b9-82a2-b16d0b653ff9/id-preview-db619953--5900c77a-8423-4386-8c1b-4a6ef34f94c1.lovable.app-1780515916701.png",
  logoUrl: "",
  faviconUrl: "",
  bookingEnabled: true,
  maintenanceMode: false,
};

export type SiteSettingsDto = {
  id: string;
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  accentPresetId: string;
  enabledAccentPresetIds: string[];
  defaultLocale: "fr" | "en";
  contactEmail?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  instagramHandle?: string;
  ogImageUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
  bookingEnabled: boolean;
  maintenanceMode: boolean;
  updatedAt: string;
};
