import { Progress } from "@/components/ui/progress";
import { getTaskCompletionPercent } from "@/lib/utils/project-helpers";
import { cn } from "@/lib/utils";

type ProjectTaskProgressProps = {
  taskDone: number;
  taskTotal: number;
  showLabel?: boolean;
  className?: string;
  barClassName?: string;
};

export function ProjectTaskProgress({
  taskDone,
  taskTotal,
  showLabel = true,
  className,
  barClassName,
}: ProjectTaskProgressProps) {
  const percent = getTaskCompletionPercent(taskDone, taskTotal);

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {taskDone}/{taskTotal} tâche{taskTotal !== 1 ? "s" : ""}
          </span>
          <span className="font-medium text-ink">{percent}%</span>
        </div>
      )}
      <Progress value={percent} className={cn("h-2", barClassName)} />
    </div>
  );
}
