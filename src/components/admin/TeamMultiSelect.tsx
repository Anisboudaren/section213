"use client";

import { TEAM } from "@/lib/mock-data/team";
import { cn } from "@/lib/utils";

type TeamMultiSelectProps = {
  value: string[];
  onChange: (ids: string[]) => void;
  excludeIds?: string[];
  disabled?: boolean;
};

export function TeamMultiSelect({
  value,
  onChange,
  excludeIds = [],
  disabled,
}: TeamMultiSelectProps) {
  const members = TEAM.filter((m) => m.active && !excludeIds.includes(m.id));

  const toggle = (id: string) => {
    if (disabled) return;
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {members.map((member) => {
        const selected = value.includes(member.id);
        return (
          <button
            key={member.id}
            type="button"
            disabled={disabled}
            onClick={() => toggle(member.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
              selected
                ? "border-gold/50 bg-gold/10 text-ink"
                : "border-ink/10 bg-background text-muted-foreground hover:border-ink/20",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[10px] font-medium text-gold">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            {member.name}
          </button>
        );
      })}
    </div>
  );
}
