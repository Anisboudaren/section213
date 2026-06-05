import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/services/sponsors")({
  component: AdminServicesSponsorsPage,
});

function AdminServicesSponsorsPage() {
  return <AdminRoutePage url="/admin/services/sponsors" />;
}
