"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";

import {
  offerCardBadgeClass,
  offerCardClass,
  offerCardDescriptionClass,
  offerCardFeatureClass,
} from "@/components/offers/offer-card-styles";
import { Button } from "@/components/ui/button";
import { pickLocaleField } from "@/lib/i18n/locale-field";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Offer } from "@/lib/types/admin";
import { cn } from "@/lib/utils";

type BookOfferCardProps = {
  offer: Offer;
  selected: boolean;
  onSelect: () => void;
};

export function BookOfferCard({ offer, selected, onSelect }: BookOfferCardProps) {
  const { translations: t, locale } = useLanguage();
  const name = pickLocaleField(locale, {
    en: offer.name,
    fr: offer.nameFr ?? offer.name,
    ar: offer.nameAr,
  });
  const description = pickLocaleField(locale, {
    en: offer.description,
    fr: offer.descriptionFr ?? offer.description,
  });
  const features =
    locale === "fr" && offer.featuresFr?.length ? offer.featuresFr : offer.features;
  const priceDisplay =
    offer.priceLabel ??
    (offer.price
      ? `${offer.price.toLocaleString(locale === "fr" ? "fr-DZ" : locale === "ar" ? "ar-DZ" : "en-US")} ${locale === "fr" ? "DA" : locale === "ar" ? "د.ج" : "DZD"}`
      : null);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={offerCardClass({ selected, featured: offer.featured })}
    >
      {offer.featured && (
        <span className={offerCardBadgeClass(selected)}>{t.booking.recommended}</span>
      )}

      <div className="flex items-start justify-between gap-3 pe-16">
        <h3 className="font-display text-xl tracking-wider md:text-2xl">{name}</h3>
        {selected && (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ruby text-white">
            <Check className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      {priceDisplay && (
        <p className={cn("mt-3 text-2xl font-bold", selected ? "text-white" : "text-ink")}>
          {priceDisplay}
        </p>
      )}

      <p className={offerCardDescriptionClass(selected)}>{description}</p>

      <ul className="mt-4 space-y-2">
        {features.slice(0, 5).map((feature) => (
          <li key={feature} className={offerCardFeatureClass(selected)}>
            <Check className={cn("mt-0.5 h-4 w-4 shrink-0", selected ? "text-gold" : "text-ruby")} />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant={selected ? "ruby" : "outline"}
        className={cn(
          "mt-5 w-full min-h-11 font-semibold",
          !selected && "border-ink/15 bg-white/80 hover:bg-white",
        )}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {t.booking.select}
      </Button>
    </article>
  );
}
