"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, ChevronRight } from "lucide-react";

import {
  formatPriceFrom,
  type OfferAlaCarteView,
  type OfferPackView,
} from "@/lib/offers/offer-types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

import { RevealInView } from "./RevealInView";
import { SectionIndex } from "./SectionIndex";

type OffersProps = {
  packs: OfferPackView[];
  alaCarte: OfferAlaCarteView[];
};

function PackCard({
  pack,
  expanded,
  onToggle,
}: {
  pack: OfferPackView;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { locale, translations: t } = useLanguage();
  const o = t.homeV2.offers;
  const isFr = locale === "fr";
  const name = isFr ? pack.nameFr : pack.nameEn;
  const tagline = isFr ? pack.taglineFr : pack.taglineEn;
  const features = isFr ? pack.featuresFr : pack.featuresEn;
  const cta = isFr ? pack.ctaFr : pack.ctaEn;
  const note = isFr ? pack.noteFr : pack.noteEn;
  const valueBreakdown = isFr ? pack.valueBreakdownFr : pack.valueBreakdownEn;
  const totalValue = isFr ? pack.totalValueFr : pack.totalValueEn;

  const priceLine = pack.studyOnly
    ? isFr
      ? pack.priceLabelFr
      : pack.priceLabelEn
    : pack.priceFrom
      ? `${o.priceFrom} ${formatPriceFrom(pack.priceFrom, locale)}`
      : null;

  return (
    <article
      className={cn(
        "relative rounded-xl border p-6 transition",
        pack.recommended
          ? "border-ruby/40 bg-white/5 ring-1 ring-ruby/25"
          : "border-white/10 bg-white/[0.03] hover:border-white/25",
      )}
    >
      {pack.recommended && (
        <span className="absolute -top-3 right-4 rounded-full bg-brand-accent px-3 py-1 text-xs font-semibold text-ruby-foreground">
          {t.booking.recommended}
        </span>
      )}

      <h3 className="font-display text-2xl tracking-wider">{name}</h3>
      <p className="mt-2 text-sm text-white/65">{tagline}</p>
      <p className="mt-4 text-2xl font-bold text-white">{priceLine}</p>

      <Link
        href={`/book?pack=${pack.slug}`}
        className={cn(
          "mt-5 flex w-full items-center justify-center gap-1 rounded-md py-2.5 text-sm font-semibold transition",
          pack.recommended
            ? "bg-brand-accent text-ruby-foreground hover:brightness-110"
            : "bg-white/10 hover:bg-white/20",
        )}
      >
        {cta} <ChevronRight className="h-4 w-4" />
      </Link>

      <button
        type="button"
        onClick={onToggle}
        className="mt-4 flex w-full items-center justify-center gap-1 border-t border-white/10 pt-4 text-xs font-medium text-white/50 transition hover:text-white/80"
        aria-expanded={expanded}
      >
        {expanded ? o.hideDetails : o.seeDetails}
        <ChevronDown className={cn("h-4 w-4 transition", expanded && "rotate-180")} />
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          expanded ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <ul className="space-y-2 text-sm">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-white/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {f}
              </li>
            ))}
          </ul>

          {valueBreakdown && (
            <div className="mt-4 space-y-1 border-t border-white/10 pt-4 text-xs text-white/55">
              <p className="font-medium text-white/70">{o.cartValueTitle}</p>
              {valueBreakdown.map((row) => (
                <div key={row.label} className="flex justify-between gap-2">
                  <span>{row.label}</span>
                  <span>{row.value}</span>
                </div>
              ))}
              {totalValue && (
                <div className="flex justify-between gap-2 border-t border-white/10 pt-2 font-medium text-white/80">
                  <span>{o.totalValue}</span>
                  <span>{totalValue}</span>
                </div>
              )}
              {pack.priceFrom && (
                <div className="flex justify-between gap-2 text-ruby">
                  <span>{o.packPrice}</span>
                  <span>{formatPriceFrom(pack.priceFrom, locale)}</span>
                </div>
              )}
            </div>
          )}

          {note && <p className="mt-4 text-xs leading-relaxed text-white/55">{note}</p>}
        </div>
      </div>
    </article>
  );
}

export function Offers({ packs, alaCarte }: OffersProps) {
  const { locale, translations: t } = useLanguage();
  const o = t.homeV2.offers;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [alaCarteOpen, setAlaCarteOpen] = useState(false);

  return (
    <section id="offers" className="bg-ink px-4 py-16 text-white sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <RevealInView>
          <SectionIndex index={o.index} />
          <h2 className="font-display text-3xl leading-tight sm:text-5xl md:text-6xl">
            {o.title} <span className="text-ruby">{o.titleHighlight}</span>
          </h2>
          <p className="mt-3 max-w-lg text-sm text-white/60 sm:text-base">{o.intro}</p>
        </RevealInView>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {packs.map((pack, i) => (
            <RevealInView key={pack.id} className={i === 1 ? "md:delay-75" : undefined}>
              <PackCard
                pack={pack}
                expanded={expandedId === pack.id}
                onToggle={() => setExpandedId((cur) => (cur === pack.id ? null : pack.id))}
              />
            </RevealInView>
          ))}
        </div>

        {alaCarte.length > 0 && (
          <RevealInView className="mt-8">
            <button
              type="button"
              onClick={() => setAlaCarteOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition hover:border-white/25"
              aria-expanded={alaCarteOpen}
            >
              <span className="font-display text-lg tracking-wider">{o.alaCarteTitle}</span>
              <ChevronDown
                className={cn("h-5 w-5 text-white/50 transition", alaCarteOpen && "rotate-180")}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-300",
                alaCarteOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <ul className="divide-y divide-white/10 rounded-xl border border-white/10">
                  {alaCarte.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-4 px-5 py-3 text-sm"
                    >
                      <span className="text-white/85">
                        {locale === "fr" ? item.nameFr : item.nameEn}
                      </span>
                      <span className="shrink-0 font-medium text-white/60">
                        {locale === "fr" ? item.priceFr : item.priceEn}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealInView>
        )}

        <p className="mt-6 text-xs leading-relaxed text-white/45">{o.travelNote}</p>
      </div>
    </section>
  );
}
