"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Check, Copy, Link2 } from "lucide-react";
import { toast } from "sonner";

import { LeadSourceBadge } from "@/components/admin/leads/LeadSourceBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TrackedLinkDto } from "@/lib/actions/leads";
import { useCreateTrackedLink, useTrackedLinks } from "@/lib/queries/leads";
import { leadSourceOptions } from "@/lib/schemas/lead-schema";
import type { LeadSource } from "@/lib/types/admin";

type GenerateLinkModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GenerateLinkModal({ open, onOpenChange }: GenerateLinkModalProps) {
  const { data: links = [] } = useTrackedLinks();
  const createLink = useCreateTrackedLink();
  const [source, setSource] = useState<LeadSource>("facebook");
  const [campaign, setCampaign] = useState("");
  const [medium, setMedium] = useState("");
  const [generated, setGenerated] = useState<TrackedLinkDto | null>(null);
  const [copied, setCopied] = useState(false);

  const previewSlug = useMemo(() => {
    const abbrev = source.slice(0, 2);
    const camp = campaign.replace(/[^a-z0-9]/gi, "").slice(0, 4).toLowerCase() || "lnk";
    return `${abbrev}-${camp}-xxxx`;
  }, [source, campaign]);

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://section213.dz";
  const previewUrl = `${siteUrl}/contact?src=${source}&ref=${previewSlug}`;

  const handleGenerate = async () => {
    try {
      const link = await createLink.mutateAsync({
        source,
        campaign: campaign || undefined,
        medium: medium || undefined,
      });
      setGenerated(link);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setGenerated(null);
    setCopied(false);
    setCampaign("");
    setMedium("");
    setSource("facebook");
  };

  const recentLinks = links.slice(0, 5);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="max-h-[95dvh] w-[calc(100%-0px)] overflow-y-auto max-sm:top-auto max-sm:bottom-0 max-sm:translate-x-[-50%] max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-2xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Générer un lien tracké
          </DialogTitle>
        </DialogHeader>

        {!generated ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={source} onValueChange={(v) => setSource(v as LeadSource)}>
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
            </div>

            <div className="space-y-2">
              <Label>Campagne (optionnel)</Label>
              <Input
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="ex: eid-promo"
                className="min-h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Médium (optionnel)</Label>
              <Input
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="ex: story / dm / paid"
                className="min-h-11"
              />
            </div>

            <div className="rounded-lg border border-ink/10 bg-muted/30 p-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Aperçu du lien</p>
              <p className="break-all text-sm">{previewUrl}</p>
            </div>

            <Button
              variant="gold"
              className="min-h-11 w-full"
              onClick={handleGenerate}
              disabled={createLink.isPending}
            >
              Générer
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700">
              <Check className="h-5 w-5" />
              <span className="font-medium">Lien généré</span>
            </div>
            <p className="break-all rounded-lg border border-ink/10 bg-muted/30 p-4 text-sm">
              {generated.url}
            </p>
            <p className="text-sm text-muted-foreground">
              Ce lien identifiera automatiquement{" "}
              {leadSourceOptions.find((o) => o.value === generated.source)?.label} comme source du
              lead lorsqu&apos;un client remplit le formulaire.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="gold"
                className="min-h-11 flex-1"
                onClick={() => handleCopy(generated.url)}
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copié !" : "Copier le lien"}
              </Button>
              <Button variant="outline" className="min-h-11" onClick={() => onOpenChange(false)}>
                Fermer
              </Button>
            </div>
          </div>
        )}

        {recentLinks.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <p className="text-sm font-medium">Liens récents</p>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Campagne</TableHead>
                    <TableHead>Clics</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Créé</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <LeadSourceBadge source={link.source} />
                      </TableCell>
                      <TableCell>{link.campaign ?? "—"}</TableCell>
                      <TableCell>{link.clickCount}</TableCell>
                      <TableCell>{link.leadCount}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(link.createdAt), "MMM d")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="min-h-11 min-w-11"
                          onClick={() => handleCopy(link.url)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {!generated && (
          <DialogFooter className="sm:justify-start">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="min-h-11">
              Fermer
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
