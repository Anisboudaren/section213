"use client";

import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Offer } from "@/lib/types/admin";
import { cn } from "@/lib/utils";

type BookOfferCardProps = {
  offer: Offer;
  selected: boolean;
  onSelect: () => void;
};

export function BookOfferCard({ offer, selected, onSelect }: BookOfferCardProps) {
  const { translations: t } = useLanguage();
  const priceDisplay =
    offer.priceLabel ?? (offer.price ? `${offer.price.toLocaleString("fr-DZ")} DZD` : "");

  return (
    <Card
      className={cn(
        "cursor-pointer border-2 transition-all",
        selected ? "border-brand-accent bg-brand-accent/5" : "border-border hover:border-brand-accent/40",
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg tracking-wide">{offer.nameFr ?? offer.name}</h3>
          {offer.featured && (
            <Badge className="bg-brand-accent text-ruby-foreground shrink-0">
              {t.booking.recommended}
            </Badge>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {offer.descriptionFr ?? offer.description}
        </p>
        <ul className="mt-3 space-y-1">
          {(offer.featuresFr ?? offer.features).slice(0, 4).map((f) => (
            <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-brand-accent" />
              {f}
            </li>
          ))}
        </ul>
        {priceDisplay && (
          <p className="mt-3 font-semibold text-sm">{priceDisplay}</p>
        )}
        <Button
          type="button"
          variant={selected ? "ruby" : "outline"}
          className="mt-4 w-full min-h-11"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {t.booking.select}
        </Button>
      </CardContent>
    </Card>
  );
}
