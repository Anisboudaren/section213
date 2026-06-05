import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/projects/tasks")({
  component: AdminProjectsTasksPage,
});

function AdminProjectsTasksPage() {
  return <AdminRoutePage url="/admin/projects/tasks" />;
}
