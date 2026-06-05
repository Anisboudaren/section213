import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/analytics/forms")({
  component: AdminAnalyticsFormsPage,
});

function AdminAnalyticsFormsPage() {
  return <AdminRoutePage url="/admin/analytics/forms" />;
}
