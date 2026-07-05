import type { BookingFormData } from "@/lib/booking-types";
import {
  computeBookingTotal,
  type OfferAlaCarteView,
  type OfferPackView,
} from "@/lib/offers/offer-types";
import type { AbandonedBookingInput } from "@/lib/schemas/lead-schema";

export function buildAbandonedBookingInput(
  data: Partial<BookingFormData>,
  packs: OfferPackView[],
  alaCarte: OfferAlaCarteView[],
  locale: "fr" | "en",
): AbandonedBookingInput | null {
  const phone = data.phone?.trim();
  if (!data.bookingSessionId || !phone || phone.length < 8) return null;

  const pack = packs.find(
    (p) => p.slug === data.selectedPackId || p.id === data.selectedPackId,
  );
  const pricing = computeBookingTotal(
    pack,
    alaCarte,
    data.alaCarteOptions ?? [],
    locale,
  );

  return {
    bookingSessionId: data.bookingSessionId,
    abandonedLeadId: data.abandonedLeadId,
    phone,
    name: data.fullName?.trim() || undefined,
    email: data.email || undefined,
    company: data.company || undefined,
    preferredDate: data.preferredDate,
    preferredTime: data.preferredTime,
    isFlexible: data.isFlexible,
    projectName: data.projectName,
    wilaya: data.wilaya,
    location: data.location,
    projectType: data.projectType,
    projectDescription: data.projectDescription,
    uploadedFiles: data.uploadedFiles,
    objective: data.objective,
    selectedPackId: data.selectedPackId,
    alaCarteOptions: data.alaCarteOptions,
    estimatedTotalDzd: pricing.total ?? undefined,
  };
}
