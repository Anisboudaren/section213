import type { Metadata } from "next";

import { ContactPageContent } from "@/components/pages/ContactPageContent";
import { getOffers } from "@/lib/actions/offers";
import { getSiteSettings } from "@/lib/actions/site-settings";
import { toPublicContactInfo } from "@/lib/contact-info";
import { partitionOffers } from "@/lib/offers/offer-types";

export const metadata: Metadata = {
  title: "Contact — Section 213",
  description: "Contactez Section 213 — promoteurs immobiliers à Oran et au Maghreb.",
};

export default async function ContactPage() {
  const [settings, offersResult] = await Promise.all([
    getSiteSettings(),
    getOffers({ activeOnly: true }),
  ]);
  const contactInfo = toPublicContactInfo(settings);
  const offers = offersResult.success ? offersResult.data : [];
  const { packs } = partitionOffers(offers);

  return <ContactPageContent contactInfo={contactInfo} packs={packs} />;
}
