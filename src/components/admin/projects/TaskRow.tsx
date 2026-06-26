"use client";

import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import type { TaskDto } from "@/lib/actions/projects";
import { TEAM } from "@/lib/mock-data/team";
import { cn } from "@/lib/utils";

type TaskRowProps = {
  task: TaskDto;
  onToggle: (id: string, done: boolean) => void;
};

function getAssigneeName(id?: string) {
  if (!id) return "—";
  return TEAM.find((m) => m.id === id)?.name ?? id;
}

export function TaskRow({ task, onToggle }: TaskRowProps) {
  const dueLabel = task.dueDate
    ? format(new Date(task.dueDate), "d MMM")
    : "—";

  return (
    <div
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-md border border-transparent px-2 py-2 hover:bg-muted/40",
        task.done && "opacity-60",
      )}
    >
      <Checkbox
        checked={task.done}
        onCheckedChange={(checked) => onToggle(task.id, checked === true)}
        className="h-5 w-5"
      />
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-sm",
          task.done && "line-through",
        )}
      >
        {task.title}
      </span>
      <span className="hidden shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs sm:inline">
        {getAssigneeName(task.assignedTo)}
      </span>
      <span className="shrink-0 text-xs text-muted-foreground">
        {task.done ? "✓ done" : `⏱ ${dueLabel}`}
      </span>
    </div>
  );
}
