"use client";

import Link from "next/link";
import { ExternalLink, GripVertical, Trash2, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { adminT } from "@/lib/i18n/admin-en";
import type { CaseStudy } from "@/lib/types/admin";

type CaseStudyCardProps = {
  caseStudy: CaseStudy;
  onTogglePublished: (id: string, published: boolean) => void;
  onDelete: (id: string) => void;
};

export function CaseStudyCard({ caseStudy, onTogglePublished, onDelete }: CaseStudyCardProps) {
  const sectionCount = caseStudy.sections?.length ?? 0;

  return (
    <Card className="border-ink/10 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex gap-0">
          <div className="hidden cursor-grab px-2 text-muted-foreground sm:flex sm:items-center">
            <GripVertical className="h-5 w-5" />
          </div>

          <Link
            href={`/admin/case-studies/${caseStudy.id}/edit`}
            className="relative h-28 w-36 shrink-0 overflow-hidden bg-black sm:h-auto sm:w-40"
          >
            {caseStudy.videoUrl ? (
              <video
                src={caseStudy.videoUrl}
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Video className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </Link>

          <div className="min-w-0 flex-1 p-4">
            <Link href={`/admin/case-studies/${caseStudy.id}/edit`} className="block w-full text-left">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-ink line-clamp-2">{caseStudy.title}</h3>
                {caseStudy.featured && (
                  <Badge className="bg-gold/20 text-ink">Featured</Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{caseStudy.clientName}</p>
              {caseStudy.categoryLabel && (
                <p className="mt-0.5 text-xs text-muted-foreground">{caseStudy.categoryLabel}</p>
              )}
              {sectionCount > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {adminT("caseStudies.sectionCount", { count: sectionCount })}
                </p>
              )}
            </Link>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={caseStudy.published ? "default" : "outline"}>
                  {caseStudy.published ? adminT("common.published") : adminT("common.draft")}
                </Badge>
                {caseStudy.published && (
                  <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
                    <Link href={`/case-studies/${caseStudy.slug}`} target="_blank">
                      <ExternalLink className="mr-1 h-3.5 w-3.5" />
                      View
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" className="h-8" asChild>
                  <Link href={`/admin/case-studies/${caseStudy.id}/edit`}>
                    {adminT("common.edit")}
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={caseStudy.published}
                  onCheckedChange={(published) => onTogglePublished(caseStudy.id, published)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onDelete(caseStudy.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
