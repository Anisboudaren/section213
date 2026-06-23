"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminStore } from "@/lib/admin-store";
import type { BookingFormData } from "@/lib/booking-types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { trackMetaLead, trackTikTokSubmit } from "@/lib/pixel-events";

type StepProps = {
  data: Partial<BookingFormData>;
};

export function Step06Confirmation({ data }: StepProps) {
  const { translations: t, locale } = useLanguage();
  const { addLead, getOfferById } = useAdminStore();
  const submitted = useRef(false);

  const offer = data.selectedOfferId ? getOfferById(data.selectedOfferId) : undefined;

  useEffect(() => {
    if (submitted.current) return;
    if (!data.firstName || !data.lastName || !data.email || !data.phone) return;

    submitted.current = true;

    addLead({
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      email: data.email,
      company: data.company,
      source: "website",
      interestedIn: data.selectedOfferId ? [data.selectedOfferId] : [],
      stage: "new",
      notes: `[Booking] ${data.projectType} | ${data.objective} | Budget: ${data.budgetRange}\n${data.projectDescription}\n\nClient notes: ${data.notes ?? ""}`,
      createdAt: new Date().toISOString(),
      pixelEventFired: "Lead",
    });

    trackMetaLead();
    trackTikTokSubmit();
  }, [data, addLead]);

  const dateLabel = data.isFlexible
    ? t.booking.flexibleDate
    : data.preferredDate
      ? format(new Date(data.preferredDate), "PPP", {
          locale: locale === "fr" ? fr : undefined,
        })
      : "—";

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <CheckCircle2 className="h-16 w-16 text-brand-accent" />
      <div>
        <h2 className="font-display text-2xl tracking-wide">{t.booking.confirmation.title}</h2>
        <p className="mt-2 text-muted-foreground">{t.booking.confirmation.message}</p>
      </div>

      <Card className="w-full text-left">
        <CardContent className="space-y-3 p-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{t.booking.summary.date}</span>
            <span className="font-medium">{dateLabel}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{t.booking.summary.project}</span>
            <span className="font-medium">
              {data.projectType ? t.booking.projectTypes[data.projectType] : "—"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{t.booking.summary.offer}</span>
            <span className="font-medium">{offer?.nameFr ?? offer?.name ?? "—"}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{t.booking.summary.contact}</span>
            <span className="font-medium">
              {data.firstName} {data.lastName} · {data.email}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
        <Button asChild variant="ruby" className="min-h-11">
          <Link href="/">{t.booking.confirmation.home}</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/#case-studies">{t.booking.confirmation.portfolio}</Link>
        </Button>
      </div>
    </div>
  );
}
