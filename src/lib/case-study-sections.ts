import { z } from "zod";

import type { CaseStudyResult } from "@/lib/schemas/case-study-schema";

export const CASE_STUDY_SECTION_TYPES = [
  "text",
  "media",
  "stats",
  "gallery",
  "quote",
  "split",
] as const;

export type CaseStudySectionType = (typeof CASE_STUDY_SECTION_TYPES)[number];

const mediaTypeSchema = z.enum(["image", "video"]);

const galleryItemSchema = z.object({
  url: z.string().min(1),
  mediaType: mediaTypeSchema,
  caption: z.string().optional(),
});

const statItemSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const baseSection = z.object({ id: z.string().min(1) });

export const caseStudySectionSchema = z.discriminatedUnion("type", [
  baseSection.extend({
    type: z.literal("text"),
    heading: z.string().optional(),
    body: z.string().min(1),
  }),
  baseSection.extend({
    type: z.literal("media"),
    url: z.string().min(1),
    mediaType: mediaTypeSchema,
    caption: z.string().optional(),
    fullWidth: z.boolean().default(true),
  }),
  baseSection.extend({
    type: z.literal("stats"),
    heading: z.string().optional(),
    items: z.array(statItemSchema).min(1),
  }),
  baseSection.extend({
    type: z.literal("gallery"),
    heading: z.string().optional(),
    items: z.array(galleryItemSchema).min(1),
  }),
  baseSection.extend({
    type: z.literal("quote"),
    text: z.string().min(1),
    attribution: z.string().optional(),
  }),
  baseSection.extend({
    type: z.literal("split"),
    heading: z.string().optional(),
    body: z.string().min(1),
    url: z.string().min(1),
    mediaType: mediaTypeSchema,
    caption: z.string().optional(),
    mediaPosition: z.enum(["left", "right"]).default("right"),
  }),
]);

export type CaseStudySection = z.infer<typeof caseStudySectionSchema>;

export type CaseStudySectionDraft = CaseStudySection;

export function newSectionId(): string {
  return `sec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function createEmptySection(type: CaseStudySectionType): CaseStudySectionDraft {
  const id = newSectionId();
  switch (type) {
    case "text":
      return { id, type: "text", heading: "", body: "" };
    case "media":
      return { id, type: "media", url: "", mediaType: "video", caption: "", fullWidth: true };
    case "stats":
      return { id, type: "stats", heading: "", items: [{ label: "", value: "" }] };
    case "gallery":
      return {
        id,
        type: "gallery",
        heading: "",
        items: [{ url: "", mediaType: "image", caption: "" }],
      };
    case "quote":
      return { id, type: "quote", text: "", attribution: "" };
    case "split":
      return {
        id,
        type: "split",
        heading: "",
        body: "",
        url: "",
        mediaType: "image",
        caption: "",
        mediaPosition: "right",
      };
  }
}

export function parseCaseStudySections(raw: unknown): CaseStudySection[] {
  if (!Array.isArray(raw)) return [];
  const parsed: CaseStudySection[] = [];
  for (const item of raw) {
    const result = caseStudySectionSchema.safeParse(item);
    if (result.success) parsed.push(result.data);
  }
  return parsed;
}

/** Build sections from legacy excerpt + results when `sections` is empty. */
export function legacySectionsFromFields(
  excerpt?: string,
  results?: CaseStudyResult[],
): CaseStudySection[] {
  const sections: CaseStudySection[] = [];
  if (excerpt?.trim()) {
    sections.push({
      id: "legacy-intro",
      type: "text",
      body: excerpt.trim(),
    });
  }
  if (results?.length) {
    sections.push({
      id: "legacy-stats",
      type: "stats",
      heading: "Résultats",
      items: results,
    });
  }
  return sections;
}

export function resolveCaseStudySections(
  sectionsRaw: unknown,
  excerpt?: string,
  results?: CaseStudyResult[],
): CaseStudySection[] {
  const parsed = parseCaseStudySections(sectionsRaw);
  if (parsed.length > 0) return parsed;
  return legacySectionsFromFields(excerpt, results);
}

export function sanitizeSections(sections: CaseStudySection[]): CaseStudySection[] {
  const cleaned: CaseStudySection[] = [];

  for (const section of sections) {
    switch (section.type) {
      case "text": {
        const body = section.body.trim();
        if (!body) continue;
        cleaned.push({
          ...section,
          body,
          heading: section.heading?.trim() || undefined,
        });
        break;
      }
      case "media": {
        const url = section.url.trim();
        if (!url) continue;
        cleaned.push({
          ...section,
          url,
          caption: section.caption?.trim() || undefined,
        });
        break;
      }
      case "stats": {
        const items = section.items.filter((i) => i.label.trim() && i.value.trim());
        if (!items.length) continue;
        cleaned.push({
          ...section,
          heading: section.heading?.trim() || undefined,
          items,
        });
        break;
      }
      case "gallery": {
        const items = section.items
          .filter((i) => i.url.trim())
          .map((i) => ({
            ...i,
            url: i.url.trim(),
            caption: i.caption?.trim() || undefined,
          }));
        if (!items.length) continue;
        cleaned.push({
          ...section,
          heading: section.heading?.trim() || undefined,
          items,
        });
        break;
      }
      case "quote": {
        const text = section.text.trim();
        if (!text) continue;
        cleaned.push({
          ...section,
          text,
          attribution: section.attribution?.trim() || undefined,
        });
        break;
      }
      case "split": {
        const body = section.body.trim();
        const url = section.url.trim();
        if (!body || !url) continue;
        cleaned.push({
          ...section,
          body,
          url,
          heading: section.heading?.trim() || undefined,
          caption: section.caption?.trim() || undefined,
        });
        break;
      }
    }
  }

  return cleaned;
}

export const SECTION_TYPE_LABELS: Record<CaseStudySectionType, string> = {
  text: "Text block",
  media: "Image / Video",
  stats: "Stats row",
  gallery: "Media gallery",
  quote: "Quote",
  split: "Text + Media",
};
