import { PixelsSettingsView } from "@/components/admin/pixels/PixelsSettingsView";
import { getPixelSettings } from "@/lib/actions/pixel-settings";

export default async function PixelsPage() {
  const settings = await getPixelSettings();
  return <PixelsSettingsView initialSettings={settings} />;
}
