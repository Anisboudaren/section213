import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/analytics/pixels")({
  component: AdminAnalyticsPixelsPage,
});

function AdminAnalyticsPixelsPage() {
  return <AdminRoutePage url="/admin/analytics/pixels" />;
}
