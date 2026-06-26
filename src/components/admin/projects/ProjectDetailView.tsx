"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { ProjectFormModal } from "@/components/admin/projects/ProjectFormModal";
import { ProjectTaskProgress } from "@/components/admin/projects/ProjectTaskProgress";
import { ProjectTeamCard } from "@/components/admin/projects/ProjectTeamCard";
import { TaskList } from "@/components/admin/projects/TaskList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ClientDto } from "@/lib/actions/clients";
import type { ProjectDetailDto, ProjectListItem, TaskDto } from "@/lib/actions/projects";
import { resolveOfferLabel } from "@/lib/offers";
import { useOffers } from "@/lib/queries/offers";
import { useDeleteProject, useUpdateProject, useUpdateProjectStatus } from "@/lib/queries/projects";
import {
  projectStatusOptions,
  serviceTypeOptions,
} from "@/lib/schemas/client-schema";
import type { ProjectStatus } from "@/generated/prisma/client";
import { formatDZD } from "@/lib/utils/client-helpers";
import {
  getProjectStatusLabel,
  projectStatusBadgeClass,
} from "@/lib/utils/project-helpers";

type ProjectDetailViewProps = {
  initialProject: ProjectDetailDto;
  clients: Pick<ClientDto, "id" | "name" | "company">[];
};

export function ProjectDetailView({ initialProject, clients }: ProjectDetailViewProps) {
  const router = useRouter();
  const updateStatus = useUpdateProjectStatus();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [project, setProject] = useState(initialProject);
  const [tasks, setTasks] = useState(initialProject.tasks);
  const [notes, setNotes] = useState(project.notes);
  const [saved, setSaved] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const { data: offers = [] } = useOffers();

  useEffect(() => {
    setProject(initialProject);
    setTasks(initialProject.tasks);
    setNotes(initialProject.notes);
  }, [initialProject]);

  const taskDone = tasks.filter((t) => t.done).length;
  const taskTotal = tasks.length;

  const serviceLabel =
    serviceTypeOptions.find((o) => o.value === project.serviceType)?.label ??
    project.serviceType;

  const budget = project.budgetDZD ?? 0;
  const paid = project.paidDZD ?? 0;
  const remaining = budget > 0 ? Math.max(budget - paid, 0) : 0;
  const paymentProgress = budget > 0 ? Math.min((paid / budget) * 100, 100) : 0;

  const handleTasksChange = (nextTasks: TaskDto[]) => {
    setTasks(nextTasks);
    setProject((p) => ({
      ...p,
      taskDone: nextTasks.filter((t) => t.done).length,
      taskTotal: nextTasks.length,
    }));
  };

  const handleStatusChange = async (status: ProjectStatus) => {
    try {
      const updated = await updateStatus.mutateAsync({ id: project.id, status });
      setProject((p) => ({ ...p, ...updated, client: p.client, tasks: p.tasks }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const saveNotes = async () => {
    if (notes === project.notes) return;
    try {
      const updated = await updateProject.mutateAsync({
        id: project.id,
        data: { notes },
      });
      setProject((p) => ({ ...p, notes: updated.notes, client: p.client, tasks: p.tasks }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const handleProjectUpdated = (updated: ProjectListItem) => {
    setProject((p) => ({
      ...p,
      ...updated,
      client: p.client,
      tasks: p.tasks,
    }));
  };

  const handleDelete = async () => {
    if (!confirm(`Supprimer le projet ${project.name} ?`)) return;
    try {
      await deleteProject.mutateAsync(project.id);
      toast.success("Projet supprimé");
      router.push("/admin/projects");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const dateRange =
    project.startDate || project.deadline
      ? [
          project.startDate ? format(new Date(project.startDate), "d MMM yyyy") : "—",
          project.deadline ? format(new Date(project.deadline), "d MMM yyyy") : "—",
        ].join(" → ")
      : null;

  return (
    <AdminPageShell title={project.name} description={project.client.company}>
      <div className="space-y-6">
        <Button asChild variant="ghost" className="min-h-11 w-fit px-0">
          <Link href="/admin/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux projets
          </Link>
        </Button>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="font-display text-2xl tracking-wide">{project.name}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
              <Link
                href={`/admin/clients/${project.client.id}`}
                className="text-gold underline-offset-2 hover:underline"
              >
                {project.client.name}
              </Link>
              <span aria-hidden>·</span>
              <span>{serviceLabel}</span>
              <span aria-hidden>·</span>
              <Select
                value={project.status}
                onValueChange={(v) => void handleStatusChange(v as ProjectStatus)}
              >
                <SelectTrigger className="inline-flex h-auto min-h-0 w-auto border-0 bg-transparent p-0 shadow-none focus:ring-0">
                  <Badge variant="outline" className={projectStatusBadgeClass[project.status]}>
                    {getProjectStatusLabel(project.status)}
                  </Badge>
                </SelectTrigger>
                <SelectContent>
                  {projectStatusOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {dateRange && (
              <p className="mt-1 text-sm text-muted-foreground">{dateRange}</p>
            )}
            <div className="mt-4 max-w-sm">
              <ProjectTaskProgress taskDone={taskDone} taskTotal={taskTotal} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="min-h-11" onClick={() => setEditOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="min-h-11 min-w-11">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => void handleDelete()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <TaskList
                  projectId={project.id}
                  initialTasks={tasks}
                  onTasksChange={handleTasksChange}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <ProjectTeamCard leadId={project.leadId} teamIds={project.teamIds} />

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Infos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <InfoRow label="Service" value={serviceLabel} />
                <InfoRow
                  label="Offre liée"
                  value={
                    project.offerSlug ? resolveOfferLabel(offers, project.offerSlug) : "—"
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avancement</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectTaskProgress taskDone={taskDone} taskTotal={taskTotal} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Budget</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <InfoRow label="Budget" value={formatDZD(project.budgetDZD)} />
                <InfoRow label="Payé" value={formatDZD(project.paidDZD)} />
                <InfoRow label="Reste" value={formatDZD(remaining || undefined)} />
                {budget > 0 && (
                  <>
                    <p className="text-xs text-muted-foreground">Paiement</p>
                    <Progress value={paymentProgress} className="h-2" />
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="project-notes" className="sr-only">
                  Notes
                </Label>
                <Textarea
                  id="project-notes"
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={() => void saveNotes()}
                />
                {saved && <p className="text-xs text-green-600">Sauvegardé</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ProjectFormModal
        open={editOpen}
        onOpenChange={setEditOpen}
        clients={clients}
        project={project}
        lockClient
        onUpdated={handleProjectUpdated}
      />
    </AdminPageShell>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
