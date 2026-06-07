"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

import { RevealInView } from "./RevealInView";
import { SectionIndex } from "./SectionIndex";

export function WhySection213() {
  const { translations: t } = useLanguage();
  const w = t.homeV2.why;

  return (
    <section className="border-t border-ink/5 bg-mist bg-dot-grid px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <RevealInView>
          <SectionIndex index={w.index} />
          <h2 className="font-display text-3xl leading-tight text-ink sm:text-5xl md:text-6xl">
            {w.title} <span className="text-ruby">{w.titleHighlight}</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">{w.subtitle}</p>
        </RevealInView>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2">
          {w.points.map((point, i) => (
            <RevealInView key={point.title} className={i % 2 === 1 ? "sm:delay-100" : undefined}>
              <article className="rounded-xl border border-ink/10 bg-paper p-5 shadow-sm sm:p-6">
                <span className="font-display text-sm tracking-[0.3em] text-ruby/80">0{i + 1}</span>
                <h3 className="mt-3 font-display text-xl tracking-wider text-ink">{point.title.toUpperCase()}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{point.desc}</p>
              </article>
            </RevealInView>
          ))}
        </div>
      </div>
    </section>
  );
}
