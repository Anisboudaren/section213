import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/services/marketing")({
  component: AdminServicesMarketingPage,
});

function AdminServicesMarketingPage() {
  return <AdminRoutePage url="/admin/services/marketing" />;
}
