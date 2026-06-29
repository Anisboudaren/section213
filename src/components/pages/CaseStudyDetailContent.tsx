"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { CaseStudySectionsRenderer } from "@/components/case-studies/CaseStudySectionsRenderer";
import { CaseStudyVideo } from "@/components/home-v2/CaseStudyVideo";
import { Footer } from "@/components/sections/Footer";
import { Section213Logo } from "@/components/Section213Logo";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { CaseStudy } from "@/lib/types/admin";

type CaseStudyDetailContentProps = {
  study: CaseStudy;
  related: CaseStudy[];
};

export function CaseStudyDetailContent({ study, related }: CaseStudyDetailContentProps) {
  const { translations: t } = useLanguage();
  const p = t.caseStudiesPage;

  return (
    <div className="theme-marketing min-h-svh bg-ink text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {p.backToPortfolio}
          </Link>
          <Section213Logo size="sm" />
          <Link
            href="/book"
            className="hidden rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider sm:inline-flex"
          >
            {p.bookCta}
          </Link>
        </div>
      </header>

      <section className="relative min-h-[70svh] pt-16">
        <CaseStudyVideo
          src={study.videoUrl}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <div className="relative mx-auto flex min-h-[calc(70svh-4rem)] max-w-7xl flex-col justify-end px-4 pb-12 pt-24 sm:px-6 sm:pb-16">
          {study.categoryLabel && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ruby">
              {study.categoryLabel}
            </p>
          )}
          <h1 className="mt-3 max-w-4xl font-display text-4xl leading-tight tracking-wide sm:text-6xl md:text-7xl">
            {study.title.toUpperCase()}
          </h1>
          <p className="mt-4 text-lg text-white/70">{study.clientName}</p>
        </div>
      </section>

      <section className="relative z-10 px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_280px] lg:gap-16">
            <CaseStudySectionsRenderer sections={study.sections} />

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-white/45">{p.client}</p>
              <p className="mt-2 font-display text-xl">{study.clientName}</p>
              {study.industry && (
                <p className="mt-1 text-sm text-white/55">{study.industry}</p>
              )}
            </div>

            {study.services.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">{p.services}</p>
                <ul className="mt-3 space-y-2">
                  {study.services.map((service) => (
                    <li key={service} className="text-sm text-white/80">
                      · {service}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link
              href="/book"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-accent py-3.5 text-sm font-semibold text-ruby-foreground transition hover:brightness-110"
            >
              {p.bookCta}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-white/10 px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-2xl tracking-wider">
              {p.title} <span className="text-ruby">{p.titleHighlight}</span>
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/case-studies/${item.slug}`}
                  className="group relative min-h-[14rem] overflow-hidden rounded-xl border border-white/10"
                >
                  <CaseStudyVideo
                    src={item.videoUrl}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="font-display text-lg">{item.title}</p>
                    <p className="text-xs text-white/60">{item.clientName}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
