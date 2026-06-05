import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/analytics/clients")({
  component: AdminAnalyticsClientsPage,
});

function AdminAnalyticsClientsPage() {
  return <AdminRoutePage url="/admin/analytics/clients" />;
}
