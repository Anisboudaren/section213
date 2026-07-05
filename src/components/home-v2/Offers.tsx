"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { Check, ChevronDown, ChevronRight } from "lucide-react";

import {
  formatPriceFrom,
  type OfferPackView,
} from "@/lib/offers/offer-types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

import { RevealInView } from "./RevealInView";
import { SectionIndex } from "./SectionIndex";

function maskDigits(text: string): string {
  return text.replace(/\d/g, "*");
}

function MaskedPrice({
  text,
  className,
  revealed,
}: {
  text: string;
  className?: string;
  revealed?: boolean;
}) {
  if (revealed) {
    return <span className={cn("font-display tracking-widest", className)}>{text}</span>;
  }

  const masked = maskDigits(text);

  return (
    <span
      className={cn("fun-masked-price inline-flex font-display tracking-widest", className)}
      aria-hidden
    >
      {masked.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          className={char === "*" ? "fun-masked-price-hash" : undefined}
          style={char === "*" ? ({ "--hash-i": i } as CSSProperties) : undefined}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

type OffersProps = {
  packs: OfferPackView[];
};

function PackCard({
  pack,
  expanded,
  onToggle,
  isFirst,
}: {
  pack: OfferPackView;
  expanded: boolean;
  onToggle: () => void;
  isFirst?: boolean;
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

  const priceLine = pack.studyOnly ? (
    <span>{isFr ? pack.priceLabelFr : pack.priceLabelEn}</span>
  ) : pack.priceFrom ? (
    isFirst ? (
      <span className="inline-flex flex-wrap items-baseline gap-x-2">
        <MaskedPrice
          revealed
          text={formatPriceFrom(pack.priceFrom, locale)}
          className="text-2xl font-bold text-ruby"
        />
        <span className="text-lg font-semibold text-white/70">{o.priceFrom}</span>
      </span>
    ) : (
      <MaskedPrice
        text={formatPriceFrom(pack.priceFrom, locale)}
        className="text-2xl font-bold text-ruby"
      />
    )
  ) : null;

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
      <p className="mt-4">{priceLine}</p>

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
                  <MaskedPrice text={row.value} className="text-sm text-white/55" />
                </div>
              ))}
              {totalValue && (
                <div className="flex justify-between gap-2 border-t border-white/10 pt-2 font-medium text-white/80">
                  <span>{o.totalValue}</span>
                  <MaskedPrice text={totalValue} className="text-sm text-white/80" />
                </div>
              )}
              {pack.priceFrom && (
                <div className="flex justify-between gap-2 text-ruby">
                  <span>{o.packPrice}</span>
                  <MaskedPrice
                    revealed={isFirst}
                    text={formatPriceFrom(pack.priceFrom, locale)}
                    className="text-sm text-ruby"
                  />
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

export function Offers({ packs }: OffersProps) {
  const { translations: t } = useLanguage();
  const o = t.homeV2.offers;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="offers" className="bg-ink bg-ink-texture px-4 py-16 text-white sm:px-6 sm:py-24">
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
                isFirst={i === 0}
                expanded={expandedId === pack.id}
                onToggle={() => setExpandedId((cur) => (cur === pack.id ? null : pack.id))}
              />
            </RevealInView>
          ))}
        </div>

        <p className="mt-6 text-xs leading-relaxed text-white/45">{o.travelNote}</p>
      </div>
    </section>
  );
}
