"use client";

import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";

import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import { Footer } from "@/components/sections/Footer";
import { Section213Logo } from "@/components/Section213Logo";
import { Skeleton } from "@/components/ui/skeleton";
import type { PublicContactInfo } from "@/lib/contact-info";
import type { OfferPackView } from "@/lib/offers/offer-types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type ContactPageContentProps = {
  contactInfo: PublicContactInfo;
  packs: OfferPackView[];
};

function ContactFormFallback() {
  return (
    <div className="space-y-4 rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

export function ContactPageContent({ contactInfo, packs }: ContactPageContentProps) {
  const { translations: t } = useLanguage();
  const c = t.contact;

  return (
    <div className="theme-marketing min-h-svh bg-ink">
      <header className="border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 transition hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            {c.backHome}
          </Link>
          <Section213Logo size="sm" />
          <span className="w-20" aria-hidden />
        </div>
      </header>

      <section className="border-b border-white/10 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            {c.title} <span className="text-ruby">{c.titleHighlight}</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-white/65 sm:text-base">{c.subtitle}</p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
          <ContactDetails info={contactInfo} />

          <div className="rounded-2xl border border-ink/10 bg-mist bg-dot-grid p-6 shadow-sm sm:p-8">
            <h2 className="font-display text-2xl tracking-wide text-ink">{c.formTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{c.formSubtitle}</p>
            <div className="mt-6">
              <Suspense fallback={<ContactFormFallback />}>
                <ContactForm embedded packs={packs} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
