import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/billing/invoices")({
  component: AdminBillingInvoicesPage,
});

function AdminBillingInvoicesPage() {
  return <AdminRoutePage url="/admin/billing/invoices" />;
}
