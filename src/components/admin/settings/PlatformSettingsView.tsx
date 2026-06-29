"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Mail,
  Palette,
  Save,
  Search,
  Settings2,
  Sparkles,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AccentPresetPicker } from "@/components/admin/settings/AccentPresetPicker";
import { BrandAssetField } from "@/components/admin/settings/BrandAssetField";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { FAVICON_PATH, LOGO_PATH } from "@/lib/site-brand";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAccentColor } from "@/lib/accent-color/AccentColorProvider";
import { adminT } from "@/lib/i18n/admin-en";
import { useUpdateSiteSettings } from "@/lib/queries/site-settings";
import {
  updateSiteSettingsSchema,
  type UpdateSiteSettingsInput,
} from "@/lib/schemas/site-settings-schema";
import type { SiteSettingsDto } from "@/lib/site-settings-defaults";
import { cn } from "@/lib/utils";

type PlatformSettingsViewProps = {
  initialSettings: SiteSettingsDto;
};

function settingsToFormValues(settings: SiteSettingsDto): UpdateSiteSettingsInput {
  return {
    siteName: settings.siteName,
    siteTitle: settings.siteTitle,
    siteDescription: settings.siteDescription,
    accentPresetId: settings.accentPresetId,
    enabledAccentPresetIds: settings.enabledAccentPresetIds,
    defaultLocale: settings.defaultLocale,
    contactEmail: settings.contactEmail ?? "",
    contactPhone: settings.contactPhone ?? "",
    contactAddress: settings.contactAddress ?? "",
    contactCity: settings.contactCity ?? "",
    contactHoursFr: settings.contactHoursFr ?? "",
    contactHoursEn: settings.contactHoursEn ?? "",
    whatsappNumber: settings.whatsappNumber ?? "",
    instagramHandle: settings.instagramHandle ?? "",
    facebookUrl: settings.facebookUrl ?? "",
    tiktokHandle: settings.tiktokHandle ?? "",
    youtubeUrl: settings.youtubeUrl ?? "",
    linkedinUrl: settings.linkedinUrl ?? "",
    mapsUrl: settings.mapsUrl ?? "",
    ogImageUrl: settings.ogImageUrl ?? "",
    logoUrl: settings.logoUrl ?? "",
    faviconUrl: settings.faviconUrl ?? "",
    bookingEnabled: settings.bookingEnabled,
    maintenanceMode: settings.maintenanceMode,
  };
}

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-gold">
      {children}
    </span>
  );
}

export function PlatformSettingsView({ initialSettings }: PlatformSettingsViewProps) {
  const updateSettings = useUpdateSiteSettings();
  const { setPresetId } = useAccentColor();
  const [settings, setSettings] = useState(initialSettings);

  const form = useForm<UpdateSiteSettingsInput>({
    resolver: zodResolver(updateSiteSettingsSchema),
    defaultValues: settingsToFormValues(settings),
  });

  useEffect(() => {
    form.reset(settingsToFormValues(settings));
  }, [settings, form]);

  const accentPresetId = form.watch("accentPresetId");
  const enabledAccentPresetIds = form.watch("enabledAccentPresetIds");
  const siteName = form.watch("siteName");
  const siteTitle = form.watch("siteTitle");
  const logoUrl = form.watch("logoUrl");
  const faviconUrl = form.watch("faviconUrl");
  const previewLogoUrl = logoUrl || LOGO_PATH;
  const previewFaviconUrl = faviconUrl || `${FAVICON_PATH}?v=${settings.updatedAt}`;

  useEffect(() => {
    setPresetId(accentPresetId);
  }, [accentPresetId, setPresetId]);

  const toggleEnabledAccent = (id: string) => {
    const current = form.getValues("enabledAccentPresetIds");
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    if (next.length === 0) {
      toast.error("Au moins un accent doit rester disponible");
      return;
    }
    form.setValue("enabledAccentPresetIds", next, { shouldDirty: true });
    if (!next.includes(accentPresetId)) {
      form.setValue("accentPresetId", next[0], { shouldDirty: true });
    }
  };

  const onSubmit = async (values: UpdateSiteSettingsInput) => {
    try {
      const updated = await updateSettings.mutateAsync(values);
      setSettings(updated);
      setPresetId(updated.accentPresetId);
      toast.success("Paramètres enregistrés");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const saveButton = (
    <Button
      type="submit"
      variant="gold"
      className="min-h-11 w-full sm:w-auto"
      disabled={updateSettings.isPending}
      form="platform-settings-form"
    >
      {updateSettings.isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {adminT("common.saving")}
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          {adminT("common.save")}
        </>
      )}
    </Button>
  );

  return (
    <AdminPageShell
      title={adminT("settings.platform.title")}
      description={adminT("settings.platform.description")}
    >
      <Form {...form}>
        <form
          id="platform-settings-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid w-full gap-5 pb-24 sm:pb-8 xl:grid-cols-2 xl:items-start xl:gap-8"
        >
          {/* Brand identity — left column on desktop */}
          <section className="overflow-hidden rounded-2xl border border-ink/10 bg-card shadow-sm xl:sticky xl:top-6">
            <div className="border-b border-ink/10 bg-gradient-to-r from-ink/[0.04] via-gold/5 to-ruby/5 px-4 py-4 sm:px-6">
              <div className="flex items-start gap-3">
                <SectionIcon>
                  <Sparkles className="h-4 w-4" />
                </SectionIcon>
                <div>
                  <h2 className="font-display text-lg tracking-wide">
                    {adminT("settings.platform.brandTitle")}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {adminT("settings.platform.brandDescription")}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-4 sm:p-6">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{adminT("settings.platform.siteName")}</FormLabel>
                    <FormControl>
                      <Input {...field} className="min-h-11 font-medium" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <BrandAssetField
                          label={adminT("settings.platform.logo")}
                          hint={adminT("settings.platform.logoHint")}
                          kind="logo"
                          siteName={siteName}
                          value={field.value || undefined}
                          onChange={(url) => {
                            const next = url ?? "";
                            field.onChange(next);
                            form.setValue("logoUrl", next, { shouldDirty: true });
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="faviconUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <BrandAssetField
                          label={adminT("settings.platform.favicon")}
                          hint={adminT("settings.platform.faviconHint")}
                          kind="favicon"
                          siteName={siteTitle || siteName}
                          value={field.value || undefined}
                          onChange={(url) => {
                            const next = url ?? "";
                            field.onChange(next);
                            form.setValue("faviconUrl", next, { shouldDirty: true });
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Live preview strip */}
              <div className="rounded-xl border border-dashed border-ink/15 bg-muted/30 p-3 sm:p-4">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {adminT("settings.platform.livePreview")}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 rounded-lg bg-ink px-3 py-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewLogoUrl} alt="" className="h-6 max-w-[120px] object-contain" />
                    {!logoUrl && (
                      <span className="text-[10px] text-white/45">Par défaut</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-ink/10 bg-background px-2 py-1.5 text-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewFaviconUrl} alt="" className="h-4 w-4 object-contain" />
                    {!faviconUrl && (
                      <span className="text-[10px] text-muted-foreground">Par défaut</span>
                    )}
                    <span className="truncate max-w-[180px]">{siteTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Settings — right column on desktop */}
          <div className="flex min-w-0 flex-col gap-5">
          <Accordion
            type="multiple"
            defaultValue={["seo"]}
            className="overflow-hidden rounded-2xl border border-ink/10 bg-card px-4 sm:px-6"
          >
            <AccordionItem value="seo" className="border-ink/10">
              <AccordionTrigger className="min-h-12 py-4 hover:no-underline">
                <span className="flex items-center gap-3 text-left">
                  <SectionIcon>
                    <Search className="h-4 w-4" />
                  </SectionIcon>
                  <span>
                    <span className="block font-display text-base tracking-wide">
                      {adminT("settings.platform.seoTitle")}
                    </span>
                    <span className="block text-xs font-normal text-muted-foreground">
                      {adminT("settings.platform.seoDescription")}
                    </span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-6">
                <FormField
                  control={form.control}
                  name="siteTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{adminT("settings.platform.siteTitle")}</FormLabel>
                      <FormControl>
                        <Input {...field} className="min-h-11" />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        {adminT("settings.platform.siteTitleHint")}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="siteDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{adminT("settings.platform.siteDescription")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} className="resize-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ogImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{adminT("settings.platform.ogImage")}</FormLabel>
                      <FormControl>
                        <Input {...field} className="min-h-11" placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="accent" className="border-ink/10">
              <AccordionTrigger className="min-h-12 py-4 hover:no-underline">
                <span className="flex items-center gap-3 text-left">
                  <SectionIcon>
                    <Palette className="h-4 w-4" />
                  </SectionIcon>
                  <span>
                    <span className="block font-display text-base tracking-wide">
                      {adminT("settings.platform.accentTitle")}
                    </span>
                    <span className="block text-xs font-normal text-muted-foreground">
                      {adminT("settings.platform.accentDescription")}
                    </span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-5 pb-6">
                <div className="space-y-2">
                  <Label>{adminT("settings.platform.mainAccent")}</Label>
                  <AccentPresetPicker
                    value={accentPresetId}
                    onChange={(id) => form.setValue("accentPresetId", id, { shouldDirty: true })}
                    enabledIds={enabledAccentPresetIds}
                  />
                </div>
                <details className="rounded-lg border border-ink/10 bg-muted/20 p-3">
                  <summary className="cursor-pointer text-sm font-medium">
                    {adminT("settings.platform.availableAccents")}
                  </summary>
                  <p className="mt-2 mb-3 text-xs text-muted-foreground">
                    {adminT("settings.platform.availableAccentsHint")}
                  </p>
                  <AccentPresetPicker
                    mode="multi"
                    value={accentPresetId}
                    onChange={() => {}}
                    selectedIds={enabledAccentPresetIds}
                    onToggle={toggleEnabledAccent}
                  />
                </details>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact" className="border-ink/10">
              <AccordionTrigger className="min-h-12 py-4 hover:no-underline">
                <span className="flex items-center gap-3 text-left">
                  <SectionIcon>
                    <Mail className="h-4 w-4" />
                  </SectionIcon>
                  <span>
                    <span className="block font-display text-base tracking-wide">
                      {adminT("settings.platform.contactTitle")}
                    </span>
                    <span className="block text-xs font-normal text-muted-foreground">
                      Email, téléphone, réseaux
                    </span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{adminT("settings.platform.contactEmail")}</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} className="min-h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{adminT("settings.platform.contactPhone")}</FormLabel>
                        <FormControl>
                          <Input {...field} className="min-h-11" placeholder="+213..." />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="whatsappNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{adminT("settings.platform.whatsapp")}</FormLabel>
                        <FormControl>
                          <Input {...field} className="min-h-11" placeholder="+213..." />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instagramHandle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input {...field} className="min-h-11" placeholder="@section213" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="contactAddress"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>{adminT("settings.platform.contactAddress")}</FormLabel>
                        <FormControl>
                          <Input {...field} className="min-h-11" placeholder="Adresse, quartier…" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{adminT("settings.platform.contactCity")}</FormLabel>
                        <FormControl>
                          <Input {...field} className="min-h-11" placeholder="Oran, Algérie" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mapsUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{adminT("settings.platform.mapsUrl")}</FormLabel>
                        <FormControl>
                          <Input {...field} className="min-h-11" placeholder="https://maps.google.com/…" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactHoursFr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{adminT("settings.platform.contactHoursFr")}</FormLabel>
                        <FormControl>
                          <Input {...field} className="min-h-11" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactHoursEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{adminT("settings.platform.contactHoursEn")}</FormLabel>
                        <FormControl>
                          <Input {...field} className="min-h-11" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <p className="mb-3 text-xs font-medium text-muted-foreground">
                    {adminT("settings.platform.socialLinks")}
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="facebookUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook</FormLabel>
                          <FormControl>
                            <Input {...field} className="min-h-11" placeholder="https://facebook.com/…" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tiktokHandle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>TikTok</FormLabel>
                          <FormControl>
                            <Input {...field} className="min-h-11" placeholder="@section213" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="youtubeUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube</FormLabel>
                          <FormControl>
                            <Input {...field} className="min-h-11" placeholder="https://youtube.com/…" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="linkedinUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <Input {...field} className="min-h-11" placeholder="https://linkedin.com/…" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="general" className="border-ink/10 border-b-0">
              <AccordionTrigger className="min-h-12 py-4 hover:no-underline">
                <span className="flex items-center gap-3 text-left">
                  <SectionIcon>
                    <Settings2 className="h-4 w-4" />
                  </SectionIcon>
                  <span>
                    <span className="block font-display text-base tracking-wide">
                      {adminT("settings.platform.generalTitle")}
                    </span>
                    <span className="block text-xs font-normal text-muted-foreground">
                      Langue, réservation, maintenance
                    </span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pb-6">
                <FormField
                  control={form.control}
                  name="defaultLocale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{adminT("settings.platform.defaultLocale")}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="min-h-11 w-full sm:w-48">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bookingEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-4 rounded-xl border border-ink/10 p-3 sm:p-4">
                      <div className="min-w-0">
                        <FormLabel className="text-sm">{adminT("settings.platform.bookingEnabled")}</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          {adminT("settings.platform.bookingEnabledHint")}
                        </p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maintenanceMode"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between gap-4 rounded-xl border border-ink/10 p-3 sm:p-4">
                      <div className="min-w-0">
                        <FormLabel className="text-sm">{adminT("settings.platform.maintenanceMode")}</FormLabel>
                        <p className="text-xs text-muted-foreground">
                          {adminT("settings.platform.maintenanceModeHint")}
                        </p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="hidden justify-end sm:flex">{saveButton}</div>
          </div>
        </form>
      </Form>

      {/* Mobile sticky save */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-background/95 p-4 backdrop-blur-sm sm:hidden",
        )}
      >
        {saveButton}
      </div>
    </AdminPageShell>
  );
}
