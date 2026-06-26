"use client";

import Image from "next/image";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";

import type { TrustedPartnerDto } from "@/lib/actions/trusted-partners";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type TrustedPartnerCardProps = {
  partner: TrustedPartnerDto;
  onEdit: (partner: TrustedPartnerDto) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
};

export function TrustedPartnerCard({
  partner,
  onEdit,
  onDelete,
  onToggleActive,
}: TrustedPartnerCardProps) {
  const content = (
    <>
      <div className="relative flex h-16 items-center justify-center rounded-lg bg-ink px-4">
        <Image
          src={partner.imageUrl}
          alt={partner.name}
          width={140}
          height={56}
          unoptimized={
            partner.imageUrl.startsWith("http") ||
            partner.imageUrl.includes("blob.vercel-storage.com")
          }
          className={cn(
            "max-h-12 w-auto object-contain",
            partner.whiteFilter && "brightness-0 invert",
          )}
        />
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium">{partner.name}</p>
          {partner.linkUrl ? (
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
              <ExternalLink className="h-3 w-3 shrink-0" />
              {partner.linkUrl}
            </p>
          ) : (
            <p className="mt-0.5 text-xs text-muted-foreground">No link</p>
          )}
        </div>
        <Switch
          checked={partner.active}
          onCheckedChange={(checked) => onToggleActive(partner.id, checked)}
          aria-label={`Toggle ${partner.name}`}
        />
      </div>
    </>
  );

  return (
    <Card className="border-ink/10">
      <CardContent className="p-4">
        {content}
        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-9 flex-1"
            onClick={() => onEdit(partner)}
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-9 text-destructive hover:text-destructive"
            onClick={() => onDelete(partner.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
