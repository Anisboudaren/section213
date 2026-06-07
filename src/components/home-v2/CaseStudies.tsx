"use client";

import { ArrowUpRight } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

import { RevealInView } from "./RevealInView";
import { SectionIndex } from "./SectionIndex";

export function CaseStudies() {
  const { translations: t } = useLanguage();
  const cs = t.homeV2.caseStudies;

  return (
    <section className="bg-ink px-4 py-16 text-white sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <RevealInView>
          <SectionIndex index={cs.index} />
          <h2 className="font-display text-3xl leading-tight sm:text-5xl md:text-6xl">
            {cs.title} <span className="text-ruby">{cs.titleHighlight}</span>
          </h2>
          <p className="mt-3 max-w-lg text-sm text-white/60 sm:text-base">{cs.subtitle}</p>
        </RevealInView>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2">
          {cs.items.map((item, i) => (
            <RevealInView key={item.title} className={i % 2 === 1 ? "sm:delay-100" : undefined}>
              <article className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 sm:aspect-[16/11]">
                <video
                  className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  src={item.media}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/55">
                    {item.category}
                  </p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <h3 className="font-display text-xl leading-tight sm:text-2xl">{item.title.toUpperCase()}</h3>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition group-hover:border-ruby group-hover:bg-ruby/20">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </article>
            </RevealInView>
          ))}
        </div>
      </div>
    </section>
  );
}
