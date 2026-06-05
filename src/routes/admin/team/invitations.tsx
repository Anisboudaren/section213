import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/team/invitations")({
  component: AdminTeamInvitationsPage,
});

function AdminTeamInvitationsPage() {
  return <AdminRoutePage url="/admin/team/invitations" />;
}
