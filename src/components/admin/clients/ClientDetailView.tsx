"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Globe, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { ClientAvatar } from "@/components/admin/clients/ClientAvatar";
import { EditClientModal } from "@/components/admin/clients/NewClientModal";
import { NewProjectModal } from "@/components/admin/projects/NewProjectModal";
import { ProjectTaskProgress } from "@/components/admin/projects/ProjectTaskProgress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ClientDetailDto } from "@/lib/actions/clients";
import { adminT } from "@/lib/i18n/admin-en";
import { useDeleteClient, useUpdateClient } from "@/lib/queries/clients";
import {
  formatDZD,
} from "@/lib/utils/client-helpers";
import {
  getDeadlineDisplay,
  getProjectStatusLabel,
  projectStatusBadgeClass,
} from "@/lib/utils/project-helpers";
import { cn } from "@/lib/utils";
import { serviceTypeOptions } from "@/lib/schemas/client-schema";

type ClientDetailViewProps = {
  initialClient: ClientDetailDto;
};

const statusStyles = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-muted text-muted-foreground",
  vip: "bg-gold/20 text-ink",
};

export function ClientDetailView({ initialClient }: ClientDetailViewProps) {
  const router = useRouter();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const [client, setClient] = useState(initialClient);
  const [editOpen, setEditOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [notes, setNotes] = useState(client.notes);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setClient(initialClient);
    setNotes(initialClient.notes);
  }, [initialClient]);

  const activeProjects = client.projects.filter(
    (p) => !["completed", "cancelled"].includes(p.status),
  ).length;
  const completedProjects = client.projects.filter((p) => p.status === "completed").length;

  const saveNotes = async () => {
    if (notes === client.notes) return;
    try {
      const updated = await updateClient.mutateAsync({
        id: client.id,
        data: { notes },
      });
      setClient((c) => ({ ...c, notes: updated.notes }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const handleToggleWebsite = async (checked: boolean) => {
    try {
      const updated = await updateClient.mutateAsync({
        id: client.id,
        data: { showOnWebsite: checked },
      });
      setClient((c) => ({ ...c, showOnWebsite: updated.showOnWebsite }));
      toast.success("Mis à jour");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Supprimer ${client.name} ?`)) return;
    try {
      await deleteClient.mutateAsync(client.id);
      toast.success("Client supprimé");
      router.push("/admin/clients");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  return (
    <AdminPageShell title={client.name} description={client.company}>
      <div className="space-y-6">
        <Button asChild variant="ghost" className="min-h-11 w-fit px-0">
          <Link href="/admin/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {adminT("common.back")}
          </Link>
        </Button>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <ClientAvatar
              name={client.company || client.name}
              logoUrl={client.logoUrl}
              size="md"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl tracking-wide">{client.name}</h2>
                {client.showOnWebsite && <Globe className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                <span>{client.industry ?? "—"}</span>
                <span aria-hidden>·</span>
                <Badge variant="outline" className={statusStyles[client.status]}>
                  {adminT(`clients.statuses.${client.status}` as Parameters<typeof adminT>[0])}
                </Badge>
                <span aria-hidden>·</span>
                <span>
                  {client.projects.length} projet{client.projects.length !== 1 ? "s" : ""}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {client.phone && <span className="mr-3">📞 {client.phone}</span>}
                {client.email && <span>✉ {client.email}</span>}
              </p>
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
                <DropdownMenuItem onClick={() => handleToggleWebsite(!client.showOnWebsite)}>
                  {client.showOnWebsite ? "Retirer du site" : "Afficher sur le site"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview" className="min-h-11">
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="projects" className="min-h-11">
              Projets
            </TabsTrigger>
            <TabsTrigger value="notes" className="min-h-11">
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3 rounded-lg border border-ink/10 p-4 text-sm">
                <Row label="Entreprise" value={client.company} />
                <Row label="Secteur" value={client.industry ?? "—"} />
                <Row label="Téléphone" value={client.phone ?? "—"} />
                <Row label="Email" value={client.email ?? "—"} />
                <Row label="Revenu total" value={formatDZD(client.totalRevenue)} />
                <Row
                  label="Date d'ajout"
                  value={format(new Date(client.createdAt), "d MMM yyyy")}
                />
                <Row
                  label="Origine"
                  value={
                    client.originLeadId ? (
                      <Link
                        href="/admin/leads"
                        className="text-gold underline-offset-2 hover:underline"
                      >
                        Converti depuis un lead
                      </Link>
                    ) : (
                      "Direct"
                    )
                  }
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <StatCard label="Projets actifs" value={String(activeProjects)} />
                <StatCard label="Projets terminés" value={String(completedProjects)} />
                <StatCard label="Revenu total" value={formatDZD(client.totalRevenue)} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-6 space-y-4">
            <Button variant="gold" className="min-h-11" onClick={() => setProjectOpen(true)}>
              + Nouveau projet
            </Button>
            {client.projects.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun projet pour ce client.</p>
            ) : (
              <div className="space-y-2">
                {client.projects.map((project) => {
                  const deadline = getDeadlineDisplay(project.deadline);
                  const serviceLabel =
                    serviceTypeOptions.find((o) => o.value === project.serviceType)?.label ??
                    project.serviceType;
                  return (
                    <Link
                      key={project.id}
                      href={`/admin/projects/${project.id}`}
                      className="flex flex-col gap-2 rounded-lg border border-ink/10 p-4 transition-colors hover:border-gold/40 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={projectStatusBadgeClass[project.status]}
                        >
                          {getProjectStatusLabel(project.status)}
                        </Badge>
                        <span className="font-medium">{project.name}</span>
                        <span className="text-sm text-muted-foreground">{serviceLabel}</span>
                      </div>
                      <div className="flex flex-col gap-2 sm:items-end">
                        <div className="flex items-center gap-3 text-sm">
                          <span className={deadline.className}>⏱ {deadline.text}</span>
                          <span className="text-gold">Ouvrir →</span>
                        </div>
                        <ProjectTaskProgress
                          taskDone={project.taskDone}
                          taskTotal={project.taskTotal}
                          className="w-full sm:w-48"
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="mt-6 space-y-2">
            <Label htmlFor="client-notes">Notes internes</Label>
            <Textarea
              id="client-notes"
              rows={8}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={saveNotes}
            />
            {saved && <p className="text-xs text-green-600">Sauvegardé</p>}
          </TabsContent>
        </Tabs>
      </div>

      <EditClientModal
        client={client}
        open={editOpen}
        onOpenChange={setEditOpen}
        loading={updateClient.isPending}
        onSubmit={async (data) => {
          const updated = await updateClient.mutateAsync({ id: client.id, data });
          setClient((c) => ({ ...c, ...updated, projects: c.projects }));
          setEditOpen(false);
          toast.success("Client mis à jour");
        }}
      />

      <NewProjectModal
        open={projectOpen}
        onOpenChange={setProjectOpen}
        clients={[{ id: client.id, name: client.name, company: client.company }]}
        defaultClientId={client.id}
        lockClient
        onCreated={(id) => router.push(`/admin/projects/${id}`)}
      />
    </AdminPageShell>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-ink/5 pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-muted/20 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl tracking-wide">{value}</p>
    </div>
  );
}
