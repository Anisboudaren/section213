"use client";

import { useEffect } from "react";
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
import { MediaUploadField } from "@/components/ui/media-upload-field";
import { adminT } from "@/lib/i18n/admin-en";
import type { Client, ClientStatus } from "@/lib/types/admin";
import { getAvatarColorClass, getInitials } from "@/lib/utils/client-helpers";
import { cn } from "@/lib/utils";

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
  logoUrl: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;

const STATUSES: ClientStatus[] = ["active", "inactive", "vip"];

function getDefaultValues(client?: Client): ClientFormValues {
  return {
    name: client?.name ?? "",
    company: client?.company ?? "",
    phone: client?.phone ?? "",
    email: client?.email ?? "",
    industry: client?.industry ?? "",
    status: client?.status ?? "active",
    notes: client?.notes ?? "",
    totalRevenue: client?.totalRevenue,
    showOnWebsite: client?.showOnWebsite ?? false,
    logoUrl: client?.logoUrl ?? "",
  };
}

type ClientFormProps = {
  client?: Client;
  onSubmit: (values: ClientFormValues) => void;
  formId?: string;
};

export function ClientForm({ client, onSubmit, formId = "client-form" }: ClientFormProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    mode: "onChange",
    defaultValues: getDefaultValues(client),
  });

  useEffect(() => {
    form.reset(getDefaultValues(client));
  }, [client?.id, form]);

  const company = form.watch("company");
  const name = form.watch("name");
  const logoUrl = form.watch("logoUrl");
  const displayName = company || name || "?";
  const initials = getInitials(displayName);
  const avatarColor = getAvatarColorClass(displayName);

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 px-0.5 pb-1"
      >
        <div className="flex flex-col items-center gap-3 border-b border-border/60 pb-6 pt-1">
          <FormField
            control={form.control}
            name="logoUrl"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center space-y-0">
                <FormControl>
                  <MediaUploadField
                    key={logoUrl || "no-logo"}
                    folder="clients/logos"
                    variant="image"
                    shape="circle"
                    value={logoUrl || undefined}
                    onChange={(url) => {
                      const next = url ?? "";
                      field.onChange(next);
                      form.setValue("logoUrl", next, { shouldDirty: true, shouldValidate: true });
                    }}
                    label={adminT("clients.logoHint")}
                    fallback={
                      <span
                        className={cn(
                          "flex size-full items-center justify-center font-display text-xl tracking-wide",
                          avatarColor,
                        )}
                      >
                        {initials}
                      </span>
                    }
                  />
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
          <div className="text-center">
            <p className="font-display text-lg tracking-wide text-ink">
              {company || adminT("clients.newClientPlaceholder")}
            </p>
            {name && <p className="text-sm text-muted-foreground">{name}</p>}
          </div>
        </div>

        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {adminT("clients.sections.identity")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
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
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {adminT("clients.sections.contact")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{adminT("common.email")}</FormLabel>
                  <FormControl>
                    <Input type="email" inputMode="email" {...field} className="min-h-11" />
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
                    <Input type="tel" inputMode="tel" {...field} className="min-h-11" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {adminT("clients.sections.business")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{adminT("common.status")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="min-h-11 w-full">
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
            <FormField
              control={form.control}
              name="totalRevenue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{adminT("clients.totalRevenue")} (DZD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      className="min-h-11"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="showOnWebsite"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between gap-4 rounded-xl border border-border/80 bg-muted/20 p-4">
                <div className="space-y-0.5 pr-2">
                  <FormLabel className="text-base">{adminT("common.showOnWebsite")}</FormLabel>
                  <p className="text-xs text-muted-foreground">
                    {adminT("clients.showOnWebsiteHint")}
                  </p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {adminT("clients.sections.notes")}
          </h3>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">{adminT("common.notes")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder={adminT("clients.notesPlaceholder")}
                    className="min-h-[6rem] resize-y"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </section>
      </form>
    </Form>
  );
}
