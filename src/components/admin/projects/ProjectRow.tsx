import Link from "next/link";
import { AlertTriangle, MoreHorizontal } from "lucide-react";

import { ProjectTaskProgress } from "@/components/admin/projects/ProjectTaskProgress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProjectListItem } from "@/lib/actions/projects";
import { serviceTypeOptions } from "@/lib/schemas/client-schema";
import {
  getDeadlineDisplay,
  getProjectStatusLabel,
  projectStatusBadgeClass,
  projectStatusBorderClass,
} from "@/lib/utils/project-helpers";
import { cn } from "@/lib/utils";

type ProjectRowProps = {
  project: ProjectListItem;
};

export function ProjectRow({ project }: ProjectRowProps) {
  const deadline = getDeadlineDisplay(project.deadline);
  const serviceLabel =
    serviceTypeOptions.find((o) => o.value === project.serviceType)?.label ??
    project.serviceType;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-ink/10 border-l-4 bg-card p-4 transition-colors hover:border-gold/30",
        projectStatusBorderClass[project.status],
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:gap-3">
          <Badge variant="outline" className={projectStatusBadgeClass[project.status]}>
            {getProjectStatusLabel(project.status)}
          </Badge>
          <span className="min-w-0 truncate font-medium">{project.name}</span>
          <span className="hidden truncate text-sm text-muted-foreground md:inline">
            {project.clientName}
          </span>
          <span className="hidden text-sm text-muted-foreground lg:inline">{serviceLabel}</span>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="truncate text-sm text-muted-foreground md:hidden">
            {project.clientName}
          </span>
          <span className={cn("hidden items-center gap-1 text-sm md:flex", deadline.className)}>
            {deadline.overdue && <AlertTriangle className="h-3.5 w-3.5" />}
            ⏱ {deadline.text}
          </span>
          <Button asChild variant="outline" size="sm" className="min-h-11 hidden sm:inline-flex">
            <Link href={`/admin/projects/${project.id}`}>Ouvrir</Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="min-h-11 min-w-11 sm:hidden">
            <Link href={`/admin/projects/${project.id}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <ProjectTaskProgress
        taskDone={project.taskDone}
        taskTotal={project.taskTotal}
        className="max-w-md"
      />
    </div>
  );
}
