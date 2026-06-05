import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AdminCommandMenu, useAdminCommandMenu } from "@/components/admin/AdminCommandMenu";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { isAdminAuthed } from "@/lib/admin/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    // TODO: Replace with Supabase Auth session check
    if (!isAdminAuthed()) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { open, setOpen } = useAdminCommandMenu();

  return (
    <SidebarProvider>
      <AdminSidebar onOpenCommand={() => setOpen(true)} />
      <SidebarInset className="min-h-svh">
        <AdminHeader onOpenCommand={() => setOpen(true)} />
        <Outlet />
      </SidebarInset>
      <AdminCommandMenu open={open} onOpenChange={setOpen} />
    </SidebarProvider>
  );
}
