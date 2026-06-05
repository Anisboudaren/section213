import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/team/users")({
  component: AdminTeamUsersPage,
});

function AdminTeamUsersPage() {
  return <AdminRoutePage url="/admin/team/users" />;
}
