import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/marketing/campaigns")({
  component: AdminMarketingCampaignsPage,
});

function AdminMarketingCampaignsPage() {
  return <AdminRoutePage url="/admin/marketing/campaigns" />;
}
