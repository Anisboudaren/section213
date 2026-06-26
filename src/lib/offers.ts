import type { Offer } from "@/lib/types/admin";

export { getOffers, getOfferLabel } from "@/lib/actions/offers";

export async function getActiveOffers(): Promise<Offer[]> {
  const { getOffers } = await import("@/lib/actions/offers");
  const result = await getOffers({ activeOnly: true });
  return result.success ? result.data : [];
}

export function resolveOfferLabel(offers: Offer[], slugOrId: string): string {
  const offer = offers.find((o) => o.slug === slugOrId || o.id === slugOrId);
  return offer?.nameFr ?? offer?.name ?? slugOrId;
}
