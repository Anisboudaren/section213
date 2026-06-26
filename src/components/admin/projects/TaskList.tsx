"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { toast } from "sonner";

import { TaskRow } from "@/components/admin/projects/TaskRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { TaskDto } from "@/lib/actions/projects";
import { createTask, toggleTask } from "@/lib/actions/projects";

type TaskListProps = {
  projectId: string;
  initialTasks: TaskDto[];
  onTasksChange?: (tasks: TaskDto[]) => void;
};

export function TaskList({ projectId, initialTasks, onTasksChange }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [completedOpen, setCompletedOpen] = useState(false);

  const pending = tasks.filter((t) => !t.done);
  const completed = tasks.filter((t) => t.done);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const updateTasks = (updater: (prev: TaskDto[]) => TaskDto[]) => {
    setTasks((prev) => {
      const next = updater(prev);
      onTasksChange?.(next);
      return next;
    });
  };

  const handleToggle = async (id: string, done: boolean) => {
    updateTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done } : t)));
    const result = await toggleTask(id, done);
    if (!result.success) {
      updateTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !done } : t)));
      toast.error(result.error);
    }
  };

  const submitNew = async () => {
    const title = newTitle.trim();
    if (!title) {
      setAdding(false);
      return;
    }

    const optimistic: TaskDto = {
      id: `temp-${Date.now()}`,
      title,
      description: "",
      projectId,
      done: false,
      priority: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateTasks((prev) => [...prev, optimistic]);
    setNewTitle("");
    setAdding(false);

    const result = await createTask({ projectId, title });
    if (result.success) {
      updateTasks((prev) => prev.map((t) => (t.id === optimistic.id ? result.data : t)));
    } else {
      updateTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-display text-sm tracking-wide text-muted-foreground">Tâches</h3>

      {pending.map((task) => (
        <TaskRow key={task.id} task={task} onToggle={handleToggle} />
      ))}

      {adding ? (
        <Input
          autoFocus
          placeholder="Titre de la tâche"
          value={newTitle}
          className="min-h-11"
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void submitNew();
            if (e.key === "Escape") {
              setAdding(false);
              setNewTitle("");
            }
          }}
          onBlur={() => void submitNew()}
        />
      ) : (
        <Button
          variant="ghost"
          className="min-h-11 w-full justify-start text-muted-foreground"
          onClick={() => setAdding(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une tâche
        </Button>
      )}

      {completed.length > 0 && (
        <Collapsible open={completedOpen} onOpenChange={setCompletedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="min-h-11 w-full justify-between">
              <span>
                {completed.length} tâche{completed.length > 1 ? "s" : ""} terminée
                {completed.length > 1 ? "s" : ""}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${completedOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {completed.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={handleToggle} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
