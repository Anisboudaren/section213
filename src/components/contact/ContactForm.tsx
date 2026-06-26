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
import { useOffers } from "@/lib/queries/offers";
import { trackMetaLead, trackTikTokSubmit } from "@/lib/pixel-events";
import {
  contactFormSchema,
  leadSourceOptions,
  type ContactFormInput,
} from "@/lib/schemas/lead-schema";
import type { LeadSource } from "@/lib/types/admin";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const searchParams = useSearchParams();
  const { data: offers = [] } = useOffers({ activeOnly: true });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const srcParam = searchParams.get("src") as LeadSource | null;
  const refParam = searchParams.get("ref");
  const source: LeadSource =
    srcParam && leadSourceOptions.some((o) => o.value === srcParam) ? srcParam : "website";
  const sourceLabel = leadSourceOptions.find((o) => o.value === source)?.label;

  useEffect(() => {
    if (refParam) {
      void incrementLinkClick(refParam);
    }
  }, [refParam]);

  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      phone: "",
      email: "",
      interestedIn: [],
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormInput) => {
    setError(null);
    const result = await createLead({
      name: `${values.prenom} ${values.nom}`.trim(),
      phone: values.phone,
      email: values.email || undefined,
      source,
      trackedLinkSlug: refParam ?? undefined,
      interestedIn: values.interestedIn,
      notes: values.message ?? "",
      pixelEventFired: "Lead",
      stage: "new",
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    trackMetaLead();
    trackTikTokSubmit();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <CheckCircle2 className="mb-4 h-14 w-14 text-brand-accent" />
        <h2 className="font-display text-2xl tracking-wide">Demande envoyée !</h2>
        <p className="mt-2 text-muted-foreground">
          Notre équipe vous contactera dans les 24h.
        </p>
        <Button asChild variant="ruby" className="mt-6 min-h-11">
          <Link href="/">← Retour à l&apos;accueil</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex justify-center">
        <Section213Logo size="md" />
      </div>

      <h1 className="text-center font-display text-2xl tracking-wide">Contactez-nous</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Décrivez votre projet — réponse sous 24h.
      </p>

      {srcParam && sourceLabel && (
        <p className="mt-4 text-center">
          <span className="inline-flex rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
            Lien depuis {sourceLabel}
          </span>
        </p>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input {...field} className="min-h-11" />
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
                  <FormLabel>Nom</FormLabel>
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Téléphone *</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" className="min-h-11" />
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" className="min-h-11" />
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
                <FormLabel>Je suis intéressé par…</FormLabel>
                <div className="space-y-2">
                  {offers.map((offer) => (
                    <FormField
                      key={offer.id}
                      control={form.control}
                      name="interestedIn"
                      render={({ field }) => {
                        const checked = field.value.includes(offer.slug);
                        return (
                          <FormItem className="flex items-center gap-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(v) => {
                                  const next = v
                                    ? [...field.value, offer.slug]
                                    : field.value.filter((s) => s !== offer.slug);
                                  field.onChange(next);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {offer.nameFr ?? offer.name}
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
                <FormLabel>Message / Projet</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    maxLength={300}
                    placeholder="Décrivez brièvement votre besoin…"
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
            className={cn("min-h-11 w-full")}
            disabled={form.formState.isSubmitting}
          >
            Envoyer ma demande
          </Button>
        </form>
      </Form>
    </div>
  );
}
