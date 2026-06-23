"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";

import { AssigneeSelect } from "@/components/admin/AssigneeSelect";
import { LeadStageBadge } from "@/components/admin/LeadStageBadge";
import { SourceIcon } from "@/components/admin/SourceIcon";
import { UpgradeToClientModal } from "@/components/admin/UpgradeToClientModal";
import { LeadForm, type LeadFormValues } from "@/components/admin/leads/LeadForm";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAdminStore } from "@/lib/admin-store";
import {
  canManageLeads,
  canUpgradeToClient,
  useCurrentUser,
} from "@/lib/hooks/useCurrentUser";
import { adminT } from "@/lib/i18n/admin-en";
import type { Lead, LeadStage } from "@/lib/types/admin";

const STAGES: LeadStage[] = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
];

type LeadSlideOverProps = {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LeadSlideOver({ lead, open, onOpenChange }: LeadSlideOverProps) {
  const user = useCurrentUser();
  const { updateLead } = useAdminStore();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const canManage = canManageLeads(user);
  const canUpgrade = canUpgradeToClient(user);

  if (!lead) return null;

  const handleSave = (values: LeadFormValues) => {
    updateLead(lead.id, {
      ...values,
      email: values.email || undefined,
      company: values.company || undefined,
      phone: values.phone || undefined,
      utmCampaign: values.utmCampaign || undefined,
      utmMedium: values.utmMedium || undefined,
      pixelEventFired: values.pixelEventFired || undefined,
    });
    onOpenChange(false);
  };

  const handleStageChange = (stage: LeadStage) => {
    if (!canManage) return;
    updateLead(lead.id, { stage, lastContactedAt: new Date().toISOString() });
  };

  const activityItems = [
    { at: lead.createdAt, text: adminT("leads.activity.created") },
    ...(lead.lastContactedAt
      ? [{ at: lead.lastContactedAt, text: adminT("leads.activity.contacted") }]
      : []),
  ];

  const upgradeButton = (
    <Button
      variant="gold"
      className="w-full min-h-11"
      disabled={!canUpgrade || lead.stage === "won"}
      onClick={() => setUpgradeOpen(true)}
    >
      <ArrowUpRight className="mr-2 h-4 w-4" />
      {adminT("leads.upgradeToClient")}
    </Button>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="flex w-full flex-col overflow-y-auto sm:max-w-lg"
        >
          <SheetHeader>
            <SheetTitle className="font-display tracking-wide">{lead.name}</SheetTitle>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <SourceIcon source={lead.source} />
              <LeadStageBadge stage={lead.stage} />
            </div>
          </SheetHeader>

          <div className="flex-1 space-y-6 py-4">
            <div className="space-y-2">
              <Label>{adminT("leads.stage")}</Label>
              {canManage ? (
                <Select value={lead.stage} onValueChange={(v) => handleStageChange(v as LeadStage)}>
                  <SelectTrigger className="min-h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {adminT(`leads.stages.${s}` as Parameters<typeof adminT>[0])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="opacity-60">
                      <Select value={lead.stage} disabled>
                        <SelectTrigger className="min-h-11">
                          <SelectValue />
                        </SelectTrigger>
                      </Select>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>{adminT("permissions.managersOnly")}</TooltipContent>
                </Tooltip>
              )}
            </div>

            <div className="space-y-2">
              <Label>{adminT("leads.assignedTo")}</Label>
              <AssigneeSelect
                value={lead.assignedTo}
                onChange={(assignedTo) => updateLead(lead.id, { assignedTo })}
              />
            </div>

            <LeadForm lead={lead} onSubmit={handleSave} formId="lead-slide-form" />

            <div className="space-y-2">
              <Label>{adminT("common.activityLog")}</Label>
              <ul className="space-y-2 rounded-lg border border-ink/10 p-3">
                {activityItems.length === 0 ? (
                  <li className="text-sm text-muted-foreground">{adminT("common.noActivity")}</li>
                ) : (
                  activityItems.map((item, i) => (
                    <li key={i} className="flex justify-between gap-2 text-sm">
                      <span>{item.text}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {format(new Date(item.at), "MMM d, yyyy HH:mm")}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          <SheetFooter className="border-t pt-4">
            {canUpgrade ? (
              upgradeButton
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full opacity-60">{upgradeButton}</div>
                </TooltipTrigger>
                <TooltipContent>{adminT("permissions.managersOnly")}</TooltipContent>
              </Tooltip>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <UpgradeToClientModal
        lead={lead}
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
      />
    </>
  );
}
