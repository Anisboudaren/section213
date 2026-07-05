import { sendGAEvent } from "@next/third-parties/google";

import type { PublicPixelConfig } from "@/lib/pixel-settings-defaults";
import type { PixelEventRequest } from "@/lib/schemas/pixel-settings-schema";
import type { PixelPlatform } from "@/lib/types/admin";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (
        event: string,
        data?: Record<string, unknown>,
        options?: Record<string, unknown>,
      ) => void;
      page: () => void;
    };
    snaptr?: (...args: unknown[]) => void;
  }
}

export type PixelEventName = PixelEventRequest["event"];

let cachedPixelConfig: PublicPixelConfig | null = null;
let initialPageViewSkipped = false;
const firedOnceKeys = new Set<string>();

export function setPixelConfigCache(config: PublicPixelConfig) {
  cachedPixelConfig = config;
}

function getConfig(): PublicPixelConfig | null {
  return cachedPixelConfig;
}

function isPlatformActive(platform: PixelPlatform): boolean {
  const config = getConfig();
  return !!config && !config.testMode && config.activePixels.includes(platform);
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

function createEventId(): string {
  return crypto.randomUUID();
}

function fireOnce(key: string): boolean {
  if (firedOnceKeys.has(key)) return false;
  firedOnceKeys.add(key);
  return true;
}

function sendServerPixelEvent(payload: Omit<PixelEventRequest, "eventId"> & { eventId: string }) {
  void fetch("/api/pixel-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      eventSourceUrl: typeof window !== "undefined" ? window.location.href : undefined,
      fbc: getCookie("_fbc"),
      fbp: getCookie("_fbp"),
      ttp: getCookie("_ttp"),
    }),
  }).catch(() => {
    // fire-and-forget
  });
}

type TrackEventOptions = {
  contentName?: string;
  contentType?: string;
  contentId?: string;
  eventId?: string;
  email?: string;
  phone?: string;
  onceKey?: string;
};

function trackBrowserEvent(
  event: PixelEventName,
  options: TrackEventOptions = {},
): string {
  const eventId = options.eventId ?? createEventId();
  if (typeof window === "undefined") return eventId;

  const config = getConfig();
  if (!config || config.testMode) return eventId;

  const { contentName, contentType, contentId } = options;

  try {
    if (isPlatformActive("meta") && config.metaPixelId) {
      if (event === "PageView") {
        window.fbq?.("track", "PageView");
      } else if (event === "Lead") {
        window.fbq?.("track", "Lead", { content_name: contentName, eventID: eventId });
      } else {
        window.fbq?.("track", event, {
          content_name: contentName,
          content_type: contentType,
          content_ids: contentId ? [contentId] : undefined,
          eventID: eventId,
        });
      }
    }
  } catch {
    // pixel not loaded
  }

  try {
    if (isPlatformActive("tiktok") && config.tiktokPixelId) {
      const tiktokEvent = event === "Lead" ? "SubmitForm" : event;
      window.ttq?.track(
        tiktokEvent,
        {
          content_name: contentName,
          content_type: contentType,
          content_id: contentId,
        },
        { event_id: eventId },
      );
    }
  } catch {
    // pixel not loaded
  }

  try {
    if (isPlatformActive("ga4") && config.ga4MeasurementId) {
      const gaEvent =
        event === "Lead"
          ? "generate_lead"
          : event === "InitiateCheckout"
            ? "begin_checkout"
            : event === "ViewContent"
              ? "view_item"
              : "page_view";
      sendGAEvent("event", gaEvent, {
        event_id: eventId,
        content_name: contentName,
        content_type: contentType,
        item_id: contentId,
      });
    }
  } catch {
    // gtag not loaded
  }

  try {
    if (isPlatformActive("google_ads") && config.googleAdsConversionId && event === "Lead") {
      sendGAEvent("event", "conversion", {
        send_to: config.googleAdsConversionId,
        event_id: eventId,
      });
    }
  } catch {
    // gtag not loaded
  }

  try {
    if (isPlatformActive("snapchat") && config.snapchatPixelId) {
      const snapEvent =
        event === "PageView"
          ? "PAGE_VIEW"
          : event === "ViewContent"
            ? "VIEW_CONTENT"
            : event === "InitiateCheckout"
              ? "START_CHECKOUT"
              : "SIGN_UP";
      window.snaptr?.("track", snapEvent, {
        sign_up_method: event === "Lead" ? "email" : undefined,
        client_dedup_id: eventId,
        description: contentName,
      });
    }
  } catch {
    // pixel not loaded
  }

  return eventId;
}

function trackPixelEvent(
  event: PixelEventName,
  options: TrackEventOptions = {},
  includeServer = true,
): string {
  const eventId = trackBrowserEvent(event, options);

  if (includeServer) {
    sendServerPixelEvent({
      event,
      eventId,
      contentName: options.contentName,
      contentType: options.contentType,
      contentId: options.contentId,
      email: options.email,
      phone: options.phone,
    });
  }

  return eventId;
}

export function trackPageView(): void {
  if (typeof window === "undefined") return;
  const config = getConfig();
  if (!config || config.testMode) return;

  if (!initialPageViewSkipped) {
    initialPageViewSkipped = true;
    return;
  }

  trackPixelEvent("PageView", { contentName: "spa_navigation" });
}

export function trackFormView(contentName: string): void {
  if (!fireOnce(`form_view:${contentName}`)) return;
  trackPixelEvent("ViewContent", {
    contentName,
    contentType: "form",
  });
}

export function trackInitiateCheckout(contentName = "booking"): void {
  if (!fireOnce(`initiate_checkout:${contentName}`)) return;
  trackPixelEvent("InitiateCheckout", {
    contentName,
    contentType: "booking_flow",
  });
}

export function trackOfferView(contentName: string, contentId?: string): void {
  if (!fireOnce(`offer_view:${contentName}:${contentId ?? "default"}`)) return;
  trackPixelEvent("ViewContent", {
    contentName,
    contentType: "offer",
    contentId,
  });
}

export type TrackLeadConversionOptions = {
  contentName?: string;
  eventId?: string;
  email?: string;
  phone?: string;
};

export function trackLeadConversion(options: TrackLeadConversionOptions = {}): string {
  const contentName = options.contentName ?? "lead";
  return trackPixelEvent(
    "Lead",
    {
      contentName,
      contentType: "form_submission",
      eventId: options.eventId,
      email: options.email,
      phone: options.phone,
    },
    false,
  );
}

/** @deprecated Use trackLeadConversion instead */
export function trackMetaLead(): void {
  trackLeadConversion({ contentName: "contact" });
}

/** @deprecated Use trackLeadConversion instead */
export function trackTikTokSubmit(): void {
  trackLeadConversion({ contentName: "contact" });
}
