"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Lead } from "@/lib/types/admin";
import { useUpgradeLeadToClient } from "@/lib/queries/clients";
import { createClientSchema, type CreateClientInput } from "@/lib/schemas/client-schema";
import { adminT } from "@/lib/i18n/admin-en";

type UpgradeToClientModalProps = {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function UpgradeToClientModal({
  lead,
  open,
  onOpenChange,
  onSuccess,
}: UpgradeToClientModalProps) {
  const router = useRouter();
  const upgrade = useUpgradeLeadToClient();

  const form = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      company: "",
      phone: "",
      email: "",
      status: "active",
      notes: "",
      showOnWebsite: false,
    },
  });

  useEffect(() => {
    if (!open || !lead) return;
    form.reset({
      name: lead.name,
      company: lead.company ?? "",
      phone: lead.phone ?? "",
      email: lead.email ?? "",
      status: "active",
      notes: lead.notes,
      showOnWebsite: false,
    });
  }, [open, lead, form]);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
  };

  const onSubmit = async (values: CreateClientInput) => {
    if (!lead) return;
    try {
      const client = await upgrade.mutateAsync({
        leadId: lead.id,
        data: {
          ...values,
          email: values.email || undefined,
          phone: values.phone || undefined,
        },
      });
      toast.success("Lead converti en client");
      onOpenChange(false);
      onSuccess?.();
      router.push(`/admin/clients/${client.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[95dvh] w-[calc(100%-0px)] flex-col overflow-hidden max-sm:top-auto max-sm:bottom-0 max-sm:translate-x-[-50%] max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Convertir en client</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Ce lead deviendra un client. Vous pouvez modifier les infos avant de confirmer.
          </p>
        </DialogHeader>

        <Form {...form}>
          <form
            id="upgrade-client-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto"
          >
            <FormField
              control={form.control}
              name="name"
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
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entreprise *</FormLabel>
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
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input {...field} className="min-h-11" />
                  </FormControl>
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="min-h-11">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="min-h-11">
            {adminT("common.cancel")}
          </Button>
          <Button
            variant="gold"
            type="submit"
            form="upgrade-client-form"
            className="min-h-11"
            disabled={upgrade.isPending}
          >
            Convertir → Client
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
