"use client";

import { useCallback, useState } from "react";

import { BookingNav } from "@/components/book/BookingNav";
import { BookingProgress } from "@/components/book/BookingProgress";
import { Step01Date } from "@/components/book/steps/Step01Date";
import { Step02Projet } from "@/components/book/steps/Step02Projet";
import { Step03Objectif } from "@/components/book/steps/Step03Objectif";
import { Step04Offre } from "@/components/book/steps/Step04Offre";
import { Step05Reservation } from "@/components/book/steps/Step05Reservation";
import { Step06Confirmation } from "@/components/book/steps/Step06Confirmation";
import { Card, CardContent } from "@/components/ui/card";
import { validateBookingStep } from "@/lib/booking-schema";
import type { BookingFormData } from "@/lib/booking-types";
import { cn } from "@/lib/utils";

const INITIAL_DATA: Partial<BookingFormData> = {
  isFlexible: false,
  preferredDate: "",
  projectTypes: [],
  projectDescription: "",
};

export function BookingWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<BookingFormData>>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step5Valid, setStep5Valid] = useState(false);
  const [fade, setFade] = useState(true);

  const updateData = useCallback((patch: Partial<BookingFormData>) => {
    setData((prev) => ({ ...prev, ...patch }));
    setErrors({});
  }, []);

  const validateStep = useCallback(
    (stepNum: number): boolean => {
      const { success, errors: fieldErrors } = validateBookingStep(stepNum, data);
      if (!success) {
        setErrors(fieldErrors);
        return false;
      }
      setErrors({});
      return true;
    },
    [data],
  );

  const goNext = () => {
    if (step === 5 && !step5Valid) {
      validateStep(5);
      return;
    }
    if (step < 6 && !validateStep(step)) return;
    setFade(false);
    setTimeout(() => {
      setStep((s) => Math.min(s + 1, 6));
      setFade(true);
    }, 150);
  };

  const goPrevious = () => {
    setFade(false);
    setTimeout(() => {
      setStep((s) => Math.max(s - 1, 1));
      setFade(true);
    }, 150);
  };

  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col md:min-h-0">
      <BookingProgress currentStep={step} />

      <Card className="mt-6 flex flex-1 flex-col border-border/60 shadow-sm md:mx-auto md:max-w-[560px] md:w-full">
        <CardContent
          className={cn(
            "flex flex-1 flex-col p-6 transition-opacity duration-150 md:p-8",
            fade ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="flex-1 overflow-y-auto">
            {step === 1 && (
              <Step01Date data={data} onChange={updateData} errors={errors} />
            )}
            {step === 2 && (
              <Step02Projet data={data} onChange={updateData} errors={errors} />
            )}
            {step === 3 && (
              <Step03Objectif data={data} onChange={updateData} errors={errors} />
            )}
            {step === 4 && (
              <Step04Offre data={data} onChange={updateData} errors={errors} />
            )}
            {step === 5 && (
              <Step05Reservation
                data={data}
                onChange={updateData}
                onValidityChange={setStep5Valid}
              />
            )}
            {step === 6 && <Step06Confirmation data={data} />}
          </div>

          {step < 6 && (
            <BookingNav
              currentStep={step}
              onNext={goNext}
              onPrevious={goPrevious}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
