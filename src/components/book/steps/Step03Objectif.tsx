"use client";

import { bookingChoiceClass } from "@/components/book/selection-styles";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { BookingFormData } from "@/lib/booking-types";

type StepProps = {
  data: Partial<BookingFormData>;
  onChange: (patch: Partial<BookingFormData>) => void;
  errors?: Record<string, string>;
};

export function Step03Objectif({ data, onChange, errors }: StepProps) {
  const { translations: t } = useLanguage();

  const objectives = [
    "notoriete",
    "conversion",
    "engagement",
    "confiance",
    "autre",
  ] as const;

  const budgets = [
    "under_50k",
    "50k_150k",
    "150k_300k",
    "over_300k",
    "flexible",
  ] as const;

  return (
    <div className="space-y-8">
      <div className="grid gap-2 sm:grid-cols-2">
        {objectives.map((obj) => (
          <button
            key={obj}
            type="button"
            aria-pressed={data.objective === obj}
            className={bookingChoiceClass(
              data.objective === obj,
              "rounded-lg p-4 text-left min-h-11",
            )}
            onClick={() => onChange({ objective: obj })}
          >
            {t.booking.objectives[obj]}
          </button>
        ))}
      </div>
      {errors?.objective && (
        <p className="text-sm text-destructive">{t.booking.validation.required}</p>
      )}

      <div className="space-y-2">
        <Label>Budget estimé</Label>
        <div className="flex flex-wrap gap-2">
          {budgets.map((b) => (
            <button
              key={b}
              type="button"
              aria-pressed={data.budgetRange === b}
              className={bookingChoiceClass(
                data.budgetRange === b,
                "rounded-full px-3 py-2 text-xs sm:text-sm min-h-11",
              )}
              onClick={() => onChange({ budgetRange: b })}
            >
              {t.booking.budgetRanges[b]}
            </button>
          ))}
        </div>
        {errors?.budgetRange && (
          <p className="text-sm text-destructive">{t.booking.validation.required}</p>
        )}
      </div>
    </div>
  );
}
