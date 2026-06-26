"use client";

import { Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TEAM } from "@/lib/mock-data/team";
import { cn } from "@/lib/utils";

type ProjectTeamCardProps = {
  leadId?: string;
  teamIds: string[];
  className?: string;
};

function getMember(id: string) {
  return TEAM.find((m) => m.id === id);
}

function MemberRow({ id, label }: { id: string; label?: string }) {
  const member = getMember(id);
  if (!member) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">?</div>
        <span>{id}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xs text-gold">
        {member.name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{member.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {label ?? member.displayRole}
        </p>
      </div>
    </div>
  );
}

export function ProjectTeamCard({ leadId, teamIds, className }: ProjectTeamCardProps) {
  const members = teamIds
    .filter((id) => id !== leadId)
    .map((id) => getMember(id))
    .filter(Boolean);
  const empty = !leadId && members.length === 0;

  return (
    <Card className={cn("border-ink/10", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Users className="h-4 w-4 text-gold" />
          Équipe assignée
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {empty ? (
          <p className="text-sm text-muted-foreground">Aucun membre assigné.</p>
        ) : (
          <>
            {leadId && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Responsable
                </p>
                <MemberRow id={leadId} label="Chef de projet" />
              </div>
            )}
            {members.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Membres
                </p>
                <div className="space-y-3">
                  {members.map((member) => (
                    <MemberRow key={member!.id} id={member!.id} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
