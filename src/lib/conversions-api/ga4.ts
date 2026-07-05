import type { PixelConfig } from "@/lib/types/admin";

import type { ConversionEventPayload } from "./shared";

function ga4EventName(event: ConversionEventPayload["event"]): string {
  switch (event) {
    case "Lead":
      return "generate_lead";
    case "InitiateCheckout":
      return "begin_checkout";
    case "ViewContent":
      return "view_item";
    case "PageView":
      return "page_view";
  }
}

export async function sendGa4ConversionEvent(
  config: PixelConfig,
  payload: ConversionEventPayload,
): Promise<void> {
  if (config.testMode) return;
  if (!config.activePixels.includes("ga4")) return;
  if (!config.ga4MeasurementId?.trim()) return;
  if (!config.ga4ApiSecret?.trim()) return;

  const url = new URL("https://www.google-analytics.com/mp/collect");
  url.searchParams.set("measurement_id", config.ga4MeasurementId);
  url.searchParams.set("api_secret", config.ga4ApiSecret);

  const body = {
    client_id: payload.eventId,
    events: [
      {
        name: ga4EventName(payload.event),
        params: {
          event_id: payload.eventId,
          engagement_time_msec: 100,
          ...(payload.contentName ? { content_name: payload.contentName } : {}),
          ...(payload.contentType ? { content_type: payload.contentType } : {}),
          ...(payload.contentId ? { item_id: payload.contentId } : {}),
          ...(payload.eventSourceUrl ? { page_location: payload.eventSourceUrl } : {}),
        },
      },
    ],
  };

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`GA4 Measurement Protocol error ${response.status}: ${await response.text()}`);
  }
}
