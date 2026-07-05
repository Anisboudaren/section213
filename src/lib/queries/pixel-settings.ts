"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updatePixelSettings } from "@/lib/actions/pixel-settings";
import type { UpdatePixelSettingsInput } from "@/lib/schemas/pixel-settings-schema";

export const PIXEL_SETTINGS_KEY = ["pixel-settings"] as const;

export function useUpdatePixelSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdatePixelSettingsInput) => {
      const result = await updatePixelSettings(data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PIXEL_SETTINGS_KEY });
    },
  });
}
