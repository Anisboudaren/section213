"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { getWilayaName } from "@/lib/algeria-wilayas";
import { resolveOfferLabel } from "@/lib/offers";
import { adminT } from "@/lib/i18n/admin-en";
import { useOffers } from "@/lib/queries/offers";
import type { Lead } from "@/lib/types/admin";

type LeadBookingSummaryProps = {
  lead: Lead;
};

export function LeadBookingSummary({ lead }: LeadBookingSummaryProps) {
  const { data: offers = [] } = useOffers({ activeOnly: true });
  if (lead.submissionType !== "booking") return null;

  const dateLabel = lead.isFlexible
    ? "Flexible"
    : lead.preferredDate
      ? format(new Date(lead.preferredDate), "PPP", { locale: fr })
      : "—";

  return (
    <div className="space-y-3 rounded-lg border border-gold/20 bg-gold/5 p-4">
      <p className="text-sm font-medium">{adminT("leads.bookingSummary")}</p>
      <dl className="grid gap-2 text-sm">
        {lead.wilaya && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{adminT("leads.wilaya")}</dt>
            <dd className="font-medium">{getWilayaName(lead.wilaya)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">{adminT("leads.preferredDate")}</dt>
          <dd className="font-medium">{dateLabel}</dd>
        </div>
        {lead.preferredTime && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{adminT("leads.preferredTime")}</dt>
            <dd className="font-medium">{lead.preferredTime}</dd>
          </div>
        )}
        {lead.projectTypes && lead.projectTypes.length > 0 && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{adminT("leads.projectTypes")}</dt>
            <dd className="font-medium text-right">{lead.projectTypes.join(", ")}</dd>
          </div>
        )}
        {lead.objective && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{adminT("leads.objective")}</dt>
            <dd className="font-medium">{lead.objective}</dd>
          </div>
        )}
        {lead.budgetRange && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{adminT("leads.budgetRange")}</dt>
            <dd className="font-medium">{lead.budgetRange}</dd>
          </div>
        )}
        {lead.interestedIn.length > 0 && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{adminT("leads.interestedIn")}</dt>
            <dd className="font-medium text-right">
              {lead.interestedIn.map((slug) => resolveOfferLabel(offers, slug)).join(", ")}
            </dd>
          </div>
        )}
        {lead.bookingOptions && lead.bookingOptions.length > 0 && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{adminT("leads.bookingOptions")}</dt>
            <dd className="font-medium text-right">{lead.bookingOptions.join(", ")}</dd>
          </div>
        )}
        {lead.depositChoice && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{adminT("leads.deposit")}</dt>
            <dd className="font-medium">
              {lead.depositChoice === "deposit_50"
                ? adminT("leads.deposit50")
                : adminT("leads.depositNone")}
              {lead.depositMethod ? ` (${lead.depositMethod})` : ""}
            </dd>
          </div>
        )}
        {lead.transferProofUrl && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{adminT("leads.transferProof")}</dt>
            <dd>
              <a
                href={lead.transferProofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ruby underline"
              >
                {adminT("common.view")}
              </a>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
