"use client";

import { useCallback, useEffect, useRef, type MutableRefObject } from "react";

import { buildAbandonedBookingInput } from "@/lib/booking/abandoned-payload";
import { saveAbandonedBooking } from "@/lib/actions/leads";
import type { BookingFormData } from "@/lib/booking-types";
import type { OfferAlaCarteView, OfferPackView } from "@/lib/offers/offer-types";

type UseAbandonedBookingCaptureArgs = {
  step: number;
  data: Partial<BookingFormData>;
  packs: OfferPackView[];
  alaCarte: OfferAlaCarteView[];
  locale: "fr" | "en";
  submittedRef: MutableRefObject<boolean>;
  onAbandonedSaved?: (id: string) => void;
};

export function useAbandonedBookingCapture({
  step,
  data,
  packs,
  alaCarte,
  locale,
  submittedRef,
  onAbandonedSaved,
}: UseAbandonedBookingCaptureArgs) {
  const stateRef = useRef({ step, data, packs, alaCarte, locale, onAbandonedSaved, submittedRef });
  stateRef.current = { step, data, packs, alaCarte, locale, onAbandonedSaved, submittedRef };

  const persistAbandoned = useCallback(async (useKeepalive = false) => {
    const current = stateRef.current;
    if (current.submittedRef.current || current.step !== 5) return;

    const payload = buildAbandonedBookingInput(
      current.data,
      current.packs,
      current.alaCarte,
      current.locale,
    );
    if (!payload) return;

    if (useKeepalive && typeof window !== "undefined") {
      void fetch("/api/booking/abandoned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
      return;
    }

    const result = await saveAbandonedBooking(payload);
    if (result.success && result.data.id !== current.data.abandonedLeadId) {
      current.onAbandonedSaved?.(result.data.id);
    }
  }, []);

  useEffect(() => {
    const onBeforeUnload = () => {
      void persistAbandoned(true);
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [persistAbandoned]);

  useEffect(() => {
    return () => {
      void persistAbandoned(false);
    };
  }, [persistAbandoned]);
}
