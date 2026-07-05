import type { PixelConfig } from "@/lib/types/admin";

import { type ConversionEventPayload, normalizePhone, sha256 } from "./shared";

function snapchatEventType(event: ConversionEventPayload["event"]): string {
  switch (event) {
    case "PageView":
      return "PAGE_VIEW";
    case "ViewContent":
      return "VIEW_CONTENT";
    case "InitiateCheckout":
      return "START_CHECKOUT";
    case "Lead":
      return "SIGN_UP";
  }
}

export async function sendSnapchatConversionEvent(
  config: PixelConfig,
  payload: ConversionEventPayload,
): Promise<void> {
  if (config.testMode) return;
  if (!config.activePixels.includes("snapchat")) return;
  if (!config.snapchatPixelId?.trim()) return;
  if (!config.snapchatAccessToken?.trim()) return;

  const conversion: Record<string, unknown> = {
    pixel_id: config.snapchatPixelId,
    event_type: snapchatEventType(payload.event),
    event_conversion_type: "WEB",
    event_tag: payload.eventId,
    timestamp: Date.now(),
    page_url: payload.eventSourceUrl,
    client_dedup_id: payload.eventId,
  };

  if (payload.email?.trim()) {
    conversion.hashed_email = sha256(payload.email);
  }
  if (payload.phone?.trim()) {
    conversion.hashed_phone_number = sha256(normalizePhone(payload.phone));
  }
  if (payload.clientIpAddress) {
    conversion.hashed_ip_address = sha256(payload.clientIpAddress);
  }
  if (payload.clientUserAgent) {
    conversion.user_agent = payload.clientUserAgent;
  }
  if (payload.contentName) {
    conversion.description = payload.contentName;
  }

  const response = await fetch("https://tr.snapchat.com/v2/conversion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.snapchatAccessToken}`,
    },
    body: JSON.stringify(conversion),
  });

  if (!response.ok) {
    throw new Error(`Snapchat CAPI error ${response.status}: ${await response.text()}`);
  }
}
