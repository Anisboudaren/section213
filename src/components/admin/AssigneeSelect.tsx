"use client";

import { TEAM } from "@/lib/mock-data/team";
import { adminT } from "@/lib/i18n/admin-en";
import {
  canReassignLead,
  useCurrentUser,
} from "@/lib/hooks/useCurrentUser";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type AssigneeSelectProps = {
  value?: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
};

export function AssigneeSelect({ value, onChange, disabled }: AssigneeSelectProps) {
  const user = useCurrentUser();
  const canReassign = canReassignLead(user);
  const isDisabled = disabled || !canReassign;

  const select = (
    <Select
      value={value ?? "unassigned"}
      onValueChange={(v) => onChange(v === "unassigned" ? undefined : v)}
      disabled={isDisabled}
    >
      <SelectTrigger className="min-h-11 w-full">
        <SelectValue placeholder={adminT("leads.unassigned")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">{adminT("leads.unassigned")}</SelectItem>
        {TEAM.filter((m) => m.active).map((member) => (
          <SelectItem key={member.id} value={member.id}>
            <span className="flex items-center gap-2">
              {member.name}
              <Badge variant="outline" className="text-[10px] font-normal">
                {member.displayRole}
              </Badge>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  if (!canReassign && !disabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="opacity-60">{select}</div>
        </TooltipTrigger>
        <TooltipContent>{adminT("permissions.managersOnly")}</TooltipContent>
      </Tooltip>
    );
  }

  return select;
}
