"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

import { RevealInView } from "./RevealInView";
import { SectionIndex } from "./SectionIndex";

export function BookCTA() {
  const { translations: t } = useLanguage();
  const c = t.homeV2.bookCta;

  return (
    <section id="book" className="bg-ink px-4 py-16 text-white sm:px-6 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <RevealInView>
          <SectionIndex index={c.index} />
          <h2 className="font-display text-3xl leading-tight sm:text-5xl md:text-6xl">{c.title}</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">
            {c.subtitle}
          </p>
          <Link
            href="/book"
            className="bg-brand-accent mt-8 inline-flex items-center gap-2 rounded-md px-8 py-3.5 text-sm font-semibold text-ruby-foreground transition hover:brightness-110 sm:text-base"
          >
            {c.cta}
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </RevealInView>
      </div>
    </section>
  );
}
