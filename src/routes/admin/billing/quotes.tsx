import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/billing/quotes")({
  component: AdminBillingQuotesPage,
});

function AdminBillingQuotesPage() {
  return <AdminRoutePage url="/admin/billing/quotes" />;
}
