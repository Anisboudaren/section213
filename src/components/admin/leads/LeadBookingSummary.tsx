"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { getWilayaName } from "@/lib/algeria-wilayas";
import { formatDzd } from "@/lib/booking/build-lead-payload";
import { resolveOfferLabel } from "@/lib/offers";
import { adminT } from "@/lib/i18n/admin-en";
import { useOffers } from "@/lib/queries/offers";
import type { Lead } from "@/lib/types/admin";

const FILE_KIND_LABELS: Record<string, string> = {
  plans: "AutoCAD / Plans",
  visuels: "Catalogue / Visuels",
  logo: "Logo",
  documents: "Charte graphique",
};

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

  const packSlug = lead.selectedPackSlug ?? lead.interestedIn[0];
  const packLabel = packSlug ? resolveOfferLabel(offers, packSlug) : "—";

  const alaCarteLabels =
    lead.bookingOptions?.map((slug) => resolveOfferLabel(offers, slug)).join(", ") || null;

  return (
    <div className="space-y-3 rounded-lg border border-gold/20 bg-gold/5 p-4">
      <p className="text-sm font-medium">
        {lead.submissionStatus === "abandoned"
          ? adminT("abandonedLeads.summaryTitle")
          : adminT("leads.bookingSummary")}
      </p>
      <dl className="grid gap-2 text-sm">
        {lead.projectName && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{adminT("leads.projectName")}</dt>
            <dd className="font-medium text-right">{lead.projectName}</dd>
          </div>
        )}
        {lead.wilaya && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{adminT("leads.wilaya")}</dt>
            <dd className="font-medium">{getWilayaName(lead.wilaya)}</dd>
          </div>
        )}
        {lead.location && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{adminT("leads.location")}</dt>
            <dd className="font-medium text-right">{lead.location}</dd>
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
        {lead.projectDescription && (
          <div className="space-y-1">
            <dt className="text-muted-foreground">{adminT("leads.projectDescription")}</dt>
            <dd className="font-medium whitespace-pre-wrap">{lead.projectDescription}</dd>
          </div>
        )}
        {lead.objective && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{adminT("leads.objective")}</dt>
            <dd className="font-medium">{lead.objective}</dd>
          </div>
        )}
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">{adminT("leads.selectedPack")}</dt>
          <dd className="font-medium text-right">{packLabel}</dd>
        </div>
        {alaCarteLabels && (
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{adminT("leads.bookingOptions")}</dt>
            <dd className="font-medium text-right">{alaCarteLabels}</dd>
          </div>
        )}
        {lead.estimatedTotalDzd != null && (
          <div className="flex justify-between gap-2 border-t border-gold/15 pt-2">
            <dt className="text-muted-foreground">{adminT("leads.estimatedTotal")}</dt>
            <dd className="font-semibold text-ruby">{formatDzd(lead.estimatedTotalDzd)}</dd>
          </div>
        )}
        {lead.uploadedFiles && lead.uploadedFiles.length > 0 && (
          <div className="space-y-1 border-t border-gold/15 pt-2">
            <dt className="text-muted-foreground">{adminT("leads.uploadedFiles")}</dt>
            <dd className="space-y-1">
              {lead.uploadedFiles.map((file) => (
                <a
                  key={file.url}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-ruby underline"
                >
                  {FILE_KIND_LABELS[file.kind] ?? file.kind} — {file.name}
                </a>
              ))}
            </dd>
          </div>
        )}
        {lead.depositChoice && (
          <div className="flex justify-between gap-2 border-t border-gold/15 pt-2">
            <dt className="text-muted-foreground">{adminT("leads.deposit")}</dt>
            <dd className="font-medium">
              {lead.depositChoice === "deposit_50"
                ? adminT("leads.deposit50")
                : adminT("leads.depositNone")}
              {lead.depositMethod
                ? ` (${
                    lead.depositMethod === "cash"
                      ? adminT("leads.depositCash")
                      : lead.depositMethod === "transfer_receipt"
                        ? adminT("leads.depositTransferReceipt")
                        : lead.depositMethod
                  })`
                : ""}
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
        {lead.submissionStatus === "abandoned" && lead.abandonedAt && (
          <div className="flex justify-between gap-2 border-t border-gold/15 pt-2 text-xs text-muted-foreground">
            <dt>{adminT("abandonedLeads.abandonedAt")}</dt>
            <dd>{format(new Date(lead.abandonedAt), "PPp", { locale: fr })}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
