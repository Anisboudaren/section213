import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/analytics/revenue")({
  component: AdminAnalyticsRevenuePage,
});

function AdminAnalyticsRevenuePage() {
  return <AdminRoutePage url="/admin/analytics/revenue" />;
}
