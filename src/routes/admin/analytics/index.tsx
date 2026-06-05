import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/analytics/")({
  component: AdminAnalyticsPage,
});

function AdminAnalyticsPage() {
  return <AdminRoutePage url="/admin/analytics" />;
}
