"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

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
import { step05Schema } from "@/lib/booking-schema";
import type { BookingFormData } from "@/lib/booking-types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { z } from "zod";

type Step05Values = z.infer<typeof step05Schema>;

type StepProps = {
  data: Partial<BookingFormData>;
  onChange: (patch: Partial<BookingFormData>) => void;
  onValidityChange?: (valid: boolean) => void;
};

export function Step05Reservation({ data, onChange, onValidityChange }: StepProps) {
  const { translations: t } = useLanguage();

  const form = useForm<Step05Values>({
    resolver: zodResolver(step05Schema),
    mode: "onChange",
    defaultValues: {
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      company: data.company ?? "",
      notes: data.notes ?? "",
    },
  });

  useEffect(() => {
    const sub = form.watch((values) => {
      onChange(values as Partial<BookingFormData>);
      onValidityChange?.(form.formState.isValid);
    });
    onValidityChange?.(form.formState.isValid);
    return () => sub.unsubscribe();
  }, [form, onChange, onValidityChange]);

  const mapError = (key: string) => {
    const msg = t.booking.validation[key as keyof typeof t.booking.validation];
    return msg ?? key;
  };

  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prénom</FormLabel>
                <FormControl>
                  <Input {...field} className="min-h-11" />
                </FormControl>
                <FormMessage>{mapError("min2")}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
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
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="+213 555 123 456" className="min-h-11" />
              </FormControl>
              <p className="text-xs text-muted-foreground">{t.booking.phoneHint}</p>
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
                <Input type="email" {...field} className="min-h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entreprise (optionnel)</FormLabel>
              <FormControl>
                <Input {...field} className="min-h-11" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optionnel)</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
            </FormItem>
          )}
        />

        <p className="text-xs text-muted-foreground">{t.booking.gdprNote}</p>
      </form>
    </Form>
  );
}