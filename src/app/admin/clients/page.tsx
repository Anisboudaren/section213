"use client";

import { useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { EmptyState } from "@/components/admin/EmptyState";
import { ClientCard } from "@/components/admin/clients/ClientCard";
import { ClientForm, type ClientFormValues } from "@/components/admin/clients/ClientForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminStore } from "@/lib/admin-store";
import { adminT } from "@/lib/i18n/admin-en";
import type { ClientStatus } from "@/lib/types/admin";

const STATUSES: (ClientStatus | "all")[] = ["all", "active", "inactive", "vip"];

export default function ClientsPage() {
  const { clients, addClient } = useAdminStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const handleAdd = (values: ClientFormValues) => {
    addClient({
      ...values,
      email: values.email || undefined,
      phone: values.phone || undefined,
      industry: values.industry || undefined,
      origin: "direct",
      projectIds: [],
      createdAt: new Date().toISOString(),
    });
    setAddOpen(false);
  };

  return (
    <AdminPageShell
      title={adminT("clients.title")}
      description={adminT("clients.count", { count: clients.length })}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="gold" className="min-h-11 w-full sm:w-auto" onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {adminT("clients.addClient")}
          </Button>
          <div className="flex flex-wrap gap-2">
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
            title={adminT("clients.emptyTitle")}
            description={adminT("clients.emptyDescription")}
            action={{ label: adminT("clients.addClient"), onClick: () => setAddOpen(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{adminT("clients.addClient")}</DialogTitle>
          </DialogHeader>
          <ClientForm onSubmit={handleAdd} formId="add-client-form" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              {adminT("common.cancel")}
            </Button>
            <Button variant="gold" type="submit" form="add-client-form" className="min-h-11">
              {adminT("common.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
