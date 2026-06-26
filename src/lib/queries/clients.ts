"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createClient,
  deleteClient,
  getClient,
  getClients,
  type ClientFilters,
  updateClient,
  upgradeLeadToClient,
} from "@/lib/actions/clients";
import type { CreateClientInput, UpdateClientInput } from "@/lib/schemas/client-schema";

export const CLIENTS_KEY = ["clients"] as const;

export function useClients(filters?: ClientFilters) {
  return useQuery({
    queryKey: [...CLIENTS_KEY, filters],
    queryFn: async () => {
      const result = await getClients(filters);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useClient(id: string | null) {
  return useQuery({
    queryKey: [...CLIENTS_KEY, id],
    enabled: !!id,
    queryFn: async () => {
      if (!id) return null;
      const result = await getClient(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateClientInput) => {
      const result = await createClient(data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CLIENTS_KEY }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateClientInput }) => {
      const result = await updateClient(id, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CLIENTS_KEY }),
  });
}

export function useUpgradeLeadToClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      leadId,
      data,
    }: {
      leadId: string;
      data: CreateClientInput;
    }) => {
      const result = await upgradeLeadToClient(leadId, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CLIENTS_KEY });
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteClient(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CLIENTS_KEY }),
  });
}
