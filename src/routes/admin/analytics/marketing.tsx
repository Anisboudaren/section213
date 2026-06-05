import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/analytics/marketing")({
  component: AdminAnalyticsMarketingPage,
});

function AdminAnalyticsMarketingPage() {
  return <AdminRoutePage url="/admin/analytics/marketing" />;
}
