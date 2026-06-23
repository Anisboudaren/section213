export type ProjectType =
  | "shooting_video"
  | "shooting_photo"
  | "reels_content"
  | "website"
  | "brand_identity"
  | "automation"
  | "full_package"
  | "other";

export type ObjectiveType =
  | "notoriete"
  | "conversion"
  | "engagement"
  | "confiance"
  | "autre";

export type BudgetRange =
  | "under_50k"
  | "50k_150k"
  | "150k_300k"
  | "over_300k"
  | "flexible";

export type PreferredTime = "matin" | "apres_midi" | "flexible";

export type BookingFormData = {
  preferredDate: string;
  preferredTime?: PreferredTime;
  isFlexible: boolean;
  projectType: ProjectType;
  projectDescription: string;
  objective: ObjectiveType;
  budgetRange: BudgetRange;
  selectedOfferId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company?: string;
  notes?: string;
};

export const BOOKING_STEPS = [
  "date",
  "projet",
  "objectif",
  "offre",
  "reservation",
  "confirmation",
] as const;

export type BookingStep = (typeof BOOKING_STEPS)[number];

export const PROJECT_TYPE_CATEGORY_MAP: Partial<
  Record<ProjectType, import("@/lib/types/admin").OfferCategory>
> = {
  shooting_video: "media",
  shooting_photo: "media",
  reels_content: "media",
  website: "websites_apps",
  brand_identity: "brand_content",
  automation: "automations",
  full_package: "media",
};
