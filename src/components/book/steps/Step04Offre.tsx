"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";

import { bookingChoiceClass } from "@/components/book/selection-styles";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { BookingFormData } from "@/lib/booking-types";
import {
  formatPriceFrom,
  type OfferAlaCarteView,
  type OfferPackView,
} from "@/lib/offers/offer-types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

type StepProps = {
  data: Partial<BookingFormData>;
  onChange: (patch: Partial<BookingFormData>) => void;
  errors?: Record<string, string>;
  initialPackId?: string;
  packs: OfferPackView[];
  alaCarte: OfferAlaCarteView[];
};

export function Step04Offre({
  data,
  onChange,
  errors,
  initialPackId,
  packs,
  alaCarte,
}: StepProps) {
  const { locale, translations: t } = useLanguage();
  const isFr = locale === "fr";
  const selected = data.selectedPackId;
  const alaCarteSelected = data.alaCarteOptions ?? [];

  useEffect(() => {
    if (!selected && initialPackId) {
      const pack = packs.find((p) => p.slug === initialPackId || p.id === initialPackId);
      if (pack) onChange({ selectedPackId: pack.slug });
    }
  }, [initialPackId, selected, onChange, packs]);

  const toggleAlaCarte = (slug: string) => {
    const next = alaCarteSelected.includes(slug)
      ? alaCarteSelected.filter((item) => item !== slug)
      : [...alaCarteSelected, slug];
    onChange({ alaCarteOptions: next });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {packs.map((pack) => {
          const isSelected = selected === pack.slug;
          const name = isFr ? pack.nameFr : pack.nameEn;
          const tagline = isFr ? pack.taglineFr : pack.taglineEn;
          const priceLine = pack.studyOnly
            ? isFr
              ? pack.priceLabelFr
              : pack.priceLabelEn
            : pack.priceFrom
              ? formatPriceFrom(pack.priceFrom, locale)
              : null;

          return (
            <button
              key={pack.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange({ selectedPackId: pack.slug })}
              className={cn(
                bookingChoiceClass(isSelected, "w-full min-w-0 rounded-xl p-4 text-left"),
                pack.recommended && "ring-1 ring-ruby/30",
              )}
            >
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg tracking-wider">{name}</span>
                    {pack.recommended && (
                      <span className="rounded-full bg-brand-accent px-2 py-0.5 text-[10px] font-semibold text-ruby-foreground">
                        {t.booking.recommended}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{tagline}</p>
                </div>
                {priceLine && (
                  <span className="shrink-0 self-start text-sm font-bold tabular-nums sm:text-right">
                    {priceLine}
                  </span>
                )}
              </div>
              {isSelected && (
                <ul className="mt-3 space-y-1 border-t border-ink/10 pt-3">
                  {(isFr ? pack.featuresFr : pack.featuresEn).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ruby" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </button>
          );
        })}
      </div>
      {errors?.selectedPackId && (
        <p className="text-center text-sm text-destructive">{t.booking.validation.required}</p>
      )}

      {alaCarte.length > 0 && (
        <div className="space-y-3 rounded-xl border border-ink/10 bg-ink/[0.02] p-4">
          <p className="text-sm font-medium">{t.booking.alaCarteTitle}</p>
          <div className="space-y-2">
            {alaCarte.map((item) => (
              <div key={item.id} className="flex min-w-0 items-center gap-2">
                <Checkbox
                  id={`ala-${item.slug}`}
                  checked={alaCarteSelected.includes(item.slug)}
                  onCheckedChange={() => toggleAlaCarte(item.slug)}
                />
                <Label
                  htmlFor={`ala-${item.slug}`}
                  className="flex min-w-0 flex-1 cursor-pointer items-start justify-between gap-3 text-sm font-normal"
                >
                  <span className="min-w-0">{isFr ? item.nameFr : item.nameEn}</span>
                  <span className="shrink-0 text-muted-foreground tabular-nums">
                    {isFr ? item.priceFr : item.priceEn}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
