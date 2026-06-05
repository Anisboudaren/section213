import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/settings/integrations")({
  component: AdminSettingsIntegrationsPage,
});

function AdminSettingsIntegrationsPage() {
  return <AdminRoutePage url="/admin/settings/integrations" />;
}
