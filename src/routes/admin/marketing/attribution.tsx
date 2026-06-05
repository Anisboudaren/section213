import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/marketing/attribution")({
  component: AdminMarketingAttributionPage,
});

function AdminMarketingAttributionPage() {
  return <AdminRoutePage url="/admin/marketing/attribution" />;
}
