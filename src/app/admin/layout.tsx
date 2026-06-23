"use client";

import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminCommandMenu, useAdminCommandMenu } from "@/components/admin/AdminCommandMenu";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMobileTabBar } from "@/components/admin/AdminMobileTabBar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useAdminCommandMenu();

  return (
    <AdminAuthGuard>
      <SidebarProvider>
        <AdminSidebar onOpenCommand={() => setOpen(true)} />
        <SidebarInset className="min-h-svh pb-16 md:pb-0">
          <AdminHeader onOpenCommand={() => setOpen(true)} />
          {children}
        </SidebarInset>
        <AdminMobileTabBar />
        <AdminCommandMenu open={open} onOpenChange={setOpen} />
      </SidebarProvider>
    </AdminAuthGuard>
  );
}
