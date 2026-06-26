import { z } from "zod";

export const trustedPartnerSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  imageUrl: z.string().min(1, "Image is required"),
  linkUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  whiteFilter: z.boolean(),
  sortOrder: z.number().int().min(0),
  active: z.boolean(),
});

export const updateTrustedPartnerSchema = trustedPartnerSchema.partial();

export const trustedSectionCopySchema = z.object({
  index: z.string().min(1).max(10),
  titleEn: z.string().min(1).max(80),
  titleHighlightEn: z.string().min(1).max(80),
  subtitleEn: z.string().min(1).max(240),
  titleFr: z.string().min(1).max(80),
  titleHighlightFr: z.string().min(1).max(80),
  subtitleFr: z.string().min(1).max(240),
});

export type TrustedPartnerInput = z.infer<typeof trustedPartnerSchema>;
export type UpdateTrustedPartnerInput = z.infer<typeof updateTrustedPartnerSchema>;
export type TrustedSectionCopyInput = z.infer<typeof trustedSectionCopySchema>;
