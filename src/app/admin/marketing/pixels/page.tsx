"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { PixelCard, PLATFORMS } from "@/components/admin/pixels/PixelCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAdminStore } from "@/lib/admin-store";
import { adminT } from "@/lib/i18n/admin-en";
import type { PixelConfig, PixelPlatform } from "@/lib/types/admin";

export default function PixelsPage() {
  const { pixelConfig, setPixelConfig } = useAdminStore();
  const [draft, setDraft] = useState<PixelConfig>(pixelConfig);

  useEffect(() => {
    setDraft(pixelConfig);
  }, [pixelConfig]);

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

  const handleSave = () => {
    // Replace with DB write via API route when Neon is connected
    setPixelConfig(draft);
    toast.success(adminT("pixels.saved"));
  };

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
        <Button variant="gold" className="min-h-11" onClick={handleSave}>
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

      <div className="mt-6 rounded-lg border border-ink/10 p-4">
        <Label>{adminT("pixels.accessToken")}</Label>
        <Input
          className="mt-2 min-h-11"
          placeholder={adminT("pixels.accessTokenPlaceholder")}
          value={draft.metaAccessToken ?? ""}
          onChange={(e) => updateField("metaAccessToken", e.target.value)}
        />
      </div>
    </AdminPageShell>
  );
}
