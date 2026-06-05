import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/marketing/pixels")({
  component: AdminMarketingPixelsPage,
});

function AdminMarketingPixelsPage() {
  return <AdminRoutePage url="/admin/marketing/pixels" />;
}
