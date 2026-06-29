"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteMediaAsset,
  getMediaAssets,
  syncMediaFromBlob,
  type MediaFilters,
} from "@/lib/actions/media";

export const MEDIA_KEY = ["media"] as const;

export function useMediaAssets(filters?: MediaFilters) {
  return useQuery({
    queryKey: [...MEDIA_KEY, filters],
    queryFn: async () => {
      const result = await getMediaAssets(filters);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useSyncMediaFromBlob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const result = await syncMediaFromBlob();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MEDIA_KEY }),
  });
}

export function useDeleteMediaAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteMediaAsset(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: MEDIA_KEY }),
  });
}
