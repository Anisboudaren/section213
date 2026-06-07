"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

import { RevealInView } from "./RevealInView";
import { SectionIndex } from "./SectionIndex";

export function Method213() {
  const { translations: t } = useLanguage();
  const m = t.homeV2.method;

  return (
    <section id="about" className="bg-ink px-4 py-16 text-white sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <RevealInView>
          <SectionIndex index={m.index} />
          <h2 className="font-display text-3xl leading-tight sm:text-5xl md:text-6xl">
            {m.title} <span className="text-ruby">{m.titleHighlight}</span>
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">{m.subtitle}</p>
        </RevealInView>

        <div className="mt-10 space-y-3 sm:mt-14 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 lg:grid-cols-4">
          {m.steps.map((step, i) => (
            <RevealInView key={step.title} className="sm:[&:nth-child(2)]:delay-75 sm:[&:nth-child(3)]:delay-150 sm:[&:nth-child(4)]:delay-200">
              <article className="group border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/25 sm:p-6">
                <span className="font-display text-3xl text-white/15 transition group-hover:text-ruby/80">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-display text-lg tracking-wider sm:text-xl">{step.title.toUpperCase()}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{step.desc}</p>
              </article>
            </RevealInView>
          ))}
        </div>
      </div>
    </section>
  );
}
