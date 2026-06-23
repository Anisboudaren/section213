"use client";

import { useState } from "react";
import { Briefcase, Plus } from "lucide-react";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { EmptyState } from "@/components/admin/EmptyState";
import { OfferCard } from "@/components/admin/offers/OfferCard";
import { OfferForm, type OfferFormValues } from "@/components/admin/offers/OfferForm";
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
import { useAdminStore } from "@/lib/admin-store";
import { adminT } from "@/lib/i18n/admin-en";
import type { Offer, OfferCategory } from "@/lib/types/admin";

// This data drives the public / Solutions section and /book flow when i18n is migrated.

const CATEGORIES: OfferCategory[] = [
  "media",
  "brand_content",
  "websites_apps",
  "automations",
];

export default function OffersPage() {
  const { offers, addOffer, updateOffer, deleteOffer } = useAdminStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [addCategory, setAddCategory] = useState<OfferCategory>("media");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSubmit = (values: OfferFormValues) => {
    const payload = {
      slug: values.slug,
      name: values.name,
      nameAr: values.nameAr || undefined,
      nameFr: values.nameFr || undefined,
      category: values.category,
      description: values.description,
      descriptionFr: values.descriptionFr || undefined,
      features: values.features.map((f) => f.value).filter(Boolean),
      price: values.priceMode === "fixed" ? values.price : undefined,
      priceLabel: values.priceMode === "label" ? values.priceLabel : undefined,
      active: values.active,
      featured: values.featured,
      order: values.order,
      cta: values.cta || undefined,
    };
    if (editing) {
      updateOffer(editing.id, payload);
    } else {
      addOffer(payload);
    }
    setDialogOpen(false);
    setEditing(null);
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
      <Tabs defaultValue="media" className="space-y-4">
        <TabsList className="flex h-auto flex-wrap gap-1">
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="min-h-11">
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
                <div className="grid gap-4 md:grid-cols-2">
                  {categoryOffers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      onEdit={openEdit}
                      onDelete={setDeleteId}
                      onToggleActive={(id, active) => updateOffer(id, { active })}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
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
            <Button variant="gold" type="submit" form="offer-form" className="min-h-11">
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
              onClick={() => {
                if (deleteId) deleteOffer(deleteId);
                setDeleteId(null);
              }}
            >
              {adminT("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPageShell>
  );
}
