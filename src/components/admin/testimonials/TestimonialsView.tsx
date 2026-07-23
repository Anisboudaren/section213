"use client";

import { useMemo, useState } from "react";
import { MessageSquareQuote, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { EmptyState } from "@/components/admin/EmptyState";
import { TestimonialCard } from "@/components/admin/testimonials/TestimonialCard";
import {
  TestimonialForm,
  type TestimonialFormValues,
} from "@/components/admin/testimonials/TestimonialForm";
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
import {
  createTestimonial,
  deleteTestimonial,
  resetTestimonialsToDefaults,
  updateTestimonial,
  type TestimonialDto,
} from "@/lib/actions/testimonials";
import { adminT } from "@/lib/i18n/admin-en";

type TestimonialsViewProps = {
  initialTestimonials: TestimonialDto[];
};

export function TestimonialsView({ initialTestimonials }: TestimonialsViewProps) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TestimonialDto | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  const nextSortOrder = useMemo(
    () => (testimonials.length > 0 ? Math.max(...testimonials.map((t) => t.sortOrder)) + 1 : 0),
    [testimonials],
  );

  const sortedTestimonials = [...testimonials].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleSubmit = async (values: TestimonialFormValues) => {
    const payload = {
      ...values,
      quoteAr: values.quoteAr?.trim() || "",
      photoUrl: values.photoUrl?.trim() || "",
      instagramHandle: values.instagramHandle?.trim() || "",
      email: values.email?.trim() || "",
    };

    try {
      if (editing) {
        const result = await updateTestimonial(editing.id, payload);
        if (!result.success) throw new Error(result.error);
        setTestimonials((prev) => prev.map((t) => (t.id === editing.id ? result.data : t)));
        toast.success(adminT("testimonials.testimonialUpdated"));
      } else {
        const result = await createTestimonial(payload);
        if (!result.success) throw new Error(result.error);
        setTestimonials((prev) => [...prev, result.data]);
        toast.success(adminT("testimonials.testimonialCreated"));
      }
      setDialogOpen(false);
      setEditing(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : adminT("common.error"));
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const result = await updateTestimonial(id, { active });
      if (!result.success) throw new Error(result.error);
      setTestimonials((prev) => prev.map((t) => (t.id === id ? result.data : t)));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : adminT("common.error"));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const result = await deleteTestimonial(deleteId);
      if (!result.success) throw new Error(result.error);
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteId));
      toast.success(adminT("testimonials.testimonialDeleted"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : adminT("common.error"));
    } finally {
      setDeleteId(null);
    }
  };

  const handleResetDefaults = async () => {
    setResetting(true);
    try {
      const result = await resetTestimonialsToDefaults();
      if (!result.success) throw new Error(result.error);
      setTestimonials(result.data);
      toast.success(adminT("testimonials.resetDone"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : adminT("common.error"));
    } finally {
      setResetting(false);
    }
  };

  return (
    <AdminPageShell
      title={adminT("testimonials.title")}
      highlight={adminT("testimonials.titleHighlight")}
      description={adminT("testimonials.description")}
    >
      <div className="grid gap-6">
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
            {adminT("testimonials.addTestimonial")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={handleResetDefaults}
            disabled={resetting}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {adminT("testimonials.resetDefaults")}
          </Button>
        </div>

        {sortedTestimonials.length === 0 ? (
          <EmptyState
            icon={MessageSquareQuote}
            title={adminT("testimonials.emptyTitle")}
            description={adminT("testimonials.emptyDescription")}
            action={{
              label: adminT("testimonials.addTestimonial"),
              onClick: () => {
                setEditing(null);
                setDialogOpen(true);
              },
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
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
              {editing
                ? adminT("testimonials.editTestimonial")
                : adminT("testimonials.addTestimonial")}
            </DialogTitle>
          </DialogHeader>
          <TestimonialForm
            key={editing?.id ?? "new"}
            testimonial={editing ?? undefined}
            nextSortOrder={nextSortOrder}
            onSubmit={handleSubmit}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {adminT("common.cancel")}
            </Button>
            <Button variant="gold" type="submit" form="testimonial-form" className="min-h-11">
              {adminT("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{adminT("testimonials.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {adminT("testimonials.deleteDescription")}
            </AlertDialogDescription>
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
