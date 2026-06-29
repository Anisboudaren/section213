import { z } from "zod";

import { caseStudySectionSchema } from "@/lib/case-study-sections";

export const caseStudyResultSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export type CaseStudyResult = z.infer<typeof caseStudyResultSchema>;

export const caseStudySchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens"),
  title: z.string().min(1),
  clientId: z.string().optional(),
  clientName: z.string().min(1),
  industry: z.string().optional(),
  categoryLabel: z.string().optional(),
  excerpt: z.string().optional(),
  videoUrl: z.string().min(1),
  thumbnailUrl: z.string().optional(),
  services: z.array(z.string()).default([]),
  results: z.array(caseStudyResultSchema).default([]),
  sections: z.array(caseStudySectionSchema).default([]),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export type CaseStudyInput = z.infer<typeof caseStudySchema>;

export const updateCaseStudySchema = caseStudySchema.partial();

export type UpdateCaseStudyInput = z.infer<typeof updateCaseStudySchema>;
