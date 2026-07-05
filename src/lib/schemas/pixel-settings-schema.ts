import { z } from "zod";

const pixelPlatformEnum = z.enum([
  "meta",
  "tiktok",
  "ga4",
  "google_ads",
  "snapchat",
]);

export const updatePixelSettingsSchema = z.object({
  metaPixelId: z.string().optional(),
  metaAccessToken: z.string().optional(),
  tiktokPixelId: z.string().optional(),
  tiktokAccessToken: z.string().optional(),
  ga4MeasurementId: z.string().optional(),
  ga4ApiSecret: z.string().optional(),
  googleAdsConversionId: z.string().optional(),
  snapchatPixelId: z.string().optional(),
  snapchatAccessToken: z.string().optional(),
  activePixels: z.array(pixelPlatformEnum),
  testMode: z.boolean(),
});

export type UpdatePixelSettingsInput = z.infer<typeof updatePixelSettingsSchema>;

export const pixelEventRequestSchema = z.object({
  event: z.enum(["PageView", "ViewContent", "InitiateCheckout", "Lead"]),
  eventId: z.string().min(1),
  contentName: z.string().optional(),
  contentType: z.string().optional(),
  contentId: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  eventSourceUrl: z.string().optional(),
  fbc: z.string().optional(),
  fbp: z.string().optional(),
  ttp: z.string().optional(),
});

export type PixelEventRequest = z.infer<typeof pixelEventRequestSchema>;
