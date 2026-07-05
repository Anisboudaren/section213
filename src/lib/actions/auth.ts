"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  clearSessionCookie,
  getSessionUser,
  setSessionCookie,
  toSessionUser,
} from "@/lib/auth/session";
import { loginSchema } from "@/lib/schemas/user-schema";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function loginAction(
  input: unknown,
): Promise<ActionResult<{ email: string; fullName: string }>> {
  try {
    const data = loginSchema.parse(input);
    const email = data.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.active) {
      return { success: false, error: "Invalid email or password" };
    }

    const valid = await verifyPassword(data.password, user.passwordHash);
    if (!valid) {
      return { success: false, error: "Invalid email or password" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const sessionUser = toSessionUser(user);
    await setSessionCookie(sessionUser);

    return {
      success: true,
      data: { email: sessionUser.email, fullName: sessionUser.fullName },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
}

export async function requireSessionUser() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
