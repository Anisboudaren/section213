import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/leads")({
  component: AdminLeadsPage,
});

function AdminLeadsPage() {
  return <AdminRoutePage url="/admin/leads" />;
}
