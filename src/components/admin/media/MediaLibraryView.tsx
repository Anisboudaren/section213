"use client";

import { useState } from "react";
import Image from "next/image";
import { Film, FolderSync, ImageIcon, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { EmptyState } from "@/components/admin/EmptyState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MediaAssetDto } from "@/lib/actions/media";
import { adminT } from "@/lib/i18n/admin-en";
import { useDeleteMediaAsset, useMediaAssets, useSyncMediaFromBlob } from "@/lib/queries/media";

function MediaTile({
  asset,
  onDelete,
}: {
  asset: MediaAssetDto;
  onDelete: (asset: MediaAssetDto) => void;
}) {
  const isVideo = asset.mimeType.startsWith("video/");

  return (
    <div className="group relative overflow-hidden rounded-xl border border-ink/10 bg-white">
      <div className="relative aspect-square bg-muted/30">
        {isVideo ? (
          <video
            src={asset.url}
            muted
            playsInline
            controls
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={asset.url}
            alt={asset.label ?? asset.filename}
            fill
            className="object-cover"
            unoptimized={asset.url.includes("blob.vercel-storage.com")}
          />
        )}
      </div>
      <div className="space-y-1 p-3">
        <p className="truncate text-sm font-medium text-ink">
          {asset.label ?? asset.filename}
        </p>
        <p className="truncate text-xs text-muted-foreground">{asset.folder}</p>
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            {isVideo ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
            {isVideo ? "Video" : "Image"}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive opacity-0 transition group-hover:opacity-100"
            onClick={() => onDelete(asset)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

type MediaLibraryViewProps = {
  initialAssets: MediaAssetDto[];
};

export function MediaLibraryView({ initialAssets }: MediaLibraryViewProps) {
  const [assets, setAssets] = useState(initialAssets);
  const [deleteTarget, setDeleteTarget] = useState<MediaAssetDto | null>(null);
  const syncMedia = useSyncMediaFromBlob();
  const deleteMedia = useDeleteMediaAsset();
  const { refetch, isFetching } = useMediaAssets();

  const images = assets.filter((a) => a.mimeType.startsWith("image/"));
  const videos = assets.filter((a) => a.mimeType.startsWith("video/"));

  const handleSync = async () => {
    try {
      const data = await syncMedia.mutateAsync();
      setAssets(data);
      toast.success(adminT("media.syncSuccess", { count: data.length }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sync failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;

    try {
      await deleteMedia.mutateAsync(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      toast.success(adminT("media.deleted"));
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  const handleRefresh = async () => {
    const result = await refetch();
    if (result.data) setAssets(result.data);
  };

  const renderGrid = (items: MediaAssetDto[]) => {
    if (items.length === 0) {
      return (
        <EmptyState
          icon={ImageIcon}
          title={adminT("media.emptyTitle")}
          description={adminT("media.emptyDescription")}
          action={{ label: adminT("media.syncFromBlob"), onClick: () => void handleSync() }}
        />
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((asset) => (
          <MediaTile key={asset.id} asset={asset} onDelete={setDeleteTarget} />
        ))}
      </div>
    );
  };

  return (
    <AdminPageShell title={adminT("media.title")} description={adminT("media.description")}>
      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          variant="gold"
          className="min-h-11"
          onClick={() => void handleSync()}
          disabled={syncMedia.isPending}
        >
          {syncMedia.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FolderSync className="mr-2 h-4 w-4" />
          )}
          {adminT("media.syncFromBlob")}
        </Button>
        <Button
          variant="outline"
          className="min-h-11"
          onClick={() => void handleRefresh()}
          disabled={isFetching}
        >
          {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {adminT("common.refresh")}
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4 flex h-auto flex-wrap gap-1.5 bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="min-h-10 rounded-full border border-ink/10 px-4 data-[state=active]:border-ruby/40 data-[state=active]:bg-ink data-[state=active]:text-white"
          >
            {adminT("media.all")} ({assets.length})
          </TabsTrigger>
          <TabsTrigger
            value="videos"
            className="min-h-10 rounded-full border border-ink/10 px-4 data-[state=active]:border-ruby/40 data-[state=active]:bg-ink data-[state=active]:text-white"
          >
            {adminT("media.videos")} ({videos.length})
          </TabsTrigger>
          <TabsTrigger
            value="images"
            className="min-h-10 rounded-full border border-ink/10 px-4 data-[state=active]:border-ruby/40 data-[state=active]:bg-ink data-[state=active]:text-white"
          >
            {adminT("media.images")} ({images.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">{renderGrid(assets)}</TabsContent>
        <TabsContent value="videos">{renderGrid(videos)}</TabsContent>
        <TabsContent value="images">{renderGrid(images)}</TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{adminT("common.delete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? adminT("media.deleteConfirm", {
                    name: deleteTarget.label ?? deleteTarget.filename,
                  })
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{adminT("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => void handleDelete()}
              disabled={deleteMedia.isPending}
            >
              {deleteMedia.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {adminT("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPageShell>
  );
}
