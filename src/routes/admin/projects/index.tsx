import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/projects/")({
  component: AdminProjectsPage,
});

function AdminProjectsPage() {
  return <AdminRoutePage url="/admin/projects" />;
}
