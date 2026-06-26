"use client";



import { formatDistanceToNow, format } from "date-fns";

import { fr } from "date-fns/locale";



import { LeadStageBadge } from "@/components/admin/LeadStageBadge";

import { LeadSourceBadge } from "@/components/admin/leads/LeadSourceBadge";

import { Badge } from "@/components/ui/badge";

import { getWilayaName } from "@/lib/algeria-wilayas";
import { resolveOfferLabel } from "@/lib/offers";
import { useOffers } from "@/lib/queries/offers";

import type { Lead } from "@/lib/types/admin";

import { cn } from "@/lib/utils";



type LeadCardProps = {

  lead: Lead;

  onClick: () => void;

};



export function LeadCard({ lead, onClick }: LeadCardProps) {
  const { data: offers = [] } = useOffers({ activeOnly: true });
  const interest =
    lead.interestedIn.length > 0
      ? resolveOfferLabel(offers, lead.interestedIn[0])
      : "—";



  return (

    <button

      type="button"

      onClick={onClick}

      className={cn(

        "w-full rounded-lg border border-ink/10 bg-card p-3 text-left shadow-sm transition-colors",

        "hover:border-gold/40 hover:bg-gold/5 min-h-11",

      )}

    >

      <div className="flex items-start justify-between gap-2">

        <div className="flex min-w-0 items-center gap-2">

          <LeadSourceBadge source={lead.source} showLabel={false} />

          <p className="font-medium text-ink truncate">{lead.name}</p>

        </div>

        <LeadStageBadge stage={lead.stage} className="shrink-0 text-[10px]" />

      </div>

      <p className="mt-1 truncate text-xs text-muted-foreground">{interest}</p>

      {lead.submissionType === "booking" && (

        <div className="mt-2 flex flex-wrap gap-1">

          {lead.wilaya && (

            <Badge variant="outline" className="text-[10px]">

              {getWilayaName(lead.wilaya)}

            </Badge>

          )}

          {lead.preferredDate && !lead.isFlexible && (

            <Badge variant="outline" className="text-[10px]">

              {format(new Date(lead.preferredDate), "d MMM", { locale: fr })}

            </Badge>

          )}

          {lead.isFlexible && (

            <Badge variant="outline" className="text-[10px]">

              Flexible

            </Badge>

          )}

        </div>

      )}

      <p className="mt-2 text-[10px] text-muted-foreground">

        {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true, locale: fr })}

      </p>

    </button>

  );

}

