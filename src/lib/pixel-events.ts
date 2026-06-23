import type { PixelConfig } from "@/lib/types/admin";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, data?: Record<string, unknown>) => void };
  }
}

let cachedPixelConfig: PixelConfig | null = null;

export function setPixelConfigCache(config: PixelConfig) {
  cachedPixelConfig = config;
}

function getConfig(): PixelConfig | null {
  if (cachedPixelConfig) return cachedPixelConfig;
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("s213_admin_pixels");
    if (!raw) return null;
    cachedPixelConfig = JSON.parse(raw) as PixelConfig;
    return cachedPixelConfig;
  } catch {
    return null;
  }
}

function canFireMeta(): boolean {
  const config = getConfig();
  return !!config && !config.testMode && config.activePixels.includes("meta");
}

function canFireTikTok(): boolean {
  const config = getConfig();
  return !!config && !config.testMode && config.activePixels.includes("tiktok");
}

export function trackMetaLead(): void {
  if (typeof window === "undefined" || !canFireMeta()) return;
  try {
    window.fbq?.("track", "Lead");
  } catch {
    // pixel not loaded
  }
}

export function trackTikTokSubmit(): void {
  if (typeof window === "undefined" || !canFireTikTok()) return;
  try {
    window.ttq?.track("SubmitForm");
  } catch {
    // pixel not loaded
  }
}
