"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { BookingNav } from "@/components/book/BookingNav";
import { BookingProgress } from "@/components/book/BookingProgress";
import { Step01Date } from "@/components/book/steps/Step01Date";
import { Step02Projet } from "@/components/book/steps/Step02Projet";
import { Step03Objectif } from "@/components/book/steps/Step03Objectif";
import { Step04Offre } from "@/components/book/steps/Step04Offre";
import { Step05Recap } from "@/components/book/steps/Step05Recap";
import { Step06Confirmation } from "@/components/book/steps/Step06Confirmation";
import { Card, CardContent } from "@/components/ui/card";
import { getOrCreateBookingSessionId } from "@/lib/booking/booking-session";
import { useAbandonedBookingCapture } from "@/lib/booking/use-abandoned-booking-capture";
import { validateBookingStep } from "@/lib/booking-schema";
import type { BookingFormData } from "@/lib/booking-types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { OfferAlaCarteView, OfferPackView } from "@/lib/offers/offer-types";
import { trackInitiateCheckout, trackOfferView } from "@/lib/pixel-events";
import { cn } from "@/lib/utils";

const INITIAL_DATA: Partial<BookingFormData> = {
  isFlexible: false,
  preferredDate: "",
  projectName: "",
  wilaya: "",
  location: "",
  projectDescription: "",
  uploadedFiles: [],
  selectedPackId: "",
  alaCarteOptions: [],
  depositChoice: "no_deposit",
};

type BookingWizardProps = {
  packs: OfferPackView[];
  alaCarte: OfferAlaCarteView[];
};

export function BookingWizard({ packs, alaCarte }: BookingWizardProps) {
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const initialPackId = searchParams.get("pack") ?? undefined;

  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<BookingFormData>>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fade, setFade] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    const sessionId = getOrCreateBookingSessionId();
    setData((prev) => (prev.bookingSessionId ? prev : { ...prev, bookingSessionId: sessionId }));
    trackInitiateCheckout("booking");
  }, []);

  useEffect(() => {
    if (step === 4) {
      trackOfferView("booking_offers", data.selectedPackId || initialPackId);
    }
  }, [step, data.selectedPackId, initialPackId]);

  useAbandonedBookingCapture({
    step,
    data,
    packs,
    alaCarte,
    locale,
    submittedRef,
    onAbandonedSaved: (id) => {
      setData((prev) => ({ ...prev, abandonedLeadId: id }));
    },
  });

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
    if (step >= 5) return;
    if (!validateStep(step)) return;
    setFade(false);
    setTimeout(() => {
      setStep((s) => s + 1);
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

  if (confirmed) {
    return (
      <div className="flex min-h-[calc(100svh-4rem)] flex-col md:min-h-0">
        <Card className="mt-6 flex flex-1 flex-col border-border/60 shadow-sm md:mx-auto md:max-w-[560px] md:w-full">
          <CardContent className="flex flex-1 flex-col p-6 md:p-8">
            <Step06Confirmation data={data} packs={packs} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col md:min-h-0">
      <BookingProgress currentStep={step} totalSteps={5} />

      <Card className="mt-6 flex flex-1 flex-col border-border/60 shadow-sm md:mx-auto md:max-w-[560px] md:w-full">
        <CardContent
          className={cn(
            "flex min-w-0 flex-1 flex-col p-6 transition-opacity duration-150 md:p-8",
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
              <Step04Offre
                data={data}
                onChange={updateData}
                errors={errors}
                initialPackId={initialPackId}
                packs={packs}
                alaCarte={alaCarte}
              />
            )}
            {step === 5 && (
              <Step05Recap
                data={data}
                onChange={updateData}
                errors={errors}
                onSubmitSuccess={() => setConfirmed(true)}
                onSubmitStart={() => {
                  submittedRef.current = true;
                }}
                packs={packs}
                alaCarte={alaCarte}
              />
            )}
          </div>

          {step < 5 && (
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
