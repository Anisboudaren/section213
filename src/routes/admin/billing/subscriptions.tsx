import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/billing/subscriptions")({
  component: AdminBillingSubscriptionsPage,
});

function AdminBillingSubscriptionsPage() {
  return <AdminRoutePage url="/admin/billing/subscriptions" />;
}
