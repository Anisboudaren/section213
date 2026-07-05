"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { nanoid } from "nanoid";

import type { Lead as PrismaLead, LeadSource, LeadStage, Prisma, TrackedLink } from "@/generated/prisma/client";
import { sendConversionEvents } from "@/lib/conversions-api";
import { getPixelSettingsForServer } from "@/lib/actions/pixel-settings";
import { notifyTeamEmail } from "@/lib/integrations/notify-team-email";
import { syncLeadToNotion } from "@/lib/integrations/sync-lead-notion";
import { prisma } from "@/lib/prisma";
import type {
  AbandonedBookingInput,
  CreateLeadInput,
  UpdateLeadInput,
} from "@/lib/schemas/lead-schema";
import type { Lead, LeadSource as AppLeadSource } from "@/lib/types/admin";
import { parseUploadedFiles } from "@/lib/booking/build-lead-payload";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export type LeadFilters = {
  stage?: LeadStage;
  source?: LeadSource;
  search?: string;
  submissionType?: "booking" | "contact";
  submissionStatus?: "completed" | "abandoned";
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
    submissionStatus: (lead.submissionStatus as "completed" | "abandoned") ?? "completed",
    bookingSessionId: lead.bookingSessionId ?? undefined,
    wilaya: lead.wilaya ?? undefined,
    preferredDate: lead.preferredDate?.toISOString(),
    preferredTime: lead.preferredTime ?? undefined,
    isFlexible: lead.isFlexible,
    projectName: lead.projectName ?? undefined,
    location: lead.location ?? undefined,
    projectTypes: lead.projectTypes,
    projectDescription: lead.projectDescription ?? undefined,
    objective: lead.objective ?? undefined,
    budgetRange: lead.budgetRange ?? undefined,
    selectedPackSlug: lead.selectedPackSlug ?? undefined,
    bookingOptions: lead.bookingOptions,
    uploadedFiles: parseUploadedFiles(lead.uploadedFiles),
    estimatedTotalDzd: lead.estimatedTotalDzd ?? undefined,
    depositChoice: lead.depositChoice ?? undefined,
    depositMethod: lead.depositMethod ?? undefined,
    transferProofUrl: lead.transferProofUrl ?? undefined,
    abandonedAt: lead.abandonedAt?.toISOString(),
    completedAt: lead.completedAt?.toISOString(),
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
    lastContactedAt: lead.lastContactedAt?.toISOString(),
  };
}

function mapBookingCreateData(data: CreateLeadInput): Prisma.LeadCreateInput {
  const submissionStatus = data.submissionStatus ?? "completed";
  const now = new Date();

  return {
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
    submissionType: data.submissionType ?? "contact",
    submissionStatus,
    bookingSessionId: data.bookingSessionId || null,
    wilaya: data.wilaya || null,
    preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
    preferredTime: data.preferredTime || null,
    isFlexible: data.isFlexible ?? false,
    projectName: data.projectName || null,
    location: data.location || null,
    projectTypes: data.projectTypes ?? [],
    projectDescription: data.projectDescription || null,
    objective: data.objective || null,
    budgetRange: data.budgetRange || null,
    selectedPackSlug: data.selectedPackSlug || null,
    bookingOptions: data.bookingOptions ?? [],
    uploadedFiles: data.uploadedFiles?.length ? data.uploadedFiles : undefined,
    estimatedTotalDzd: data.estimatedTotalDzd ?? null,
    depositChoice: data.depositChoice || null,
    depositMethod: data.depositMethod || null,
    transferProofUrl: data.transferProofUrl || null,
    abandonedAt: submissionStatus === "abandoned" ? now : null,
    completedAt: submissionStatus === "completed" && data.submissionType === "booking" ? now : null,
  };
}

function mapBookingUpdateData(data: UpdateLeadInput): Prisma.LeadUpdateInput {
  const patch: Prisma.LeadUpdateInput = {
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
    ...(data.submissionType !== undefined ? { submissionType: data.submissionType } : {}),
    ...(data.submissionStatus !== undefined ? { submissionStatus: data.submissionStatus } : {}),
    ...(data.bookingSessionId !== undefined
      ? { bookingSessionId: data.bookingSessionId || null }
      : {}),
    ...(data.wilaya !== undefined ? { wilaya: data.wilaya || null } : {}),
    ...(data.preferredDate !== undefined
      ? { preferredDate: data.preferredDate ? new Date(data.preferredDate) : null }
      : {}),
    ...(data.preferredTime !== undefined ? { preferredTime: data.preferredTime || null } : {}),
    ...(data.isFlexible !== undefined ? { isFlexible: data.isFlexible } : {}),
    ...(data.projectName !== undefined ? { projectName: data.projectName || null } : {}),
    ...(data.location !== undefined ? { location: data.location || null } : {}),
    ...(data.projectTypes !== undefined ? { projectTypes: data.projectTypes } : {}),
    ...(data.projectDescription !== undefined
      ? { projectDescription: data.projectDescription || null }
      : {}),
    ...(data.objective !== undefined ? { objective: data.objective || null } : {}),
    ...(data.budgetRange !== undefined ? { budgetRange: data.budgetRange || null } : {}),
    ...(data.selectedPackSlug !== undefined
      ? { selectedPackSlug: data.selectedPackSlug || null }
      : {}),
    ...(data.bookingOptions !== undefined ? { bookingOptions: data.bookingOptions } : {}),
    ...(data.uploadedFiles !== undefined
      ? { uploadedFiles: data.uploadedFiles.length ? data.uploadedFiles : undefined }
      : {}),
    ...(data.estimatedTotalDzd !== undefined
      ? { estimatedTotalDzd: data.estimatedTotalDzd ?? null }
      : {}),
    ...(data.depositChoice !== undefined ? { depositChoice: data.depositChoice || null } : {}),
    ...(data.depositMethod !== undefined ? { depositMethod: data.depositMethod || null } : {}),
    ...(data.transferProofUrl !== undefined
      ? { transferProofUrl: data.transferProofUrl || null }
      : {}),
    ...(data.abandonedAt !== undefined
      ? { abandonedAt: data.abandonedAt ? new Date(data.abandonedAt) : null }
      : {}),
    ...(data.completedAt !== undefined
      ? { completedAt: data.completedAt ? new Date(data.completedAt) : null }
      : {}),
  };

  return patch;
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

function buildLeadWhere(filters?: LeadFilters): Prisma.LeadWhereInput {
  const search = filters?.search?.trim();

  return {
    ...(filters?.stage ? { stage: filters.stage } : {}),
    ...(filters?.source ? { source: filters.source } : {}),
    ...(filters?.submissionType ? { submissionType: filters.submissionType } : {}),
    ...(filters?.submissionStatus
      ? { submissionStatus: filters.submissionStatus }
      : { submissionStatus: { not: "abandoned" } }),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { company: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { projectName: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };
}

export async function getLeads(
  filters?: LeadFilters,
): Promise<ActionResult<Lead[]>> {
  try {
    const leads = await prisma.lead.findMany({
      where: buildLeadWhere(filters),
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

export async function getAbandonedLeads(
  search?: string,
): Promise<ActionResult<Lead[]>> {
  return getLeads({
    submissionType: "booking",
    submissionStatus: "abandoned",
    stage: "new",
    search,
  });
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

async function findExistingBookingLead(data: CreateLeadInput) {
  if (data.bookingSessionId) {
    const bySession = await prisma.lead.findFirst({
      where: { bookingSessionId: data.bookingSessionId },
      orderBy: { updatedAt: "desc" },
    });
    if (bySession) return bySession;
  }

  if (data.phone && data.submissionType === "booking") {
    return prisma.lead.findFirst({
      where: {
        phone: data.phone,
        submissionType: "booking",
        submissionStatus: "abandoned",
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  return null;
}

export async function saveAbandonedBooking(
  input: AbandonedBookingInput,
): Promise<ActionResult<{ id: string }>> {
  try {
    const alreadyCompleted = await prisma.lead.findFirst({
      where: {
        bookingSessionId: input.bookingSessionId,
        submissionStatus: "completed",
      },
    });
    if (alreadyCompleted) {
      return { success: true, data: { id: alreadyCompleted.id } };
    }

    const now = new Date();
    const packSlug = input.selectedPackId;
    const payload: CreateLeadInput = {
      name: input.name?.trim() || "Booking in progress",
      phone: input.phone,
      email: input.email || undefined,
      company: input.company,
      source: "website",
      interestedIn: packSlug ? [packSlug] : [],
      stage: "new",
      submissionType: "booking",
      submissionStatus: "abandoned",
      bookingSessionId: input.bookingSessionId,
      wilaya: input.wilaya,
      preferredDate: input.isFlexible ? undefined : input.preferredDate,
      preferredTime: input.preferredTime,
      isFlexible: input.isFlexible ?? false,
      projectName: input.projectName,
      location: input.location,
      projectTypes: input.projectType ? [input.projectType] : [],
      projectDescription: input.projectDescription || undefined,
      objective: input.objective,
      selectedPackSlug: packSlug,
      bookingOptions: input.alaCarteOptions ?? [],
      uploadedFiles: input.uploadedFiles ?? [],
      estimatedTotalDzd: input.estimatedTotalDzd,
    };

    const existing =
      (input.abandonedLeadId
        ? await prisma.lead.findUnique({ where: { id: input.abandonedLeadId } })
        : null) ?? (await findExistingBookingLead(payload));

    const lead = existing
      ? await prisma.lead.update({
          where: { id: existing.id },
          data: {
            ...mapBookingCreateData(payload),
            submissionStatus: "abandoned",
            abandonedAt: existing.abandonedAt ?? now,
            depositChoice: null,
            depositMethod: null,
            transferProofUrl: null,
            completedAt: null,
          },
        })
      : await prisma.lead.create({
          data: mapBookingCreateData(payload),
        });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/leads/abandoned");
    return { success: true, data: { id: lead.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save abandoned booking",
    };
  }
}

export async function createLead(
  data: CreateLeadInput,
): Promise<ActionResult<Lead>> {
  try {
    const trackedLink = await resolveTrackedLink(data.trackedLinkSlug);
    const submissionStatus = data.submissionStatus ?? "completed";
    const existing =
      data.submissionType === "booking" ? await findExistingBookingLead(data) : null;

    const lead = existing
      ? await prisma.lead.update({
          where: { id: existing.id },
          data: {
            ...mapBookingCreateData({
              ...data,
              submissionStatus: "completed",
            }),
            trackedLinkId: trackedLink?.id ?? data.trackedLinkId ?? existing.trackedLinkId,
            trackedLinkSrc: trackedLink?.source ?? existing.trackedLinkSrc,
            submissionStatus: "completed",
            abandonedAt: null,
            completedAt: new Date(),
          },
        })
      : await prisma.lead.create({
          data: {
            ...mapBookingCreateData({
              ...data,
              submissionStatus,
            }),
            trackedLinkId: trackedLink?.id ?? data.trackedLinkId ?? null,
            trackedLinkSrc: trackedLink?.source ?? null,
          },
        });

    if (trackedLink && !existing) {
      await prisma.trackedLink.update({
        where: { id: trackedLink.id },
        data: { leadCount: { increment: 1 } },
      });
    }

    const dto = toLeadDto(lead);

    if (submissionStatus === "completed") {
      void notifyTeamEmail(dto).catch(console.error);
      void syncLeadToNotion(dto).catch(console.error);

      if (data.pixelEventId) {
        void (async () => {
          try {
            const pixelConfig = await getPixelSettingsForServer();
            const headerStore = await headers();
            const eventSourceUrl =
              headerStore.get("referer") ??
              `${getSiteUrl()}${data.submissionType === "booking" ? "/book" : "/contact"}`;

            await sendConversionEvents(pixelConfig, {
              event: "Lead",
              eventId: data.pixelEventId!,
              email: data.email,
              phone: data.phone,
              eventSourceUrl,
              clientUserAgent: headerStore.get("user-agent") ?? undefined,
              clientIpAddress:
                headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
                headerStore.get("x-real-ip") ??
                undefined,
              contentName: data.submissionType === "booking" ? "booking" : "contact",
              contentType: "form_submission",
            });
          } catch (error) {
            console.error("Conversion API Lead event failed:", error);
          }
        })();
      }
    }

    revalidatePath("/admin/leads");
    revalidatePath("/admin/leads/abandoned");
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
    const promoteFromAbandoned =
      existing.submissionStatus === "abandoned" &&
      data.stage !== undefined &&
      data.stage !== "new";

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...mapBookingUpdateData(data),
        ...(promoteFromAbandoned
          ? {
              submissionStatus: "completed",
              completedAt: existing.completedAt ?? new Date(),
              abandonedAt: null,
            }
          : {}),
        ...(stageChangedToWon ? { lastContactedAt: new Date() } : {}),
      },
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/leads/abandoned");
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
    revalidatePath("/admin/leads/abandoned");
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
    revalidatePath("/admin/leads/abandoned");
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
