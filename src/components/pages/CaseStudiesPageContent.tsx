"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronLeft } from "lucide-react";

import { CaseStudyVideo } from "@/components/home-v2/CaseStudyVideo";
import { Footer } from "@/components/sections/Footer";
import { Section213Logo } from "@/components/Section213Logo";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { CaseStudy } from "@/lib/types/admin";
import { cn } from "@/lib/utils";

type CaseStudiesPageContentProps = {
  caseStudies: CaseStudy[];
};

function PortfolioCard({
  study,
  large,
  label,
}: {
  study: CaseStudy;
  large?: boolean;
  label: string;
}) {
  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]",
        large ? "col-span-1 row-span-2 min-h-[28rem] lg:col-span-2" : "min-h-[18rem]",
      )}
    >
      <CaseStudyVideo
        src={study.videoUrl}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 transition group-hover:via-black/50" />
      <div className="absolute inset-0 opacity-0 mix-blend-overlay transition duration-500 group-hover:opacity-100 bg-ruby/10" />

      {study.featured && (
        <span className="absolute left-4 top-4 rounded-full border border-ruby/40 bg-ruby/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
          {label}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
        {study.categoryLabel && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/55">
            {study.categoryLabel}
          </p>
        )}
        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h2
              className={cn(
                "font-display leading-tight tracking-wider text-white",
                large ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl",
              )}
            >
              {study.title.toUpperCase()}
            </h2>
            <p className="mt-1 text-sm text-white/60">{study.clientName}</p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition group-hover:border-ruby group-hover:bg-ruby/25">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CaseStudiesPageContent({ caseStudies }: CaseStudiesPageContentProps) {
  const { translations: t } = useLanguage();
  const p = t.caseStudiesPage;

  const featured = caseStudies.find((c) => c.featured) ?? caseStudies[0];
  const rest = caseStudies.filter((c) => c.id !== featured?.id);

  return (
    <div className="theme-marketing min-h-svh bg-ink text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,30,45,0.15),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjciIG51bU9jdGF2ZXM9IjQiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9Ii4zNSIvPjwvc3ZnPg==')]" />

      <header className="relative z-10 border-b border-white/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/70 transition hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            {p.backHome}
          </Link>
          <Section213Logo size="sm" />
          <Link
            href="/book"
            className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition hover:border-ruby hover:text-ruby"
          >
            {p.bookCta}
          </Link>
        </div>
      </header>

      <section className="relative z-10 px-4 pb-6 pt-14 sm:px-6 sm:pt-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-ruby">
            {p.heroIndex}
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[0.95] sm:text-7xl md:text-8xl">
            {p.title}
            <br />
            <span className="text-ruby">{p.titleHighlight}</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm text-white/60 sm:text-base">{p.subtitle}</p>
          <p className="mt-6 text-xs uppercase tracking-[0.2em] text-white/40">
            {caseStudies.length} projets
          </p>
        </div>
      </section>

      <section className="relative z-10 px-4 pb-20 sm:px-6 sm:pb-28">
        <div className="mx-auto max-w-7xl">
          {caseStudies.length === 0 ? (
            <p className="py-24 text-center text-white/50">{p.notFoundDesc}</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {featured && (
                <PortfolioCard study={featured} large label={p.featured} />
              )}
              {rest.map((study) => (
                <PortfolioCard key={study.id} study={study} label={p.featured} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative z-10 border-t border-white/10 px-4 py-16 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl tracking-wider sm:text-3xl">
              VOTRE PROJET <span className="text-ruby">SUIVANT</span>
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/60">
              Films, reels et landing pages pour vendre plus vite en renforçant la confiance.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/book"
              className="inline-flex min-h-11 items-center rounded-full bg-brand-accent px-6 text-sm font-semibold text-ruby-foreground transition hover:brightness-110"
            >
              {p.bookCta}
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-6 text-sm font-semibold transition hover:border-white/40"
            >
              {p.contactCta}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
