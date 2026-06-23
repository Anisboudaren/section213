import { z } from "zod";
import { addHours, startOfDay } from "date-fns";

import type { BookingFormData } from "@/lib/booking-types";

const minBookingDate = addHours(new Date(), 48);

const projectTypeEnum = z.enum([
  "shooting_video",
  "shooting_photo",
  "reels_content",
  "website",
  "brand_identity",
  "automation",
  "full_package",
  "other",
]);

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
  projectTypes: z.array(projectTypeEnum).min(1, "required"),
  projectDescription: z.string().trim().min(10, "min10").max(500, "max500"),
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

/** Only pass fields relevant to the current step — avoids partial wizard state breaking validation */
export function getStepInput(
  step: number,
  data: Partial<BookingFormData>,
): Record<string, unknown> {
  switch (step) {
    case 1:
      return {
        preferredDate: data.preferredDate ?? "",
        preferredTime: data.preferredTime,
        isFlexible: data.isFlexible ?? false,
      };
    case 2:
      return {
        projectTypes: data.projectTypes ?? [],
        projectDescription: data.projectDescription ?? "",
      };
    case 3:
      return {
        objective: data.objective,
        budgetRange: data.budgetRange,
      };
    case 4:
      return {
        selectedOfferId: data.selectedOfferId ?? "",
      };
    case 5:
      return {
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        company: data.company ?? "",
        notes: data.notes ?? "",
      };
    default:
      return {};
  }
}

export function validateBookingStep(step: number, data: Partial<BookingFormData>) {
  if (step > 5) return { success: true as const, errors: {} as Record<string, string> };
  const schema = STEP_SCHEMAS[step - 1];
  const result = schema.safeParse(getStepInput(step, data));
  if (result.success) {
    return { success: true as const, errors: {} as Record<string, string> };
  }
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path[0]?.toString();
    if (path) errors[path] = issue.message;
  }
  return { success: false as const, errors };
}
