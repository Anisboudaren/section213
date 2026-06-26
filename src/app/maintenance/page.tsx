import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SiteMessagePage } from "@/components/pages/SiteMessagePage";
import { getSiteSettings } from "@/lib/actions/site-settings";

export const metadata: Metadata = {
  title: "Maintenance",
  robots: { index: false, follow: false },
};

export default async function MaintenancePage() {
  const settings = await getSiteSettings();

  if (!settings.maintenanceMode) {
    redirect("/");
  }

  return <SiteMessagePage variant="maintenance" />;
}
