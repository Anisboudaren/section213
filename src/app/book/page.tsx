import type { Metadata } from "next";
import Link from "next/link";

import { BookPageContent } from "@/components/pages/BookPageContent";
import { getOffers } from "@/lib/actions/offers";
import { getSiteSettings } from "@/lib/actions/site-settings";
import { partitionOffers } from "@/lib/offers/offer-types";

export const metadata: Metadata = {
  title: "Réserver un projet — Section 213",
  description: "Planifiez votre lancement — date, projet, objectif et accompagnement.",
};

export default async function Page() {
  const [settings, offersResult] = await Promise.all([
    getSiteSettings(),
    getOffers({ activeOnly: true }),
  ]);
  const offers = offersResult.success ? offersResult.data : [];
  const { packs, alaCarte } = partitionOffers(offers);

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

  return <BookPageContent packs={packs} alaCarte={alaCarte} />;
}
