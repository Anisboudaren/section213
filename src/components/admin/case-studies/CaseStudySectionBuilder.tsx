"use client";

import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  ImageIcon,
  LayoutTemplate,
  MessageSquareQuote,
  Plus,
  Rows3,
  Trash2,
  Type,
  Video,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MediaUploadField } from "@/components/ui/media-upload-field";
import {
  CASE_STUDY_SECTION_TYPES,
  createEmptySection,
  SECTION_TYPE_LABELS,
  type CaseStudySection,
  type CaseStudySectionType,
} from "@/lib/case-study-sections";
import { adminT } from "@/lib/i18n/admin-en";
import { cn } from "@/lib/utils";

const SECTION_ICONS: Record<CaseStudySectionType, React.ReactNode> = {
  text: <Type className="h-4 w-4" />,
  media: <Video className="h-4 w-4" />,
  stats: <Rows3 className="h-4 w-4" />,
  gallery: <ImageIcon className="h-4 w-4" />,
  quote: <MessageSquareQuote className="h-4 w-4" />,
  split: <LayoutTemplate className="h-4 w-4" />,
};

type CaseStudySectionBuilderProps = {
  sections: CaseStudySection[];
  onChange: (sections: CaseStudySection[]) => void;
};

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}


type SectionEditorProps = {
  section: CaseStudySection;
  index: number;
  onChange: (section: CaseStudySection) => void;
};

function SectionFields({ section, onChange }: SectionEditorProps) {
  switch (section.type) {
    case "text":
      return (
        <div className="space-y-3">
          <div>
            <Label>{adminT("caseStudies.sectionHeading")}</Label>
            <Input
              value={section.heading ?? ""}
              onChange={(e) => onChange({ ...section, heading: e.target.value })}
              placeholder={adminT("caseStudies.sectionHeadingOptional")}
              className="mt-1 min-h-11"
            />
          </div>
          <div>
            <Label>{adminT("caseStudies.sectionBody")}</Label>
            <Textarea
              value={section.body}
              onChange={(e) => onChange({ ...section, body: e.target.value })}
              rows={8}
              className="mt-1 font-mono text-sm leading-relaxed"
              placeholder={adminT("caseStudies.sectionBodyPlaceholder")}
            />
          </div>
        </div>
      );

    case "media":
      return (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>{adminT("caseStudies.mediaType")}</Label>
              <Select
                value={section.mediaType}
                onValueChange={(v) =>
                  onChange({ ...section, mediaType: v as "image" | "video" })
                }
              >
                <SelectTrigger className="mt-1 min-h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">{adminT("caseStudies.video")}</SelectItem>
                  <SelectItem value="image">{adminT("caseStudies.image")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-3 rounded-lg border p-3">
              <Switch
                checked={section.fullWidth}
                onCheckedChange={(fullWidth) => onChange({ ...section, fullWidth })}
              />
              <Label>{adminT("caseStudies.fullWidth")}</Label>
            </div>
          </div>
          <MediaUploadField
            folder={
              section.mediaType === "video" ? "case-studies/videos" : "case-studies/thumbnails"
            }
            variant={section.mediaType === "video" ? "video" : "image"}
            value={section.url || undefined}
            onChange={(url) => onChange({ ...section, url: url ?? "" })}
          />
          <Input
            value={section.url}
            onChange={(e) => onChange({ ...section, url: e.target.value })}
            placeholder="URL"
            className="min-h-11"
          />
          <div>
            <Label>{adminT("caseStudies.caption")}</Label>
            <Input
              value={section.caption ?? ""}
              onChange={(e) => onChange({ ...section, caption: e.target.value })}
              className="mt-1 min-h-11"
            />
          </div>
        </div>
      );

    case "stats":
      return (
        <div className="space-y-3">
          <div>
            <Label>{adminT("caseStudies.sectionHeading")}</Label>
            <Input
              value={section.heading ?? ""}
              onChange={(e) => onChange({ ...section, heading: e.target.value })}
              className="mt-1 min-h-11"
            />
          </div>
          {section.items.map((item, itemIndex) => (
            <div key={itemIndex} className="flex gap-2">
              <Input
                value={item.label}
                onChange={(e) => {
                  const items = [...section.items];
                  items[itemIndex] = { ...item, label: e.target.value };
                  onChange({ ...section, items });
                }}
                placeholder="Label"
                className="min-h-11"
              />
              <Input
                value={item.value}
                onChange={(e) => {
                  const items = [...section.items];
                  items[itemIndex] = { ...item, value: e.target.value };
                  onChange({ ...section, items });
                }}
                placeholder="Value"
                className="min-h-11"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => {
                  const items = section.items.filter((_, i) => i !== itemIndex);
                  onChange({ ...section, items: items.length ? items : [{ label: "", value: "" }] });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({ ...section, items: [...section.items, { label: "", value: "" }] })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            {adminT("caseStudies.addStat")}
          </Button>
        </div>
      );

    case "gallery":
      return (
        <div className="space-y-3">
          <div>
            <Label>{adminT("caseStudies.sectionHeading")}</Label>
            <Input
              value={section.heading ?? ""}
              onChange={(e) => onChange({ ...section, heading: e.target.value })}
              className="mt-1 min-h-11"
            />
          </div>
          {section.items.map((item, itemIndex) => (
            <div key={itemIndex} className="space-y-2 rounded-lg border border-ink/10 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {adminT("caseStudies.galleryItem")} {itemIndex + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const items = section.items.filter((_, i) => i !== itemIndex);
                    onChange({
                      ...section,
                      items: items.length
                        ? items
                        : [{ url: "", mediaType: "image", caption: "" }],
                    });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Select
                value={item.mediaType}
                onValueChange={(v) => {
                  const items = [...section.items];
                  items[itemIndex] = { ...item, mediaType: v as "image" | "video" };
                  onChange({ ...section, items });
                }}
              >
                <SelectTrigger className="min-h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">{adminT("caseStudies.image")}</SelectItem>
                  <SelectItem value="video">{adminT("caseStudies.video")}</SelectItem>
                </SelectContent>
              </Select>
              <MediaUploadField
                folder={
                  item.mediaType === "video" ? "case-studies/videos" : "case-studies/thumbnails"
                }
                variant={item.mediaType === "video" ? "video" : "image"}
                value={item.url || undefined}
                onChange={(url) => {
                  const items = [...section.items];
                  items[itemIndex] = { ...item, url: url ?? "" };
                  onChange({ ...section, items });
                }}
              />
              <Input
                value={item.caption ?? ""}
                onChange={(e) => {
                  const items = [...section.items];
                  items[itemIndex] = { ...item, caption: e.target.value };
                  onChange({ ...section, items });
                }}
                placeholder={adminT("caseStudies.caption")}
                className="min-h-10"
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              onChange({
                ...section,
                items: [...section.items, { url: "", mediaType: "image", caption: "" }],
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            {adminT("caseStudies.addGalleryItem")}
          </Button>
        </div>
      );

    case "quote":
      return (
        <div className="space-y-3">
          <div>
            <Label>{adminT("caseStudies.quoteText")}</Label>
            <Textarea
              value={section.text}
              onChange={(e) => onChange({ ...section, text: e.target.value })}
              rows={4}
              className="mt-1"
            />
          </div>
          <div>
            <Label>{adminT("caseStudies.quoteAttribution")}</Label>
            <Input
              value={section.attribution ?? ""}
              onChange={(e) => onChange({ ...section, attribution: e.target.value })}
              className="mt-1 min-h-11"
            />
          </div>
        </div>
      );

    case "split":
      return (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>{adminT("caseStudies.mediaPosition")}</Label>
              <Select
                value={section.mediaPosition}
                onValueChange={(v) =>
                  onChange({ ...section, mediaPosition: v as "left" | "right" })
                }
              >
                <SelectTrigger className="mt-1 min-h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">{adminT("caseStudies.mediaLeft")}</SelectItem>
                  <SelectItem value="right">{adminT("caseStudies.mediaRight")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{adminT("caseStudies.mediaType")}</Label>
              <Select
                value={section.mediaType}
                onValueChange={(v) =>
                  onChange({ ...section, mediaType: v as "image" | "video" })
                }
              >
                <SelectTrigger className="mt-1 min-h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">{adminT("caseStudies.image")}</SelectItem>
                  <SelectItem value="video">{adminT("caseStudies.video")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>{adminT("caseStudies.sectionHeading")}</Label>
            <Input
              value={section.heading ?? ""}
              onChange={(e) => onChange({ ...section, heading: e.target.value })}
              className="mt-1 min-h-11"
            />
          </div>
          <div>
            <Label>{adminT("caseStudies.sectionBody")}</Label>
            <Textarea
              value={section.body}
              onChange={(e) => onChange({ ...section, body: e.target.value })}
              rows={6}
              className="mt-1"
            />
          </div>
          <MediaUploadField
            folder={
              section.mediaType === "video" ? "case-studies/videos" : "case-studies/thumbnails"
            }
            variant={section.mediaType === "video" ? "video" : "image"}
            value={section.url || undefined}
            onChange={(url) => onChange({ ...section, url: url ?? "" })}
          />
          <Input
            value={section.caption ?? ""}
            onChange={(e) => onChange({ ...section, caption: e.target.value })}
            placeholder={adminT("caseStudies.caption")}
            className="min-h-11"
          />
        </div>
      );
  }
}

export function CaseStudySectionBuilder({ sections, onChange }: CaseStudySectionBuilderProps) {
  const addSection = (type: CaseStudySectionType) => {
    onChange([...sections, createEmptySection(type)]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink">{adminT("caseStudies.pageContent")}</h2>
          <p className="text-sm text-muted-foreground">{adminT("caseStudies.pageContentHint")}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="gold" className="min-h-11">
              <Plus className="mr-2 h-4 w-4" />
              {adminT("caseStudies.addSection")}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {CASE_STUDY_SECTION_TYPES.map((type) => (
              <DropdownMenuItem key={type} onClick={() => addSection(type)}>
                <span className="mr-2 text-muted-foreground">{SECTION_ICONS[type]}</span>
                {SECTION_TYPE_LABELS[type]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {sections.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink/15 bg-muted/20 px-6 py-14 text-center">
          <p className="text-sm text-muted-foreground">{adminT("caseStudies.noSections")}</p>
          <Button
            type="button"
            variant="outline"
            className="mt-4 min-h-11"
            onClick={() => addSection("text")}
          >
            <Plus className="mr-2 h-4 w-4" />
            {adminT("caseStudies.addFirstSection")}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={cn(
                "rounded-xl border border-ink/10 bg-white shadow-sm",
                "overflow-hidden",
              )}
            >
              <div className="flex items-center gap-2 border-b border-ink/10 bg-muted/30 px-3 py-2">
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                <span className="flex items-center gap-2 text-sm font-medium text-ink">
                  {SECTION_ICONS[section.type]}
                  {SECTION_TYPE_LABELS[section.type]}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">#{index + 1}</span>
                <div className="flex items-center gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={index === 0}
                    onClick={() => onChange(moveItem(sections, index, index - 1))}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={index === sections.length - 1}
                    onClick={() => onChange(moveItem(sections, index, index + 1))}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => onChange(sections.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <SectionFields
                  section={section}
                  index={index}
                  onChange={(next) => {
                    const copy = [...sections];
                    copy[index] = next;
                    onChange(copy);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
