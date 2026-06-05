import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/analytics/exports")({
  component: AdminAnalyticsExportsPage,
});

function AdminAnalyticsExportsPage() {
  return <AdminRoutePage url="/admin/analytics/exports" />;
}
