"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { SessionUser } from "@/lib/auth/session";

const AdminUserContext = createContext<SessionUser | null>(null);

export function AdminUserProvider({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  return <AdminUserContext.Provider value={user}>{children}</AdminUserContext.Provider>;
}

export function useAdminUser(): SessionUser {
  const user = useContext(AdminUserContext);
  if (!user) {
    throw new Error("useAdminUser must be used within AdminUserProvider");
  }
  return user;
}
