import type { Metadata } from "next";
import Link from "next/link";

import { BookPageContent } from "@/components/pages/BookPageContent";
import { getOffers } from "@/lib/actions/offers";
import { getSiteSettings } from "@/lib/actions/site-settings";

export const metadata: Metadata = {
  title: "Book a Shoot",
};

export default async function Page() {
  const [offersResult, settings] = await Promise.all([
    getOffers({ activeOnly: true }),
    getSiteSettings(),
  ]);

  if (!settings.bookingEnabled) {
    return (
      <div className="theme-marketing flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-2xl tracking-wide">Booking unavailable</h1>
        <p className="max-w-md text-muted-foreground">
          Online booking is temporarily disabled. Please contact us directly.
        </p>
        <Link href="/contact" className="text-ruby underline-offset-2 hover:underline">
          Contact us
        </Link>
      </div>
    );
  }

  const offers = offersResult.success ? offersResult.data : [];

  return <BookPageContent offers={offers} />;
}
