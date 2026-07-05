import type { UserRole } from "@/generated/prisma/client";
import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "s213_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  photoUrl?: string;
  role: UserRole;
};

function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getAuthSecret());
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    const user = payload as SessionUser;
    if (!user?.id || !user.email || !user.role) return null;
    return user;
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(
  request: NextRequest,
): Promise<SessionUser | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function canManageUsers(role: UserRole): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export const SESSION_MAX_AGE = SESSION_DURATION_SECONDS;
