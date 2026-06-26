"use client";

import { Check, GripVertical, Pencil, Trash2 } from "lucide-react";

import {
  offerCardBadgeClass,
  offerCardClass,
  offerCardDescriptionClass,
  offerCardFeatureClass,
} from "@/components/offers/offer-card-styles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminT } from "@/lib/i18n/admin-en";
import type { Offer } from "@/lib/types/admin";
import { cn } from "@/lib/utils";

type OfferCardProps = {
  offer: Offer;
  onEdit: (offer: Offer) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
};

export function OfferCard({ offer, onEdit, onDelete, onToggleActive }: OfferCardProps) {
  const priceDisplay =
    offer.priceLabel ?? (offer.price ? `${offer.price.toLocaleString("fr-DZ")} DZD` : "—");

  return (
    <div className={offerCardClass({ featured: offer.featured, interactive: false, className: "flex flex-col" })}>
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-1 cursor-grab text-muted-foreground/60"
          aria-hidden
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          {offer.featured && (
            <span className={cn(offerCardBadgeClass(), "relative static mb-2 inline-block")}>
              {adminT("common.featured")}
            </span>
          )}

          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-xl tracking-wider text-ink">
                {offer.nameFr ?? offer.name}
              </h3>
              <p className="mt-1 text-lg font-bold text-ink">{priceDisplay}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {offer.active ? (
                <Badge className="bg-green-100 text-green-800">{adminT("common.active")}</Badge>
              ) : (
                <Badge variant="outline">{adminT("common.inactive")}</Badge>
              )}
            </div>
          </div>

          <p className={offerCardDescriptionClass()}>{offer.descriptionFr ?? offer.description}</p>

          <ul className="mt-3 space-y-1.5">
            {(offer.featuresFr ?? offer.features).slice(0, 4).map((feature) => (
              <li key={feature} className={offerCardFeatureClass()}>
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ruby" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-ink/10 pt-4">
        <Button
          variant="outline"
          size="sm"
          className="min-h-10"
          onClick={() => onToggleActive(offer.id, !offer.active)}
        >
          {offer.active ? adminT("pixels.disable") : adminT("pixels.enable")}
        </Button>
        <Button variant="outline" size="icon" className="min-h-10 min-w-10" onClick={() => onEdit(offer)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="min-h-10 min-w-10 text-destructive hover:text-destructive"
          onClick={() => onDelete(offer.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
