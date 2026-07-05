"use client";

import { useRef, useState } from "react";
import { Building2, Home, Landmark, Loader2, Store, Trees } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { bookingChoiceClass } from "@/components/book/selection-styles";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ALGERIA_WILAYAS } from "@/lib/algeria-wilayas";
import type { BookingFormData, ProjectType, UploadedFile } from "@/lib/booking-types";
import { PROJECT_TYPES } from "@/lib/booking-types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const PROJECT_ICONS: Record<ProjectType, LucideIcon> = {
  residence: Building2,
  lotissement: Trees,
  immeuble: Landmark,
  villa: Home,
  commercial: Store,
  other: Building2,
};

const UPLOAD_KINDS: UploadedFile["kind"][] = ["plans", "visuels", "logo", "documents"];

type StepProps = {
  data: Partial<BookingFormData>;
  onChange: (patch: Partial<BookingFormData>) => void;
  errors?: Record<string, string>;
};

export function Step02Projet({ data, onChange, errors }: StepProps) {
  const { translations: t } = useLanguage();
  const description = data.projectDescription ?? "";
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadKind, setUploadKind] = useState<UploadedFile["kind"]>("plans");

  const mapError = (key?: string) => {
    if (!key) return null;
    return t.booking.validation[key as keyof typeof t.booking.validation] ?? key;
  };

  const handleUpload = async (file: File, kind: UploadedFile["kind"]) => {
    setUploading(kind);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "bookings/project-files");
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "Upload failed");
      const current = data.uploadedFiles ?? [];
      onChange({
        uploadedFiles: [...current, { name: file.name, url: json.url, kind }],
      });
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>{t.booking.projectName}</Label>
        <Input
          value={data.projectName ?? ""}
          onChange={(e) => onChange({ projectName: e.target.value })}
          placeholder={t.booking.projectNamePlaceholder}
          aria-invalid={Boolean(errors?.projectName)}
        />
        {errors?.projectName && (
          <p className="text-sm text-destructive">{mapError(errors.projectName)}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{t.booking.wilaya}</Label>
          <Select
            value={data.wilaya ?? ""}
            onValueChange={(v) => onChange({ wilaya: v })}
          >
            <SelectTrigger aria-invalid={Boolean(errors?.wilaya)}>
              <SelectValue placeholder={t.booking.wilayaPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {ALGERIA_WILAYAS.map((w) => (
                <SelectItem key={w.code} value={w.code}>
                  {w.code} — {w.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.wilaya && (
            <p className="text-sm text-destructive">{mapError(errors.wilaya)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>{t.booking.location}</Label>
          <Input
            value={data.location ?? ""}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder={t.booking.locationPlaceholder}
            aria-invalid={Boolean(errors?.location)}
          />
          {errors?.location && (
            <p className="text-sm text-destructive">{mapError(errors.location)}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t.booking.projectTypeLabel}</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PROJECT_TYPES.map((type) => {
            const Icon = PROJECT_ICONS[type];
            const selected = data.projectType === type;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={selected}
                className={bookingChoiceClass(
                  selected,
                  "flex flex-col items-center gap-2 rounded-lg p-3 text-center min-h-11",
                )}
                onClick={() => onChange({ projectType: type })}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{t.booking.projectTypes[type]}</span>
              </button>
            );
          })}
        </div>
        {errors?.projectType && (
          <p className="text-sm text-destructive">{mapError(errors.projectType)}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>
            {t.booking.descriptionLabel}{" "}
            <span className="font-normal text-muted-foreground">({t.booking.optional})</span>
          </Label>
          <span className="text-xs text-muted-foreground">
            {t.booking.charCount.replace("{count}", String(description.length))}
          </span>
        </div>
        <Textarea
          value={description}
          onChange={(e) => onChange({ projectDescription: e.target.value })}
          rows={4}
          maxLength={500}
          placeholder="Décrivez votre projet…"
          aria-invalid={Boolean(errors?.projectDescription)}
        />
        {errors?.projectDescription && (
          <p className="text-sm text-destructive">
            {mapError(errors.projectDescription)}
          </p>
        )}
      </div>

      <div className="space-y-3 rounded-xl border border-ink/10 bg-ink/[0.02] p-4">
        <p className="text-sm font-medium">{t.booking.uploads.title}</p>
        <div className="flex flex-wrap gap-2">
          {UPLOAD_KINDS.map((kind) => (
            <button
              key={kind}
              type="button"
              className={bookingChoiceClass(
                uploadKind === kind,
                "rounded-full px-3 py-1.5 text-xs min-h-9",
              )}
              onClick={() => setUploadKind(kind)}
            >
              {t.booking.uploads[kind]}
            </button>
          ))}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*,application/pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file, uploadKind);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          disabled={uploading !== null}
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-ink/20 py-3 text-sm text-muted-foreground transition hover:border-ruby/40 hover:text-foreground"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.booking.uploads.uploading}
            </>
          ) : (
            t.booking.uploads.add
          )}
        </button>
        {(data.uploadedFiles ?? []).length > 0 && (
          <ul className="space-y-1 text-xs text-muted-foreground">
            {data.uploadedFiles!.map((f) => (
              <li key={f.url}>
                {t.booking.uploads[f.kind]} — {f.name}
              </li>
            ))}
          </ul>
        )}
        {errors?.uploadedFiles && (
          <p className="text-sm text-destructive">{mapError(errors.uploadedFiles)}</p>
        )}
      </div>
    </div>
  );
}
