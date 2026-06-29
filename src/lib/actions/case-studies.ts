"use server";

import { revalidatePath } from "next/cache";

import type { CaseStudy as PrismaCaseStudy, Prisma } from "@/generated/prisma/client";
import { resolveCaseStudySections } from "@/lib/case-study-sections";
import { CASE_STUDY_SEED } from "@/lib/case-studies-seed-data";
import { prisma } from "@/lib/prisma";
import type { CaseStudyResult } from "@/lib/schemas/case-study-schema";
import {
  caseStudySchema,
  updateCaseStudySchema,
  type CaseStudyInput,
  type UpdateCaseStudyInput,
} from "@/lib/schemas/case-study-schema";
import type { CaseStudy } from "@/lib/types/admin";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

function parseResults(raw: unknown): CaseStudyResult[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (r): r is CaseStudyResult =>
      !!r &&
      typeof r === "object" &&
      "label" in r &&
      "value" in r &&
      typeof (r as CaseStudyResult).label === "string" &&
      typeof (r as CaseStudyResult).value === "string",
  );
}

function toCaseStudyDto(row: PrismaCaseStudy): CaseStudy {
  const results = parseResults(row.results);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    clientId: row.clientId ?? undefined,
    clientName: row.clientName,
    industry: row.industry ?? undefined,
    categoryLabel: row.categoryLabel ?? undefined,
    excerpt: row.excerpt ?? undefined,
    videoUrl: row.videoUrl,
    thumbnailUrl: row.thumbnailUrl ?? undefined,
    services: row.services,
    results,
    sections: resolveCaseStudySections(row.sections, row.excerpt ?? undefined, results),
    published: row.published,
    featured: row.featured,
    order: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
  };
}

function caseStudyCreateData(data: CaseStudyInput) {
  return {
    slug: data.slug,
    title: data.title,
    clientId: data.clientId || null,
    clientName: data.clientName,
    industry: data.industry || null,
    categoryLabel: data.categoryLabel || null,
    excerpt: data.excerpt || null,
    videoUrl: data.videoUrl,
    thumbnailUrl: data.thumbnailUrl || null,
    services: data.services,
    results: data.results as Prisma.InputJsonValue,
    sections: data.sections as Prisma.InputJsonValue,
    published: data.published,
    featured: data.featured,
    sortOrder: data.sortOrder,
  };
}

async function ensureDefaultCaseStudies() {
  const count = await prisma.caseStudy.count();
  if (count > 0) return;

  for (const item of CASE_STUDY_SEED) {
    await prisma.caseStudy.create({ data: caseStudyCreateData(item) });
  }
}

function revalidateCaseStudyPaths(slug?: string) {
  revalidatePath("/case-studies");
  revalidatePath("/admin/case-studies");
  if (slug) revalidatePath(`/case-studies/${slug}`);
  revalidatePath("/");
}

export async function getCaseStudiesAdmin(): Promise<ActionResult<CaseStudy[]>> {
  try {
    await ensureDefaultCaseStudies();
    const rows = await prisma.caseStudy.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return { success: true, data: rows.map(toCaseStudyDto) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch case studies",
    };
  }
}

export async function getCaseStudyById(id: string): Promise<ActionResult<CaseStudy>> {
  try {
    await ensureDefaultCaseStudies();
    const row = await prisma.caseStudy.findUnique({ where: { id } });
    if (!row) return { success: false, error: "Case study not found" };
    return { success: true, data: toCaseStudyDto(row) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch case study",
    };
  }
}

export async function getCaseStudiesPublic(): Promise<CaseStudy[]> {
  try {
    await ensureDefaultCaseStudies();
    const rows = await prisma.caseStudy.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return rows.map(toCaseStudyDto);
  } catch {
    return [];
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    await ensureDefaultCaseStudies();
    const row = await prisma.caseStudy.findUnique({ where: { slug } });
    if (!row || !row.published) return null;
    return toCaseStudyDto(row);
  } catch {
    return null;
  }
}

export async function createCaseStudy(input: CaseStudyInput): Promise<ActionResult<CaseStudy>> {
  try {
    const data = caseStudySchema.parse(input);
    const row = await prisma.caseStudy.create({ data: caseStudyCreateData(data) });
    revalidateCaseStudyPaths(row.slug);
    return { success: true, data: toCaseStudyDto(row) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create case study",
    };
  }
}

export async function updateCaseStudy(
  id: string,
  input: UpdateCaseStudyInput,
): Promise<ActionResult<CaseStudy>> {
  try {
    const data = updateCaseStudySchema.parse(input);
    const row = await prisma.caseStudy.update({
      where: { id },
      data: {
        ...(data.slug !== undefined ? { slug: data.slug } : {}),
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.clientId !== undefined ? { clientId: data.clientId || null } : {}),
        ...(data.clientName !== undefined ? { clientName: data.clientName } : {}),
        ...(data.industry !== undefined ? { industry: data.industry || null } : {}),
        ...(data.categoryLabel !== undefined ? { categoryLabel: data.categoryLabel || null } : {}),
        ...(data.excerpt !== undefined ? { excerpt: data.excerpt || null } : {}),
        ...(data.videoUrl !== undefined ? { videoUrl: data.videoUrl } : {}),
        ...(data.thumbnailUrl !== undefined ? { thumbnailUrl: data.thumbnailUrl || null } : {}),
        ...(data.services !== undefined ? { services: data.services } : {}),
        ...(data.results !== undefined ? { results: data.results as Prisma.InputJsonValue } : {}),
        ...(data.sections !== undefined ? { sections: data.sections as Prisma.InputJsonValue } : {}),
        ...(data.published !== undefined ? { published: data.published } : {}),
        ...(data.featured !== undefined ? { featured: data.featured } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      },
    });
    revalidateCaseStudyPaths(row.slug);
    return { success: true, data: toCaseStudyDto(row) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update case study",
    };
  }
}

export async function deleteCaseStudy(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    await prisma.caseStudy.delete({ where: { id } });
    revalidateCaseStudyPaths();
    return { success: true, data: { id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete case study",
    };
  }
}

export async function resetCaseStudiesToSeed(): Promise<ActionResult<CaseStudy[]>> {
  try {
    await prisma.caseStudy.deleteMany();
    for (const item of CASE_STUDY_SEED) {
      await prisma.caseStudy.create({ data: caseStudyCreateData(item) });
    }
    revalidateCaseStudyPaths();
    const rows = await prisma.caseStudy.findMany({ orderBy: { sortOrder: "asc" } });
    return { success: true, data: rows.map(toCaseStudyDto) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reset case studies",
    };
  }
}
