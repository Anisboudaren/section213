"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

import type { Lead as PrismaLead, LeadSource, LeadStage, TrackedLink } from "@/generated/prisma/client";
import { notifyTeamEmail } from "@/lib/integrations/notify-team-email";
import { syncLeadToNotion } from "@/lib/integrations/sync-lead-notion";
import { prisma } from "@/lib/prisma";
import type { CreateLeadInput, UpdateLeadInput } from "@/lib/schemas/lead-schema";
import type { Lead, LeadSource as AppLeadSource } from "@/lib/types/admin";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export type LeadFilters = {
  stage?: LeadStage;
  source?: LeadSource;
  search?: string;
  submissionType?: "booking" | "contact";
};

export type TrackedLinkDto = {
  id: string;
  source: AppLeadSource;
  campaign?: string;
  medium?: string;
  slug: string;
  url: string;
  clickCount: number;
  leadCount: number;
  createdBy?: string;
  createdAt: string;
};

const SOURCE_ABBREV: Record<LeadSource, string> = {
  website: "wb",
  instagram: "ig",
  facebook: "fb",
  whatsapp: "wa",
  google: "gg",
  tiktok: "tk",
  referral: "rf",
  cold: "cl",
  other: "ot",
};

function toLeadDto(lead: PrismaLead): Lead {
  return {
    id: lead.id,
    name: lead.name,
    company: lead.company ?? undefined,
    phone: lead.phone ?? undefined,
    email: lead.email ?? undefined,
    source: lead.source as AppLeadSource,
    utmCampaign: lead.utmCampaign ?? undefined,
    utmMedium: lead.utmMedium ?? undefined,
    referredBy: lead.referredBy ?? undefined,
    pixelEventFired: lead.pixelEventFired ?? undefined,
    interestedIn: lead.interestedIn,
    stage: lead.stage,
    notes: lead.notes,
    assignedTo: lead.assignedTo ?? undefined,
    trackedLinkId: lead.trackedLinkId ?? undefined,
    trackedLinkSrc: lead.trackedLinkSrc as AppLeadSource | undefined,
    submissionType: (lead.submissionType as "booking" | "contact") ?? "contact",
    wilaya: lead.wilaya ?? undefined,
    preferredDate: lead.preferredDate?.toISOString(),
    preferredTime: lead.preferredTime ?? undefined,
    isFlexible: lead.isFlexible,
    projectTypes: lead.projectTypes,
    projectDescription: lead.projectDescription ?? undefined,
    objective: lead.objective ?? undefined,
    budgetRange: lead.budgetRange ?? undefined,
    bookingOptions: lead.bookingOptions,
    depositChoice: lead.depositChoice ?? undefined,
    depositMethod: lead.depositMethod ?? undefined,
    transferProofUrl: lead.transferProofUrl ?? undefined,
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
    lastContactedAt: lead.lastContactedAt?.toISOString(),
  };
}

function toTrackedLinkDto(link: TrackedLink): TrackedLinkDto {
  return {
    id: link.id,
    source: link.source as AppLeadSource,
    campaign: link.campaign ?? undefined,
    medium: link.medium ?? undefined,
    slug: link.slug,
    url: link.url,
    clickCount: link.clickCount,
    leadCount: link.leadCount,
    createdBy: link.createdBy ?? undefined,
    createdAt: link.createdAt.toISOString(),
  };
}

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

async function resolveTrackedLink(slug?: string) {
  if (!slug) return null;
  return prisma.trackedLink.findUnique({ where: { slug } });
}

export async function getLeads(
  filters?: LeadFilters,
): Promise<ActionResult<Lead[]>> {
  try {
    const search = filters?.search?.trim();

    const leads = await prisma.lead.findMany({
      where: {
        ...(filters?.stage ? { stage: filters.stage } : {}),
        ...(filters?.source ? { source: filters.source } : {}),
        ...(filters?.submissionType ? { submissionType: filters.submissionType } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { company: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: leads.map(toLeadDto) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch leads",
    };
  }
}

export async function getLead(id: string): Promise<ActionResult<Lead>> {
  try {
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return { success: false, error: "Lead not found" };
    return { success: true, data: toLeadDto(lead) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch lead",
    };
  }
}

export async function createLead(
  data: CreateLeadInput,
): Promise<ActionResult<Lead>> {
  try {
    const trackedLink = await resolveTrackedLink(data.trackedLinkSlug);

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        company: data.company || null,
        phone: data.phone || null,
        email: data.email || null,
        source: data.source,
        utmCampaign: data.utmCampaign || null,
        utmMedium: data.utmMedium || null,
        referredBy: data.referredBy || null,
        pixelEventFired: data.pixelEventFired || null,
        interestedIn: data.interestedIn ?? [],
        stage: data.stage ?? "new",
        notes: data.notes ?? "",
        assignedTo: data.assignedTo || null,
        trackedLinkId: trackedLink?.id ?? data.trackedLinkId ?? null,
        trackedLinkSrc: trackedLink?.source ?? null,
        submissionType: data.submissionType ?? "contact",
        wilaya: data.wilaya || null,
        preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
        preferredTime: data.preferredTime || null,
        isFlexible: data.isFlexible ?? false,
        projectTypes: data.projectTypes ?? [],
        projectDescription: data.projectDescription || null,
        objective: data.objective || null,
        budgetRange: data.budgetRange || null,
        bookingOptions: data.bookingOptions ?? [],
        depositChoice: data.depositChoice || null,
        depositMethod: data.depositMethod || null,
        transferProofUrl: data.transferProofUrl || null,
      },
    });

    if (trackedLink) {
      await prisma.trackedLink.update({
        where: { id: trackedLink.id },
        data: { leadCount: { increment: 1 } },
      });
    }

    const dto = toLeadDto(lead);

    void notifyTeamEmail(dto).catch(console.error);
    void syncLeadToNotion(dto).catch(console.error);

    revalidatePath("/admin/leads");
    return { success: true, data: dto };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create lead",
    };
  }
}

export async function updateLead(
  id: string,
  data: UpdateLeadInput,
): Promise<ActionResult<Lead>> {
  try {
    const existing = await prisma.lead.findUnique({ where: { id } });
    if (!existing) return { success: false, error: "Lead not found" };

    const stageChangedToWon = data.stage === "won" && existing.stage !== "won";

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.company !== undefined ? { company: data.company || null } : {}),
        ...(data.phone !== undefined ? { phone: data.phone || null } : {}),
        ...(data.email !== undefined ? { email: data.email || null } : {}),
        ...(data.source !== undefined ? { source: data.source } : {}),
        ...(data.utmCampaign !== undefined ? { utmCampaign: data.utmCampaign || null } : {}),
        ...(data.utmMedium !== undefined ? { utmMedium: data.utmMedium || null } : {}),
        ...(data.referredBy !== undefined ? { referredBy: data.referredBy || null } : {}),
        ...(data.pixelEventFired !== undefined
          ? { pixelEventFired: data.pixelEventFired || null }
          : {}),
        ...(data.interestedIn !== undefined ? { interestedIn: data.interestedIn } : {}),
        ...(data.stage !== undefined ? { stage: data.stage } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        ...(data.assignedTo !== undefined ? { assignedTo: data.assignedTo || null } : {}),
        ...(data.lastContactedAt !== undefined
          ? { lastContactedAt: new Date(data.lastContactedAt) }
          : {}),
        ...(stageChangedToWon ? { lastContactedAt: new Date() } : {}),
      },
    });

    revalidatePath("/admin/leads");
    return { success: true, data: toLeadDto(lead) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update lead",
    };
  }
}

export async function upgradeLead(id: string): Promise<ActionResult<Lead>> {
  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: {
        stage: "won",
        lastContactedAt: new Date(),
      },
    });

    revalidatePath("/admin/leads");
    return { success: true, data: toLeadDto(lead) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upgrade lead",
    };
  }
}

export async function deleteLead(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    await prisma.lead.delete({ where: { id } });
    revalidatePath("/admin/leads");
    return { success: true, data: { id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete lead",
    };
  }
}

export async function createTrackedLink(data: {
  source: LeadSource;
  campaign?: string;
  medium?: string;
  createdBy?: string;
}): Promise<ActionResult<TrackedLinkDto>> {
  try {
    const abbrev = SOURCE_ABBREV[data.source];
    const campaignPart = data.campaign?.replace(/[^a-z0-9]/gi, "").slice(0, 4).toLowerCase() || "lnk";
    const slug = `${abbrev}-${campaignPart}-${nanoid(4).toLowerCase()}`;
    const url = `${getSiteUrl()}/contact?src=${data.source}&ref=${slug}`;

    const link = await prisma.trackedLink.create({
      data: {
        source: data.source,
        campaign: data.campaign || null,
        medium: data.medium || null,
        slug,
        url,
        createdBy: data.createdBy || null,
      },
    });

    revalidatePath("/admin/leads");
    return { success: true, data: toTrackedLinkDto(link) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create tracked link",
    };
  }
}

export async function getTrackedLinks(): Promise<ActionResult<TrackedLinkDto[]>> {
  try {
    const links = await prisma.trackedLink.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
    return { success: true, data: links.map(toTrackedLinkDto) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch tracked links",
    };
  }
}

export async function incrementLinkClick(slug: string): Promise<void> {
  try {
    await prisma.trackedLink.update({
      where: { slug },
      data: { clickCount: { increment: 1 } },
    });
  } catch {
    // fire-and-forget
  }
}
