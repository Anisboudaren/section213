import { z } from "zod";

export const updateSiteSettingsSchema = z.object({
  siteName: z.string().min(1).max(80),
  siteTitle: z.string().min(1).max(120),
  siteDescription: z.string().min(1).max(320),
  accentPresetId: z.string().min(1),
  enabledAccentPresetIds: z.array(z.string()).min(1),
  defaultLocale: z.enum(["fr", "en"]),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().max(40).optional(),
  contactAddress: z.string().max(200).optional(),
  contactCity: z.string().max(120).optional(),
  contactHoursFr: z.string().max(120).optional(),
  contactHoursEn: z.string().max(120).optional(),
  whatsappNumber: z.string().max(40).optional(),
  instagramHandle: z.string().max(80).optional(),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  tiktokHandle: z.string().max(80).optional(),
  youtubeUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  mapsUrl: z.string().url().optional().or(z.literal("")),
  ogImageUrl: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  faviconUrl: z.string().url().optional().or(z.literal("")),
  bookingEnabled: z.boolean(),
  maintenanceMode: z.boolean(),
});

export type UpdateSiteSettingsInput = z.infer<typeof updateSiteSettingsSchema>;
