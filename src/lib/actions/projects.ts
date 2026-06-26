"use server";

import { revalidatePath } from "next/cache";

import type {
  Client as PrismaClient,
  Project as PrismaProject,
  ProjectStatus,
  ServiceType,
  Task as PrismaTask,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateProjectInput, UpdateProjectInput } from "@/lib/schemas/client-schema";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export type TaskDto = {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedTo?: string;
  done: boolean;
  dueDate?: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
};

export type ProjectListItem = {
  id: string;
  name: string;
  description: string;
  clientId: string;
  clientName: string;
  serviceType: ServiceType;
  status: ProjectStatus;
  leadId?: string;
  teamIds: string[];
  offerSlug?: string;
  startDate?: string;
  deadline?: string;
  deliveredAt?: string;
  budgetDZD?: number;
  paidDZD?: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  taskTotal: number;
  taskDone: number;
};

export type ProjectDetailDto = ProjectListItem & {
  client: {
    id: string;
    name: string;
    company: string;
  };
  tasks: TaskDto[];
};

function toTaskDto(task: PrismaTask): TaskDto {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    projectId: task.projectId,
    assignedTo: task.assignedTo ?? undefined,
    done: task.done,
    dueDate: task.dueDate?.toISOString(),
    priority: task.priority,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

function toProjectListItem(
  project: PrismaProject & {
    client: Pick<PrismaClient, "name">;
    tasks?: Array<Pick<PrismaTask, "done">>;
    _count?: { tasks: number };
  },
  taskDone?: number,
): ProjectListItem {
  const total = project._count?.tasks ?? project.tasks?.length ?? 0;
  const done =
    taskDone ?? project.tasks?.filter((t) => t.done).length ?? 0;

  return {
    id: project.id,
    name: project.name,
    description: project.description,
    clientId: project.clientId,
    clientName: project.client.name,
    serviceType: project.serviceType,
    status: project.status,
    leadId: project.leadId ?? undefined,
    teamIds: project.teamIds,
    offerSlug: project.offerSlug ?? undefined,
    startDate: project.startDate?.toISOString(),
    deadline: project.deadline?.toISOString(),
    deliveredAt: project.deliveredAt?.toISOString(),
    budgetDZD: project.budgetDZD ?? undefined,
    paidDZD: project.paidDZD ?? undefined,
    notes: project.notes,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    taskTotal: total,
    taskDone: done,
  };
}

export type ProjectFilters = {
  clientId?: string;
  status?: ProjectStatus;
  serviceType?: ServiceType;
  assignedTo?: string;
  search?: string;
};

export async function getProjects(
  filters?: ProjectFilters,
): Promise<ActionResult<ProjectListItem[]>> {
  try {
    const search = filters?.search?.trim();
    const rows = await prisma.project.findMany({
      where: {
        ...(filters?.clientId ? { clientId: filters.clientId } : {}),
        ...(filters?.status ? { status: filters.status } : {}),
        ...(filters?.serviceType ? { serviceType: filters.serviceType } : {}),
        ...(filters?.assignedTo ? { leadId: filters.assignedTo } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { client: { name: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: {
        client: { select: { name: true } },
        tasks: { select: { done: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const data = rows.map((row) =>
      toProjectListItem(row, row.tasks.filter((t) => t.done).length),
    );

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch projects",
    };
  }
}

export async function getProject(id: string): Promise<ActionResult<ProjectDetailDto>> {
  try {
    const row = await prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, company: true } },
        tasks: {
          orderBy: [{ done: "asc" }, { priority: "desc" }, { dueDate: "asc" }],
        },
      },
    });

    if (!row) return { success: false, error: "Project not found" };

    const base = toProjectListItem(
      { ...row, client: { name: row.client.name } },
      row.tasks.filter((t) => t.done).length,
    );

    return {
      success: true,
      data: {
        ...base,
        client: row.client,
        tasks: row.tasks.map(toTaskDto),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch project",
    };
  }
}

function parseDate(value?: string) {
  return value ? new Date(value) : null;
}

export async function createProject(
  data: CreateProjectInput,
): Promise<ActionResult<ProjectListItem>> {
  try {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description ?? "",
        clientId: data.clientId,
        serviceType: data.serviceType,
        status: data.status ?? "briefing",
        leadId: data.leadId || null,
        teamIds: data.teamIds ?? [],
        offerSlug: data.offerSlug || null,
        startDate: parseDate(data.startDate),
        deadline: parseDate(data.deadline),
        budgetDZD: data.budgetDZD ?? null,
        notes: data.notes ?? "",
      },
      include: {
        client: { select: { name: true } },
        tasks: { select: { done: true } },
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/clients/${data.clientId}`);
    return { success: true, data: toProjectListItem(project, 0) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create project",
    };
  }
}

export async function updateProject(
  id: string,
  data: UpdateProjectInput,
): Promise<ActionResult<ProjectListItem>> {
  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.clientId !== undefined ? { clientId: data.clientId } : {}),
        ...(data.serviceType !== undefined ? { serviceType: data.serviceType } : {}),
        ...(data.status !== undefined ? { status: data.status } : {}),
        ...(data.leadId !== undefined ? { leadId: data.leadId || null } : {}),
        ...(data.teamIds !== undefined ? { teamIds: data.teamIds } : {}),
        ...(data.offerSlug !== undefined ? { offerSlug: data.offerSlug || null } : {}),
        ...(data.startDate !== undefined ? { startDate: parseDate(data.startDate) } : {}),
        ...(data.deadline !== undefined ? { deadline: parseDate(data.deadline) } : {}),
        ...(data.budgetDZD !== undefined ? { budgetDZD: data.budgetDZD ?? null } : {}),
        ...(data.paidDZD !== undefined ? { paidDZD: data.paidDZD ?? null } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        ...(data.deliveredAt !== undefined
          ? { deliveredAt: new Date(data.deliveredAt) }
          : {}),
      },
      include: {
        client: { select: { name: true } },
        tasks: { select: { done: true } },
      },
    });

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath(`/admin/clients/${project.clientId}`);
    return {
      success: true,
      data: toProjectListItem(
        project,
        project.tasks.filter((t) => t.done).length,
      ),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update project",
    };
  }
}

export async function updateProjectStatus(
  id: string,
  status: ProjectStatus,
): Promise<ActionResult<ProjectListItem>> {
  const extra: UpdateProjectInput = { status };
  if (status === "delivered") {
    extra.deliveredAt = new Date().toISOString();
  }
  return updateProject(id, extra);
}

export async function deleteProject(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const p = await prisma.project.findUnique({
      where: { id },
      select: { clientId: true },
    });
    await prisma.project.delete({ where: { id } });
    revalidatePath("/admin/projects");
    if (p) revalidatePath(`/admin/clients/${p.clientId}`);
    return { success: true, data: { id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete project",
    };
  }
}

export async function createTask(data: {
  projectId: string;
  title: string;
  assignedTo?: string;
  dueDate?: string;
  priority?: number;
}): Promise<ActionResult<TaskDto>> {
  try {
    const task = await prisma.task.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        assignedTo: data.assignedTo || null,
        dueDate: parseDate(data.dueDate),
        priority: data.priority ?? 1,
      },
    });
    revalidatePath(`/admin/projects/${data.projectId}`);
    return { success: true, data: toTaskDto(task) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create task",
    };
  }
}

export async function toggleTask(
  id: string,
  done: boolean,
): Promise<ActionResult<TaskDto>> {
  try {
    const task = await prisma.task.update({
      where: { id },
      data: { done },
    });
    return { success: true, data: toTaskDto(task) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update task",
    };
  }
}

export async function deleteTask(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const task = await prisma.task.findUnique({
      where: { id },
      select: { projectId: true },
    });
    await prisma.task.delete({ where: { id } });
    if (task) revalidatePath(`/admin/projects/${task.projectId}`);
    return { success: true, data: { id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete task",
    };
  }
}
