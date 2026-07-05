"use client";

import { useMemo, useState } from "react";
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

const PAGE_SIZE = 24;

type MediaPickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  filter?: "image" | "video" | "all";
};

function MediaPickerThumb({
  url,
  alt,
  isVideo,
}: {
  url: string;
  alt: string;
  isVideo: boolean;
}) {
  if (isVideo) {
    return (
      <video
        src={url}
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  );
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  filter = "all",
}: MediaPickerDialogProps) {
  const mimePrefix = filter === "all" ? undefined : filter;
  const { data: assets = [], isLoading } = useMediaAssets(
    open ? { mimePrefix, limit: 120 } : undefined,
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleAssets = useMemo(
    () => assets.slice(0, visibleCount),
    [assets, visibleCount],
  );

  const handleOpenChange = (next: boolean) => {
    if (!next) setVisibleCount(PAGE_SIZE);
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="z-[80] flex max-h-[90dvh] w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b px-4 py-4 sm:px-6">
          <DialogTitle>Choisir depuis la bibliothèque</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
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
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {visibleAssets.map((asset) => {
                  const isVideo = asset.mimeType.startsWith("video/");
                  return (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => {
                        onSelect(asset.url);
                        handleOpenChange(false);
                      }}
                      className={cn(
                        "group flex flex-col overflow-hidden rounded-lg border border-border bg-muted/40 text-left transition hover:border-ruby/50 hover:ring-2 hover:ring-ruby/20",
                      )}
                    >
                      <div className="relative aspect-square w-full overflow-hidden bg-muted">
                        <MediaPickerThumb
                          url={asset.url}
                          alt={asset.label ?? asset.filename}
                          isVideo={isVideo}
                        />
                        <span className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white">
                          {isVideo ? (
                            <Film className="h-3.5 w-3.5" />
                          ) : (
                            <ImageIcon className="h-3.5 w-3.5" />
                          )}
                        </span>
                      </div>
                      <div className="border-t border-border/60 bg-background/90 px-2 py-2">
                        <p className="truncate text-[11px] font-medium text-foreground">
                          {asset.label ?? asset.filename}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {visibleCount < assets.length ? (
                <div className="mt-4 flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                  >
                    Charger plus ({assets.length - visibleCount} restants)
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="flex shrink-0 justify-end border-t px-4 py-3 sm:px-6">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
