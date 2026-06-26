"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminT } from "@/lib/i18n/admin-en";
import { useOffers } from "@/lib/queries/offers";
import type { Lead, LeadSource, LeadStage } from "@/lib/types/admin";

const leadFormSchema = z.object({
  name: z.string().min(1, adminT("form.validation.required")),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email(adminT("form.validation.email")).optional().or(z.literal("")),
  source: z.enum([
    "instagram",
    "tiktok",
    "facebook",
    "whatsapp",
    "google",
    "referral",
    "website",
    "cold",
    "other",
  ]),
  utmCampaign: z.string().optional(),
  utmMedium: z.string().optional(),
  pixelEventFired: z.string().optional(),
  interestedIn: z.array(z.string()),
  stage: z.enum(["new", "contacted", "qualified", "proposal_sent", "won", "lost"]),
  notes: z.string(),
  assignedTo: z.string().optional(),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

const SOURCES: LeadSource[] = [
  "instagram",
  "tiktok",
  "facebook",
  "whatsapp",
  "google",
  "referral",
  "website",
  "cold",
  "other",
];

const STAGES: LeadStage[] = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
];

type LeadFormProps = {
  lead?: Lead;
  onSubmit: (values: LeadFormValues) => void;
  formId?: string;
};

export function LeadForm({ lead, onSubmit, formId = "lead-form" }: LeadFormProps) {
  const { data: offers = [] } = useOffers({ activeOnly: true });

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    mode: "onChange",
    defaultValues: {
      name: lead?.name ?? "",
      company: lead?.company ?? "",
      phone: lead?.phone ?? "",
      email: lead?.email ?? "",
      source: lead?.source ?? "website",
      utmCampaign: lead?.utmCampaign ?? "",
      utmMedium: lead?.utmMedium ?? "",
      pixelEventFired: lead?.pixelEventFired ?? "",
      interestedIn: lead?.interestedIn ?? [],
      stage: lead?.stage ?? "new",
      notes: lead?.notes ?? "",
      assignedTo: lead?.assignedTo,
    },
  });

  useEffect(() => {
    if (lead) {
      form.reset({
        name: lead.name,
        company: lead.company ?? "",
        phone: lead.phone ?? "",
        email: lead.email ?? "",
        source: lead.source,
        utmCampaign: lead.utmCampaign ?? "",
        utmMedium: lead.utmMedium ?? "",
        pixelEventFired: lead.pixelEventFired ?? "",
        interestedIn: lead.interestedIn,
        stage: lead.stage,
        notes: lead.notes,
        assignedTo: lead.assignedTo,
      });
    }
  }, [lead, form]);

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
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

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("common.company")}</FormLabel>
                <FormControl>
                  <Input {...field} className="min-h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("common.phone")}</FormLabel>
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("common.email")}</FormLabel>
              <FormControl>
                <Input type="email" {...field} className="min-h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("leads.filterSource")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="min-h-11">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SOURCES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {adminT(`leads.sources.${s}` as Parameters<typeof adminT>[0])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("leads.stage")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="min-h-11">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {adminT(`leads.stages.${s}` as Parameters<typeof adminT>[0])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-lg border border-ink/10 p-4 space-y-3">
          <p className="text-sm font-medium">{adminT("leads.sourceSection")}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="utmCampaign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{adminT("leads.utmCampaign")}</FormLabel>
                  <FormControl>
                    <Input {...field} className="min-h-11" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="utmMedium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{adminT("leads.utmMedium")}</FormLabel>
                  <FormControl>
                    <Input {...field} className="min-h-11" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="pixelEventFired"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("leads.pixelEvent")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Lead, ViewContent…" className="min-h-11" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="interestedIn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("leads.interestedIn")}</FormLabel>
              <div className="flex flex-wrap gap-2">
                {offers.map((offer) => {
                  const selected = field.value.includes(offer.id);
                  return (
                    <button
                      key={offer.id}
                      type="button"
                      className={`rounded-full border px-3 py-1.5 text-xs transition-colors min-h-11 sm:min-h-0 ${
                        selected
                          ? "border-gold bg-gold/10 text-ink"
                          : "border-border text-muted-foreground hover:border-gold/50"
                      }`}
                      onClick={() => {
                        const next = selected
                          ? field.value.filter((id) => id !== offer.id)
                          : [...field.value, offer.id];
                        field.onChange(next);
                      }}
                    >
                      {offer.name}
                    </button>
                  );
                })}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("common.notes")}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
