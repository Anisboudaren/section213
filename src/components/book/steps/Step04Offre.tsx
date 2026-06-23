"use client";

import { useEffect, useMemo, useState } from "react";

import { BookOfferCard } from "@/components/book/OfferCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminStore } from "@/lib/admin-store";
import { getDefaultOfferCategory } from "@/lib/booking-types";
import type { BookingFormData } from "@/lib/booking-types";
import { adminT } from "@/lib/i18n/admin-en";
import type { OfferCategory } from "@/lib/types/admin";

type StepProps = {
  data: Partial<BookingFormData>;
  onChange: (patch: Partial<BookingFormData>) => void;
  errors?: Record<string, string>;
};

const CATEGORIES: OfferCategory[] = [
  "media",
  "brand_content",
  "websites_apps",
  "automations",
];

export function Step04Offre({ data, onChange, errors }: StepProps) {
  const { offers } = useAdminStore();
  const activeOffers = offers.filter((o) => o.active);
  const [category, setCategory] = useState<OfferCategory>("media");

  const defaultCategory = getDefaultOfferCategory(data.projectTypes);

  useEffect(() => {
    if (defaultCategory) setCategory(defaultCategory);
  }, [defaultCategory]);

  useEffect(() => {
    if (!data.selectedOfferId && defaultCategory) {
      const match = activeOffers.find((o) => o.category === defaultCategory);
      if (match) onChange({ selectedOfferId: match.id });
    }
  }, [defaultCategory, activeOffers, data.selectedOfferId, onChange]);

  const offersByCategory = useMemo(
    () =>
      Object.fromEntries(
        CATEGORIES.map((cat) => [
          cat,
          activeOffers.filter((o) => o.category === cat),
        ]),
      ) as Record<OfferCategory, typeof activeOffers>,
    [activeOffers],
  );

  return (
    <div className="space-y-4">
      <Tabs value={category} onValueChange={(v) => setCategory(v as OfferCategory)}>
        <TabsList className="flex h-auto w-full flex-wrap gap-1">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="min-h-11 flex-1 text-xs sm:text-sm">
              {adminT(`offers.categories.${cat}` as Parameters<typeof adminT>[0])}
            </TabsTrigger>
          ))}
        </TabsList>
        {CATEGORIES.map((cat) => {
          const categoryOffers = offersByCategory[cat];
          return (
          <TabsContent key={cat} value={cat} className="mt-4 space-y-4">
            {categoryOffers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {adminT("offers.emptyTitle")}
              </p>
            ) : (
              categoryOffers.map((offer) => (
                <BookOfferCard
                  key={offer.id}
                  offer={offer}
                  selected={data.selectedOfferId === offer.id}
                  onSelect={() => onChange({ selectedOfferId: offer.id })}
                />
              ))
            )}
          </TabsContent>
          );
        })}
      </Tabs>
      {errors?.selectedOfferId && (
        <p className="text-sm text-destructive text-center">Required</p>
      )}
    </div>
  );
}
