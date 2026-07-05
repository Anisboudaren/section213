import type { User } from "@/generated/prisma/client";
import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";

import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  type SessionUser,
  verifySessionToken,
} from "./session-edge";

export type { SessionUser } from "./session-edge";
export {
  canManageUsers,
  createSessionToken,
  getSessionFromRequest,
  SESSION_COOKIE,
  verifySessionToken,
} from "./session-edge";

export function toSessionUser(user: User): SessionUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone ?? undefined,
    photoUrl: user.photoUrl ?? undefined,
    role: user.role,
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user || !user.active) return null;

  return toSessionUser(user);
}

export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = await createSessionToken(user);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
