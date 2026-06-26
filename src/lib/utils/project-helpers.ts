import type { ProjectStatus } from "@/generated/prisma/client";
import { projectStatusOptions } from "@/lib/schemas/client-schema";

export function getProjectStatusLabel(status: ProjectStatus): string {
  return projectStatusOptions.find((o) => o.value === status)?.label ?? status;
}

export const projectStatusBorderClass: Record<ProjectStatus, string> = {
  briefing: "border-l-blue-500",
  in_progress: "border-l-amber-500",
  review: "border-l-purple-500",
  delivered: "border-l-teal-500",
  completed: "border-l-green-500",
  on_hold: "border-l-gray-400",
  cancelled: "border-l-red-500",
};

export const projectStatusBadgeClass: Record<ProjectStatus, string> = {
  briefing: "bg-blue-100 text-blue-800 border-blue-200",
  in_progress: "bg-amber-100 text-amber-800 border-amber-200",
  review: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-teal-100 text-teal-800 border-teal-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  on_hold: "bg-muted text-muted-foreground border-border",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export function getDeadlineDisplay(deadline?: string): {
  text: string;
  className: string;
  overdue: boolean;
} {
  if (!deadline) return { text: "—", className: "text-muted-foreground", overdue: false };

  const date = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const formatted = date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

  if (diffDays < 0) {
    return { text: formatted, className: "text-red-600 font-medium", overdue: true };
  }
  if (diffDays <= 7) {
    return {
      text: diffDays === 0 ? "Aujourd'hui" : `Dans ${diffDays} jour${diffDays > 1 ? "s" : ""}`,
      className: "text-amber-600 font-medium",
      overdue: false,
    };
  }
  return { text: formatted, className: "text-muted-foreground", overdue: false };
}

export function getTaskCompletionPercent(taskDone: number, taskTotal: number): number {
  if (taskTotal <= 0) return 0;
  return Math.round((taskDone / taskTotal) * 100);
}
