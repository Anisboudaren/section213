"use client";

import type { UserRole } from "@/generated/prisma/client";
import { useAdminUser } from "@/lib/admin/user-context";
import type { AdminAccessLevel, TeamMember } from "@/lib/types/admin";

function roleToAdminAccess(role: UserRole): AdminAccessLevel {
  switch (role) {
    case "SUPER_ADMIN":
      return "full";
    case "ADMIN":
      return "full_no_billing";
    default:
      return "tasks_only";
  }
}

export function useCurrentUser(): TeamMember {
  const user = useAdminUser();

  return {
    id: user.id,
    name: user.fullName,
    role: "ceo",
    displayRole: user.role === "SUPER_ADMIN" ? "Super Admin" : user.role === "ADMIN" ? "Admin" : "Team Member",
    responsibilities: [],
    reportsTo: [],
    adminAccess: roleToAdminAccess(user.role),
    active: true,
    email: user.email,
    phone: user.phone,
    avatar: user.photoUrl,
  };
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

export function canManageUsers(user: TeamMember): boolean {
  return user.adminAccess === "full" || user.adminAccess === "full_no_billing";
}
