import { z } from "zod";

export const leadSourceOptions = [
  { value: "website", label: "Site web" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook / Messenger" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "google", label: "Google Search" },
  { value: "tiktok", label: "TikTok" },
  { value: "referral", label: "Référence / réseau" },
  { value: "cold", label: "Prospection directe" },
  { value: "other", label: "Autre" },
] as const;

const leadSourceEnum = z.enum([
  "website",
  "instagram",
  "facebook",
  "whatsapp",
  "google",
  "tiktok",
  "referral",
  "cold",
  "other",
]);

const leadStageEnum = z.enum([
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
]);

export const createLeadSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  source: leadSourceEnum,
  utmCampaign: z.string().optional(),
  utmMedium: z.string().optional(),
  referredBy: z.string().optional(),
  interestedIn: z.array(z.string()),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
  stage: leadStageEnum.optional(),
  pixelEventFired: z.string().optional(),
  trackedLinkId: z.string().optional(),
  trackedLinkSlug: z.string().optional(),
  submissionType: z.enum(["booking", "contact"]).optional(),
  wilaya: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  isFlexible: z.boolean().optional(),
  projectTypes: z.array(z.string()).optional(),
  projectDescription: z.string().optional(),
  objective: z.string().optional(),
  budgetRange: z.string().optional(),
  bookingOptions: z.array(z.string()).optional(),
  depositChoice: z.string().optional(),
  depositMethod: z.string().optional(),
  transferProofUrl: z.string().optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;

export const updateLeadSchema = createLeadSchema.partial().extend({
  stage: leadStageEnum.optional(),
  lastContactedAt: z.string().datetime().optional(),
});

export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;

export const contactFormSchema = z.object({
  prenom: z.string().min(1, "Prénom requis"),
  nom: z.string().min(1, "Nom requis"),
  phone: z.string().min(6, "Téléphone requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  interestedIn: z.array(z.string()),
  message: z.string().max(300).optional(),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
