"use client";

import Image from "next/image";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { PORTFOLIO_CLIENTS } from "@/lib/portfolio-clients";
import { cn } from "@/lib/utils";

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

        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 lg:grid-cols-4">
          {PORTFOLIO_CLIENTS.map((client, i) => (
            <RevealInView
              key={client.image}
              className={i % 2 === 1 ? "sm:delay-100" : undefined}
            >
              <div className="flex min-h-[8rem] flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-white/25 hover:bg-white/[0.06] sm:min-h-[9rem]">
                <div className="relative flex h-14 w-full items-center justify-center sm:h-16">
                  <Image
                    src={client.image}
                    alt={client.name}
                    width={160}
                    height={64}
                    className={cn(
                      "max-h-14 w-auto object-contain sm:max-h-16",
                      client.whiteFilter && "brightness-0 invert",
                    )}
                  />
                </div>
                <p className="text-center font-display text-xs tracking-wider text-white/90 sm:text-sm">
                  {client.name.toUpperCase()}
                </p>
              </div>
            </RevealInView>
          ))}
        </div>
      </div>
    </section>
  );
}
