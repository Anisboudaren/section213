"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateSiteSettings } from "@/lib/actions/site-settings";
import type { UpdateSiteSettingsInput } from "@/lib/schemas/site-settings-schema";

export const SITE_SETTINGS_KEY = ["site-settings"] as const;

export function useUpdateSiteSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateSiteSettingsInput) => {
      const result = await updateSiteSettings(data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SITE_SETTINGS_KEY });
    },
  });
}
