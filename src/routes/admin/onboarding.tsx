import { createFileRoute } from "@tanstack/react-router";

import { AdminRoutePage } from "@/components/admin/AdminRoutePage";

export const Route = createFileRoute("/admin/onboarding")({
  component: AdminOnboardingPage,
});

function AdminOnboardingPage() {
  return <AdminRoutePage url="/admin/onboarding" />;
}
