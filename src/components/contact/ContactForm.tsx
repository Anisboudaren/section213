"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { Section213Logo } from "@/components/Section213Logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { incrementLinkClick, createLead } from "@/lib/actions/leads";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getPackName, type OfferPackView } from "@/lib/offers/offer-types";
import { trackFormView, trackLeadConversion } from "@/lib/pixel-events";
import {
  createContactFormSchema,
  leadSourceOptions,
  type ContactFormInput,
} from "@/lib/schemas/lead-schema";
import type { LeadSource } from "@/lib/types/admin";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  embedded?: boolean;
  packs: OfferPackView[];
};

export function ContactForm({ embedded = false, packs }: ContactFormProps) {
  const searchParams = useSearchParams();
  const { translations: t, locale } = useLanguage();
  const c = t.contact;
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const srcParam = searchParams.get("src") as LeadSource | null;
  const refParam = searchParams.get("ref");
  const source: LeadSource =
    srcParam && leadSourceOptions.some((o) => o.value === srcParam) ? srcParam : "website";
  const sourceLabel = c.leadSources[source as keyof typeof c.leadSources];

  useEffect(() => {
    if (refParam) {
      void incrementLinkClick(refParam);
    }
  }, [refParam]);

  useEffect(() => {
    trackFormView("contact");
  }, []);

  const form = useForm<ContactFormInput>({
    resolver: async (values, context, options) =>
      zodResolver(createContactFormSchema(c.validation))(values, context, options),
    defaultValues: {
      prenom: "",
      nom: "",
      phone: "",
      email: "",
      interestedIn: [],
      message: "",
    },
  });

  useEffect(() => {
    form.clearErrors();
  }, [locale, form]);

  const onSubmit = async (values: ContactFormInput) => {
    setError(null);
    const pixelEventId = crypto.randomUUID();
    const result = await createLead({
      name: `${values.prenom} ${values.nom}`.trim(),
      phone: values.phone,
      email: values.email || undefined,
      source,
      trackedLinkSlug: refParam ?? undefined,
      interestedIn: values.interestedIn,
      notes: values.message ?? "",
      pixelEventFired: "Lead",
      pixelEventId,
      stage: "new",
      submissionType: "contact",
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    trackLeadConversion({
      contentName: "contact",
      eventId: pixelEventId,
      email: values.email || undefined,
      phone: values.phone,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <CheckCircle2 className="mb-4 h-14 w-14 text-brand-accent" />
        <h2 className="font-display text-2xl tracking-wide text-ink">{c.successTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{c.successMessage}</p>
        <Button asChild variant="ruby" className="mt-6 min-h-11">
          <Link href="/">{c.backHome}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("w-full", !embedded && "max-w-md")}>
      {!embedded && (
        <>
          <div className="mb-8 flex justify-center">
            <Section213Logo size="md" />
          </div>
          <h1 className="text-center font-display text-2xl tracking-wide">
            {c.title} <span className="text-ruby">{c.titleHighlight}</span>
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">{c.subtitle}</p>
        </>
      )}

      {srcParam && sourceLabel && (
        <p className={cn("text-center", embedded ? "mt-0 mb-4" : "mt-4")}>
          <span className="inline-flex rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
            {c.sourceFrom} {sourceLabel}
          </span>
        </p>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-4", embedded ? "" : "mt-8")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{c.firstName}</FormLabel>
                  <FormControl>
                    <Input {...field} className="min-h-11 bg-paper" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{c.lastName}</FormLabel>
                  <FormControl>
                    <Input {...field} className="min-h-11 bg-paper" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{c.phoneLabel} *</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" className="min-h-11 bg-paper" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{c.emailLabel}</FormLabel>
                <FormControl>
                  <Input {...field} type="email" className="min-h-11 bg-paper" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interestedIn"
            render={() => (
              <FormItem>
                <FormLabel>{c.interestedIn}</FormLabel>
                <div className="space-y-2">
                  {packs.map((pack) => (
                    <FormField
                      key={pack.id}
                      control={form.control}
                      name="interestedIn"
                      render={({ field }) => {
                        const checked = field.value.includes(pack.slug);
                        return (
                          <FormItem className="flex items-center gap-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(v) => {
                                  const next = v
                                    ? [...field.value, pack.slug]
                                    : field.value.filter((s) => s !== pack.slug);
                                  field.onChange(next);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {getPackName(pack, locale)}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{c.message}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    maxLength={300}
                    placeholder={c.messagePlaceholder}
                    className="bg-paper"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            variant="ruby"
            className="min-h-11 w-full"
            disabled={form.formState.isSubmitting}
          >
            {c.submit}
          </Button>
        </form>
      </Form>
    </div>
  );
}
