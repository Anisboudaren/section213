"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type BookingNavProps = {
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep?: boolean;
};

export function BookingNav({
  currentStep,
  onNext,
  onPrevious,
  isLastStep,
}: BookingNavProps) {
  const { translations: t } = useLanguage();

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-6">
      {currentStep === 1 ? (
        <Link
          href="/"
          className="min-h-11 inline-flex items-center text-sm text-muted-foreground hover:text-brand-accent"
        >
          {t.booking.previous}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onPrevious}
          className="min-h-11 text-sm text-muted-foreground hover:text-brand-accent"
        >
          {t.booking.previous}
        </button>
      )}
      {!isLastStep && (
        <Button
          type="button"
          variant="ruby"
          className="min-h-11 px-8"
          onClick={onNext}
        >
          {t.booking.next}
        </Button>
      )}
    </div>
  );
}
