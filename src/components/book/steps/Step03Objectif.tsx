"use client";

import { bookingChoiceClass } from "@/components/book/selection-styles";
import type { BookingFormData } from "@/lib/booking-types";
import { OBJECTIVE_TYPES } from "@/lib/booking-types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type StepProps = {
  data: Partial<BookingFormData>;
  onChange: (patch: Partial<BookingFormData>) => void;
  errors?: Record<string, string>;
};

export function Step03Objectif({ data, onChange, errors }: StepProps) {
  const { translations: t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        {OBJECTIVE_TYPES.map((obj) => (
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
    </div>
  );
}
