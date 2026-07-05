"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
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
import { bookingChoiceClass } from "@/components/book/selection-styles";
import { getWilayaName } from "@/lib/algeria-wilayas";
import { step05Schema } from "@/lib/booking-schema";
import { buildBookingLeadPayload } from "@/lib/booking/build-lead-payload";
import { clearBookingSessionId } from "@/lib/booking/booking-session";
import type { BookingFormData } from "@/lib/booking-types";
import { createLead } from "@/lib/actions/leads";
import { ORAN_WILAYA_CODE } from "@/lib/offers/v1-packs-constants";
import {
  computeBookingTotal,
  findPackView,
  type OfferAlaCarteView,
  type OfferPackView,
} from "@/lib/offers/offer-types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { trackFormView, trackLeadConversion } from "@/lib/pixel-events";
import { cn } from "@/lib/utils";

type Step05Values = z.infer<typeof step05Schema>;

type StepProps = {
  data: Partial<BookingFormData>;
  onChange: (patch: Partial<BookingFormData>) => void;
  onSubmitSuccess: () => void;
  onSubmitStart?: () => void;
  errors?: Record<string, string>;
  packs: OfferPackView[];
  alaCarte: OfferAlaCarteView[];
};

function SummaryRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

export function Step05Recap({
  data,
  onChange,
  onSubmitSuccess,
  onSubmitStart,
  errors,
  packs,
  alaCarte,
}: StepProps) {
  const { translations: t, locale } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const proofInputRef = useRef<HTMLInputElement>(null);
  const isFr = locale === "fr";

  useEffect(() => {
    trackFormView("booking_recap");
  }, []);

  const pack = findPackView(packs, data.selectedPackId || undefined);

  const form = useForm<Step05Values>({
    resolver: zodResolver(step05Schema),
    mode: "onChange",
    defaultValues: {
      fullName: data.fullName ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      company: data.company ?? "",
      depositChoice: data.depositChoice ?? "no_deposit",
      depositMethod: data.depositMethod,
      transferProofUrl: data.transferProofUrl ?? "",
    },
  });

  const depositChoice = form.watch("depositChoice");
  const depositMethod = form.watch("depositMethod");
  const transferProofUrl = form.watch("transferProofUrl");

  const syncForm = (values: Partial<Step05Values>) => {
    onChange(values as Partial<BookingFormData>);
  };

  const dateLabel = data.isFlexible
    ? t.booking.flexibleDate
    : data.preferredDate
      ? format(new Date(data.preferredDate), "d MMM yyyy", {
          locale: locale === "fr" ? fr : undefined,
        })
      : null;

  const timeLabel = data.preferredTime
    ? t.booking.timeSlots[data.preferredTime]
    : null;

  const packName = pack ? (isFr ? pack.nameFr : pack.nameEn) : null;

  const alaCarteLabel = useMemo(() => {
    if (!data.alaCarteOptions?.length) return null;
    return data.alaCarteOptions
      .map((slug) => {
        const item = alaCarte.find((i) => i.slug === slug);
        return item ? (isFr ? item.nameFr : item.nameEn) : slug;
      })
      .join(", ");
  }, [data.alaCarteOptions, alaCarte, isFr]);

  const pricing = useMemo(
    () =>
      computeBookingTotal(
        pack,
        alaCarte,
        data.alaCarteOptions ?? [],
        locale === "fr" ? "fr" : "en",
      ),
    [pack, alaCarte, data.alaCarteOptions, locale],
  );

  const mapError = (key: string) => {
    const msg = t.booking.validation[key as keyof typeof t.booking.validation];
    return msg ?? key;
  };

  const showTravelNote = data.wilaya && data.wilaya !== ORAN_WILAYA_CODE;

  const handleProofUpload = async (file: File) => {
    setUploadingProof(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "bookings/deposit-proofs");
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) throw new Error(json.error ?? "Upload failed");
      form.setValue("transferProofUrl", json.url, { shouldValidate: true });
      syncForm({ transferProofUrl: json.url });
    } catch {
      toast.error(t.booking.validation.proofRequired);
    } finally {
      setUploadingProof(false);
    }
  };

  const handleSubmit = async (values: Step05Values) => {
    onSubmitStart?.();
    setSubmitting(true);
    try {
      const pixelEventId = crypto.randomUUID();
      const payload = buildBookingLeadPayload({
        data,
        packs,
        alaCarte,
        locale: locale === "fr" ? "fr" : "en",
        submissionStatus: "completed",
        name: values.fullName,
        phone: values.phone,
        email: values.email || undefined,
        company: values.company || undefined,
        depositChoice: values.depositChoice,
        depositMethod: values.depositMethod,
        transferProofUrl: values.transferProofUrl || undefined,
        pixelEventId,
      });

      const result = await createLead(payload);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      trackLeadConversion({
        contentName: "booking",
        eventId: pixelEventId,
        email: values.email || undefined,
        phone: values.phone,
      });
      clearBookingSessionId();
      onChange({
        fullName: values.fullName,
        phone: values.phone,
        email: values.email || undefined,
        company: values.company || undefined,
        depositChoice: values.depositChoice,
        depositMethod: values.depositMethod,
        transferProofUrl: values.transferProofUrl || undefined,
      });
      onSubmitSuccess();
    } catch {
      toast.error(t.booking.validation.required);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold">{t.booking.recap.title}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{t.booking.recap.hint}</p>
      </div>

      <div className="space-y-2 rounded-xl border border-ink/10 bg-ink/[0.02] p-4">
        <SummaryRow label={t.booking.summary.date} value={dateLabel} />
        <SummaryRow label={t.booking.summary.time} value={timeLabel} />
        <SummaryRow label={t.booking.summary.projectName} value={data.projectName} />
        <SummaryRow
          label={t.booking.summary.wilaya}
          value={data.wilaya ? getWilayaName(data.wilaya) : null}
        />
        <SummaryRow label={t.booking.summary.location} value={data.location} />
        <SummaryRow
          label={t.booking.summary.project}
          value={data.projectType ? t.booking.projectTypes[data.projectType] : null}
        />
        <SummaryRow
          label={t.booking.summary.objective}
          value={data.objective ? t.booking.objectives[data.objective] : null}
        />
        <SummaryRow label={t.booking.summary.offer} value={packName} />
        <SummaryRow label={t.booking.summary.options} value={alaCarteLabel} />
        {showTravelNote && (
          <p className="border-t border-ink/10 pt-2 text-xs text-muted-foreground">
            {t.booking.travelNote}
          </p>
        )}
      </div>

      {pricing.lines.length > 0 && (
        <div className="space-y-2 rounded-xl border border-ink/10 bg-ink/[0.02] p-4">
          <p className="text-sm font-semibold">{t.booking.recap.pricingTitle}</p>
          {pricing.lines.map((line) => (
            <div key={line.label} className="flex justify-between gap-4 text-sm">
              <span className="min-w-0 text-muted-foreground">{line.label}</span>
              <span className="shrink-0 font-medium tabular-nums">{line.display}</span>
            </div>
          ))}
          {pricing.totalDisplay && (
            <div className="flex justify-between gap-4 border-t border-ink/10 pt-2 text-sm font-semibold">
              <span>{t.booking.summary.total}</span>
              <span className="shrink-0 tabular-nums text-ruby">{pricing.totalDisplay}</span>
            </div>
          )}
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold">{t.booking.recap.contactTitle}</h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs">{t.booking.contact.fullName}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="h-10"
                    autoComplete="name"
                    onChange={(e) => {
                      field.onChange(e);
                      syncForm({ fullName: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs">{t.booking.contact.phone}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="tel"
                    inputMode="tel"
                    placeholder="+213 555 123 456"
                    className="h-10"
                    autoComplete="tel"
                    onChange={(e) => {
                      field.onChange(e);
                      syncForm({ phone: e.target.value });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">{t.booking.contact.email}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      className="h-10"
                      autoComplete="email"
                      onChange={(e) => {
                        field.onChange(e);
                        syncForm({ email: e.target.value });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">{t.booking.contact.company}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="h-10"
                      autoComplete="organization"
                      onChange={(e) => {
                        field.onChange(e);
                        syncForm({ company: e.target.value });
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-xs font-medium">{t.booking.deposit.title}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["no_deposit", "deposit_50"] as const).map((choice) => (
                <button
                  key={choice}
                  type="button"
                  className={cn(
                    bookingChoiceClass(depositChoice === choice, "rounded-lg p-3 text-left"),
                  )}
                  onClick={() => {
                    form.setValue("depositChoice", choice);
                    if (choice === "no_deposit") {
                      form.setValue("depositMethod", undefined);
                      form.setValue("transferProofUrl", "");
                      syncForm({
                        depositChoice: choice,
                        depositMethod: undefined,
                        transferProofUrl: undefined,
                      });
                    } else {
                      syncForm({ depositChoice: choice });
                    }
                  }}
                >
                  <p className="text-xs font-semibold">
                    {choice === "no_deposit"
                      ? t.booking.deposit.optionA
                      : t.booking.deposit.optionB}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {choice === "no_deposit"
                      ? t.booking.deposit.optionADesc
                      : t.booking.deposit.optionBDesc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {depositChoice === "deposit_50" && (
            <div className="space-y-3 rounded-xl border border-ink/10 bg-ink/[0.02] p-4">
              <p className="text-xs font-medium">{t.booking.deposit.methodTitle}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {(["cash", "transfer_receipt"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    className={cn(
                      bookingChoiceClass(depositMethod === method, "rounded-lg p-3 text-left"),
                    )}
                    onClick={() => {
                      form.setValue("depositMethod", method, { shouldValidate: true });
                      if (method === "cash") {
                        form.setValue("transferProofUrl", "");
                        syncForm({ depositMethod: method, transferProofUrl: undefined });
                      } else {
                        syncForm({ depositMethod: method });
                      }
                    }}
                  >
                    <p className="text-xs font-semibold">
                      {method === "cash"
                        ? t.booking.deposit.cash
                        : t.booking.deposit.transferReceipt}
                    </p>
                  </button>
                ))}
              </div>

              {depositMethod === "transfer_receipt" && (
                <div className="space-y-2">
                  <p className="text-[11px] text-muted-foreground">
                    {t.booking.deposit.transferProofHint}
                  </p>
                  <input
                    ref={proofInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleProofUpload(file);
                      e.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploadingProof}
                    onClick={() => proofInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-ink/20 py-3 text-sm text-muted-foreground transition hover:border-ruby/40 hover:text-foreground"
                  >
                    {uploadingProof ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t.booking.deposit.transferProofUploading}
                      </>
                    ) : transferProofUrl ? (
                      t.booking.deposit.transferProofUploaded
                    ) : (
                      t.booking.deposit.transferProofAdd
                    )}
                  </button>
                  {transferProofUrl && (
                    <p className="text-xs text-muted-foreground">
                      {t.booking.deposit.transferProof} — {transferProofUrl.split("/").pop()}
                    </p>
                  )}
                  {form.formState.errors.transferProofUrl && (
                    <p className="text-sm text-destructive">
                      {mapError(form.formState.errors.transferProofUrl.message ?? "proofRequired")}
                    </p>
                  )}
                </div>
              )}

              {form.formState.errors.depositMethod && (
                <p className="text-sm text-destructive">
                  {mapError(form.formState.errors.depositMethod.message ?? "required")}
                </p>
              )}
            </div>
          )}

          {errors?.depositChoice && (
            <p className="text-sm text-destructive">{mapError(errors.depositChoice)}</p>
          )}

          <p className="text-[11px] leading-snug text-muted-foreground">{t.booking.gdprNote}</p>

          <Button type="submit" variant="ruby" className="h-11 w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.booking.recap.submitting}
              </>
            ) : (
              t.booking.recap.submit
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
