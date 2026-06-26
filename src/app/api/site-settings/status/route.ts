import { NextResponse } from "next/server";

import { getSiteSettings } from "@/lib/actions/site-settings";

export async function GET() {
  const settings = await getSiteSettings();

  return NextResponse.json(
    {
      maintenanceMode: settings.maintenanceMode,
      defaultLocale: settings.defaultLocale,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=15, stale-while-revalidate=60",
      },
    },
  );
}
