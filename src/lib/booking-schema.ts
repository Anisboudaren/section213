import { z } from "zod";
import { addHours, startOfDay } from "date-fns";

import type { BookingFormData } from "@/lib/booking-types";

const minBookingDate = addHours(new Date(), 48);

const projectTypeEnum = z.enum([
  "residence",
  "lotissement",
  "immeuble",
  "villa",
  "commercial",
  "other",
]);

const objectiveEnum = z.enum([
  "visites",
  "vendre_vite",
  "confiance",
  "diaspora",
  "nouveau_projet",
  "autre",
]);

const uploadedFileSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  kind: z.enum(["plans", "visuels", "logo", "documents"]),
});

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
  projectName: z.string().trim().min(2, "min2"),
  wilaya: z.string().min(1, "required"),
  location: z.string().trim().min(2, "min2"),
  projectType: projectTypeEnum,
  projectDescription: z.string().trim().max(500, "max500").default(""),
  uploadedFiles: z.array(uploadedFileSchema).min(1, "fileRequired"),
});

export const step03Schema = z.object({
  objective: objectiveEnum,
});

export const step04Schema = z.object({
  selectedPackId: z.string().min(1, "required"),
  alaCarteOptions: z.array(z.string()).default([]),
});

export const step05Schema = z
  .object({
    fullName: z.string().trim().min(2, "min2"),
    phone: z.string().trim().min(8, "phone"),
    email: z
      .string()
      .trim()
      .optional()
      .refine((v) => !v || z.string().email().safeParse(v).success, { message: "email" }),
    company: z.string().trim().optional(),
    depositChoice: z.enum(["no_deposit", "deposit_50"]),
    depositMethod: z.enum(["cash", "transfer_receipt"]).optional(),
    transferProofUrl: z.string().url().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.depositChoice !== "deposit_50") return;
    if (!data.depositMethod) {
      ctx.addIssue({ code: "custom", message: "required", path: ["depositMethod"] });
      return;
    }
    if (data.depositMethod === "transfer_receipt" && !data.transferProofUrl) {
      ctx.addIssue({
        code: "custom",
        message: "proofRequired",
        path: ["transferProofUrl"],
      });
    }
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
        projectName: data.projectName ?? "",
        wilaya: data.wilaya ?? "",
        location: data.location ?? "",
        projectType: data.projectType,
        projectDescription: data.projectDescription ?? "",
        uploadedFiles: data.uploadedFiles ?? [],
      };
    case 3:
      return {
        objective: data.objective,
      };
    case 4:
      return {
        selectedPackId: data.selectedPackId || undefined,
        alaCarteOptions: data.alaCarteOptions ?? [],
      };
    case 5:
      return {
        fullName: data.fullName ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        company: data.company ?? "",
        depositChoice: data.depositChoice ?? "no_deposit",
        depositMethod: data.depositMethod,
        transferProofUrl: data.transferProofUrl ?? "",
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
