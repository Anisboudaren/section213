import type { Metadata } from "next";

import { HomePageV2 } from "@/components/pages/HomePageV2";
import { getOffers } from "@/lib/actions/offers";
import { partitionOffers } from "@/lib/offers/offer-types";
import { getTestimonialsPublic } from "@/lib/queries/testimonials";
import { getTrustedSection } from "@/lib/queries/trusted-section";

export const metadata: Metadata = {
  title: "Section 213 — Vendez plus vite en renforçant la confiance",
  description:
    "Section 213 aide les promoteurs à vendre plus vite en renforçant la confiance des acheteurs avant la visite. Basés à Oran, Algérie.",
};

export default async function Page() {
  const [trustedSection, testimonials, offersResult] = await Promise.all([
    getTrustedSection(),
    getTestimonialsPublic(),
    getOffers({ activeOnly: true }),
  ]);
  const offers = offersResult.success ? offersResult.data : [];
  const { packs, alaCarte } = partitionOffers(offers);

  return (
    <HomePageV2
      trustedSection={trustedSection}
      testimonials={testimonials}
      packs={packs}
      alaCarte={alaCarte}
    />
  );
}
