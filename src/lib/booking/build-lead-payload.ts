import type { BookingFormData, UploadedFile } from "@/lib/booking-types";
import {
  computeBookingTotal,
  findPackView,
  type OfferAlaCarteView,
  type OfferPackView,
} from "@/lib/offers/offer-types";
import type { CreateLeadInput } from "@/lib/schemas/lead-schema";

export type BookingLeadPayloadInput = {
  data: Partial<BookingFormData>;
  packs: OfferPackView[];
  alaCarte: OfferAlaCarteView[];
  locale: "fr" | "en";
  submissionStatus: "abandoned" | "completed";
  name: string;
  phone: string;
  email?: string;
  company?: string;
  depositChoice?: string;
  depositMethod?: string;
  transferProofUrl?: string;
  pixelEventId?: string;
};

export function buildBookingLeadPayload(input: BookingLeadPayloadInput): CreateLeadInput {
  const { data, packs, alaCarte, locale, submissionStatus } = input;
  const pack = findPackView(packs, data.selectedPackId || undefined);
  const pricing = computeBookingTotal(
    pack,
    alaCarte,
    data.alaCarteOptions ?? [],
    locale,
  );

  return {
    name: input.name,
    phone: input.phone,
    email: input.email,
    company: input.company,
    source: "website",
    interestedIn: pack ? [pack.slug] : [],
    stage: "new",
    submissionType: "booking",
    submissionStatus,
    bookingSessionId: data.bookingSessionId,
    wilaya: data.wilaya,
    preferredDate: data.isFlexible ? undefined : data.preferredDate,
    preferredTime: data.preferredTime,
    isFlexible: data.isFlexible ?? false,
    projectName: data.projectName,
    location: data.location,
    projectTypes: data.projectType ? [data.projectType] : [],
    projectDescription: data.projectDescription || undefined,
    objective: data.objective,
    selectedPackSlug: data.selectedPackId,
    bookingOptions: data.alaCarteOptions ?? [],
    uploadedFiles: data.uploadedFiles ?? [],
    estimatedTotalDzd: pricing.total ?? undefined,
    depositChoice: input.depositChoice,
    depositMethod: input.depositMethod,
    transferProofUrl: input.transferProofUrl,
    pixelEventFired: submissionStatus === "completed" ? "Lead" : undefined,
    pixelEventId: input.pixelEventId,
  };
}

export function parseUploadedFiles(value: unknown): UploadedFile[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is UploadedFile =>
      !!item &&
      typeof item === "object" &&
      "name" in item &&
      "url" in item &&
      "kind" in item,
  );
}

export function formatDzd(amount?: number | null): string {
  if (amount == null) return "—";
  return `${amount.toLocaleString("fr-DZ")} DA`;
}
