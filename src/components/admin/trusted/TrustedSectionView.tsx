"use client";

import { useMemo, useState } from "react";
import { Handshake, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { EmptyState } from "@/components/admin/EmptyState";
import { TrustedPartnerCard } from "@/components/admin/trusted/TrustedPartnerCard";
import {
  TrustedPartnerForm,
  type TrustedPartnerFormValues,
} from "@/components/admin/trusted/TrustedPartnerForm";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  createTrustedPartner,
  deleteTrustedPartner,
  resetTrustedPartnersToDefaults,
  updateTrustedPartner,
  updateTrustedSectionCopy,
  type TrustedPartnerDto,
  type TrustedSectionCopyDto,
} from "@/lib/actions/trusted-partners";
import { adminT } from "@/lib/i18n/admin-en";

type TrustedSectionViewProps = {
  initialPartners: TrustedPartnerDto[];
  initialCopy: TrustedSectionCopyDto;
};

export function TrustedSectionView({ initialPartners, initialCopy }: TrustedSectionViewProps) {
  const [partners, setPartners] = useState(initialPartners);
  const [copy, setCopy] = useState(initialCopy);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TrustedPartnerDto | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [savingCopy, setSavingCopy] = useState(false);
  const [resetting, setResetting] = useState(false);

  const nextSortOrder = useMemo(
    () => (partners.length > 0 ? Math.max(...partners.map((p) => p.sortOrder)) + 1 : 0),
    [partners],
  );

  const sortedPartners = [...partners].sort((a, b) => a.sortOrder - b.sortOrder);

  const handlePartnerSubmit = async (values: TrustedPartnerFormValues) => {
    const payload = {
      ...values,
      linkUrl: values.linkUrl?.trim() || "",
    };

    try {
      if (editing) {
        const result = await updateTrustedPartner(editing.id, payload);
        if (!result.success) throw new Error(result.error);
        setPartners((prev) => prev.map((p) => (p.id === editing.id ? result.data : p)));
        toast.success(adminT("trusted.partnerUpdated"));
      } else {
        const result = await createTrustedPartner(payload);
        if (!result.success) throw new Error(result.error);
        setPartners((prev) => [...prev, result.data]);
        toast.success(adminT("trusted.partnerCreated"));
      }
      setDialogOpen(false);
      setEditing(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : adminT("common.error"));
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const result = await updateTrustedPartner(id, { active });
      if (!result.success) throw new Error(result.error);
      setPartners((prev) => prev.map((p) => (p.id === id ? result.data : p)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : adminT("common.error"));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const result = await deleteTrustedPartner(deleteId);
      if (!result.success) throw new Error(result.error);
      setPartners((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success(adminT("trusted.partnerDeleted"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : adminT("common.error"));
    } finally {
      setDeleteId(null);
    }
  };

  const handleSaveCopy = async () => {
    setSavingCopy(true);
    try {
      const result = await updateTrustedSectionCopy({
        index: copy.index,
        titleEn: copy.en.title,
        titleHighlightEn: copy.en.titleHighlight,
        subtitleEn: copy.en.subtitle,
        titleFr: copy.fr.title,
        titleHighlightFr: copy.fr.titleHighlight,
        subtitleFr: copy.fr.subtitle,
      });
      if (!result.success) throw new Error(result.error);
      setCopy(result.data);
      toast.success(adminT("trusted.copySaved"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : adminT("common.error"));
    } finally {
      setSavingCopy(false);
    }
  };

  const handleResetDefaults = async () => {
    setResetting(true);
    try {
      const result = await resetTrustedPartnersToDefaults();
      if (!result.success) throw new Error(result.error);
      setPartners(result.data);
      toast.success(adminT("trusted.resetDone"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : adminT("common.error"));
    } finally {
      setResetting(false);
    }
  };

  return (
    <AdminPageShell
      title={adminT("trusted.title")}
      highlight={adminT("trusted.titleHighlight")}
      description={adminT("trusted.description")}
    >
      <div className="grid gap-6">
        <Card className="border-ink/10">
          <CardHeader>
            <CardTitle className="text-base">{adminT("trusted.sectionCopyTitle")}</CardTitle>
            <CardDescription>{adminT("trusted.sectionCopyDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-xs space-y-2">
              <Label htmlFor="trusted-index">{adminT("trusted.sectionIndex")}</Label>
              <Input
                id="trusted-index"
                value={copy.index}
                onChange={(e) => setCopy((c) => ({ ...c, index: e.target.value }))}
                className="min-h-11"
              />
            </div>

            <Tabs defaultValue="en">
              <TabsList>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="fr">Français</TabsTrigger>
              </TabsList>
              <TabsContent value="en" className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{adminT("trusted.titleLine")}</Label>
                    <Input
                      value={copy.en.title}
                      onChange={(e) =>
                        setCopy((c) => ({ ...c, en: { ...c.en, title: e.target.value } }))
                      }
                      className="min-h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{adminT("trusted.titleHighlightLine")}</Label>
                    <Input
                      value={copy.en.titleHighlight}
                      onChange={(e) =>
                        setCopy((c) => ({ ...c, en: { ...c.en, titleHighlight: e.target.value } }))
                      }
                      className="min-h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{adminT("common.description")}</Label>
                  <Textarea
                    value={copy.en.subtitle}
                    onChange={(e) =>
                      setCopy((c) => ({ ...c, en: { ...c.en, subtitle: e.target.value } }))
                    }
                    rows={3}
                  />
                </div>
              </TabsContent>
              <TabsContent value="fr" className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{adminT("trusted.titleLine")}</Label>
                    <Input
                      value={copy.fr.title}
                      onChange={(e) =>
                        setCopy((c) => ({ ...c, fr: { ...c.fr, title: e.target.value } }))
                      }
                      className="min-h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{adminT("trusted.titleHighlightLine")}</Label>
                    <Input
                      value={copy.fr.titleHighlight}
                      onChange={(e) =>
                        setCopy((c) => ({ ...c, fr: { ...c.fr, titleHighlight: e.target.value } }))
                      }
                      className="min-h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{adminT("common.description")}</Label>
                  <Textarea
                    value={copy.fr.subtitle}
                    onChange={(e) =>
                      setCopy((c) => ({ ...c, fr: { ...c.fr, subtitle: e.target.value } }))
                    }
                    rows={3}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Button
              type="button"
              variant="gold"
              className="min-h-11"
              onClick={handleSaveCopy}
              disabled={savingCopy}
            >
              {savingCopy ? adminT("common.saving") : adminT("trusted.saveCopy")}
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="gold"
            className="min-h-11"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            {adminT("trusted.addPartner")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={handleResetDefaults}
            disabled={resetting}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {adminT("trusted.resetDefaults")}
          </Button>
        </div>

        {sortedPartners.length === 0 ? (
          <EmptyState
            icon={Handshake}
            title={adminT("trusted.emptyTitle")}
            description={adminT("trusted.emptyDescription")}
            action={{
              label: adminT("trusted.addPartner"),
              onClick: () => {
                setEditing(null);
                setDialogOpen(true);
              },
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedPartners.map((partner) => (
              <TrustedPartnerCard
                key={partner.id}
                partner={partner}
                onEdit={(item) => {
                  setEditing(item);
                  setDialogOpen(true);
                }}
                onDelete={setDeleteId}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}
      </div>

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
              {editing ? adminT("trusted.editPartner") : adminT("trusted.addPartner")}
            </DialogTitle>
          </DialogHeader>
          <TrustedPartnerForm
            key={editing?.id ?? "new"}
            partner={editing ?? undefined}
            nextSortOrder={nextSortOrder}
            onSubmit={handlePartnerSubmit}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {adminT("common.cancel")}
            </Button>
            <Button variant="gold" type="submit" form="trusted-partner-form" className="min-h-11">
              {adminT("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{adminT("trusted.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{adminT("trusted.deleteDescription")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{adminT("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{adminT("common.delete")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPageShell>
  );
}
