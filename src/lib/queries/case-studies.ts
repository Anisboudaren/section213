"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCaseStudy,
  deleteCaseStudy,
  getCaseStudiesAdmin,
  resetCaseStudiesToSeed,
  updateCaseStudy,
} from "@/lib/actions/case-studies";
import type { CaseStudyInput, UpdateCaseStudyInput } from "@/lib/schemas/case-study-schema";

export const CASE_STUDIES_KEY = ["case-studies"] as const;

export function useCaseStudiesAdmin() {
  return useQuery({
    queryKey: CASE_STUDIES_KEY,
    queryFn: async () => {
      const result = await getCaseStudiesAdmin();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useCreateCaseStudy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: CaseStudyInput) => {
      const result = await createCaseStudy(data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CASE_STUDIES_KEY }),
  });
}

export function useUpdateCaseStudy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCaseStudyInput }) => {
      const result = await updateCaseStudy(id, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CASE_STUDIES_KEY }),
  });
}

export function useDeleteCaseStudy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteCaseStudy(id);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CASE_STUDIES_KEY }),
  });
}

export function useResetCaseStudies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const result = await resetCaseStudiesToSeed();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CASE_STUDIES_KEY }),
  });
}
