"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { Switch } from "@/components/ui/switch";
import { adminT } from "@/lib/i18n/admin-en";
import type { Client, ClientStatus } from "@/lib/types/admin";

const clientFormSchema = z.object({
  name: z.string().min(1, adminT("form.validation.required")),
  company: z.string().min(1, adminT("form.validation.required")),
  phone: z.string().optional(),
  email: z.string().email(adminT("form.validation.email")).optional().or(z.literal("")),
  industry: z.string().optional(),
  status: z.enum(["active", "inactive", "vip"]),
  notes: z.string(),
  totalRevenue: z.number().optional(),
  showOnWebsite: z.boolean(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

const STATUSES: ClientStatus[] = ["active", "inactive", "vip"];

type ClientFormProps = {
  client?: Client;
  onSubmit: (values: ClientFormValues) => void;
  formId?: string;
};

export function ClientForm({ client, onSubmit, formId = "client-form" }: ClientFormProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    mode: "onChange",
    defaultValues: {
      name: client?.name ?? "",
      company: client?.company ?? "",
      phone: client?.phone ?? "",
      email: client?.email ?? "",
      industry: client?.industry ?? "",
      status: client?.status ?? "active",
      notes: client?.notes ?? "",
      totalRevenue: client?.totalRevenue,
      showOnWebsite: client?.showOnWebsite ?? false,
    },
  });

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
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
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
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("common.phone")}</FormLabel>
                <FormControl>
                  <Input {...field} className="min-h-11" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("common.industry")}</FormLabel>
                <FormControl>
                  <Input {...field} className="min-h-11" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("common.status")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="min-h-11">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {adminT(`clients.statuses.${s}` as Parameters<typeof adminT>[0])}
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
          name="totalRevenue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("clients.totalRevenue")} (DZD)</FormLabel>
              <FormControl>
                <Input type="number" {...field} className="min-h-11" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="showOnWebsite"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <FormLabel>{adminT("common.showOnWebsite")}</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
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
                <Textarea {...field} rows={3} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
