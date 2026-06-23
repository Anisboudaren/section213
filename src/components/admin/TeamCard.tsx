import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TEAM } from "@/lib/mock-data/team";
import { adminT } from "@/lib/i18n/admin-en";

export function TeamCard({ member }: { member: (typeof TEAM)[0] }) {
  const reportsToNames = member.reportsTo
    .map((id) => TEAM.find((m) => m.id === id)?.name)
    .filter(Boolean);

  return (
    <Card className="border-ink/10">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink font-display text-sm text-gold">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <CardTitle className="text-base">{member.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{member.displayRole}</p>
            </div>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs">
            {adminT(
              `team.accessLevels.${member.adminAccess}` as Parameters<typeof adminT>[0],
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {adminT("team.responsibilities")}
          </p>
          <ul className="mt-1 list-inside list-disc text-sm">
            {member.responsibilities.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {adminT("team.reportsTo")}
          </p>
          <p className="mt-1 text-sm">
            {reportsToNames.length > 0 ? (
              reportsToNames.map((name, i) => {
                const reportId = member.reportsTo[i];
                return (
                  <Link
                    key={reportId}
                    href={`#member-${reportId}`}
                    className="text-gold hover:underline"
                  >
                    {name}
                    {i < reportsToNames.length - 1 ? ", " : ""}
                  </Link>
                );
              })
            ) : (
              <span className="text-muted-foreground">{adminT("team.noReports")}</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
