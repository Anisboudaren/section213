"use client";

import Image from "next/image";
import { Film, ImageIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaAssets } from "@/lib/queries/media";
import { cn } from "@/lib/utils";

type MediaPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  filter?: "image" | "video" | "all";
};

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  filter = "all",
}: MediaPickerDialogProps) {
  const mimePrefix = filter === "all" ? undefined : filter;
  const { data: assets = [], isLoading } = useMediaAssets(
    open ? { mimePrefix } : undefined,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-1.5rem)] overflow-hidden sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choisir depuis la bibliothèque</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : assets.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Aucun média enregistré. Uploadez un fichier ou synchronisez depuis Blob dans
            Médias.
          </p>
        ) : (
          <div className="grid max-h-[60dvh] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
            {assets.map((asset) => {
              const isVideo = asset.mimeType.startsWith("video/");
              return (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    onSelect(asset.url);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted/40 text-left transition hover:border-ruby/50 hover:ring-2 hover:ring-ruby/20",
                  )}
                >
                  {isVideo ? (
                    <video
                      src={asset.url}
                      muted
                      playsInline
                      preload="metadata"
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
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <p className="truncate text-[11px] font-medium text-white">
                      {asset.label ?? asset.filename}
                    </p>
                  </div>
                  <span className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white">
                    {isVideo ? (
                      <Film className="h-3.5 w-3.5" />
                    ) : (
                      <ImageIcon className="h-3.5 w-3.5" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex justify-end border-t pt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
