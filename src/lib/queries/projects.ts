"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createProject,
  createTask,
  deleteProject,
  deleteTask,
  getProject,
  getProjects,
  type ProjectFilters,
  toggleTask,
  updateProject,
  updateProjectStatus,
} from "@/lib/actions/projects";
import type { CreateProjectInput, UpdateProjectInput } from "@/lib/schemas/client-schema";
import type { ProjectStatus } from "@/generated/prisma/client";
import { CLIENTS_KEY } from "@/lib/queries/clients";

export const PROJECTS_KEY = ["projects"] as const;

export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: [...PROJECTS_KEY, filters],
    queryFn: async () => {
      const result = await getProjects(filters);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useProject(id: string | null) {
  return useQuery({
    queryKey: [...PROJECTS_KEY, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const result = await getProject(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateProjectInput) => {
      const result = await createProject(data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROJECTS_KEY });
      qc.invalidateQueries({ queryKey: CLIENTS_KEY });
    },
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectInput }) => {
      const result = await updateProject(id, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROJECTS_KEY });
      qc.invalidateQueries({ queryKey: CLIENTS_KEY });
    },
  });
}

export function useUpdateProjectStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ProjectStatus }) => {
      const result = await updateProjectStatus(id, status);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROJECTS_KEY });
      qc.invalidateQueries({ queryKey: CLIENTS_KEY });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteProject(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROJECTS_KEY });
      qc.invalidateQueries({ queryKey: CLIENTS_KEY });
    },
  });
}

export function useCreateTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: [...PROJECTS_KEY, projectId] }),
  });
}

export function useToggleTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, done }: { id: string; done: boolean }) => {
      const result = await toggleTask(id, done);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [...PROJECTS_KEY, projectId] }),
  });
}

export function useDeleteTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteTask(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [...PROJECTS_KEY, projectId] }),
  });
}
