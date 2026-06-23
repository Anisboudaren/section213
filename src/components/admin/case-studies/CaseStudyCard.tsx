"use client";

import { GripVertical, Video } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { adminT } from "@/lib/i18n/admin-en";
import type { CaseStudy } from "@/lib/types/admin";

type CaseStudyCardProps = {
  caseStudy: CaseStudy;
  onTogglePublished: (id: string, published: boolean) => void;
  onEdit: (caseStudy: CaseStudy) => void;
};

export function CaseStudyCard({
  caseStudy,
  onTogglePublished,
  onEdit,
}: CaseStudyCardProps) {
  return (
    <Card className="border-ink/10">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <button
            type="button"
            className="mt-1 cursor-grab text-muted-foreground"
            aria-label={adminT("caseStudies.dragToReorder")}
          >
            <GripVertical className="h-5 w-5" />
          </button>
          <div
            className="flex h-24 w-32 shrink-0 items-center justify-center rounded-lg bg-muted"
            onClick={() => onEdit(caseStudy)}
            onKeyDown={(e) => e.key === "Enter" && onEdit(caseStudy)}
            role="button"
            tabIndex={0}
          >
            <Video className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <button
              type="button"
              className="text-left w-full"
              onClick={() => onEdit(caseStudy)}
            >
              <h3 className="font-medium text-ink line-clamp-2">{caseStudy.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{caseStudy.clientName}</p>
            </button>
            <div className="mt-3 flex items-center justify-between gap-2">
              <Badge variant={caseStudy.published ? "default" : "outline"}>
                {caseStudy.published ? adminT("common.published") : adminT("common.draft")}
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {adminT("caseStudies.publishToggle")}
                </span>
                <Switch
                  checked={caseStudy.published}
                  onCheckedChange={(published) =>
                    onTogglePublished(caseStudy.id, published)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
