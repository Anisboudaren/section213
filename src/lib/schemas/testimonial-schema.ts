import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  role: z.string().min(1, "Role is required").max(160),
  company: z.string().min(1, "Company is required").max(200),
  quoteEn: z.string().min(1, "English quote is required").max(1000),
  quoteFr: z.string().min(1, "French quote is required").max(1000),
  quoteAr: z.string().max(1000).optional().or(z.literal("")),
  photoUrl: z.string().optional().or(z.literal("")),
  instagramHandle: z.string().max(120).optional().or(z.literal("")),
  email: z.string().email("Must be a valid email").optional().or(z.literal("")),
  sortOrder: z.number().int().min(0),
  active: z.boolean(),
});

export const updateTestimonialSchema = testimonialSchema.partial();

export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
