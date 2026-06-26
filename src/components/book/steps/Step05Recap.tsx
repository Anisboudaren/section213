"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALGERIA_WILAYAS } from "@/lib/algeria-wilayas";
import { step05Schema } from "@/lib/booking-schema";
import type { BookingFormData } from "@/lib/booking-types";
import { createLead } from "@/lib/actions/leads";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { trackMetaLead, trackTikTokSubmit } from "@/lib/pixel-events";
import type { Offer } from "@/lib/types/admin";

type Step05Values = z.infer<typeof step05Schema>;

type StepProps = {
  data: Partial<BookingFormData>;
  onChange: (patch: Partial<BookingFormData>) => void;
  onSubmitSuccess: () => void;
  errors?: Record<string, string>;
  offers: Offer[];
};

export function Step05Recap({ data, onChange, onSubmitSuccess, errors, offers }: StepProps) {
  const { translations: t, locale } = useLanguage();
  const [submitting, setSubmitting] = useState(false);

  const offer = useMemo(
    () => offers.find((o) => o.id === data.selectedOfferId),
    [offers, data.selectedOfferId],
  );

  const form = useForm<Step05Values>({
    resolver: zodResolver(step05Schema),
    mode: "onChange",
    defaultValues: {
      wilaya: data.wilaya ?? "",
      fullName: data.fullName ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      company: data.company ?? "",
    },
  });

  const syncForm = (values: Partial<Step05Values>) => {
    onChange(values as Partial<BookingFormData>);
  };

  const dateLabel = data.isFlexible
    ? t.booking.flexibleDate
    : data.preferredDate
      ? format(new Date(data.preferredDate), "d MMM yyyy", {
          locale: locale === "fr" ? fr : undefined,
        })
      : null;

  const projectLabel = data.projectTypes
    ?.map((type) => t.booking.projectTypes[type])
    .join(" · ");

  const mapError = (key: string) => {
    const msg = t.booking.validation[key as keyof typeof t.booking.validation];
    return msg ?? key;
  };

  const handleSubmit = async (values: Step05Values) => {
    setSubmitting(true);
    try {
      const result = await createLead({
        name: values.fullName,
        phone: values.phone,
        email: values.email || undefined,
        company: values.company || undefined,
        source: "website",
        interestedIn: offer ? [offer.slug] : [],
        stage: "new",
        notes: "",
        pixelEventFired: "Lead",
        submissionType: "booking",
        wilaya: values.wilaya,
        preferredDate: data.isFlexible ? undefined : data.preferredDate,
        preferredTime: data.preferredTime,
        isFlexible: data.isFlexible ?? false,
        projectTypes: data.projectTypes ?? [],
        projectDescription: data.projectDescription,
        objective: data.objective,
        budgetRange: data.budgetRange,
        bookingOptions: data.bookingOptions ?? [],
        depositChoice: "no_deposit",
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      trackMetaLead();
      trackTikTokSubmit();
      onChange({
        wilaya: values.wilaya,
        fullName: values.fullName,
        phone: values.phone,
        email: values.email || undefined,
        company: values.company || undefined,
      });
      onSubmitSuccess();
    } catch {
      toast.error(t.booking.validation.required);
    } finally {
      setSubmitting(false);
    }
  };

  const summaryParts = [dateLabel, projectLabel, offer?.nameFr ?? offer?.name].filter(Boolean);

  return (
    <div className="space-y-4">
      {summaryParts.length > 0 && (
        <p className="text-xs leading-relaxed text-muted-foreground">{summaryParts.join(" · ")}</p>
      )}

      <div>
        <h3 className="text-sm font-semibold">{t.booking.recap.title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{t.booking.recap.hint}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="wilaya"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs">{t.booking.wilaya}</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                    syncForm({ wilaya: v });
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder={t.booking.wilayaPlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ALGERIA_WILAYAS.map((w) => (
                      <SelectItem key={w.code} value={w.code}>
                        {w.code} — {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>{errors?.wilaya && mapError(errors.wilaya)}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs">{t.booking.contact.fullName}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-10"
                    autoComplete="name"
                    onChange={(e) => {
                      field.onChange(e);
                      syncForm({ fullName: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs">{t.booking.contact.phone}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    inputMode="tel"
                    placeholder="+213 555 123 456"
                    className="h-10"
                    autoComplete="tel"
                    onChange={(e) => {
                      field.onChange(e);
                      syncForm({ phone: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">{t.booking.contact.email}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      className="h-10"
                      autoComplete="email"
                      onChange={(e) => {
                        field.onChange(e);
                        syncForm({ email: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">{t.booking.contact.company}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-10"
                      autoComplete="organization"
                      onChange={(e) => {
                        field.onChange(e);
                        syncForm({ company: e.target.value });
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <p className="text-[11px] leading-snug text-muted-foreground">{t.booking.gdprNote}</p>

          <Button type="submit" variant="ruby" className="h-11 w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.booking.recap.submitting}
              </>
            ) : (
              t.booking.recap.submit
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
