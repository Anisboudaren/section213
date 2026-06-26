"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createLead,
  createTrackedLink,
  deleteLead,
  getLead,
  getLeads,
  getTrackedLinks,
  type LeadFilters,
  updateLead,
  upgradeLead,
} from "@/lib/actions/leads";
import type { CreateLeadInput, UpdateLeadInput } from "@/lib/schemas/lead-schema";

export const LEADS_KEY = ["leads"] as const;
export const TRACKED_LINKS_KEY = ["tracked-links"] as const;

export function useLeads(filters?: LeadFilters) {
  return useQuery({
    queryKey: [...LEADS_KEY, filters],
    queryFn: async () => {
      const result = await getLeads(filters);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useLead(id: string | null) {
  return useQuery({
    queryKey: [...LEADS_KEY, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const result = await getLead(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useTrackedLinks() {
  return useQuery({
    queryKey: TRACKED_LINKS_KEY,
    queryFn: async () => {
      const result = await getTrackedLinks();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateLeadInput) => {
      const result = await createLead(data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LEADS_KEY });
      qc.invalidateQueries({ queryKey: TRACKED_LINKS_KEY });
    },
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLeadInput }) => {
      const result = await updateLead(id, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: LEADS_KEY }),
  });
}

export function useUpgradeLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await upgradeLead(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: LEADS_KEY }),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteLead(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: LEADS_KEY }),
  });
}

export function useCreateTrackedLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Parameters<typeof createTrackedLink>[0]) => {
      const result = await createTrackedLink(data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: TRACKED_LINKS_KEY }),
  });
}
