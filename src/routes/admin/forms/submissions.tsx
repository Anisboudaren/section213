import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/forms/submissions")({
  component: AdminFormsSubmissionsPage,
});

function AdminFormsSubmissionsPage() {
  return <AdminRoutePage url="/admin/forms/submissions" />;
}
