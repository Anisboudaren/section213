import { z } from "zod";

export const userRoleSchema = z.enum(["SUPER_ADMIN", "ADMIN", "MEMBER"]);

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createUserSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().max(40).optional(),
  photoUrl: z.string().optional(),
  role: userRoleSchema,
});

export const updateUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email("Enter a valid email address"),
  password: z.union([z.literal(""), z.string().min(8, "Password must be at least 8 characters")]).optional(),
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().max(40).optional(),
  photoUrl: z.string().optional(),
  role: userRoleSchema,
  active: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
