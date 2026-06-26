"use client";

import { useEffect, useMemo, useState } from "react";

import { BookOfferCard } from "@/components/book/OfferCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BookingFormData } from "@/lib/booking-types";
import { getDefaultOfferCategory } from "@/lib/booking-types";
import { adminT } from "@/lib/i18n/admin-en";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Offer, OfferCategory } from "@/lib/types/admin";

type StepProps = {
  data: Partial<BookingFormData>;
  onChange: (patch: Partial<BookingFormData>) => void;
  errors?: Record<string, string>;
  offers: Offer[];
};

const CATEGORIES: OfferCategory[] = [
  "media",
  "brand_content",
  "websites_apps",
  "automations",
];

export function Step04Offre({ data, onChange, errors, offers }: StepProps) {
  const { locale } = useLanguage();
  const activeOffers = offers.filter((o) => o.active);
  const [category, setCategory] = useState<OfferCategory>("media");

  const defaultCategory = getDefaultOfferCategory(data.projectTypes);

  const selectedOffer = useMemo(
    () => activeOffers.find((o) => o.id === data.selectedOfferId),
    [activeOffers, data.selectedOfferId],
  );

  const optionFeatures = useMemo(() => {
    if (!selectedOffer) return [];
    return locale === "fr" && selectedOffer.featuresFr?.length
      ? selectedOffer.featuresFr
      : selectedOffer.features;
  }, [selectedOffer, locale]);

  const toggleOption = (feature: string) => {
    const current = data.bookingOptions ?? [];
    const next = current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature];
    onChange({ bookingOptions: next });
  };

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
    <div className="space-y-5">
      <Tabs value={category} onValueChange={(v) => setCategory(v as OfferCategory)}>
        <TabsList className="flex h-auto w-full flex-wrap gap-1.5 bg-transparent p-0">
          {CATEGORIES.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="min-h-10 flex-1 rounded-full border border-ink/10 bg-background px-3 text-xs data-[state=active]:border-ruby/40 data-[state=active]:bg-ink data-[state=active]:text-white sm:text-sm"
            >
              {adminT(`offers.categories.${cat}` as Parameters<typeof adminT>[0])}
            </TabsTrigger>
          ))}
        </TabsList>
        {CATEGORIES.map((cat) => {
          const categoryOffers = offersByCategory[cat];
          return (
            <TabsContent key={cat} value={cat} className="mt-5 space-y-4">
              {categoryOffers.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  {adminT("offers.emptyTitle")}
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {categoryOffers.map((offer) => (
                    <BookOfferCard
                      key={offer.id}
                      offer={offer}
                      selected={data.selectedOfferId === offer.id}
                      onSelect={() => onChange({ selectedOfferId: offer.id })}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
      {errors?.selectedOfferId && (
        <p className="text-sm text-destructive text-center">Required</p>
      )}

      {selectedOffer && optionFeatures.length > 0 && (
        <div className="space-y-3 rounded-xl border border-ink/10 bg-ink/[0.02] p-4">
          <p className="text-sm font-medium">{adminT("common.features")}</p>
          <div className="space-y-2">
            {optionFeatures.map((feature) => (
              <div key={feature} className="flex items-center gap-2">
                <Checkbox
                  id={`opt-${feature}`}
                  checked={(data.bookingOptions ?? []).includes(feature)}
                  onCheckedChange={() => toggleOption(feature)}
                />
                <Label htmlFor={`opt-${feature}`} className="text-sm font-normal cursor-pointer">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
