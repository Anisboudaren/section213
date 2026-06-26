"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AssigneeSelect } from "@/components/admin/AssigneeSelect";
import { LeadSourceIcon } from "@/components/icons/lead-source-icon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useOffers } from "@/lib/queries/offers";
import { useCreateLead } from "@/lib/queries/leads";
import {
  createLeadSchema,
  leadSourceOptions,
  type CreateLeadInput,
} from "@/lib/schemas/lead-schema";
import type { LeadSource } from "@/lib/types/admin";
import { cn } from "@/lib/utils";

type NewLeadModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function NewLeadModal({ open, onOpenChange }: NewLeadModalProps) {
  const createLeadMutation = useCreateLead();
  const { data: offers = [] } = useOffers({ activeOnly: true });
  const [selectedSource, setSelectedSource] = useState<LeadSource | null>(null);

  const form = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: "",
      company: "",
      phone: "",
      email: "",
      source: "website",
      utmCampaign: "",
      utmMedium: "",
      referredBy: "",
      interestedIn: [],
      notes: "",
      assignedTo: undefined,
    },
  });

  const resetForm = () => {
    setSelectedSource(null);
    form.reset();
  };

  const handleSubmit = async (values: CreateLeadInput) => {
    try {
      await createLeadMutation.mutateAsync({
        ...values,
        source: selectedSource ?? values.source,
        email: values.email || undefined,
      });
      toast.success("Lead créé");
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la création");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) resetForm();
      }}
    >
      <DialogContent className="flex max-h-[95dvh] w-[calc(100%-0px)] flex-col overflow-hidden p-0 max-sm:top-auto max-sm:bottom-0 max-sm:translate-x-[-50%] max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-2xl sm:max-w-3xl">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Nouveau lead</DialogTitle>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 gap-0 overflow-y-auto md:grid-cols-2">
          <div className="border-b border-ink/10 p-6 md:border-b-0 md:border-r">
            <p className="mb-4 text-sm font-medium">Choisissez la source</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {leadSourceOptions.map((option) => {
                const selected = selectedSource === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedSource(option.value);
                      form.setValue("source", option.value);
                    }}
                    className={cn(
                      "relative flex min-h-11 flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-colors",
                      selected
                        ? "border-gold bg-gold/10"
                        : "border-ink/10 hover:border-gold/40",
                    )}
                  >
                    {selected && (
                      <Check className="absolute right-2 top-2 h-4 w-4 text-gold" />
                    )}
                    <LeadSourceIcon source={option.value} size="md" />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 p-6"
              id="new-lead-form"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet *</FormLabel>
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
                      <FormLabel>Entreprise</FormLabel>
                      <FormControl>
                        <Input {...field} className="min-h-11" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input {...field} className="min-h-11" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

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

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="utmCampaign"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campagne</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ex: ramadan-promo" className="min-h-11" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="utmMedium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Médium</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ex: story, dm" className="min-h-11" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {selectedSource === "referral" && (
                <FormField
                  control={form.control}
                  name="referredBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Référé par</FormLabel>
                      <FormControl>
                        <Input {...field} className="min-h-11" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="interestedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offres intéressées</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {offers.map((offer) => {
                        const selected = field.value.includes(offer.slug);
                        return (
                          <button
                            key={offer.id}
                            type="button"
                            className={cn(
                              "rounded-full border px-3 py-1.5 text-xs min-h-11 sm:min-h-0",
                              selected
                                ? "border-gold bg-gold/10 text-ink"
                                : "border-border text-muted-foreground",
                            )}
                            onClick={() => {
                              const next = selected
                                ? field.value.filter((s) => s !== offer.slug)
                                : [...field.value, offer.slug];
                              field.onChange(next);
                            }}
                          >
                            {offer.nameFr ?? offer.name}
                          </button>
                        );
                      })}
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigné à</FormLabel>
                    <AssigneeSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="min-h-11">
            Annuler
          </Button>
          <Button
            variant="gold"
            type="submit"
            form="new-lead-form"
            className="min-h-11"
            disabled={!selectedSource || createLeadMutation.isPending}
          >
            Créer le lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
