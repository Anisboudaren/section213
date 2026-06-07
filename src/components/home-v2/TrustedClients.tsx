"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

import { RevealInView } from "./RevealInView";
import { SectionIndex } from "./SectionIndex";

export function TrustedClients() {
  const { translations: t } = useLanguage();
  const c = t.homeV2.trusted;

  return (
    <section className="border-t border-white/5 bg-ink px-4 py-16 text-white sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <RevealInView>
          <SectionIndex index={c.index} />
          <h2 className="font-display text-3xl leading-tight sm:text-5xl">
            {c.title} <span className="text-ruby">{c.titleHighlight}</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/60 sm:text-base">{c.subtitle}</p>
        </RevealInView>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {c.clients.map((client, i) => (
            <RevealInView
              key={client.name}
              className={i % 2 === 1 ? "sm:delay-100" : undefined}
            >
              <div className="flex min-h-[5.5rem] flex-col justify-between rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/25 hover:bg-white/[0.06]">
                <p className="font-display text-sm tracking-wider sm:text-base">{client.name.toUpperCase()}</p>
                <p className="mt-2 text-[11px] uppercase tracking-wider text-white/45">{client.tag}</p>
              </div>
            </RevealInView>
          ))}
        </div>
      </div>
    </section>
  );
}
