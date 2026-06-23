"use client";

import { addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";

import { bookingChoiceClass } from "@/components/book/selection-styles";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { BookingFormData } from "@/lib/booking-types";

type StepProps = {
  data: Partial<BookingFormData>;
  onChange: (patch: Partial<BookingFormData>) => void;
  errors?: Record<string, string>;
};

export function Step01Date({ data, onChange, errors }: StepProps) {
  const { translations: t, locale } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const minDate = useMemo(() => (mounted ? addDays(new Date(), 2) : null), [mounted]);

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
          {mounted && minDate ? (
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
          ) : (
            <div
              className="mx-auto h-[320px] max-w-sm animate-pulse rounded-lg border bg-muted/40"
              aria-hidden
            />
          )}
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
              aria-pressed={data.preferredTime === slot}
              className={bookingChoiceClass(
                data.preferredTime === slot,
                "rounded-full px-4 py-2 text-sm min-h-11",
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
