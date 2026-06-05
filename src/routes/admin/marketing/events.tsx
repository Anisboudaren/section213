import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/marketing/events")({
  component: AdminMarketingEventsPage,
});

function AdminMarketingEventsPage() {
  return <AdminRoutePage url="/admin/marketing/events" />;
}
