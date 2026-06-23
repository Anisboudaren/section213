"use client";

import type { TeamMember } from "@/lib/types/admin";
import { TEAM } from "@/lib/mock-data/team";

// Replace with real auth session when Neon + Auth is connected
const DEFAULT_USER_ID = "amine";

export function useCurrentUser(): TeamMember {
  const member = TEAM.find((m) => m.id === DEFAULT_USER_ID);
  return member ?? TEAM[0];
}

export function canManageLeads(user: TeamMember): boolean {
  return user.adminAccess === "full" || user.adminAccess === "full_no_billing";
}

export function canUpgradeToClient(user: TeamMember): boolean {
  return user.adminAccess === "full" || user.adminAccess === "full_no_billing";
}

export function canReassignLead(user: TeamMember): boolean {
  return user.adminAccess === "full" || user.adminAccess === "full_no_billing";
}

export function canAccessBilling(user: TeamMember): boolean {
  return user.adminAccess === "full";
}
