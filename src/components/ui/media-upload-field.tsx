"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { FileText, FolderOpen, Loader2, Upload, X } from "lucide-react";

import { MediaPickerDialog } from "@/components/admin/media/MediaPickerDialog";
import { Button } from "@/components/ui/button";
import { adminT } from "@/lib/i18n/admin-en";
import { cn } from "@/lib/utils";
import type { BlobFolder } from "@/lib/blob";

export type MediaUploadVariant = "image" | "video" | "document";

type MediaUploadFieldProps = {
  value?: string;
  onChange: (url: string | undefined) => void;
  folder: BlobFolder;
  variant?: MediaUploadVariant;
  shape?: "default" | "circle";
  fallback?: ReactNode;
  accept?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  allowLibraryPick?: boolean;
};

const VARIANT_ACCEPT: Record<MediaUploadVariant, string> = {
  image: "image/jpeg,image/png,image/webp,image/svg+xml",
  video: "video/mp4,video/webm",
  document: "image/jpeg,image/png,image/webp,application/pdf",
};

export function MediaUploadField({
  value,
  onChange,
  folder,
  variant = "image",
  shape = "default",
  fallback,
  accept,
  label,
  className,
  disabled,
  allowLibraryPick = true,
}: MediaUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const libraryFilter =
    variant === "video" ? "video" : variant === "image" ? "image" : "all";

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const headers: Record<string, string> = {};
        const token = process.env.NEXT_PUBLIC_ADMIN_UPLOAD_SECRET;
        if (token) headers["x-upload-token"] = token;

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          headers,
          credentials: "include",
        });

        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok) {
          throw new Error(data.error ?? "Upload failed");
        }
        if (data.url) onChange(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) void uploadFile(file);
    },
    [uploadFile],
  );

  const isImage =
    variant === "image" ||
    (variant === "document" && value && !value.endsWith(".pdf"));

  const isCircle = shape === "circle";

  const libraryButton = allowLibraryPick ? (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="min-h-9"
      disabled={disabled || uploading}
      onClick={() => setLibraryOpen(true)}
    >
      <FolderOpen className="mr-2 h-4 w-4" />
      {adminT("media.pickFromLibrary")}
    </Button>
  ) : null;

  if (isCircle) {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <div className="group relative">
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled) setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (!disabled) handleFiles(e.dataTransfer.files);
            }}
            className={cn(
              "relative flex size-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed bg-muted/40 transition-all sm:size-28",
              dragOver ? "border-brand-accent bg-brand-accent/5" : "border-border hover:border-brand-accent/60",
              disabled && "pointer-events-none opacity-50",
            )}
          >
            {uploading ? (
              <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
            ) : value && isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              (fallback ?? <Upload className="h-6 w-6 text-muted-foreground" />)
            )}
            {!uploading && (
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 text-white opacity-0 transition-all group-hover:bg-black/45 group-hover:opacity-100">
                <Upload className="h-5 w-5" />
              </span>
            )}
          </button>
          {value && !disabled && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute -right-1 -top-1 h-7 w-7 rounded-full shadow-sm"
              onClick={() => onChange(undefined)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        {label && <p className="text-center text-xs text-muted-foreground">{label}</p>}
        {libraryButton}
        <input
          ref={inputRef}
          type="file"
          accept={accept ?? VARIANT_ACCEPT[variant]}
          className="hidden"
          disabled={disabled || uploading}
          onChange={(e) => handleFiles(e.target.files)}
        />
        {error && <p className="text-center text-xs text-destructive">{error}</p>}
        <MediaPickerDialog
          open={libraryOpen}
          onOpenChange={setLibraryOpen}
          filter={libraryFilter}
          onSelect={onChange}
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-sm font-medium">{label}</p>}

      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30">
          {variant === "video" ? (
            <video src={value} controls className="max-h-48 w-full object-contain" />
          ) : isImage ? (
            <div className="relative flex h-32 items-center justify-center p-4">
              <Image
                src={value}
                alt=""
                width={200}
                height={80}
                className="max-h-24 w-auto object-contain"
                unoptimized={value.includes("blob.vercel-storage.com")}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
              <FileText className="h-5 w-5 shrink-0" />
              <span className="truncate">Document uploaded</span>
            </div>
          )}
          {!disabled && (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={() => onChange(undefined)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (!disabled) handleFiles(e.dataTransfer.files);
          }}
          onClick={() => !disabled && inputRef.current?.click()}
          className={cn(
            "flex min-h-[8rem] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 text-center transition-colors",
            dragOver ? "border-brand-accent bg-brand-accent/5" : "border-border hover:border-brand-accent/50",
            disabled && "pointer-events-none opacity-50",
          )}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Glissez un fichier ou cliquez pour parcourir
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept ?? VARIANT_ACCEPT[variant]}
        className="hidden"
        disabled={disabled || uploading}
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="flex flex-wrap gap-2">
        {value && !disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Remplacer
          </Button>
        )}
        {libraryButton}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <MediaPickerDialog
        open={libraryOpen}
        onOpenChange={setLibraryOpen}
        filter={libraryFilter}
        onSelect={onChange}
      />
    </div>
  );
}
