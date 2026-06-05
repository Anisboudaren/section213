import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/team/roles")({
  component: AdminTeamRolesPage,
});

function AdminTeamRolesPage() {
  return <AdminRoutePage url="/admin/team/roles" />;
}
