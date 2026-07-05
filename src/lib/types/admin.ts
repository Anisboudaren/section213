export type LeadSource =
  | "instagram"
  | "tiktok"
  | "facebook"
  | "whatsapp"
  | "google"
  | "referral"
  | "website"
  | "cold"
  | "other";

export type LeadStage =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "won"
  | "lost";

export type Lead = {
  id: string;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  source: LeadSource;
  utmCampaign?: string;
  utmMedium?: string;
  referredBy?: string;
  pixelEventFired?: string;
  interestedIn: string[];
  stage: LeadStage;
  notes: string;
  createdAt: string;
  updatedAt?: string;
  lastContactedAt?: string;
  assignedTo?: string;
  trackedLinkId?: string;
  trackedLinkSrc?: LeadSource;
  submissionType?: "booking" | "contact";
  submissionStatus?: "completed" | "abandoned";
  bookingSessionId?: string;
  wilaya?: string;
  preferredDate?: string;
  preferredTime?: string;
  isFlexible?: boolean;
  projectName?: string;
  location?: string;
  projectTypes?: string[];
  projectDescription?: string;
  objective?: string;
  budgetRange?: string;
  selectedPackSlug?: string;
  bookingOptions?: string[];
  uploadedFiles?: { name: string; url: string; kind: string }[];
  estimatedTotalDzd?: number;
  depositChoice?: string;
  depositMethod?: string;
  transferProofUrl?: string;
  abandonedAt?: string;
  completedAt?: string;
};

export type ClientStatus = "active" | "inactive" | "vip";

export type ClientOrigin = "lead_upgrade" | "direct";

export type Client = {
  id: string;
  name: string;
  company: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  industry?: string;
  status: ClientStatus;
  origin: ClientOrigin;
  originLeadId?: string;
  projectIds: string[];
  notes: string;
  createdAt: string;
  lastProjectAt?: string;
  totalRevenue?: number;
  showOnWebsite: boolean;
};

export type CaseStudyResult = {
  label: string;
  value: string;
};

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  clientId?: string;
  clientName: string;
  industry?: string;
  categoryLabel?: string;
  excerpt?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  services: string[];
  results: CaseStudyResult[];
  sections: import("@/lib/case-study-sections").CaseStudySection[];
  published: boolean;
  featured: boolean;
  order: number;
  createdAt: string;
};

export type OfferCategory = "pack" | "ala_carte";

export type Offer = {
  id: string;
  slug: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  category: OfferCategory;
  description: string;
  descriptionFr?: string;
  features: string[];
  featuresFr?: string[];
  price?: number;
  priceLabel?: string;
  priceLabelFr?: string;
  active: boolean;
  featured: boolean;
  studyOnly?: boolean;
  order: number;
  cta?: string;
  ctaFr?: string;
  noteEn?: string;
  noteFr?: string;
  metadata?: import("@/lib/offers/offer-types").OfferMetadata;
};

export type PixelPlatform =
  | "meta"
  | "tiktok"
  | "ga4"
  | "google_ads"
  | "snapchat";

export type PixelConfig = {
  metaPixelId?: string;
  metaAccessToken?: string;
  tiktokPixelId?: string;
  tiktokAccessToken?: string;
  ga4MeasurementId?: string;
  ga4ApiSecret?: string;
  googleAdsConversionId?: string;
  snapchatPixelId?: string;
  snapchatAccessToken?: string;
  activePixels: PixelPlatform[];
  testMode: boolean;
};

export type TeamRole =
  | "ceo"
  | "cto"
  | "web_dev"
  | "videographer"
  | "designer";

export type AdminAccessLevel =
  | "full"
  | "full_no_billing"
  | "tasks_only";

export type TeamMember = {
  id: string;
  name: string;
  role: TeamRole;
  displayRole: string;
  responsibilities: string[];
  reportsTo: string[];
  adminAccess: AdminAccessLevel;
  avatar?: string;
  active: boolean;
};

export type ProjectStatus = "active" | "completed" | "on_hold";

export type Project = {
  id: string;
  name: string;
  clientId: string;
  status: ProjectStatus;
  dueDate?: string;
  createdAt: string;
};
