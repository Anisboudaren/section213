"use client";

import Link from "next/link";
import { useState } from "react";
import { FolderOpen, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { CaseStudyCard } from "@/components/admin/case-studies/CaseStudyCard";
import { EmptyState } from "@/components/admin/EmptyState";
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
import { adminT } from "@/lib/i18n/admin-en";
import { useDeleteCaseStudy, useResetCaseStudies, useUpdateCaseStudy } from "@/lib/queries/case-studies";
import type { CaseStudy } from "@/lib/types/admin";

type CaseStudiesViewProps = {
  initialCaseStudies: CaseStudy[];
};

export function CaseStudiesView({ initialCaseStudies }: CaseStudiesViewProps) {
  const [caseStudies, setCaseStudies] = useState(initialCaseStudies);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const updateCaseStudy = useUpdateCaseStudy();
  const deleteCaseStudy = useDeleteCaseStudy();
  const resetCaseStudies = useResetCaseStudies();

  const sorted = [...caseStudies].sort((a, b) => a.order - b.order);

  const handleTogglePublished = async (id: string, published: boolean) => {
    try {
      const updated = await updateCaseStudy.mutateAsync({ id, data: { published } });
      setCaseStudies((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCaseStudy.mutateAsync(deleteId);
      setCaseStudies((prev) => prev.filter((c) => c.id !== deleteId));
      toast.success("Étude de cas supprimée");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setDeleteId(null);
    }
  };

  const handleReset = async () => {
    try {
      const data = await resetCaseStudies.mutateAsync();
      setCaseStudies(data);
      toast.success(adminT("caseStudies.resetSuccess"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setResetOpen(false);
    }
  };

  return (
    <AdminPageShell
      title={adminT("caseStudies.title")}
      description={adminT("caseStudies.count", { count: caseStudies.length })}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant="gold" className="min-h-11" asChild>
          <Link href="/admin/case-studies/new">
            <Plus className="mr-2 h-4 w-4" />
            {adminT("caseStudies.addCaseStudy")}
          </Link>
        </Button>
        <Button
          variant="outline"
          className="min-h-11"
          onClick={() => setResetOpen(true)}
          disabled={resetCaseStudies.isPending}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {adminT("caseStudies.resetToSeed")}
        </Button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={adminT("caseStudies.emptyTitle")}
          description={adminT("caseStudies.emptyDescription")}
          action={{
            label: adminT("caseStudies.addCaseStudy"),
            onClick: () => {
              window.location.href = "/admin/case-studies/new";
            },
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {sorted.map((cs) => (
            <CaseStudyCard
              key={cs.id}
              caseStudy={cs}
              onTogglePublished={handleTogglePublished}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{adminT("common.delete")}</AlertDialogTitle>
            <AlertDialogDescription>{adminT("caseStudies.deleteConfirm")}</AlertDialogDescription>
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
            <AlertDialogTitle>{adminT("caseStudies.resetToSeed")}</AlertDialogTitle>
            <AlertDialogDescription>{adminT("caseStudies.resetConfirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{adminT("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleReset()} disabled={resetCaseStudies.isPending}>
              {adminT("caseStudies.resetToSeed")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminPageShell>
  );
}
