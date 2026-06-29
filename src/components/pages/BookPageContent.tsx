"use client";

import Link from "next/link";
import { Suspense } from "react";

import { BookingWizard } from "@/components/book/BookingWizard";
import { Section213Logo } from "@/components/Section213Logo";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { OfferAlaCarteView, OfferPackView } from "@/lib/offers/offer-types";

type BookPageContentProps = {
  packs: OfferPackView[];
  alaCarte: OfferAlaCarteView[];
};

function BookWizardInner({ packs, alaCarte }: BookPageContentProps) {
  return <BookingWizard packs={packs} alaCarte={alaCarte} />;
}

export function BookPageContent({ packs, alaCarte }: BookPageContentProps) {
  const { translations: t } = useLanguage();

  return (
    <div className="theme-marketing min-h-svh bg-gradient-to-b from-secondary/40 via-background to-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4 md:px-8">
          <Link href="/" className="flex items-center">
            <Section213Logo size="sm" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
        <h1 className="font-display text-2xl tracking-wide sm:text-3xl">{t.booking.title}</h1>
        <Suspense fallback={<div className="mt-6 h-96 animate-pulse rounded-xl bg-muted" />}>
          <BookWizardInner packs={packs} alaCarte={alaCarte} />
        </Suspense>
      </main>
    </div>
  );
}
