import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/settings/platform")({
  component: AdminSettingsPlatformPage,
});

function AdminSettingsPlatformPage() {
  return <AdminRoutePage url="/admin/settings/platform" />;
}
