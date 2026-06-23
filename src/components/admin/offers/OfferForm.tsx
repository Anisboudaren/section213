"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { adminT } from "@/lib/i18n/admin-en";
import type { Offer, OfferCategory } from "@/lib/types/admin";

const CATEGORIES: OfferCategory[] = [
  "media",
  "brand_content",
  "websites_apps",
  "automations",
];

const offerSchema = z.object({
  slug: z.string().min(1, adminT("form.validation.required")),
  name: z.string().min(1, adminT("form.validation.required")),
  nameAr: z.string().optional(),
  nameFr: z.string().optional(),
  category: z.enum(["media", "brand_content", "websites_apps", "automations"]),
  description: z.string().min(1, adminT("form.validation.required")),
  descriptionFr: z.string().optional(),
  features: z.array(z.object({ value: z.string() })),
  featuresFr: z.array(z.object({ value: z.string() })).optional(),
  priceMode: z.enum(["fixed", "label"]),
  price: z.number().optional(),
  priceLabel: z.string().optional(),
  active: z.boolean(),
  featured: z.boolean(),
  order: z.number(),
  cta: z.string().optional(),
});

export type OfferFormValues = z.infer<typeof offerSchema>;

type OfferFormProps = {
  offer?: Offer;
  defaultCategory?: OfferCategory;
  onSubmit: (values: OfferFormValues) => void;
  formId?: string;
};

export function OfferForm({
  offer,
  defaultCategory,
  onSubmit,
  formId = "offer-form",
}: OfferFormProps) {
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    mode: "onChange",
    defaultValues: {
      slug: offer?.slug ?? "",
      name: offer?.name ?? "",
      nameAr: offer?.nameAr ?? "",
      nameFr: offer?.nameFr ?? "",
      category: offer?.category ?? defaultCategory ?? "media",
      description: offer?.description ?? "",
      descriptionFr: offer?.descriptionFr ?? "",
      features: (offer?.features ?? [""]).map((v) => ({ value: v })),
      priceMode: offer?.priceLabel ? "label" : "fixed",
      price: offer?.price,
      priceLabel: offer?.priceLabel ?? "",
      active: offer?.active ?? true,
      featured: offer?.featured ?? false,
      order: offer?.order ?? 1,
      cta: offer?.cta ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const priceMode = form.watch("priceMode");

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("common.name")}</FormLabel>
                <FormControl>
                  <Input {...field} className="min-h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("offers.slug")}</FormLabel>
                <FormControl>
                  <Input {...field} className="min-h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("offers.category")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="min-h-11">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {adminT(`offers.categories.${c}` as Parameters<typeof adminT>[0])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("common.description")}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>{adminT("common.features")}</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={form.control}
                name={`features.${index}.value`}
                render={({ field: f }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...f} className="min-h-11" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                className="min-h-11"
                onClick={() => remove(index)}
              >
                {adminT("common.removeRow")}
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11"
            onClick={() => append({ value: "" })}
          >
            {adminT("common.addRow")}
          </Button>
        </div>

        <FormField
          control={form.control}
          name="priceMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("common.price")}</FormLabel>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed">{adminT("common.fixedPrice")}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="label" id="label" />
                  <Label htmlFor="label">{adminT("common.customLabel")}</Label>
                </div>
              </RadioGroup>
            </FormItem>
          )}
        />

        {priceMode === "fixed" ? (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("common.price")} (DZD)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="min-h-11" />
                </FormControl>
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="priceLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("common.priceLabel")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Starting from 80,000 DZD" className="min-h-11" />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <FormLabel>{adminT("common.active")}</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <FormLabel>{adminT("common.featured")}</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("common.order")}</FormLabel>
              <FormControl>
                <Input type="number" {...field} className="min-h-11" />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
