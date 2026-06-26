"use client";

import Image from "next/image";

import { LOGO_PATH } from "@/components/Section213Logo";
import { MediaUploadField } from "@/components/ui/media-upload-field";
import { FAVICON_PATH } from "@/lib/site-brand";
import { cn } from "@/lib/utils";

type BrandAssetFieldProps = {
  label: string;
  hint: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  kind: "logo" | "favicon";
  siteName?: string;
  className?: string;
};

export function BrandAssetField({
  label,
  hint,
  value,
  onChange,
  kind,
  siteName = "Section 213",
  className,
}: BrandAssetFieldProps) {
  const isLogo = kind === "logo";
  const displaySrc = isLogo ? value || LOGO_PATH : value || FAVICON_PATH;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-ink/10 bg-gradient-to-b from-ink/[0.03] to-transparent p-4",
        className,
      )}
    >
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>

      <div className="flex flex-col gap-3">
        {isLogo && !value && (
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-ink/15 bg-muted/25 px-3 py-2.5">
            <Image
              src={LOGO_PATH}
              alt=""
              width={160}
              height={48}
              className="h-8 w-auto max-w-[140px] object-contain object-left"
            />
            <p className="text-xs text-muted-foreground">Logo par défaut du site</p>
          </div>
        )}

        {!isLogo && !value && (
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-ink/15 bg-muted/25 px-3 py-2.5">
            <Image
              src={FAVICON_PATH}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-sm object-contain"
            />
            <p className="text-xs text-muted-foreground">Favicon par défaut du site</p>
          </div>
        )}

        <div className={cn(!isLogo && "flex justify-center")}>
          <MediaUploadField
          key={value || `empty-${kind}`}
          folder="brand/platform"
          variant="image"
          shape={isLogo ? "default" : "circle"}
          value={value}
          onChange={onChange}
          className="w-full"
          fallback={
            isLogo ? (
              <span className="flex h-24 w-full items-center justify-center rounded-lg bg-ink font-display text-lg tracking-wider text-gold sm:h-28">
                {siteName.slice(0, 2).toUpperCase()}
              </span>
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-md bg-ink text-xs font-bold text-gold">
                {siteName.slice(0, 1)}
              </span>
            )
          }
        />
        </div>

        <div className="min-w-0 rounded-lg border border-ink/10 bg-background p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Aperçu
          </p>
          {isLogo ? (
            <div className="flex items-center gap-3 rounded-md border border-ink/10 bg-ink px-3 py-2.5">
              <div className="relative h-8 w-28 shrink-0">
                <Image
                  src={displaySrc!}
                  alt=""
                  fill
                  className="object-contain object-left"
                  unoptimized={
                    displaySrc!.startsWith("http") || displaySrc!.includes("blob.vercel-storage.com")
                  }
                />
              </div>
              {!value && (
                <span className="text-[10px] text-white/45">Par défaut</span>
              )}
              <span className="hidden text-xs text-white/50 sm:inline">Navigation</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-ink/10 bg-muted/40 px-2 py-1.5">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-400/80" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                  <span className="h-2 w-2 rounded-full bg-green-400/80" />
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded bg-background px-2 py-0.5 text-[10px] text-muted-foreground">
                  <Image
                    src={displaySrc}
                    alt=""
                    width={12}
                    height={12}
                    className="shrink-0 rounded-sm object-contain"
                    unoptimized={
                      displaySrc.startsWith("http") || displaySrc.includes("blob.vercel-storage.com")
                    }
                  />
                  <span className="truncate">{siteName}</span>
                </div>
              </div>
              <div className="rounded-b-lg border border-ink/10 bg-muted/20 px-3 py-4 text-center text-[10px] text-muted-foreground">
                Onglet navigateur
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">
        {isLogo ? "PNG, SVG ou WebP — affiché dans la navigation" : "PNG carré, 32×32 min — icône d’onglet"}
      </p>
    </div>
  );
}
