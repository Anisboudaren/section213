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
  const count = data.projectDescription?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {PROJECT_TYPES.map((type) => {
          const Icon = PROJECT_ICONS[type];
          const selected = data.projectType === type;
          return (
            <button
              key={type}
              type="button"
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-4 text-center min-h-11 transition-colors",
                selected
                  ? "border-brand-accent bg-brand-accent/5"
                  : "border-border hover:border-brand-accent/40",
              )}
              onClick={() => onChange({ projectType: type })}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{t.booking.projectTypes[type]}</span>
            </button>
          );
        })}
      </div>
      {errors?.projectType && (
        <p className="text-sm text-destructive">{t.booking.validation.required}</p>
      )}

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Description du projet</Label>
          <span className="text-xs text-muted-foreground">
            {t.booking.charCount.replace("{count}", String(count))}
          </span>
        </div>
        <Textarea
          value={data.projectDescription ?? ""}
          onChange={(e) => onChange({ projectDescription: e.target.value })}
          rows={5}
          maxLength={500}
          placeholder="Décrivez votre projet…"
        />
        {errors?.projectDescription && (
          <p className="text-sm text-destructive">
            {t.booking.validation[errors.projectDescription as keyof typeof t.booking.validation]}
          </p>
        )}
      </div>
    </div>
  );
}
