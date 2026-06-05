import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/analytics/services")({
  component: AdminAnalyticsServicesPage,
});

function AdminAnalyticsServicesPage() {
  return <AdminRoutePage url="/admin/analytics/services" />;
}
