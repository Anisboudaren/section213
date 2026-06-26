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

export type DepositChoice = "no_deposit" | "deposit_50";

export type DepositMethod = "manual_transfer" | "chargilly";

export type BookingFormData = {
  preferredDate: string;
  preferredTime?: PreferredTime;
  isFlexible: boolean;
  projectTypes: ProjectType[];
  projectDescription: string;
  objective: ObjectiveType;
  budgetRange: BudgetRange;
  selectedOfferId: string;
  bookingOptions: string[];
  wilaya: string;
  fullName: string;
  phone: string;
  email?: string;
  company?: string;
  depositChoice: DepositChoice;
  depositMethod?: DepositMethod;
  transferProofUrl?: string;
};

export const BOOKING_STEPS = [
  "date",
  "projet",
  "objectif",
  "offre",
  "recap",
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

const OFFER_CATEGORY_PRIORITY: import("@/lib/types/admin").OfferCategory[] = [
  "media",
  "brand_content",
  "websites_apps",
  "automations",
];

/** Pick the best offer tab from one or more selected project types */
export function getDefaultOfferCategory(
  projectTypes?: ProjectType[],
): import("@/lib/types/admin").OfferCategory | undefined {
  if (!projectTypes?.length) return undefined;
  for (const category of OFFER_CATEGORY_PRIORITY) {
    if (projectTypes.some((type) => PROJECT_TYPE_CATEGORY_MAP[type] === category)) {
      return category;
    }
  }
  return PROJECT_TYPE_CATEGORY_MAP[projectTypes[0]];
}
