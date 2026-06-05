import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/team/audit")({
  component: AdminTeamAuditPage,
});

function AdminTeamAuditPage() {
  return <AdminRoutePage url="/admin/team/audit" />;
}
