import { z } from "zod";
import { addHours, startOfDay } from "date-fns";

const minBookingDate = addHours(new Date(), 48);

export const step01Schema = z
  .object({
    preferredDate: z.string(),
    preferredTime: z.enum(["matin", "apres_midi", "flexible"]).optional(),
    isFlexible: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.isFlexible) return;
    if (!data.preferredDate) {
      ctx.addIssue({ code: "custom", message: "required", path: ["preferredDate"] });
      return;
    }
    const selected = startOfDay(new Date(data.preferredDate));
    const min = startOfDay(minBookingDate);
    if (selected < min) {
      ctx.addIssue({
        code: "custom",
        message: "min48h",
        path: ["preferredDate"],
      });
    }
  });

export const step02Schema = z.object({
  projectType: z.enum([
    "shooting_video",
    "shooting_photo",
    "reels_content",
    "website",
    "brand_identity",
    "automation",
    "full_package",
    "other",
  ]),
  projectDescription: z
    .string()
    .min(10, "min10")
    .max(500, "max500"),
});

export const step03Schema = z.object({
  objective: z.enum(["notoriete", "conversion", "engagement", "confiance", "autre"]),
  budgetRange: z.enum([
    "under_50k",
    "50k_150k",
    "150k_300k",
    "over_300k",
    "flexible",
  ]),
});

export const step04Schema = z.object({
  selectedOfferId: z.string().min(1, "required"),
});

export const step05Schema = z.object({
  firstName: z.string().min(2, "min2"),
  lastName: z.string().min(2, "min2"),
  phone: z.string().min(8, "phone"),
  email: z.string().email("email"),
  company: z.string().optional(),
  notes: z.string().optional(),
});

export const fullBookingSchema = step01Schema
  .and(step02Schema)
  .and(step03Schema)
  .and(step04Schema)
  .and(step05Schema);

export const STEP_SCHEMAS = [
  step01Schema,
  step02Schema,
  step03Schema,
  step04Schema,
  step05Schema,
] as const;
