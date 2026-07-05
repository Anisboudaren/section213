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
import { offerFormValuesToInput } from "@/lib/schemas/offer-schema";
import type { Offer, OfferCategory } from "@/lib/types/admin";

const CATEGORIES: OfferCategory[] = ["pack", "ala_carte"];

const offerSchema = z.object({
  slug: z.string().min(1, adminT("form.validation.required")),
  name: z.string().min(1, adminT("form.validation.required")),
  nameAr: z.string().optional(),
  nameFr: z.string().optional(),
  category: z.enum(["pack", "ala_carte"]),
  description: z.string().min(1, adminT("form.validation.required")),
  descriptionFr: z.string().optional(),
  features: z.array(z.object({ value: z.string() })),
  featuresFr: z.array(z.object({ value: z.string() })).optional(),
  priceMode: z.enum(["fixed", "label", "study"]),
  price: z.number().optional(),
  priceLabel: z.string().optional(),
  priceLabelFr: z.string().optional(),
  active: z.boolean(),
  featured: z.boolean(),
  studyOnly: z.boolean(),
  order: z.number(),
  cta: z.string().optional(),
  ctaFr: z.string().optional(),
  noteEn: z.string().optional(),
  noteFr: z.string().optional(),
});

export type OfferFormValues = z.infer<typeof offerSchema>;

type OfferFormProps = {
  offer?: Offer;
  defaultCategory?: OfferCategory;
  onSubmit: (values: Parameters<typeof offerFormValuesToInput>[0]) => void;
  formId?: string;
};

function resolvePriceMode(offer?: Offer): "fixed" | "label" | "study" {
  if (offer?.studyOnly) return "study";
  if (offer?.priceLabel || offer?.priceLabelFr) return "label";
  return "fixed";
}

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
      category: offer?.category ?? defaultCategory ?? "pack",
      description: offer?.description ?? "",
      descriptionFr: offer?.descriptionFr ?? "",
      features: (offer?.features ?? [""]).map((v) => ({ value: v })),
      featuresFr: (offer?.featuresFr ?? []).map((v) => ({ value: v })),
      priceMode: resolvePriceMode(offer),
      price: offer?.price,
      priceLabel: offer?.priceLabel ?? "",
      priceLabelFr: offer?.priceLabelFr ?? "",
      active: offer?.active ?? true,
      featured: offer?.featured ?? false,
      studyOnly: offer?.studyOnly ?? false,
      order: offer?.order ?? 1,
      cta: offer?.cta ?? "",
      ctaFr: offer?.ctaFr ?? "",
      noteEn: offer?.noteEn ?? "",
      noteFr: offer?.noteFr ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const {
    fields: featuresFrFields,
    append: appendFr,
    remove: removeFr,
  } = useFieldArray({
    control: form.control,
    name: "featuresFr",
  });

  const priceMode = form.watch("priceMode");
  const category = form.watch("category");

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit((values) => onSubmit(values))}
        className="space-y-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("common.name")} (EN)</FormLabel>
                <FormControl>
                  <Input {...field} className="min-h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nameFr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("offers.nameFr")}</FormLabel>
                <FormControl>
                  <Input {...field} className="min-h-11" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="nameAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("offers.nameAr")}</FormLabel>
              <FormControl>
                <Input {...field} className="min-h-11" dir="rtl" />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("common.description")} (EN)</FormLabel>
              <FormControl>
                <Textarea {...field} rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descriptionFr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("offers.descriptionFr")}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={2} />
              </FormControl>
            </FormItem>
          )}
        />

        {category === "pack" && (
          <div className="space-y-2">
            <Label>{adminT("common.features")} (EN)</Label>
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
        )}

        {category === "pack" && (
          <div className="space-y-2">
            <Label>{adminT("offers.featuresFr")}</Label>
            {featuresFrFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`featuresFr.${index}.value`}
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
                  onClick={() => removeFr(index)}
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
              onClick={() => appendFr({ value: "" })}
            >
              {adminT("common.addRow")}
            </Button>
          </div>
        )}

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
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="study" id="study" />
                  <Label htmlFor="study">Study / on request</Label>
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
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || undefined)}
                    className="min-h-11"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="priceLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{adminT("common.priceLabel")} (EN)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="From 80,000 DZD" className="min-h-11" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceLabelFr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{adminT("common.priceLabel")} (FR)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="À partir de 80 000 DA" className="min-h-11" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="cta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("offers.cta")} (EN)</FormLabel>
                <FormControl>
                  <Input {...field} className="min-h-11" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ctaFr"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("offers.cta")} (FR)</FormLabel>
                <FormControl>
                  <Input {...field} className="min-h-11" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {category === "pack" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="noteEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (EN)</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="noteFr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (FR)</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
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
          <FormField
            control={form.control}
            name="studyOnly"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <FormLabel>Study only</FormLabel>
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
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  className="min-h-11"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
