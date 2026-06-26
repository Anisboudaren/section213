"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { EmptyState } from "@/components/admin/EmptyState";
import { ClientCard } from "@/components/admin/clients/ClientCard";
import { NewClientModal } from "@/components/admin/clients/NewClientModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ClientDto } from "@/lib/actions/clients";
import { adminT } from "@/lib/i18n/admin-en";
import { useCreateClient } from "@/lib/queries/clients";
import type { CreateClientInput } from "@/lib/schemas/client-schema";
import type { ClientStatus } from "@/generated/prisma/client";

type ClientsViewProps = {
  initialClients: ClientDto[];
};

const STATUSES: (ClientStatus | "all")[] = ["all", "active", "inactive", "vip"];

export function ClientsView({ initialClients }: ClientsViewProps) {
  const router = useRouter();
  const createClient = useCreateClient();
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const handleCreate = async (values: CreateClientInput) => {
    try {
      const created = await createClient.mutateAsync(values);
      setClients((prev) => [created, ...prev]);
      toast.success("Client créé");
      setAddOpen(false);
      router.push(`/admin/clients/${created.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  return (
    <AdminPageShell
      title={adminT("clients.title")}
      description={adminT("clients.count", { count: clients.length })}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="font-display text-lg tracking-wide lg:sr-only">
            {adminT("clients.title")} ({clients.length})
          </h2>
          <Button
            variant="gold"
            className="min-h-11 w-full lg:w-auto"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouveau client
          </Button>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Input
              placeholder={adminT("clients.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-h-11 w-full sm:w-48"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="min-h-11 w-full sm:w-36">
                <SelectValue placeholder={adminT("clients.filterStatus")} />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "all"
                      ? adminT("common.all")
                      : adminT(`clients.statuses.${s}` as Parameters<typeof adminT>[0])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Aucun client pour l'instant"
            description="Commencez par convertir un lead ou ajoutez un client manuellement."
            action={{ label: "Nouveau client", onClick: () => setAddOpen(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>

      <NewClientModal
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleCreate}
        loading={createClient.isPending}
      />
    </AdminPageShell>
  );
}
