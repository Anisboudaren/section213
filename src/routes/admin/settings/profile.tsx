import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/settings/profile")({
  component: AdminSettingsProfilePage,
});

function AdminSettingsProfilePage() {
  return <AdminRoutePage url="/admin/settings/profile" />;
}
