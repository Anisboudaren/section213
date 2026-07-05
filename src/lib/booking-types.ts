export type ProjectType =
  | "residence"
  | "lotissement"
  | "immeuble"
  | "villa"
  | "commercial"
  | "other";

export type ObjectiveType =
  | "visites"
  | "vendre_vite"
  | "confiance"
  | "diaspora"
  | "nouveau_projet"
  | "autre";

export type PreferredTime = "matin" | "apres_midi" | "flexible";

export type DepositChoice = "no_deposit" | "deposit_50";

export type DepositMethod = "cash" | "transfer_receipt";

export type UploadedFile = {
  name: string;
  url: string;
  kind: "plans" | "visuels" | "logo" | "documents";
};

export type BookingFormData = {
  preferredDate: string;
  preferredTime?: PreferredTime;
  isFlexible: boolean;
  projectName: string;
  wilaya: string;
  location: string;
  projectType: ProjectType;
  projectDescription: string;
  uploadedFiles: UploadedFile[];
  objective: ObjectiveType;
  selectedPackId: string;
  alaCarteOptions: string[];
  fullName: string;
  phone: string;
  email?: string;
  company?: string;
  depositChoice: DepositChoice;
  depositMethod?: DepositMethod;
  transferProofUrl?: string;
  bookingSessionId?: string;
  abandonedLeadId?: string;
};

export const BOOKING_STEPS = [
  "date",
  "projet",
  "objectif",
  "offre",
  "recap",
] as const;

export type BookingStep = (typeof BOOKING_STEPS)[number];

export const PROJECT_TYPES: ProjectType[] = [
  "residence",
  "lotissement",
  "immeuble",
  "villa",
  "commercial",
  "other",
];

export const OBJECTIVE_TYPES: ObjectiveType[] = [
  "visites",
  "vendre_vite",
  "confiance",
  "diaspora",
  "nouveau_projet",
  "autre",
];
