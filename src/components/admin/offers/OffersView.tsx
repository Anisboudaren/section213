"use client";

import { useState } from "react";
import { Briefcase, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { EmptyState } from "@/components/admin/EmptyState";
import { OfferCard } from "@/components/admin/offers/OfferCard";
import { OfferForm } from "@/components/admin/offers/OfferForm";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminT } from "@/lib/i18n/admin-en";
import {
  useCreateOffer,
  useDeleteOffer,
  useResetOffersToV1,
  useUpdateOffer,
} from "@/lib/queries/offers";
import { offerFormValuesToInput } from "@/lib/schemas/offer-schema";
import type { Offer, OfferCategory } from "@/lib/types/admin";

const CATEGORIES: OfferCategory[] = ["pack", "ala_carte"];

type OffersViewProps = {
  initialOffers: Offer[];
};

export function OffersView({ initialOffers }: OffersViewProps) {
  const [offers, setOffers] = useState(initialOffers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [addCategory, setAddCategory] = useState<OfferCategory>("pack");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const deleteOffer = useDeleteOffer();
  const resetOffers = useResetOffersToV1();

  const handleSubmit = async (values: Parameters<typeof offerFormValuesToInput>[0]) => {
    const payload = offerFormValuesToInput(values);
    try {
      if (editing) {
        const updated = await updateOffer.mutateAsync({ id: editing.id, data: payload });
        setOffers((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        toast.success("Offre mise à jour");
      } else {
        const created = await createOffer.mutateAsync(payload);
        setOffers((prev) => [...prev, created]);
        toast.success("Offre créée");
      }
      setDialogOpen(false);
      setEditing(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const updated = await updateOffer.mutateAsync({ id, data: { active } });
      setOffers((prev) => prev.map((o) => (o.id === id ? updated : o)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteOffer.mutateAsync(deleteId);
      setOffers((prev) => prev.filter((o) => o.id !== deleteId));
      toast.success("Offre supprimée");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setDeleteId(null);
    }
  };

  const handleReset = async () => {
    try {
      const data = await resetOffers.mutateAsync();
      setOffers(data);
      toast.success(adminT("offers.resetSuccess"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setResetOpen(false);
    }
  };

  const openAdd = (category: OfferCategory) => {
    setEditing(null);
    setAddCategory(category);
    setDialogOpen(true);
  };

  const openEdit = (offer: Offer) => {
    setEditing(offer);
    setDialogOpen(true);
  };

  return (
    <AdminPageShell
      title={adminT("offers.title")}
      description={adminT("offers.drivesPublicSite")}
    >
      <div className="flex justify-end">
        <Button
          variant="outline"
          className="min-h-11"
          onClick={() => setResetOpen(true)}
          disabled={resetOffers.isPending}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {adminT("offers.resetToV1")}
        </Button>
      </div>

      <Tabs defaultValue="pack" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap gap-1.5 bg-transparent p-0">
          {CATEGORIES.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="min-h-10 rounded-full border border-ink/10 px-4 data-[state=active]:border-ruby/40 data-[state=active]:bg-ink data-[state=active]:text-white"
            >
              {adminT(`offers.categories.${cat}` as Parameters<typeof adminT>[0])}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIES.map((cat) => {
          const categoryOffers = offers
            .filter((o) => o.category === cat)
            .sort((a, b) => a.order - b.order);

          return (
            <TabsContent key={cat} value={cat} className="space-y-4">
              <Button variant="gold" className="min-h-11" onClick={() => openAdd(cat)}>
                <Plus className="mr-2 h-4 w-4" />
                {adminT("offers.addOffer")}
              </Button>

              {categoryOffers.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title={adminT("offers.emptyTitle")}
                  description={adminT("offers.emptyDescription")}
                  action={{
                    label: adminT("offers.addOffer"),
                    onClick: () => openAdd(cat),
                  }}
                />
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {categoryOffers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      onEdit={openEdit}
                      onDelete={setDeleteId}
                      onToggleActive={handleToggleActive}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="max-h-[95dvh] w-[calc(100%-1.5rem)] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? adminT("offers.editOffer") : adminT("offers.addOffer")}
            </DialogTitle>
          </DialogHeader>
          <OfferForm
            key={editing?.id ?? addCategory}
            offer={editing ?? undefined}
            defaultCategory={addCategory}
            onSubmit={handleSubmit}
            formId="offer-form"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {adminT("common.cancel")}
            </Button>
            <Button
              variant="gold"
              type="submit"
              form="offer-form"
              className="min-h-11"
              disabled={createOffer.isPending || updateOffer.isPending}
            >
              {adminT("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{adminT("offers.deleteOffer")}</AlertDialogTitle>
            <AlertDialogDescription>{adminT("offers.deleteConfirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{adminT("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => void handleDelete()}
            >
              {adminT("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{adminT("offers.resetToV1")}</AlertDialogTitle>
            <AlertDialogDescription>{adminT("offers.resetConfirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{adminT("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleReset()}
              disabled={resetOffers.isPending}
            >
              {adminT("offers.resetToV1")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPageShell>
  );
}
