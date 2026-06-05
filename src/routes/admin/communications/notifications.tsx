import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/communications/notifications")({
  component: AdminCommunicationsNotificationsPage,
});

function AdminCommunicationsNotificationsPage() {
  return <AdminRoutePage url="/admin/communications/notifications" />;
}
