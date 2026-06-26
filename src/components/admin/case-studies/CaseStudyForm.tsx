"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { MediaUploadField } from "@/components/ui/media-upload-field";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminStore } from "@/lib/admin-store";
import { adminT } from "@/lib/i18n/admin-en";
import type { CaseStudy } from "@/lib/types/admin";

const SERVICE_OPTIONS = [
  "Reels Production",
  "Website",
  "Brand Identity",
  "Social Content",
  "Photography",
  "Automations",
  "Video Production",
  "Carousels",
];

const caseStudySchema = z.object({
  title: z.string().min(1, adminT("form.validation.required")),
  clientId: z.string().optional(),
  clientName: z.string().min(1, adminT("form.validation.required")),
  industry: z.string().optional(),
  videoUrl: z.string().min(1, adminT("form.validation.required")),
  thumbnailUrl: z.string().optional(),
  services: z.array(z.string()),
  results: z.array(
    z.object({
      label: z.string().min(1),
      value: z.string().min(1),
    }),
  ),
  published: z.boolean(),
  order: z.number(),
});

export type CaseStudyFormValues = z.infer<typeof caseStudySchema>;

type CaseStudyFormProps = {
  caseStudy?: CaseStudy;
  onSubmit: (values: CaseStudyFormValues) => void;
  formId?: string;
};

export function CaseStudyForm({
  caseStudy,
  onSubmit,
  formId = "case-study-form",
}: CaseStudyFormProps) {
  const { clients } = useAdminStore();

  const form = useForm<CaseStudyFormValues>({
    resolver: zodResolver(caseStudySchema),
    mode: "onChange",
    defaultValues: {
      title: caseStudy?.title ?? "",
      clientId: caseStudy?.clientId ?? "",
      clientName: caseStudy?.clientName ?? "",
      industry: caseStudy?.industry ?? "",
      videoUrl: caseStudy?.videoUrl ?? "",
      thumbnailUrl: caseStudy?.thumbnailUrl ?? "",
      services: caseStudy?.services ?? [],
      results: caseStudy?.results ?? [{ label: "", value: "" }],
      published: caseStudy?.published ?? false,
      order: caseStudy?.order ?? 1,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "results",
  });

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} className="min-h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("caseStudies.selectClient")}</FormLabel>
              <Select
                value={field.value ?? "none"}
                onValueChange={(v) => {
                  const id = v === "none" ? undefined : v;
                  field.onChange(id);
                  const client = clients.find((c) => c.id === id);
                  if (client) form.setValue("clientName", client.company);
                }}
              >
                <FormControl>
                  <SelectTrigger className="min-h-11">
                    <SelectValue placeholder={adminT("caseStudies.selectClient")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">—</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("caseStudies.clientOverride")}</FormLabel>
              <FormControl>
                <Input {...field} className="min-h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("caseStudies.videoUrl")}</FormLabel>
              <FormControl>
                <MediaUploadField
                  folder="case-studies/videos"
                  variant="video"
                  value={field.value || undefined}
                  onChange={(url) => field.onChange(url ?? "")}
                />
              </FormControl>
              <Input {...field} placeholder="/vids/example.mp4" className="min-h-11 mt-2" />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("caseStudies.thumbnailUrl")}</FormLabel>
              <FormControl>
                <MediaUploadField
                  folder="case-studies/thumbnails"
                  variant="image"
                  value={field.value || undefined}
                  onChange={(url) => field.onChange(url ?? "")}
                />
              </FormControl>
              <Input {...field} className="min-h-11 mt-2" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="services"
          render={() => (
            <FormItem>
              <FormLabel>{adminT("common.services")}</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {SERVICE_OPTIONS.map((service) => (
                  <FormField
                    key={service}
                    control={form.control}
                    name="services"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(service)}
                            onCheckedChange={(checked) => {
                              const next = checked
                                ? [...(field.value ?? []), service]
                                : field.value?.filter((s) => s !== service) ?? [];
                              field.onChange(next);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">{service}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>{adminT("common.results")}</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <FormField
                control={form.control}
                name={`results.${index}.label`}
                render={({ field: f }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...f} placeholder="Label" className="min-h-11" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`results.${index}.value`}
                render={({ field: f }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...f} placeholder="Value" className="min-h-11" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="min-h-11"
                onClick={() => remove(index)}
              >
                {adminT("common.removeRow")}
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11"
            onClick={() => append({ label: "", value: "" })}
          >
            {adminT("common.addRow")}
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("common.order")}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} className="min-h-11" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3 mt-6">
                <FormLabel>{adminT("caseStudies.publishToggle")}</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
