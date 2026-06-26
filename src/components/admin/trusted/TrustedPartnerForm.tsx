"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MediaUploadField } from "@/components/ui/media-upload-field";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { adminT } from "@/lib/i18n/admin-en";
import type { TrustedPartnerDto } from "@/lib/actions/trusted-partners";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, adminT("form.validation.required")),
  imageUrl: z.string().min(1, adminT("form.validation.required")),
  linkUrl: z.string().optional(),
  whiteFilter: z.boolean(),
  sortOrder: z.number().int().min(0),
  active: z.boolean(),
});

export type TrustedPartnerFormValues = z.infer<typeof formSchema>;

type TrustedPartnerFormProps = {
  partner?: TrustedPartnerDto;
  nextSortOrder?: number;
  onSubmit: (values: TrustedPartnerFormValues) => void;
  formId?: string;
};

export function TrustedPartnerForm({
  partner,
  nextSortOrder = 0,
  onSubmit,
  formId = "trusted-partner-form",
}: TrustedPartnerFormProps) {
  const form = useForm<TrustedPartnerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: partner?.name ?? "",
      imageUrl: partner?.imageUrl ?? "",
      linkUrl: partner?.linkUrl ?? "",
      whiteFilter: partner?.whiteFilter ?? false,
      sortOrder: partner?.sortOrder ?? nextSortOrder,
      active: partner?.active ?? true,
    },
  });

  const imageUrl = form.watch("imageUrl");
  const whiteFilter = form.watch("whiteFilter");

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("common.name")}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Nova Florida" className="min-h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("trusted.logo")}</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <MediaUploadField
                    folder="clients/logos"
                    variant="image"
                    value={field.value || undefined}
                    onChange={(url) => field.onChange(url ?? "")}
                  />
                  <Input
                    {...field}
                    placeholder="/portfolio/nova florida.png"
                    className="min-h-11"
                  />
                  {imageUrl ? (
                    <div className="flex min-h-[5rem] items-center justify-center rounded-lg border border-ink/10 bg-ink p-4">
                      <Image
                        src={imageUrl}
                        alt=""
                        width={160}
                        height={64}
                        unoptimized={
                          imageUrl.startsWith("http") ||
                          imageUrl.includes("blob.vercel-storage.com")
                        }
                        className={cn(
                          "max-h-14 w-auto object-contain",
                          whiteFilter && "brightness-0 invert",
                        )}
                      />
                    </div>
                  ) : null}
                </div>
              </FormControl>
              <FormDescription>{adminT("trusted.logoHint")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("trusted.link")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="url"
                  placeholder="https://example.com"
                  className="min-h-11"
                />
              </FormControl>
              <FormDescription>{adminT("trusted.linkHint")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("common.order")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    className="min-h-11"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whiteFilter"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <div className="flex items-center justify-between rounded-lg border border-ink/10 px-3 py-3">
                  <div>
                    <FormLabel className="text-sm">{adminT("trusted.whiteFilter")}</FormLabel>
                    <FormDescription className="text-xs">
                      {adminT("trusted.whiteFilterHint")}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-ink/10 px-3 py-3">
              <div>
                <FormLabel>{adminT("common.active")}</FormLabel>
                <FormDescription>{adminT("trusted.activeHint")}</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
