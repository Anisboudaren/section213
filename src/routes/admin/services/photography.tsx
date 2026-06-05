import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/services/photography")({
  component: AdminServicesPhotographyPage,
});

function AdminServicesPhotographyPage() {
  return <AdminRoutePage url="/admin/services/photography" />;
}
