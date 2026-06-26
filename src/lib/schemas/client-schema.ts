import { z } from "zod";

export const clientStatusOptions = [
  { value: "active", label: "Actif", color: "green" },
  { value: "inactive", label: "Inactif", color: "gray" },
  { value: "vip", label: "VIP", color: "amber" },
] as const;

export const serviceTypeOptions = [
  { value: "photo_video", label: "Photo / Vidéo" },
  { value: "reels_content", label: "Reels & Contenu social" },
  { value: "brand_identity", label: "Identité de marque" },
  { value: "website", label: "Site web" },
  { value: "app", label: "Application" },
  { value: "automation", label: "Automatisation" },
  { value: "marketing_strategy", label: "Stratégie marketing" },
  { value: "full_package", label: "Pack complet" },
  { value: "other", label: "Autre" },
] as const;

export const projectStatusOptions = [
  { value: "briefing", label: "Briefing", color: "blue" },
  { value: "in_progress", label: "En cours", color: "amber" },
  { value: "review", label: "En révision", color: "purple" },
  { value: "delivered", label: "Livré", color: "teal" },
  { value: "completed", label: "Terminé", color: "green" },
  { value: "on_hold", label: "En pause", color: "gray" },
  { value: "cancelled", label: "Annulé", color: "red" },
] as const;

const clientStatusEnum = z.enum(["active", "inactive", "vip"]);
const serviceTypeEnum = z.enum([
  "photo_video",
  "reels_content",
  "brand_identity",
  "website",
  "app",
  "automation",
  "marketing_strategy",
  "full_package",
  "other",
]);
const projectStatusEnum = z.enum([
  "briefing",
  "in_progress",
  "review",
  "delivered",
  "completed",
  "on_hold",
  "cancelled",
]);

export const createClientSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(1, "Entreprise requise"),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  industry: z.string().optional(),
  status: clientStatusEnum,
  notes: z.string().optional(),
  showOnWebsite: z.boolean(),
  logoUrl: z.string().url().optional().or(z.literal("")),
  totalRevenue: z.number().int().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

export const updateClientSchema = createClientSchema.partial();

export type UpdateClientInput = z.infer<typeof updateClientSchema>;

export const createProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  clientId: z.string().min(1),
  serviceType: serviceTypeEnum,
  status: projectStatusEnum,
  leadId: z.string().optional(),
  teamIds: z.array(z.string()),
  offerSlug: z.string().optional(),
  startDate: z.string().optional(),
  deadline: z.string().optional(),
  budgetDZD: z.number().int().optional(),
  notes: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial().extend({
  paidDZD: z.number().int().optional(),
  deliveredAt: z.string().datetime().optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
