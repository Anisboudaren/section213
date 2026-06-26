"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createOffer,
  deleteOffer,
  getOffers,
  type OfferFilters,
  updateOffer,
} from "@/lib/actions/offers";
import type { CreateOfferInput, UpdateOfferInput } from "@/lib/schemas/offer-schema";

export const OFFERS_KEY = ["offers"] as const;

export function useOffers(filters?: OfferFilters) {
  return useQuery({
    queryKey: [...OFFERS_KEY, filters],
    queryFn: async () => {
      const result = await getOffers(filters);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useCreateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateOfferInput) => {
      const result = await createOffer(data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: OFFERS_KEY }),
  });
}

export function useUpdateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOfferInput }) => {
      const result = await updateOffer(id, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: OFFERS_KEY }),
  });
}

export function useDeleteOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteOffer(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: OFFERS_KEY }),
  });
}
