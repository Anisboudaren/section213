"use server";

import { revalidatePath } from "next/cache";

import type { User, UserRole } from "@/generated/prisma/client";
import { requireSessionUser } from "@/lib/actions/auth";
import { hashPassword } from "@/lib/auth/password";
import { canManageUsers } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { createUserSchema, updateUserSchema, type CreateUserInput, type UpdateUserInput } from "@/lib/schemas/user-schema";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export type UserDto = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  photoUrl?: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  lastLoginAt?: string;
};

function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone ?? undefined,
    photoUrl: user.photoUrl ?? undefined,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt?.toISOString(),
  };
}

async function assertCanManageUsers() {
  const session = await requireSessionUser();
  if (!canManageUsers(session.role)) {
    throw new Error("You do not have permission to manage users");
  }
  return session;
}

function assertCanAssignRole(actorRole: UserRole, targetRole: UserRole) {
  if (actorRole === "SUPER_ADMIN") return;
  if (targetRole !== "MEMBER") {
    throw new Error("Only super admins can assign admin roles");
  }
}

export async function listUsers(): Promise<UserDto[]> {
  await assertCanManageUsers();
  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { fullName: "asc" }],
  });
  return users.map(toUserDto);
}

export async function createUser(
  input: CreateUserInput,
): Promise<ActionResult<UserDto>> {
  try {
    const session = await assertCanManageUsers();
    const data = createUserSchema.parse(input);
    assertCanAssignRole(session.role, data.role);

    const email = data.email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "A user with this email already exists" };
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(data.password),
        fullName: data.fullName.trim(),
        phone: data.phone?.trim() || null,
        photoUrl: data.photoUrl?.trim() || null,
        role: data.role,
      },
    });

    revalidatePath("/admin/team/users");
    return { success: true, data: toUserDto(user) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}

export async function updateUser(
  input: UpdateUserInput,
): Promise<ActionResult<UserDto>> {
  try {
    const session = await assertCanManageUsers();
    const data = updateUserSchema.parse(input);
    assertCanAssignRole(session.role, data.role);

    const email = data.email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { id: data.id } });
    if (!existing) {
      return { success: false, error: "User not found" };
    }

    if (session.role !== "SUPER_ADMIN" && existing.role !== "MEMBER") {
      return { success: false, error: "You can only edit member accounts" };
    }

    const emailTaken = await prisma.user.findFirst({
      where: { email, NOT: { id: data.id } },
    });
    if (emailTaken) {
      return { success: false, error: "A user with this email already exists" };
    }

    const password = data.password?.trim();
    const user = await prisma.user.update({
      where: { id: data.id },
      data: {
        email,
        fullName: data.fullName.trim(),
        phone: data.phone?.trim() || null,
        photoUrl: data.photoUrl?.trim() || null,
        role: data.role,
        ...(typeof data.active === "boolean" ? { active: data.active } : {}),
        ...(password ? { passwordHash: await hashPassword(password) } : {}),
      },
    });

    revalidatePath("/admin/team/users");
    return { success: true, data: toUserDto(user) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}
