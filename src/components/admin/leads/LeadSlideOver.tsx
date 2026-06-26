"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ArrowUpRight, Link2 } from "lucide-react";
import { toast } from "sonner";

import { AssigneeSelect } from "@/components/admin/AssigneeSelect";
import { LeadStageBadge } from "@/components/admin/LeadStageBadge";
import { LeadSourceBadge } from "@/components/admin/leads/LeadSourceBadge";
import { LeadBookingSummary } from "@/components/admin/leads/LeadBookingSummary";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { resolveOfferLabel } from "@/lib/offers";
import {
  canManageLeads,
  canUpgradeToClient,
  useCurrentUser,
} from "@/lib/hooks/useCurrentUser";
import { adminT } from "@/lib/i18n/admin-en";
import { useOffers } from "@/lib/queries/offers";
import { UpgradeToClientModal } from "@/components/admin/clients/UpgradeToClientModal";
import { useUpdateLead } from "@/lib/queries/leads";
import { leadSourceOptions } from "@/lib/schemas/lead-schema";
import type { Lead, LeadSource, LeadStage } from "@/lib/types/admin";
import { cn } from "@/lib/utils";

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
  const updateLeadMutation = useUpdateLead();
  const { data: offers = [] } = useOffers({ activeOnly: true });

  const [draft, setDraft] = useState<Lead | null>(lead);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const canManage = canManageLeads(user);
  const canUpgrade = canUpgradeToClient(user);

  useEffect(() => {
    setDraft(lead);
  }, [lead]);

  if (!lead || !draft) return null;

  const saveField = async (data: Parameters<typeof updateLeadMutation.mutateAsync>[0]["data"]) => {
    try {
      const updated = await updateLeadMutation.mutateAsync({ id: lead.id, data });
      setDraft(updated);
      toast.success("Enregistré");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const handleStageChange = (stage: LeadStage) => {
    if (!canManage) return;
    void saveField({ stage });
  };

  const toggleInterest = (slug: string) => {
    const next = draft.interestedIn.includes(slug)
      ? draft.interestedIn.filter((s) => s !== slug)
      : [...draft.interestedIn, slug];
    setDraft({ ...draft, interestedIn: next });
    void saveField({ interestedIn: next });
  };

  const activityItems = [
    { at: draft.createdAt, text: "Lead créé" },
    ...(draft.lastContactedAt
      ? [{ at: draft.lastContactedAt, text: adminT("leads.activity.contacted") }]
      : []),
  ];

  const upgradeButton = (
    <Button
      variant="gold"
      className="w-full min-h-11"
      disabled={!canUpgrade || draft.stage === "won"}
      onClick={() => setUpgradeOpen(true)}
    >
      <ArrowUpRight className="mr-2 h-4 w-4" />
      {adminT("leads.upgradeToClient")}
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full max-w-full flex-col overflow-y-auto p-4 pt-12 sm:max-w-[400px] sm:p-6 lg:max-w-[480px]"
      >
        <SheetHeader className="space-y-3 text-left">
          <SheetTitle className="sr-only">{draft.name}</SheetTitle>
          <Input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            onBlur={() => {
              if (draft.name !== lead.name) void saveField({ name: draft.name });
            }}
            aria-label={adminT("common.name")}
            className="border-0 px-0 text-xl font-display tracking-wide shadow-none focus-visible:ring-0"
            disabled={!canManage}
          />
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <LeadSourceBadge source={draft.source} />
            <LeadStageBadge stage={draft.stage} />
            {draft.trackedLinkId && (
              <Badge variant="outline" className="gap-1 text-xs">
                <Link2 className="h-3 w-3" />
                Arrived via tracked link
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 space-y-6 py-4">
          <div className="space-y-2">
            <Label>{adminT("leads.stage")}</Label>
            {canManage ? (
              <Select value={draft.stage} onValueChange={(v) => handleStageChange(v as LeadStage)}>
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
              <LeadStageBadge stage={draft.stage} />
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Contact</p>
            <div className="grid gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">{adminT("common.phone")}</Label>
                <Input
                  value={draft.phone ?? ""}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                  onBlur={() => {
                    if (draft.phone !== lead.phone) void saveField({ phone: draft.phone });
                  }}
                  className="min-h-11"
                  disabled={!canManage}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{adminT("common.email")}</Label>
                <Input
                  type="email"
                  value={draft.email ?? ""}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  onBlur={() => {
                    if (draft.email !== lead.email) void saveField({ email: draft.email });
                  }}
                  className="min-h-11"
                  disabled={!canManage}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">{adminT("common.company")}</Label>
                <Input
                  value={draft.company ?? ""}
                  onChange={(e) => setDraft({ ...draft, company: e.target.value })}
                  onBlur={() => {
                    if (draft.company !== lead.company) void saveField({ company: draft.company });
                  }}
                  className="min-h-11"
                  disabled={!canManage}
                />
              </div>
            </div>
          </div>

          <LeadBookingSummary lead={draft} />

          <div className="space-y-3 rounded-lg border border-ink/10 p-4">
            <p className="text-sm font-medium">{adminT("leads.sourceSection")}</p>
            {canManage ? (
              <Select
                value={draft.source}
                onValueChange={(v) => {
                  const source = v as LeadSource;
                  setDraft({ ...draft, source });
                  void saveField({ source });
                }}
              >
                <SelectTrigger className="min-h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {leadSourceOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <LeadSourceBadge source={draft.source} />
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="text-xs">{adminT("leads.utmCampaign")}</Label>
                <Input
                  value={draft.utmCampaign ?? ""}
                  onChange={(e) => setDraft({ ...draft, utmCampaign: e.target.value })}
                  onBlur={() => {
                    if (draft.utmCampaign !== lead.utmCampaign)
                      void saveField({ utmCampaign: draft.utmCampaign });
                  }}
                  className="min-h-11"
                  disabled={!canManage}
                />
              </div>
              <div>
                <Label className="text-xs">{adminT("leads.utmMedium")}</Label>
                <Input
                  value={draft.utmMedium ?? ""}
                  onChange={(e) => setDraft({ ...draft, utmMedium: e.target.value })}
                  onBlur={() => {
                    if (draft.utmMedium !== lead.utmMedium)
                      void saveField({ utmMedium: draft.utmMedium });
                  }}
                  className="min-h-11"
                  disabled={!canManage}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Référé par</Label>
              <Input
                value={draft.referredBy ?? ""}
                onChange={(e) => setDraft({ ...draft, referredBy: e.target.value })}
                onBlur={() => {
                  if (draft.referredBy !== lead.referredBy)
                    void saveField({ referredBy: draft.referredBy });
                }}
                className="min-h-11"
                disabled={!canManage}
              />
            </div>
            <div>
              <Label className="text-xs">{adminT("leads.pixelEvent")}</Label>
              <Input
                value={draft.pixelEventFired ?? ""}
                onChange={(e) => setDraft({ ...draft, pixelEventFired: e.target.value })}
                onBlur={() => {
                  if (draft.pixelEventFired !== lead.pixelEventFired)
                    void saveField({ pixelEventFired: draft.pixelEventFired });
                }}
                className="min-h-11"
                disabled={!canManage}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{adminT("leads.interestedIn")}</Label>
            <div className="flex flex-wrap gap-2">
              {offers.map((offer) => {
                const selected = draft.interestedIn.includes(offer.slug);
                return (
                  <button
                    key={offer.id}
                    type="button"
                    disabled={!canManage}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs min-h-11 sm:min-h-0",
                      selected
                        ? "border-gold bg-gold/10 text-ink"
                        : "border-border text-muted-foreground",
                    )}
                    onClick={() => toggleInterest(offer.slug)}
                  >
                    {offer.nameFr ?? offer.name}
                  </button>
                );
              })}
            </div>
            {draft.interestedIn.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {draft.interestedIn.map((slug) => resolveOfferLabel(offers, slug)).join(", ")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{adminT("leads.assignedTo")}</Label>
            <AssigneeSelect
              value={draft.assignedTo}
              onChange={(assignedTo) => {
                setDraft({ ...draft, assignedTo });
                void saveField({ assignedTo });
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>{adminT("common.notes")}</Label>
            <Textarea
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              onBlur={() => {
                if (draft.notes !== lead.notes) void saveField({ notes: draft.notes });
              }}
              rows={4}
              disabled={!canManage}
            />
          </div>

          <div className="space-y-2">
            <Label>{adminT("common.activityLog")}</Label>
            <ul className="space-y-2 rounded-lg border border-ink/10 p-3">
              {activityItems.map((item, i) => (
                <li key={i} className="flex justify-between gap-2 text-sm">
                  <span>{item.text}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {format(new Date(item.at), "MMM d, yyyy HH:mm")}
                  </span>
                </li>
              ))}
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

      <UpgradeToClientModal
        lead={draft}
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        onSuccess={() => onOpenChange(false)}
      />
    </Sheet>
  );
}
