"use client";

import { AdminCommandMenu, useAdminCommandMenu } from "@/components/admin/AdminCommandMenu";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMobileTabBar } from "@/components/admin/AdminMobileTabBar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminUserProvider } from "@/lib/admin/user-context";
import type { SessionUser } from "@/lib/auth/session";

type AdminLayoutClientProps = {
  children: React.ReactNode;
  user: SessionUser;
  newLeadCount: number;
  overdueProjectCount: number;
};

export function AdminLayoutClient({
  children,
  user,
  newLeadCount,
  overdueProjectCount,
}: AdminLayoutClientProps) {
  const { open, setOpen } = useAdminCommandMenu();

  return (
    <AdminUserProvider user={user}>
      <SidebarProvider>
        <AdminSidebar
          newLeadCount={newLeadCount}
          overdueProjectCount={overdueProjectCount}
          onOpenCommand={() => setOpen(true)}
        />
        <SidebarInset className="min-h-svh pb-16 md:pb-0">
          <AdminHeader onOpenCommand={() => setOpen(true)} />
          {children}
        </SidebarInset>
        <AdminMobileTabBar
          newLeadCount={newLeadCount}
          overdueProjectCount={overdueProjectCount}
        />
        <AdminCommandMenu open={open} onOpenChange={setOpen} />
      </SidebarProvider>
    </AdminUserProvider>
  );
}
