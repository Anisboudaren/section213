"use client";

import { ChevronRight, Clapperboard, Code2, Megaphone, Workflow } from "lucide-react";

import { handleSmoothScroll } from "@/lib/smooth-scroll";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

import { RevealInView } from "./RevealInView";
import { SectionIndex } from "./SectionIndex";

const ICONS = [Clapperboard, Megaphone, Code2, Workflow];

export function Solutions() {
  const { translations: t } = useLanguage();
  const s = t.homeV2.solutions;

  return (
    <section id="listing" className="bg-mist bg-dot-grid px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <RevealInView>
          <SectionIndex index={s.index} />
          <h2 className="font-display text-3xl leading-tight text-ink sm:text-5xl md:text-6xl">
            {s.title} <span className="text-ruby">{s.titleHighlight}</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">{s.subtitle}</p>
        </RevealInView>

        <div className="mt-10 space-y-3 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
          {s.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <RevealInView key={item.title} className={i % 2 === 1 ? "sm:delay-100" : undefined}>
                <article className="flex gap-4 rounded-xl border border-ink/10 bg-paper p-5 shadow-sm transition hover:border-ink/30">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink/8">
                    <Icon className="h-5 w-5 text-ink" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg tracking-wider text-ink">{item.title.toUpperCase()}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </div>
                </article>
              </RevealInView>
            );
          })}
        </div>

        <RevealInView className="mt-10 text-center sm:mt-12">
          <a
            href="#services"
            onClick={(e) => handleSmoothScroll(e, "services")}
            className="bg-brand-accent inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition hover:brightness-110"
          >
            {s.cta} <ChevronRight className="h-4 w-4" />
          </a>
        </RevealInView>
      </div>
    </section>
  );
}
