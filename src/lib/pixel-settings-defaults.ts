import type { PixelConfig, PixelPlatform } from "@/lib/types/admin";

export const PIXEL_SETTINGS_ID = "default";

export const DEFAULT_PIXEL_SETTINGS: PixelConfig = {
  activePixels: [],
  testMode: true,
};

export type PixelSettingsDto = PixelConfig & {
  id: string;
  updatedAt: string;
};

const SERVER_ONLY_KEYS = [
  "metaAccessToken",
  "tiktokAccessToken",
  "ga4ApiSecret",
  "snapchatAccessToken",
] as const;

export type PublicPixelConfig = Omit<
  PixelConfig,
  (typeof SERVER_ONLY_KEYS)[number]
> & {
  hasMetaCapi: boolean;
  hasTiktokCapi: boolean;
  hasGa4Mp: boolean;
  hasSnapchatCapi: boolean;
};

const VALID_PLATFORMS = new Set<PixelPlatform>([
  "meta",
  "tiktok",
  "ga4",
  "google_ads",
  "snapchat",
]);

export function normalizeActivePixels(platforms: string[]): PixelPlatform[] {
  return platforms.filter((p): p is PixelPlatform =>
    VALID_PLATFORMS.has(p as PixelPlatform),
  );
}

export function toPublicPixelConfig(config: PixelConfig): PublicPixelConfig {
  const {
    metaAccessToken,
    tiktokAccessToken,
    ga4ApiSecret,
    snapchatAccessToken,
    ...rest
  } = config;

  return {
    ...rest,
    hasMetaCapi: Boolean(metaAccessToken?.trim()),
    hasTiktokCapi: Boolean(tiktokAccessToken?.trim()),
    hasGa4Mp: Boolean(ga4ApiSecret?.trim()),
    hasSnapchatCapi: Boolean(snapchatAccessToken?.trim()),
  };
}
