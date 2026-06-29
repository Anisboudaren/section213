"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

import { RevealInView } from "./RevealInView";
import { SectionIndex } from "./SectionIndex";
import { ProblemPhoneReels } from "./ProblemPhoneReels";

export function Problem() {
  const { translations: t } = useLanguage();
  const p = t.homeV2.problem;

  return (
    <section id="problem" className="overflow-hidden bg-ink px-4 py-16 text-white sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <RevealInView>
            <SectionIndex index={p.index} />
            <h2 className="font-display text-3xl leading-tight sm:text-5xl md:text-6xl">
              {p.title} <span className="text-ruby">{p.titleHighlight}</span>
            </h2>
            <p className="mt-4 text-sm text-white/70 sm:text-base">{p.subtitle}</p>

            <div className="mt-8 space-y-2 text-sm leading-relaxed text-white/75 sm:text-base">
              {p.paragraphs.map((line) => (
                <p
                  key={line}
                  className={
                    line.startsWith("«") || line.startsWith("\"")
                      ? "font-display text-lg text-white sm:text-xl"
                      : undefined
                  }
                >
                  {line}
                </p>
              ))}
            </div>

            <div className="mt-8 border-l-2 border-ruby/60 pl-4">
              <p className="text-sm text-white/60">{p.closingBefore}</p>
              <p className="mt-1 font-display text-lg text-ruby sm:text-xl">{p.closingHighlight}</p>
            </div>
          </RevealInView>

          <RevealInView className="lg:delay-100">
            <ProblemPhoneReels channels={p.channels} />
          </RevealInView>
        </div>
      </div>
    </section>
  );
}
