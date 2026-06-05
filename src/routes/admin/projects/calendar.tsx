import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/projects/calendar")({
  component: AdminProjectsCalendarPage,
});

function AdminProjectsCalendarPage() {
  return <AdminRoutePage url="/admin/projects/calendar" />;
}
