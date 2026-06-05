import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/forms/builder")({
  component: AdminFormsBuilderPage,
});

function AdminFormsBuilderPage() {
  return <AdminRoutePage url="/admin/forms/builder" />;
}
