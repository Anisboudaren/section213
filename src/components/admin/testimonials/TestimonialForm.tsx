"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MediaUploadField } from "@/components/ui/media-upload-field";
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
import { Textarea } from "@/components/ui/textarea";
import { adminT } from "@/lib/i18n/admin-en";
import type { TestimonialDto } from "@/lib/actions/testimonials";

const formSchema = z.object({
  name: z.string().min(1, adminT("form.validation.required")),
  role: z.string().min(1, adminT("form.validation.required")),
  company: z.string().min(1, adminT("form.validation.required")),
  quoteEn: z.string().min(1, adminT("form.validation.required")),
  quoteFr: z.string().min(1, adminT("form.validation.required")),
  quoteAr: z.string().optional(),
  photoUrl: z.string().optional(),
  instagramHandle: z.string().optional(),
  email: z.string().email(adminT("form.validation.email")).optional().or(z.literal("")),
  sortOrder: z.number().int().min(0),
  active: z.boolean(),
});

export type TestimonialFormValues = z.infer<typeof formSchema>;

type TestimonialFormProps = {
  testimonial?: TestimonialDto;
  nextSortOrder?: number;
  onSubmit: (values: TestimonialFormValues) => void;
  formId?: string;
};

export function TestimonialForm({
  testimonial,
  nextSortOrder = 0,
  onSubmit,
  formId = "testimonial-form",
}: TestimonialFormProps) {
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: testimonial?.name ?? "",
      role: testimonial?.role ?? "",
      company: testimonial?.company ?? "",
      quoteEn: testimonial?.quoteEn ?? "",
      quoteFr: testimonial?.quoteFr ?? "",
      quoteAr: testimonial?.quoteAr ?? "",
      photoUrl: testimonial?.photoUrl ?? "",
      instagramHandle: testimonial?.instagramHandle ?? "",
      email: testimonial?.email ?? "",
      sortOrder: testimonial?.sortOrder ?? nextSortOrder,
      active: testimonial?.active ?? true,
    },
  });

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="photoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("testimonials.photo")}</FormLabel>
              <FormControl>
                <MediaUploadField
                  folder="testimonials/avatars"
                  variant="image"
                  shape="circle"
                  value={field.value || undefined}
                  onChange={(url) => field.onChange(url ?? "")}
                />
              </FormControl>
              <FormDescription>{adminT("testimonials.photoHint")}</FormDescription>
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
                <Input {...field} placeholder="Youcef Bouaalm" className="min-h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("testimonials.role")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Responsable marketing" className="min-h-11" />
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
                <FormLabel>{adminT("testimonials.company")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Benamar Promotion · Hôtel Bladi"
                    className="min-h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="quoteFr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("testimonials.quoteFr")}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quoteEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("testimonials.quoteEn")}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quoteAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("testimonials.quoteAr")}</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} dir="rtl" />
              </FormControl>
              <FormDescription>{adminT("testimonials.quoteArHint")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="instagramHandle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("testimonials.instagram")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="youcefbm" className="min-h-11" />
                </FormControl>
                <FormDescription>{adminT("testimonials.instagramHint")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{adminT("testimonials.email")}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="contact@example.com"
                    className="min-h-11"
                  />
                </FormControl>
                <FormDescription>{adminT("testimonials.emailHint")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
          name="active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border border-ink/10 px-3 py-3">
              <div>
                <FormLabel>{adminT("common.active")}</FormLabel>
                <FormDescription>{adminT("testimonials.activeHint")}</FormDescription>
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
