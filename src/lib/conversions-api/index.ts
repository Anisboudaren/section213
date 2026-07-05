import type { PixelConfig } from "@/lib/types/admin";

import { sendGa4ConversionEvent } from "./ga4";
import { sendMetaConversionEvent } from "./meta";
import { type ConversionEventPayload } from "./shared";
import { sendSnapchatConversionEvent } from "./snapchat";
import { sendTikTokConversionEvent } from "./tiktok";

export type { ConversionEventPayload } from "./shared";

export async function sendConversionEvents(
  config: PixelConfig,
  payload: ConversionEventPayload,
): Promise<void> {
  const results = await Promise.allSettled([
    sendMetaConversionEvent(config, payload),
    sendTikTokConversionEvent(config, payload),
    sendSnapchatConversionEvent(config, payload),
    sendGa4ConversionEvent(config, payload),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Conversion API event failed:", result.reason);
    }
  }
}
