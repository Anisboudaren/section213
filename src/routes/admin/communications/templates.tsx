import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/communications/templates")({
  component: AdminCommunicationsTemplatesPage,
});

function AdminCommunicationsTemplatesPage() {
  return <AdminRoutePage url="/admin/communications/templates" />;
}
