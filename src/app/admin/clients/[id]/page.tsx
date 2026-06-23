"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { format } from "date-fns";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { ClientForm, type ClientFormValues } from "@/components/admin/clients/ClientForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAdminStore } from "@/lib/admin-store";
import { MOCK_PROJECTS } from "@/lib/mock-data/projects";
import { adminT } from "@/lib/i18n/admin-en";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const statusStyles = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-muted text-muted-foreground",
  vip: "bg-gold/20 text-ink",
};

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getClientById, updateClient } = useAdminStore();
  const client = getClientById(id);
  const [editOpen, setEditOpen] = useState(false);
  const [notes, setNotes] = useState(client?.notes ?? "");
  const [linkedIds, setLinkedIds] = useState(client?.projectIds ?? []);

  if (!client) {
    return (
      <AdminPageShell
        title={adminT("clients.notFound")}
        description={adminT("clients.notFoundDescription")}
      >
        <Button asChild variant="outline">
          <Link href="/admin/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {adminT("common.back")}
          </Link>
        </Button>
      </AdminPageShell>
    );
  }

  const projects = MOCK_PROJECTS.filter((p) => linkedIds.includes(p.id));
  const unlinked = MOCK_PROJECTS.filter(
    (p) => p.clientId === client.id && !linkedIds.includes(p.id),
  );

  const handleEdit = (values: ClientFormValues) => {
    updateClient(client.id, {
      ...values,
      email: values.email || undefined,
      phone: values.phone || undefined,
      industry: values.industry || undefined,
    });
    setEditOpen(false);
  };

  const handleSaveNotes = () => {
    updateClient(client.id, { notes });
  };

  const handleLinkProject = (projectId: string) => {
    const next = [...linkedIds, projectId];
    setLinkedIds(next);
    updateClient(client.id, { projectIds: next });
  };

  return (
    <AdminPageShell title={client.name} description={client.company}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost" size="sm" className="min-h-11 w-fit">
          <Link href="/admin/clients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {adminT("common.back")}
          </Link>
        </Button>
        <Button variant="outline" className="min-h-11" onClick={() => setEditOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          {adminT("common.edit")}
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink font-display text-xl text-gold">
          {getInitials(client.name)}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl tracking-wide text-ink">{client.name}</h2>
            <Badge variant="outline" className={cn(statusStyles[client.status])}>
              {adminT(`clients.statuses.${client.status}` as Parameters<typeof adminT>[0])}
            </Badge>
          </div>
          <p className="text-muted-foreground">{client.company}</p>
          {client.originLeadId && (
            <Link
              href={`/admin/leads`}
              className="mt-1 inline-block text-sm text-gold hover:underline"
            >
              {adminT("common.viewSourceLead")}
            </Link>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview" className="min-h-11">
            {adminT("clients.tabs.overview")}
          </TabsTrigger>
          <TabsTrigger value="projects" className="min-h-11">
            {adminT("clients.tabs.projects")}
          </TabsTrigger>
          <TabsTrigger value="notes" className="min-h-11">
            {adminT("clients.tabs.notes")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <dl className="divide-y divide-border rounded-lg border border-ink/10">
            {[
              { label: adminT("common.email"), value: client.email ?? "—" },
              { label: adminT("common.phone"), value: client.phone ?? "—" },
              { label: adminT("common.industry"), value: client.industry ?? "—" },
              {
                label: adminT("clients.origin"),
                value:
                  client.origin === "lead_upgrade"
                    ? adminT("clients.originLead")
                    : adminT("clients.originDirect"),
              },
              {
                label: adminT("common.created"),
                value: format(new Date(client.createdAt), "MMM d, yyyy"),
              },
              {
                label: adminT("clients.totalRevenue"),
                value: client.totalRevenue
                  ? `${client.totalRevenue.toLocaleString("fr-DZ")} DZD`
                  : "—",
              },
            ].map((row) => (
              <div key={row.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="font-medium text-right">{row.value}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3">
              <Label>{adminT("common.showOnWebsite")}</Label>
              <Switch
                checked={client.showOnWebsite}
                onCheckedChange={(showOnWebsite) =>
                  updateClient(client.id, { showOnWebsite })
                }
              />
            </div>
          </dl>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">{adminT("table.noData")}</p>
          ) : (
            <ul className="divide-y divide-border rounded-lg border border-ink/10">
              {projects.map((p) => (
                <li key={p.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {adminT(`projects.status.${p.status}` as Parameters<typeof adminT>[0])}
                    </p>
                  </div>
                  {p.dueDate && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(p.dueDate), "MMM d, yyyy")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {unlinked.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground w-full">
                {adminT("common.linkProject")}:
              </span>
              {unlinked.map((p) => (
                <Button
                  key={p.id}
                  variant="outline"
                  size="sm"
                  className="min-h-11"
                  onClick={() => handleLinkProject(p.id)}
                >
                  {p.name}
                </Button>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8}
            className="mb-3"
          />
          <Button variant="gold" className="min-h-11" onClick={handleSaveNotes}>
            {adminT("common.save")}
          </Button>
        </TabsContent>
      </Tabs>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{adminT("clients.editClient")}</DialogTitle>
          </DialogHeader>
          <ClientForm client={client} onSubmit={handleEdit} formId="edit-client-form" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              {adminT("common.cancel")}
            </Button>
            <Button variant="gold" type="submit" form="edit-client-form" className="min-h-11">
              {adminT("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
