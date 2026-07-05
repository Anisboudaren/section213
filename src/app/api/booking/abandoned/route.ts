import { NextResponse } from "next/server";

import { saveAbandonedBooking } from "@/lib/actions/leads";
import { abandonedBookingSchema } from "@/lib/schemas/lead-schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = abandonedBookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const result = await saveAbandonedBooking(parsed.data);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
