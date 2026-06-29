import { MediaLibraryView } from "@/components/admin/media/MediaLibraryView";
import { getMediaAssets } from "@/lib/actions/media";

export default async function MediaPage() {
  const result = await getMediaAssets();
  const assets = result.success ? result.data : [];

  return <MediaLibraryView initialAssets={assets} />;
}
