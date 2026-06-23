"use client";

import {
  Bot,
  Camera,
  Clapperboard,
  Globe,
  Layers,
  Palette,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { bookingChoiceClass } from "@/components/book/selection-styles";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { BookingFormData, ProjectType } from "@/lib/booking-types";
import { cn } from "@/lib/utils";

const PROJECT_ICONS: Record<ProjectType, LucideIcon> = {
  shooting_video: Video,
  shooting_photo: Camera,
  reels_content: Clapperboard,
  website: Globe,
  brand_identity: Palette,
  automation: Bot,
  full_package: Layers,
  other: Layers,
};

const PROJECT_TYPES: ProjectType[] = [
  "shooting_video",
  "shooting_photo",
  "reels_content",
  "website",
  "brand_identity",
  "automation",
  "full_package",
  "other",
];

type StepProps = {
  data: Partial<BookingFormData>;
  onChange: (patch: Partial<BookingFormData>) => void;
  errors?: Record<string, string>;
};

export function Step02Projet({ data, onChange, errors }: StepProps) {
  const { translations: t } = useLanguage();
  const description = data.projectDescription ?? "";
  const count = description.trim().length;
  const selectedTypes = data.projectTypes ?? [];
  const charsRemaining = Math.max(0, 10 - count);

  const mapError = (key?: string) => {
    if (!key) return null;
    return t.booking.validation[key as keyof typeof t.booking.validation] ?? key;
  };

  const toggleProjectType = (type: ProjectType) => {
    const next = selectedTypes.includes(type)
      ? selectedTypes.filter((item) => item !== type)
      : [...selectedTypes, type];
    onChange({ projectTypes: next });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{t.booking.projectMultiHint}</p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {PROJECT_TYPES.map((type) => {
          const Icon = PROJECT_ICONS[type];
          const selected = selectedTypes.includes(type);
          return (
            <button
              key={type}
              type="button"
              aria-pressed={selected}
              className={bookingChoiceClass(
                selected,
                "flex flex-col items-center gap-2 rounded-lg p-4 text-center min-h-11",
              )}
              onClick={() => toggleProjectType(type)}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{t.booking.projectTypes[type]}</span>
            </button>
          );
        })}
      </div>
      {errors?.projectTypes && (
        <p className="text-sm text-destructive">{mapError(errors.projectTypes)}</p>
      )}

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Description du projet</Label>
          <span
            className={cn(
              "text-xs",
              count < 10 ? "text-muted-foreground" : "text-ruby",
            )}
          >
            {t.booking.charCount.replace("{count}", String(description.length))}
          </span>
        </div>
        <Textarea
          value={description}
          onChange={(e) => onChange({ projectDescription: e.target.value })}
          rows={5}
          maxLength={500}
          placeholder="Décrivez votre projet…"
          aria-invalid={Boolean(errors?.projectDescription)}
        />
        {charsRemaining > 0 && !errors?.projectDescription && (
          <p className="text-xs text-muted-foreground">
            {t.booking.descriptionRemaining.replace("{count}", String(charsRemaining))}
          </p>
        )}
        {errors?.projectDescription && (
          <p className="text-sm text-destructive">
            {mapError(errors.projectDescription)}
          </p>
        )}
      </div>
    </div>
  );
}
