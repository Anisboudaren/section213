"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AssigneeSelect } from "@/components/admin/AssigneeSelect";
import { TeamMultiSelect } from "@/components/admin/TeamMultiSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ClientDto } from "@/lib/actions/clients";
import type { ProjectListItem } from "@/lib/actions/projects";
import { adminT } from "@/lib/i18n/admin-en";
import { useCreateProject, useUpdateProject } from "@/lib/queries/projects";
import { useOffers } from "@/lib/queries/offers";
import {
  createProjectSchema,
  projectStatusOptions,
  serviceTypeOptions,
  type CreateProjectInput,
} from "@/lib/schemas/client-schema";

type ProjectFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Pick<ClientDto, "id" | "name" | "company">[];
  project?: ProjectListItem;
  defaultClientId?: string;
  lockClient?: boolean;
  onCreated?: (projectId: string) => void;
  onUpdated?: (project: ProjectListItem) => void;
};

function toDateInput(value?: string) {
  return value ? value.slice(0, 10) : "";
}

function getDefaultValues(clientId = "", project?: ProjectListItem): CreateProjectInput {
  if (project) {
    return {
      name: project.name,
      description: project.description,
      clientId: project.clientId,
      serviceType: project.serviceType,
      status: project.status,
      leadId: project.leadId,
      teamIds: project.teamIds,
      offerSlug: project.offerSlug ?? "",
      startDate: toDateInput(project.startDate),
      deadline: toDateInput(project.deadline),
      budgetDZD: project.budgetDZD,
      notes: project.notes,
    };
  }

  return {
    name: "",
    description: "",
    clientId,
    serviceType: "reels_content",
    status: "briefing",
    teamIds: [],
    offerSlug: "",
    startDate: "",
    deadline: "",
    notes: "",
  };
}

export function ProjectFormModal({
  open,
  onOpenChange,
  clients,
  project,
  defaultClientId,
  lockClient,
  onCreated,
  onUpdated,
}: ProjectFormModalProps) {
  const isEdit = !!project;
  const { data: offers = [] } = useOffers();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const activeOffers = offers.filter((o) => o.active);

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: getDefaultValues(defaultClientId ?? "", project),
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(defaultClientId ?? "", project));
    }
  }, [open, defaultClientId, project, form]);

  const onSubmit = async (values: CreateProjectInput) => {
    try {
      if (isEdit && project) {
        const updated = await updateProject.mutateAsync({
          id: project.id,
          data: {
            ...values,
            budgetDZD: values.budgetDZD || undefined,
            paidDZD: project.paidDZD,
          },
        });
        onOpenChange(false);
        onUpdated?.(updated);
        toast.success("Projet mis à jour");
        return;
      }

      const created = await createProject.mutateAsync({
        ...values,
        budgetDZD: values.budgetDZD || undefined,
      });
      onOpenChange(false);
      form.reset(getDefaultValues(defaultClientId ?? ""));
      onCreated?.(created.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const pending = createProject.isPending || updateProject.isPending;
  const formId = isEdit ? "edit-project-form" : "new-project-form";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95dvh] w-[calc(100%-0px)] flex-col overflow-hidden max-sm:top-auto max-sm:bottom-0 max-sm:translate-x-[-50%] max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier le projet" : "Nouveau projet"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id={formId}
            onSubmit={form.handleSubmit(onSubmit)}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto"
          >
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={lockClient || isEdit}
                  >
                    <FormControl>
                      <SelectTrigger className="min-h-11">
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} — {c.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} className="min-h-11" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="min-h-11">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceTypeOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {isEdit && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="min-h-11">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projectStatusOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date début</FormLabel>
                    <FormControl>
                      <Input type="date" className="min-h-11" {...field} value={field.value ?? ""} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" className="min-h-11" {...field} value={field.value ?? ""} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="budgetDZD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget (DZD)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="min-h-11"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offerSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offre liée</FormLabel>
                  <Select
                    value={field.value || "none"}
                    onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
                  >
                    <FormControl>
                      <SelectTrigger className="min-h-11">
                        <SelectValue placeholder="Aucune" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Aucune</SelectItem>
                      {activeOffers.map((o) => (
                        <SelectItem key={o.id} value={o.slug}>
                          {o.nameFr ?? o.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leadId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsable</FormLabel>
                  <AssigneeSelect value={field.value} onChange={field.onChange} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teamIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Équipe</FormLabel>
                  <TeamMultiSelect
                    value={field.value ?? []}
                    onChange={field.onChange}
                    excludeIds={form.watch("leadId") ? [form.watch("leadId")!] : []}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ""} rows={3} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-2 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="min-h-11">
            {adminT("common.cancel")}
          </Button>
          <Button
            variant="gold"
            type="submit"
            form={formId}
            className="min-h-11"
            disabled={pending}
          >
            {isEdit ? adminT("common.save") : "Créer le projet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
