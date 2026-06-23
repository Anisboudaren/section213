"use client";

import { useState } from "react";
import { Copy, Share2, BarChart3, Search, Megaphone, Ghost } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { adminT } from "@/lib/i18n/admin-en";
import type { PixelConfig, PixelPlatform } from "@/lib/types/admin";

const PLATFORMS: {
  id: PixelPlatform;
  icon: LucideIcon;
  idField: keyof PixelConfig;
}[] = [
  { id: "meta", icon: Share2, idField: "metaPixelId" },
  { id: "tiktok", icon: Megaphone, idField: "tiktokPixelId" },
  { id: "ga4", icon: BarChart3, idField: "ga4MeasurementId" },
  { id: "google_ads", icon: Search, idField: "googleAdsConversionId" },
  { id: "snapchat", icon: Ghost, idField: "snapchatPixelId" },
];

type PixelCardProps = {
  platform: PixelPlatform;
  icon: LucideIcon;
  idField: keyof PixelConfig;
  value: string;
  active: boolean;
  onValueChange: (value: string) => void;
  onToggle: (active: boolean) => void;
};

export function PixelCard({
  platform,
  icon: Icon,
  value,
  active,
  onValueChange,
  onToggle,
}: PixelCardProps) {
  const [localValue, setLocalValue] = useState(value);

  const handleCopy = async () => {
    if (!localValue) return;
    await navigator.clipboard.writeText(localValue);
    toast.success(adminT("common.copied"));
  };

  return (
    <Card className="border-ink/10">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className="h-5 w-5 text-gold" />
            {adminT(`pixels.platforms.${platform}` as Parameters<typeof adminT>[0])}
          </CardTitle>
          <Badge variant={active ? "default" : "outline"}>
            {active ? adminT("pixels.statusActive") : adminT("pixels.statusInactive")}
          </Badge>
        </div>
        <CardDescription>
          {adminT(`pixels.helpers.${platform}` as Parameters<typeof adminT>[0])}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Pixel ID</Label>
          <div className="flex gap-2">
            <Input
              value={localValue}
              onChange={(e) => {
                setLocalValue(e.target.value);
                onValueChange(e.target.value);
              }}
              placeholder="Enter pixel ID"
              className="min-h-11"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="min-h-11 min-w-11 shrink-0"
              onClick={handleCopy}
              disabled={!localValue}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Label>{adminT("pixels.enable")}</Label>
          <Switch checked={active} onCheckedChange={onToggle} />
        </div>
      </CardContent>
    </Card>
  );
}

export { PLATFORMS };
