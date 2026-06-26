"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Briefcase, Plus } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { EmptyState } from "@/components/admin/EmptyState";
import { NewProjectModal } from "@/components/admin/projects/NewProjectModal";
import { ProjectRow } from "@/components/admin/projects/ProjectRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProjectListItem } from "@/lib/actions/projects";
import type { ClientDto } from "@/lib/actions/clients";
import { adminT } from "@/lib/i18n/admin-en";
import { projectStatusOptions, serviceTypeOptions } from "@/lib/schemas/client-schema";
import type { ProjectStatus } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";

type ProjectsViewProps = {
  initialProjects: ProjectListItem[];
  clients: Pick<ClientDto, "id" | "name" | "company">[];
};

const QUICK_FILTERS: { label: string; value: string }[] = [
  { label: "Tous", value: "all" },
  { label: "En cours", value: "in_progress" },
  { label: "Livré", value: "delivered" },
  { label: "En pause", value: "on_hold" },
];

export function ProjectsView({ initialProjects, clients }: ProjectsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") ?? "all";

  const [projects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);

  const setQuickFilter = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("status");
    else params.set("status", value);
    router.replace(`/admin/projects?${params.toString()}`, { scroll: false });
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return projects.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" ? true : p.status === statusFilter;
      const matchesQuick =
        statusParam === "all" ? true : p.status === statusParam;
      const matchesService =
        serviceFilter === "all" ? true : p.serviceType === serviceFilter;
      const matchesClient =
        clientFilter === "all" ? true : p.clientId === clientFilter;
      return matchesSearch && matchesStatus && matchesQuick && matchesService && matchesClient;
    });
  }, [projects, search, statusFilter, statusParam, serviceFilter, clientFilter]);

  return (
    <AdminPageShell
      title="Projets"
      description={`${projects.length} projet${projects.length !== 1 ? "s" : ""}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-display text-lg tracking-wide lg:sr-only">
            Projets ({projects.length})
          </h2>
          <Button
            variant="gold"
            className="min-h-11 w-full lg:order-last lg:w-auto"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau projet
          </Button>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Input
              placeholder="Rechercher…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-h-11 w-full sm:w-48"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="min-h-11 w-full sm:w-36">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{adminT("common.all")}</SelectItem>
                {projectStatusOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="min-h-11 w-full sm:w-40">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{adminT("common.all")}</SelectItem>
                {serviceTypeOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="min-h-11 w-full sm:w-44">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{adminT("common.all")}</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={statusParam === f.value ? "secondary" : "outline"}
              size="sm"
              className={cn("min-h-11", statusParam === f.value && "border-gold/40 bg-gold/10")}
              onClick={() => setQuickFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="Aucun projet"
            description="Créez un projet pour un client existant."
            action={{ label: "Nouveau projet", onClick: () => setAddOpen(true) }}
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      <NewProjectModal
        open={addOpen}
        onOpenChange={setAddOpen}
        clients={clients}
        onCreated={(id) => {
          toast.success("Projet créé");
          router.push(`/admin/projects/${id}`);
        }}
      />
    </AdminPageShell>
  );
}
