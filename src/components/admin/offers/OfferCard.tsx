"use client";

import { GripVertical, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { adminT } from "@/lib/i18n/admin-en";
import type { Offer } from "@/lib/types/admin";

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
    <Card className="border-ink/10">
      <CardContent className="flex items-start gap-3 p-4">
        <button
          type="button"
          className="mt-1 cursor-grab text-muted-foreground"
          aria-hidden
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-medium text-ink">{offer.name}</h3>
              <p className="text-sm text-muted-foreground">{priceDisplay}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {offer.active ? (
                <Badge className="bg-green-100 text-green-800">{adminT("common.active")}</Badge>
              ) : (
                <Badge variant="outline">{adminT("common.inactive")}</Badge>
              )}
              {offer.featured && (
                <Badge className="bg-gold/20 text-ink">{adminT("common.featured")}</Badge>
              )}
            </div>
          </div>
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{offer.description}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11"
            onClick={() => onEdit(offer)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="min-h-11 min-w-11 text-destructive"
            onClick={() => onDelete(offer.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="min-h-11 text-xs"
            onClick={() => onToggleActive(offer.id, !offer.active)}
          >
            {offer.active ? adminT("pixels.disable") : adminT("pixels.enable")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
