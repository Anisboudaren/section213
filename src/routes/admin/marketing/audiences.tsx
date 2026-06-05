import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/marketing/audiences")({
  component: AdminMarketingAudiencesPage,
});

function AdminMarketingAudiencesPage() {
  return <AdminRoutePage url="/admin/marketing/audiences" />;
}
