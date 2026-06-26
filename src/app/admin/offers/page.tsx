import { OffersView } from "@/components/admin/offers/OffersView";
import { getOffers } from "@/lib/actions/offers";

export default async function OffersPage() {
  const result = await getOffers();
  const offers = result.success ? result.data : [];

  return <OffersView initialOffers={offers} />;
}
