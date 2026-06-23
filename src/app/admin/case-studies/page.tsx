"use client";

import { useState } from "react";
import { FolderOpen, Plus } from "lucide-react";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { EmptyState } from "@/components/admin/EmptyState";
import { CaseStudyCard } from "@/components/admin/case-studies/CaseStudyCard";
import {
  CaseStudyForm,
  type CaseStudyFormValues,
} from "@/components/admin/case-studies/CaseStudyForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAdminStore } from "@/lib/admin-store";
import { adminT } from "@/lib/i18n/admin-en";
import type { CaseStudy } from "@/lib/types/admin";

export default function CaseStudiesPage() {
  const { caseStudies, addCaseStudy, updateCaseStudy } = useAdminStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CaseStudy | null>(null);

  const sorted = [...caseStudies].sort((a, b) => a.order - b.order);

  const handleSubmit = (values: CaseStudyFormValues) => {
    const data = {
      ...values,
      clientId: values.clientId || undefined,
      industry: values.industry || undefined,
      thumbnailUrl: values.thumbnailUrl || undefined,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
    };
    if (editing) {
      updateCaseStudy(editing.id, data);
    } else {
      addCaseStudy(data);
    }
    setDialogOpen(false);
    setEditing(null);
  };

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (cs: CaseStudy) => {
    setEditing(cs);
    setDialogOpen(true);
  };

  return (
    <AdminPageShell
      title={adminT("caseStudies.title")}
      description={adminT("caseStudies.count", { count: caseStudies.length })}
    >
      <div className="mb-4">
        <Button variant="gold" className="min-h-11" onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" />
          {adminT("caseStudies.addCaseStudy")}
        </Button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={adminT("caseStudies.emptyTitle")}
          description={adminT("caseStudies.emptyDescription")}
          action={{ label: adminT("caseStudies.addCaseStudy"), onClick: openAdd }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {sorted.map((cs) => (
            <CaseStudyCard
              key={cs.id}
              caseStudy={cs}
              onTogglePublished={(id, published) => updateCaseStudy(id, { published })}
              onEdit={openEdit}
            />
          ))}
        </div>
      )}

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
              {editing
                ? adminT("caseStudies.editCaseStudy")
                : adminT("caseStudies.addCaseStudy")}
            </DialogTitle>
          </DialogHeader>
          <CaseStudyForm
            key={editing?.id ?? "new"}
            caseStudy={editing ?? undefined}
            onSubmit={handleSubmit}
            formId="case-study-form"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {adminT("common.cancel")}
            </Button>
            <Button variant="gold" type="submit" form="case-study-form" className="min-h-11">
              {adminT("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
