import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/pipeline")({
  component: AdminPipelinePage,
});

function AdminPipelinePage() {
  return <AdminRoutePage url="/admin/pipeline" />;
}
