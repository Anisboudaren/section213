import type { ReactNode } from "react";
import { Construction } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AdminPageShellProps = {
  title: string;
  highlight?: string;
  description: string;
  children?: ReactNode;
};

export function AdminPageShell({ title, highlight, description, children }: AdminPageShellProps) {
  const titleParts = highlight ? title.split(highlight) : [title];

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      <div className="space-y-1">
        <h1 className="font-display text-2xl tracking-wide text-ink md:text-3xl lg:text-4xl">
          {highlight && titleParts.length > 1 ? (
            <>
              {titleParts[0]}
              <span className="text-gold">{highlight}</span>
              {titleParts[1]}
            </>
          ) : (
            title
          )}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p>
      </div>

      {children ?? (
        <Card className="border-ink/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Construction className="h-4 w-4 text-gold" />
              Coming soon
            </CardTitle>
            <CardDescription>
              This module is scaffolded and ready for data, tables, and workflows in the next phase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Section 213 will connect CRM records, forms, pixels, and analytics here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
