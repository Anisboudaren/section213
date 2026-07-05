import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { getPixelSettingsForServer } from "@/lib/actions/pixel-settings";
import { sendConversionEvents } from "@/lib/conversions-api";
import { pixelEventRequestSchema } from "@/lib/schemas/pixel-settings-schema";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = pixelEventRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const config = await getPixelSettingsForServer();
    if (config.testMode) {
      return NextResponse.json({ ok: true, skipped: "test_mode" });
    }

    const headerStore = await headers();
    const eventSourceUrl =
      parsed.data.eventSourceUrl ??
      headerStore.get("referer") ??
      undefined;

    await sendConversionEvents(config, {
      ...parsed.data,
      eventSourceUrl,
      clientUserAgent: headerStore.get("user-agent") ?? undefined,
      clientIpAddress:
        headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        headerStore.get("x-real-ip") ??
        undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Pixel events API error:", error);
    return NextResponse.json({ error: "Failed to process event" }, { status: 500 });
  }
}
