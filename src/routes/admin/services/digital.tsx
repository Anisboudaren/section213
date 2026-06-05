import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/services/digital")({
  component: AdminServicesDigitalPage,
});

function AdminServicesDigitalPage() {
  return <AdminRoutePage url="/admin/services/digital" />;
}
