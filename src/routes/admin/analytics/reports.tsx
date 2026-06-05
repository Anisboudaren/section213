import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/analytics/reports")({
  component: AdminAnalyticsReportsPage,
});

function AdminAnalyticsReportsPage() {
  return <AdminRoutePage url="/admin/analytics/reports" />;
}
