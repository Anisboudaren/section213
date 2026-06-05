import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/projects/assets")({
  component: AdminProjectsAssetsPage,
});

function AdminProjectsAssetsPage() {
  return <AdminRoutePage url="/admin/projects/assets" />;
}
