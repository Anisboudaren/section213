"use client";

import { ClientForm, type ClientFormValues } from "@/components/admin/clients/ClientForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ClientDto } from "@/lib/actions/clients";
import { adminT } from "@/lib/i18n/admin-en";
import type { CreateClientInput } from "@/lib/schemas/client-schema";

type NewClientModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateClientInput) => void | Promise<void>;
  loading?: boolean;
};

export function NewClientModal({
  open,
  onOpenChange,
  onSubmit,
  loading,
}: NewClientModalProps) {
  const handleSubmit = (values: ClientFormValues) => {
    void onSubmit({
      ...values,
      email: values.email || undefined,
      phone: values.phone || undefined,
      industry: values.industry || undefined,
      logoUrl: values.logoUrl?.trim() || undefined,
      totalRevenue: values.totalRevenue,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95dvh] w-[calc(100%-1rem)] flex-col overflow-hidden p-0 max-sm:top-auto max-sm:bottom-0 max-sm:translate-x-[-50%] max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-2xl sm:max-w-xl">
        <DialogHeader className="border-b px-4 py-4 sm:px-6">
          <DialogTitle>Nouveau client</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <ClientForm onSubmit={handleSubmit} formId="new-client-form" />
        </div>
        <DialogFooter className="gap-2 border-t px-4 py-4 sm:px-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="min-h-11">
            {adminT("common.cancel")}
          </Button>
          <Button
            variant="gold"
            type="submit"
            form="new-client-form"
            className="min-h-11"
            disabled={loading}
          >
            {adminT("common.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type EditClientModalProps = {
  client: ClientDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateClientInput) => void | Promise<void>;
  loading?: boolean;
};

export function EditClientModal({
  client,
  open,
  onOpenChange,
  onSubmit,
  loading,
}: EditClientModalProps) {
  const handleSubmit = (values: ClientFormValues) => {
    void onSubmit({
      ...values,
      email: values.email || undefined,
      phone: values.phone || undefined,
      industry: values.industry || undefined,
      logoUrl: values.logoUrl?.trim() || undefined,
      totalRevenue: values.totalRevenue,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95dvh] w-[calc(100%-1rem)] flex-col overflow-hidden p-0 max-sm:top-auto max-sm:bottom-0 max-sm:translate-x-[-50%] max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-2xl sm:max-w-xl">
        <DialogHeader className="border-b px-4 py-4 sm:px-6">
          <DialogTitle>{adminT("clients.editClient")}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <ClientForm
            key={client.id}
            client={{
              ...client,
              projectIds: [],
              origin: client.origin as "direct" | "lead_upgrade",
              originLeadId: client.originLeadId,
              logoUrl: client.logoUrl,
            }}
            onSubmit={handleSubmit}
            formId="edit-client-form"
          />
        </div>
        <DialogFooter className="gap-2 border-t px-4 py-4 sm:px-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="min-h-11">
            {adminT("common.cancel")}
          </Button>
          <Button
            variant="gold"
            type="submit"
            form="edit-client-form"
            className="min-h-11"
            disabled={loading}
          >
            {adminT("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
