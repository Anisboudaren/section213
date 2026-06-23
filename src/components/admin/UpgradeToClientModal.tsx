"use client";

import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdminStore } from "@/lib/admin-store";
import { adminT } from "@/lib/i18n/admin-en";
import type { Lead } from "@/lib/types/admin";

type UpgradeToClientModalProps = {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UpgradeToClientModal({ lead, open, onOpenChange }: UpgradeToClientModalProps) {
  const router = useRouter();
  const { upgradeLeadToClient } = useAdminStore();

  const handleConfirm = () => {
    if (!lead) return;
    const clientId = upgradeLeadToClient(lead.id);
    onOpenChange(false);
    if (clientId) {
      router.push(`/admin/clients/${clientId}`);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{adminT("leads.upgradeConfirmTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {lead
              ? adminT("leads.upgradeConfirmDescription", { name: lead.name })
              : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{adminT("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-gold text-gold-foreground hover:bg-gold/90"
            onClick={handleConfirm}
          >
            {adminT("leads.upgradeConfirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
