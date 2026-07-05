import type { PixelConfig } from "@/lib/types/admin";

import { type ConversionEventPayload, normalizePhone, sha256 } from "./shared";

function tiktokEventName(event: ConversionEventPayload["event"]): string {
  switch (event) {
    case "Lead":
      return "SubmitForm";
    default:
      return event;
  }
}

export async function sendTikTokConversionEvent(
  config: PixelConfig,
  payload: ConversionEventPayload,
): Promise<void> {
  if (config.testMode) return;
  if (!config.activePixels.includes("tiktok")) return;
  if (!config.tiktokPixelId?.trim()) return;
  if (!config.tiktokAccessToken?.trim()) return;

  const user: Record<string, string> = {};
  if (payload.email?.trim()) user.email = sha256(payload.email);
  if (payload.phone?.trim()) user.phone = sha256(normalizePhone(payload.phone));
  if (payload.ttp) user.ttp = payload.ttp;

  const body = {
    event_source: "web",
    event_source_id: config.tiktokPixelId,
    data: [
      {
        event: tiktokEventName(payload.event),
        event_time: Math.floor(Date.now() / 1000).toString(),
        event_id: payload.eventId,
        user,
        properties: {
          ...(payload.contentName ? { content_name: payload.contentName } : {}),
          ...(payload.contentType ? { content_type: payload.contentType } : {}),
          ...(payload.contentId ? { content_id: payload.contentId } : {}),
        },
        page: payload.eventSourceUrl ? { url: payload.eventSourceUrl } : undefined,
      },
    ],
  };

  const response = await fetch(
    "https://business-api.tiktok.com/open_api/v1.3/event/track/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": config.tiktokAccessToken,
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error(`TikTok Events API error ${response.status}: ${await response.text()}`);
  }
}
