import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/services/")({
  component: AdminServicesPage,
});

function AdminServicesPage() {
  return <AdminRoutePage url="/admin/services" />;
}
