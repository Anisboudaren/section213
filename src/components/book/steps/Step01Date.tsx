"use client";

import { addDays } from "date-fns";
import { fr } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { BookingFormData } from "@/lib/booking-types";
import { cn } from "@/lib/utils";

type StepProps = {
  data: Partial<BookingFormData>;
  onChange: (patch: Partial<BookingFormData>) => void;
  errors?: Record<string, string>;
};

export function Step01Date({ data, onChange, errors }: StepProps) {
  const { translations: t, locale } = useLanguage();
  const minDate = addDays(new Date(), 2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <Label htmlFor="flexible">{t.booking.flexibleDate}</Label>
        <Switch
          id="flexible"
          checked={data.isFlexible ?? false}
          onCheckedChange={(isFlexible) => onChange({ isFlexible })}
        />
      </div>

      {!data.isFlexible && (
        <div>
          <Calendar
            mode="single"
            selected={data.preferredDate ? new Date(data.preferredDate) : undefined}
            onSelect={(date) =>
              onChange({ preferredDate: date ? date.toISOString() : "" })
            }
            disabled={(date) => date < minDate}
            locale={locale === "fr" ? fr : undefined}
            className="mx-auto rounded-lg border"
          />
          {errors?.preferredDate && (
            <p className="mt-2 text-sm text-destructive">
              {t.booking.validation[errors.preferredDate as keyof typeof t.booking.validation] ??
                errors.preferredDate}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label>Créneau préféré</Label>
        <div className="flex flex-wrap gap-2">
          {(["matin", "apres_midi", "flexible"] as const).map((slot) => (
            <button
              key={slot}
              type="button"
              className={cn(
                "rounded-full border px-4 py-2 text-sm min-h-11 transition-colors",
                data.preferredTime === slot
                  ? "border-brand-accent bg-brand-accent/10 text-ink"
                  : "border-border hover:border-brand-accent/50",
              )}
              onClick={() => onChange({ preferredTime: slot })}
            >
              {t.booking.timeSlots[slot]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
