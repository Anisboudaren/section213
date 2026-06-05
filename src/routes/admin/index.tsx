import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
});

function AdminPage() {
  return <AdminRoutePage url="/admin" />;
}
