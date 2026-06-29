"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { CaseStudySectionBuilder } from "@/components/admin/case-studies/CaseStudySectionBuilder";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MediaUploadField } from "@/components/ui/media-upload-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { sanitizeSections, type CaseStudySection } from "@/lib/case-study-sections";
import { adminT } from "@/lib/i18n/admin-en";
import { useCreateCaseStudy, useUpdateCaseStudy } from "@/lib/queries/case-studies";
import { slugify } from "@/lib/slugify";
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

type ClientOption = { id: string; company: string };

type CaseStudyEditorProps = {
  caseStudy?: CaseStudy;
  clients: ClientOption[];
};

export function CaseStudyEditor({ caseStudy, clients }: CaseStudyEditorProps) {
  const router = useRouter();
  const isEdit = !!caseStudy;
  const createCaseStudy = useCreateCaseStudy();
  const updateCaseStudy = useUpdateCaseStudy();
  const saving = createCaseStudy.isPending || updateCaseStudy.isPending;

  const [title, setTitle] = useState(caseStudy?.title ?? "");
  const [slug, setSlug] = useState(caseStudy?.slug ?? "");
  const [clientId, setClientId] = useState(caseStudy?.clientId ?? "");
  const [clientName, setClientName] = useState(caseStudy?.clientName ?? "");
  const [industry, setIndustry] = useState(caseStudy?.industry ?? "");
  const [categoryLabel, setCategoryLabel] = useState(caseStudy?.categoryLabel ?? "");
  const [excerpt, setExcerpt] = useState(caseStudy?.excerpt ?? "");
  const [videoUrl, setVideoUrl] = useState(caseStudy?.videoUrl ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(caseStudy?.thumbnailUrl ?? "");
  const [services, setServices] = useState<string[]>(caseStudy?.services ?? []);
  const [sections, setSections] = useState<CaseStudySection[]>(caseStudy?.sections ?? []);
  const [published, setPublished] = useState(caseStudy?.published ?? false);
  const [featured, setFeatured] = useState(caseStudy?.featured ?? false);
  const [order, setOrder] = useState(caseStudy?.order ?? 1);
  const [slugTouched, setSlugTouched] = useState(!!caseStudy?.slug);

  useEffect(() => {
    if (!slugTouched && title) {
      setSlug(slugify(title));
    }
  }, [title, slugTouched]);

  const buildPayload = () => {
    const cleanedSections = sanitizeSections(sections);
    const results =
      cleanedSections.find((s) => s.type === "stats")?.items ??
      caseStudy?.results ??
      [];

    return {
      slug: slug || slugify(title),
      title: title.trim(),
      clientId: clientId || undefined,
      clientName: clientName.trim(),
      industry: industry.trim() || undefined,
      categoryLabel: categoryLabel.trim() || undefined,
      excerpt: excerpt.trim() || undefined,
      videoUrl: videoUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      services,
      results,
      sections: cleanedSections,
      published,
      featured,
      sortOrder: order,
    };
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error(adminT("form.validation.required"));
      return;
    }
    if (!videoUrl.trim()) {
      toast.error(adminT("caseStudies.heroVideoRequired"));
      return;
    }
    if (!clientName.trim()) {
      toast.error(adminT("form.validation.required"));
      return;
    }

    const payload = buildPayload();

    try {
      if (isEdit && caseStudy) {
        await updateCaseStudy.mutateAsync({ id: caseStudy.id, data: payload });
        toast.success("Étude de cas mise à jour");
      } else {
        const created = await createCaseStudy.mutateAsync(payload);
        toast.success("Étude de cas créée");
        router.push(`/admin/case-studies/${created.id}/edit`);
        return;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="sticky top-0 z-20 border-b border-ink/10 bg-background/95 px-4 py-3 backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="shrink-0" asChild>
              <Link href="/admin/case-studies">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="font-display text-xl tracking-wide text-ink md:text-2xl">
                {isEdit ? adminT("caseStudies.editCaseStudy") : adminT("caseStudies.addCaseStudy")}
              </h1>
              {title && <p className="text-sm text-muted-foreground line-clamp-1">{title}</p>}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isEdit && published && slug && (
              <Button variant="outline" size="sm" className="min-h-10" asChild>
                <Link href={`/case-studies/${slug}`} target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {adminT("caseStudies.preview")}
                </Link>
              </Button>
            )}
            <Button variant="gold" className="min-h-11" disabled={saving} onClick={() => void handleSave()}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {adminT("common.save")}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <CaseStudySectionBuilder sections={sections} onChange={setSections} />

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-ink">{adminT("caseStudies.metaTitle")}</h2>

              <div>
                <Label>{adminT("common.title")}</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 min-h-11" />
              </div>

              <div>
                <Label>{adminT("caseStudies.slug")}</Label>
                <Input
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  className="mt-1 min-h-11"
                />
              </div>

              <div>
                <Label>{adminT("caseStudies.selectClient")}</Label>
                <Select
                  value={clientId || "none"}
                  onValueChange={(v) => {
                    const id = v === "none" ? "" : v;
                    setClientId(id);
                    const client = clients.find((c) => c.id === id);
                    if (client) setClientName(client.company);
                  }}
                >
                  <SelectTrigger className="mt-1 min-h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">—</SelectItem>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{adminT("caseStudies.clientOverride")}</Label>
                <Input value={clientName} onChange={(e) => setClientName(e.target.value)} className="mt-1 min-h-11" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div>
                  <Label>{adminT("caseStudies.categoryLabel")}</Label>
                  <Input
                    value={categoryLabel}
                    onChange={(e) => setCategoryLabel(e.target.value)}
                    className="mt-1 min-h-11"
                  />
                </div>
                <div>
                  <Label>{adminT("common.industry")}</Label>
                  <Input value={industry} onChange={(e) => setIndustry(e.target.value)} className="mt-1 min-h-11" />
                </div>
              </div>

              <div>
                <Label>{adminT("caseStudies.excerpt")}</Label>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="mt-1 text-sm"
                  placeholder={adminT("caseStudies.excerptHint")}
                />
              </div>
            </div>

            <div className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm space-y-4">
              <h2 className="font-semibold text-ink">{adminT("caseStudies.heroMedia")}</h2>
              <div>
                <Label>{adminT("caseStudies.videoUrl")}</Label>
                <MediaUploadField
                  folder="case-studies/videos"
                  variant="video"
                  value={videoUrl || undefined}
                  onChange={(url) => setVideoUrl(url ?? "")}
                  className="mt-1"
                />
                <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="mt-2 min-h-11" />
              </div>
              <div>
                <Label>{adminT("caseStudies.thumbnailUrl")}</Label>
                <MediaUploadField
                  folder="case-studies/thumbnails"
                  variant="image"
                  value={thumbnailUrl || undefined}
                  onChange={(url) => setThumbnailUrl(url ?? "")}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm space-y-3">
              <Label>{adminT("common.services")}</Label>
              <div className="grid grid-cols-1 gap-2">
                {SERVICE_OPTIONS.map((service) => (
                  <label key={service} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={services.includes(service)}
                      onCheckedChange={(checked) => {
                        setServices((prev) =>
                          checked ? [...prev, service] : prev.filter((s) => s !== service),
                        );
                      }}
                    />
                    {service}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm space-y-4">
              <div>
                <Label>{adminT("common.order")}</Label>
                <Input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value) || 0)}
                  className="mt-1 min-h-11"
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label>{adminT("caseStudies.publishToggle")}</Label>
                <Switch checked={published} onCheckedChange={setPublished} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label>{adminT("caseStudies.featured")}</Label>
                <Switch checked={featured} onCheckedChange={setFeatured} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
