import { PlatformSettingsView } from "@/components/admin/settings/PlatformSettingsView";
import { getSiteSettings } from "@/lib/actions/site-settings";

export default async function PlatformSettingsPage() {
  const settings = await getSiteSettings();
  return <PlatformSettingsView initialSettings={settings} />;
}
