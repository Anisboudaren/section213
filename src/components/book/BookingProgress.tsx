"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type BookingProgressProps = {
  currentStep: number;
  totalSteps?: number;
};

export function BookingProgress({ currentStep, totalSteps = 6 }: BookingProgressProps) {
  const { translations: t } = useLanguage();

  return (
    <div className="w-full space-y-3">
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-150",
              i < currentStep ? "bg-brand-accent" : "bg-muted",
            )}
          />
        ))}
      </div>
      <div className="flex justify-between gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
        {t.booking.steps.map((label, i) => (
          <span
            key={label}
            className={cn(
              "truncate text-center flex-1",
              i + 1 === currentStep && "text-brand-accent",
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
