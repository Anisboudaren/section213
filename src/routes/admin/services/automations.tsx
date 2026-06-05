import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/services/automations")({
  component: AdminServicesAutomationsPage,
});

function AdminServicesAutomationsPage() {
  return <AdminRoutePage url="/admin/services/automations" />;
}
