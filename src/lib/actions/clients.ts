"use server";

import { revalidatePath } from "next/cache";

import type {
  Client as PrismaClient,
  ClientStatus,
  Project as PrismaProject,
  ProjectStatus,
  ServiceType,
  Task as PrismaTask,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateClientInput, UpdateClientInput } from "@/lib/schemas/client-schema";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export type ClientDto = {
  id: string;
  name: string;
  company: string;
  phone?: string;
  email?: string;
  industry?: string;
  status: ClientStatus;
  notes: string;
  originLeadId?: string;
  origin: string;
  showOnWebsite: boolean;
  logoUrl?: string;
  totalRevenue?: number;
  createdAt: string;
  updatedAt: string;
  projectCount?: number;
  lastProjectName?: string;
};

export type ClientProjectSummary = {
  id: string;
  name: string;
  serviceType: ServiceType;
  status: ProjectStatus;
  deadline?: string;
  startDate?: string;
  taskDone: number;
  taskTotal: number;
  createdAt: string;
};

export type ClientDetailDto = ClientDto & {
  projects: ClientProjectSummary[];
};

function toClientDto(client: PrismaClient): ClientDto {
  return {
    id: client.id,
    name: client.name,
    company: client.company,
    phone: client.phone ?? undefined,
    email: client.email ?? undefined,
    industry: client.industry ?? undefined,
    status: client.status,
    notes: client.notes,
    originLeadId: client.originLeadId ?? undefined,
    origin: client.origin,
    showOnWebsite: client.showOnWebsite,
    logoUrl: client.logoUrl ?? undefined,
    totalRevenue: client.totalRevenue ?? undefined,
    createdAt: client.createdAt.toISOString(),
    updatedAt: client.updatedAt.toISOString(),
  };
}

function toProjectSummary(
  project: PrismaProject & {
    tasks: { done: boolean }[];
  },
): ClientProjectSummary {
  return {
    id: project.id,
    name: project.name,
    serviceType: project.serviceType,
    status: project.status,
    deadline: project.deadline?.toISOString(),
    startDate: project.startDate?.toISOString(),
    taskDone: project.tasks.filter((t) => t.done).length,
    taskTotal: project.tasks.length,
    createdAt: project.createdAt.toISOString(),
  };
}

export type ClientFilters = {
  status?: ClientStatus;
  search?: string;
};

export async function getClients(
  filters?: ClientFilters,
): Promise<ActionResult<ClientDto[]>> {
  try {
    const search = filters?.search?.trim();
    const rows = await prisma.client.findMany({
      where: {
        ...(filters?.status ? { status: filters.status } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { company: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        projects: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { name: true },
        },
        _count: { select: { projects: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = rows.map((row) => ({
      ...toClientDto(row),
      projectCount: row._count.projects,
      lastProjectName: row.projects[0]?.name,
    }));

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch clients",
    };
  }
}

export async function getClient(id: string): Promise<ActionResult<ClientDetailDto>> {
  try {
    const row = await prisma.client.findUnique({
      where: { id },
      include: {
        projects: {
          include: { tasks: { select: { done: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!row) return { success: false, error: "Client not found" };

    return {
      success: true,
      data: {
        ...toClientDto(row),
        projectCount: row.projects.length,
        projects: row.projects.map(toProjectSummary),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch client",
    };
  }
}

export async function createClient(
  data: CreateClientInput,
): Promise<ActionResult<ClientDto>> {
  try {
    const client = await prisma.client.create({
      data: {
        name: data.name,
        company: data.company,
        phone: data.phone || null,
        email: data.email || null,
        industry: data.industry || null,
        status: data.status ?? "active",
        notes: data.notes ?? "",
        showOnWebsite: data.showOnWebsite ?? false,
        logoUrl: data.logoUrl || null,
        totalRevenue: data.totalRevenue ?? null,
      },
    });
    revalidatePath("/admin/clients");
    revalidatePath("/");
    return { success: true, data: toClientDto(client) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create client",
    };
  }
}

export async function updateClient(
  id: string,
  data: UpdateClientInput,
): Promise<ActionResult<ClientDto>> {
  try {
    const client = await prisma.client.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.company !== undefined ? { company: data.company } : {}),
        ...(data.phone !== undefined ? { phone: data.phone || null } : {}),
        ...(data.email !== undefined ? { email: data.email || null } : {}),
        ...(data.industry !== undefined ? { industry: data.industry || null } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        ...(data.showOnWebsite !== undefined ? { showOnWebsite: data.showOnWebsite } : {}),
        ...(data.logoUrl !== undefined ? { logoUrl: data.logoUrl || null } : {}),
        ...(data.totalRevenue !== undefined ? { totalRevenue: data.totalRevenue ?? null } : {}),
      },
    });
    revalidatePath("/admin/clients");
    revalidatePath(`/admin/clients/${id}`);
    revalidatePath("/");
    return { success: true, data: toClientDto(client) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update client",
    };
  }
}

export async function upgradeLeadToClient(
  leadId: string,
  data: CreateClientInput,
): Promise<ActionResult<ClientDto>> {
  try {
    const client = await prisma.$transaction(async (tx) => {
      const newClient = await tx.client.create({
        data: {
          name: data.name,
          company: data.company,
          phone: data.phone || null,
          email: data.email || null,
          industry: data.industry || null,
          status: data.status ?? "active",
          notes: data.notes ?? "",
          showOnWebsite: data.showOnWebsite ?? false,
          logoUrl: data.logoUrl || null,
          totalRevenue: data.totalRevenue ?? null,
          originLeadId: leadId,
          origin: "lead_upgrade",
        },
      });
      await tx.lead.update({
        where: { id: leadId },
        data: { stage: "won", updatedAt: new Date() },
      });
      return newClient;
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/clients");
    revalidatePath("/");
    return { success: true, data: toClientDto(client) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upgrade lead",
    };
  }
}

export async function deleteClient(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    await prisma.client.delete({ where: { id } });
    revalidatePath("/admin/clients");
    return { success: true, data: { id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete client",
    };
  }
}

export async function getAdminBadgeCounts(): Promise<{
  newLeadCount: number;
  overdueProjectCount: number;
}> {
  const [newLeadCount, overdueProjectCount] = await Promise.all([
    prisma.lead.count({ where: { stage: "new" } }),
    prisma.project.count({
      where: {
        deadline: { lt: new Date() },
        status: { notIn: ["completed", "cancelled", "delivered"] },
      },
    }),
  ]);
  return { newLeadCount, overdueProjectCount };
}
