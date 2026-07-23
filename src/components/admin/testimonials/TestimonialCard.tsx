"use client";

import Image from "next/image";
import { AtSign, Mail, Pencil, Trash2 } from "lucide-react";

import type { TestimonialDto } from "@/lib/actions/testimonials";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type TestimonialCardProps = {
  testimonial: TestimonialDto;
  onEdit: (testimonial: TestimonialDto) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
};

export function TestimonialCard({
  testimonial,
  onEdit,
  onDelete,
  onToggleActive,
}: TestimonialCardProps) {
  return (
    <Card className="border-ink/10">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            {testimonial.photoUrl ? (
              <Image
                src={testimonial.photoUrl}
                alt={testimonial.name}
                width={48}
                height={48}
                unoptimized={
                  testimonial.photoUrl.startsWith("http") ||
                  testimonial.photoUrl.includes("blob.vercel-storage.com")
                }
                className="h-12 w-12 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                {getInitials(testimonial.name)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-medium">{testimonial.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {testimonial.role} — {testimonial.company}
              </p>
            </div>
          </div>
          <Switch
            checked={testimonial.active}
            onCheckedChange={(checked) => onToggleActive(testimonial.id, checked)}
            aria-label={`Toggle ${testimonial.name}`}
          />
        </div>

        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
          &ldquo;{testimonial.quoteFr}&rdquo;
        </p>

        {(testimonial.instagramHandle || testimonial.email) && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {testimonial.instagramHandle ? (
              <span className="flex items-center gap-1">
                <AtSign className="h-3 w-3 shrink-0" />
                {testimonial.instagramHandle}
              </span>
            ) : null}
            {testimonial.email ? (
              <span className="flex items-center gap-1 truncate">
                <Mail className="h-3 w-3 shrink-0" />
                {testimonial.email}
              </span>
            ) : null}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-9 flex-1"
            onClick={() => onEdit(testimonial)}
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-9 text-destructive hover:text-destructive"
            onClick={() => onDelete(testimonial.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
