import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/communications/inbox")({
  component: AdminCommunicationsInboxPage,
});

function AdminCommunicationsInboxPage() {
  return <AdminRoutePage url="/admin/communications/inbox" />;
}
