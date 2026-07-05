import type { PixelConfig } from "@/lib/types/admin";

import { buildHashedUserData, type ConversionEventPayload } from "./shared";

function metaEventName(event: ConversionEventPayload["event"]): string {
  return event;
}

export async function sendMetaConversionEvent(
  config: PixelConfig,
  payload: ConversionEventPayload,
): Promise<void> {
  if (config.testMode) return;
  if (!config.activePixels.includes("meta")) return;
  if (!config.metaPixelId?.trim()) return;
  if (!config.metaAccessToken?.trim()) return;

  const userData = buildHashedUserData(payload);

  const body = {
    data: [
      {
        event_name: metaEventName(payload.event),
        event_time: Math.floor(Date.now() / 1000),
        event_id: payload.eventId,
        action_source: "website",
        event_source_url: payload.eventSourceUrl,
        user_data: userData,
        custom_data: {
          ...(payload.contentName ? { content_name: payload.contentName } : {}),
          ...(payload.contentType ? { content_type: payload.contentType } : {}),
          ...(payload.contentId ? { content_ids: [payload.contentId] } : {}),
        },
      },
    ],
  };

  const url = `https://graph.facebook.com/v21.0/${config.metaPixelId}/events?access_token=${encodeURIComponent(config.metaAccessToken)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Meta CAPI error ${response.status}: ${await response.text()}`);
  }
}

export { sendMetaConversionEvent as sendMetaLeadEvent };
