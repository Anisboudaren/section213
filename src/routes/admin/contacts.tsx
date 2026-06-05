import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/contacts")({
  component: AdminContactsPage,
});

function AdminContactsPage() {
  return <AdminRoutePage url="/admin/contacts" />;
}
