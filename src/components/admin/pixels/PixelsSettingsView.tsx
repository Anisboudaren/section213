"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { PixelCard, PLATFORMS } from "@/components/admin/pixels/PixelCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { adminT } from "@/lib/i18n/admin-en";
import { useUpdatePixelSettings } from "@/lib/queries/pixel-settings";
import type { PixelSettingsDto } from "@/lib/pixel-settings-defaults";
import type { PixelConfig, PixelPlatform } from "@/lib/types/admin";

type PixelsSettingsViewProps = {
  initialSettings: PixelSettingsDto;
};

const API_CREDENTIALS: {
  platform: PixelPlatform;
  tokenField: keyof PixelConfig;
  labelKey: Parameters<typeof adminT>[0];
  hintKey: Parameters<typeof adminT>[0];
  placeholderKey: Parameters<typeof adminT>[0];
}[] = [
  {
    platform: "meta",
    tokenField: "metaAccessToken",
    labelKey: "pixels.apiCredentials.meta.label",
    hintKey: "pixels.apiCredentials.meta.hint",
    placeholderKey: "pixels.apiCredentials.meta.placeholder",
  },
  {
    platform: "tiktok",
    tokenField: "tiktokAccessToken",
    labelKey: "pixels.apiCredentials.tiktok.label",
    hintKey: "pixels.apiCredentials.tiktok.hint",
    placeholderKey: "pixels.apiCredentials.tiktok.placeholder",
  },
  {
    platform: "ga4",
    tokenField: "ga4ApiSecret",
    labelKey: "pixels.apiCredentials.ga4.label",
    hintKey: "pixels.apiCredentials.ga4.hint",
    placeholderKey: "pixels.apiCredentials.ga4.placeholder",
  },
  {
    platform: "snapchat",
    tokenField: "snapchatAccessToken",
    labelKey: "pixels.apiCredentials.snapchat.label",
    hintKey: "pixels.apiCredentials.snapchat.hint",
    placeholderKey: "pixels.apiCredentials.snapchat.placeholder",
  },
];

export function PixelsSettingsView({ initialSettings }: PixelsSettingsViewProps) {
  const updateSettings = useUpdatePixelSettings();
  const [draft, setDraft] = useState<PixelConfig>(() => {
    const { id: _id, updatedAt: _updatedAt, ...config } = initialSettings;
    return config;
  });

  useEffect(() => {
    const { id: _id, updatedAt: _updatedAt, ...config } = initialSettings;
    setDraft(config);
  }, [initialSettings]);

  const updateField = (field: keyof PixelConfig, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const togglePlatform = (platform: PixelPlatform, enabled: boolean) => {
    setDraft((prev) => {
      const activePixels = enabled
        ? [...new Set([...prev.activePixels, platform])]
        : prev.activePixels.filter((p) => p !== platform);
      return { ...prev, activePixels };
    });
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(draft);
      toast.success(adminT("pixels.saved"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save pixel settings");
    }
  };

  const isTokenConfigured = (field: keyof PixelConfig) =>
    Boolean((draft[field] as string | undefined)?.trim());

  return (
    <AdminPageShell
      title={adminT("pixels.title")}
      description={adminT("pixels.description")}
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 rounded-lg border border-ink/10 p-4">
          <Switch
            checked={draft.testMode}
            onCheckedChange={(testMode) => setDraft((p) => ({ ...p, testMode }))}
          />
          <div>
            <Label className="font-medium">{adminT("pixels.testMode")}</Label>
            <p className="text-xs text-muted-foreground">
              {adminT("pixels.testModeDescription")}
            </p>
          </div>
        </div>
        <Button
          variant="gold"
          className="min-h-11"
          onClick={() => void handleSave()}
          disabled={updateSettings.isPending}
        >
          {adminT("pixels.save")}
        </Button>
      </div>

      {draft.testMode && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{adminT("pixels.testMode")}</AlertTitle>
          <AlertDescription>{adminT("pixels.testModeWarning")}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {PLATFORMS.map(({ id, icon, idField }) => (
          <PixelCard
            key={id}
            platform={id}
            icon={icon}
            idField={idField}
            value={(draft[idField] as string) ?? ""}
            active={draft.activePixels.includes(id)}
            onValueChange={(v) => updateField(idField, v)}
            onToggle={(enabled) => togglePlatform(id, enabled)}
          />
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <div>
          <h3 className="text-base font-semibold">{adminT("pixels.apiCredentials.title")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {adminT("pixels.apiCredentials.description")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {API_CREDENTIALS.map(({ platform, tokenField, labelKey, hintKey, placeholderKey }) => (
            <div key={platform} className="rounded-lg border border-ink/10 p-4">
              <div className="flex items-center gap-2">
                <Label>{adminT(labelKey)}</Label>
                {isTokenConfigured(tokenField) && (
                  <Badge variant="secondary">{adminT("pixels.capiConfigured")}</Badge>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{adminT(hintKey)}</p>
              <Input
                className="mt-2 min-h-11"
                type="password"
                autoComplete="off"
                placeholder={adminT(placeholderKey)}
                value={(draft[tokenField] as string) ?? ""}
                onChange={(e) => updateField(tokenField, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}
