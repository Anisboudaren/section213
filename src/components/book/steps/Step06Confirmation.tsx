"use client";

import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BookingFormData } from "@/lib/booking-types";
import { getWilayaName } from "@/lib/algeria-wilayas";
import { findPackView, type OfferPackView } from "@/lib/offers/offer-types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type StepProps = {
  data: Partial<BookingFormData>;
  packs: OfferPackView[];
};

export function Step06Confirmation({ data, packs }: StepProps) {
  const { translations: t, locale } = useLanguage();
  const isFr = locale === "fr";

  const pack = findPackView(packs, data.selectedPackId || undefined);

  const dateLabel = data.isFlexible
    ? t.booking.flexibleDate
    : data.preferredDate
      ? format(new Date(data.preferredDate), "PPP", {
          locale: locale === "fr" ? fr : undefined,
        })
      : "—";

  const depositLabel =
    data.depositChoice === "deposit_50"
      ? t.booking.deposit.optionB
      : t.booking.deposit.optionA;

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
          {data.projectName && (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">{t.booking.summary.projectName}</span>
              <span className="font-medium text-right">{data.projectName}</span>
            </div>
          )}
          {data.wilaya && (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">{t.booking.summary.wilaya}</span>
              <span className="font-medium">{getWilayaName(data.wilaya)}</span>
            </div>
          )}
          {data.projectType && (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">{t.booking.summary.project}</span>
              <span className="font-medium">{t.booking.projectTypes[data.projectType]}</span>
            </div>
          )}
          {data.objective && (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">{t.booking.summary.objective}</span>
              <span className="font-medium">{t.booking.objectives[data.objective]}</span>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{t.booking.summary.offer}</span>
            <span className="font-medium">
              {pack ? (isFr ? pack.nameFr : pack.nameEn) : "—"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{t.booking.summary.deposit}</span>
            <span className="font-medium">{depositLabel}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">{t.booking.summary.contact}</span>
            <span className="font-medium text-right">
              {data.fullName}
              {data.phone ? ` · ${data.phone}` : ""}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
        <Button asChild variant="ruby" className="min-h-11">
          <Link href="/">{t.booking.confirmation.home}</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/#portfolio">{t.booking.confirmation.portfolio}</Link>
        </Button>
      </div>
    </div>
  );
}
