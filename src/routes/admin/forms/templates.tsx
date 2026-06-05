import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/forms/templates")({
  component: AdminFormsTemplatesPage,
});

function AdminFormsTemplatesPage() {
  return <AdminRoutePage url="/admin/forms/templates" />;
}
