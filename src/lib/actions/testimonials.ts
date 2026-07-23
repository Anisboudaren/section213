"use server";

import { revalidatePath } from "next/cache";

import type { Testimonial as PrismaTestimonial } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  testimonialSchema,
  updateTestimonialSchema,
  type TestimonialInput,
  type UpdateTestimonialInput,
} from "@/lib/schemas/testimonial-schema";
import { DEFAULT_TESTIMONIALS } from "@/lib/testimonials-defaults";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export type TestimonialDto = {
  id: string;
  name: string;
  role: string;
  company: string;
  quoteEn: string;
  quoteFr: string;
  quoteAr?: string;
  photoUrl?: string;
  instagramHandle?: string;
  email?: string;
  sortOrder: number;
  active: boolean;
};

function toTestimonialDto(row: PrismaTestimonial): TestimonialDto {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    company: row.company,
    quoteEn: row.quoteEn,
    quoteFr: row.quoteFr,
    quoteAr: row.quoteAr ?? undefined,
    photoUrl: row.photoUrl ?? undefined,
    instagramHandle: row.instagramHandle ?? undefined,
    email: row.email ?? undefined,
    sortOrder: row.sortOrder,
    active: row.active,
  };
}

export async function ensureDefaultTestimonials() {
  const count = await prisma.testimonial.count();
  if (count > 0) return;

  await prisma.testimonial.createMany({
    data: DEFAULT_TESTIMONIALS,
  });
}

export async function getTestimonialsAdmin(): Promise<ActionResult<TestimonialDto[]>> {
  try {
    await ensureDefaultTestimonials();
    const rows = await prisma.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return { success: true, data: rows.map(toTestimonialDto) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch testimonials",
    };
  }
}

export async function getTestimonialsPublic(): Promise<TestimonialDto[]> {
  try {
    await ensureDefaultTestimonials();
    const rows = await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return rows.map(toTestimonialDto);
  } catch {
    return [];
  }
}

export async function createTestimonial(
  input: TestimonialInput,
): Promise<ActionResult<TestimonialDto>> {
  try {
    const data = testimonialSchema.parse(input);
    const row = await prisma.testimonial.create({
      data: {
        name: data.name,
        role: data.role,
        company: data.company,
        quoteEn: data.quoteEn,
        quoteFr: data.quoteFr,
        quoteAr: data.quoteAr || null,
        photoUrl: data.photoUrl || null,
        instagramHandle: data.instagramHandle || null,
        email: data.email || null,
        sortOrder: data.sortOrder,
        active: data.active,
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true, data: toTestimonialDto(row) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create testimonial",
    };
  }
}

export async function updateTestimonial(
  id: string,
  input: UpdateTestimonialInput,
): Promise<ActionResult<TestimonialDto>> {
  try {
    const data = updateTestimonialSchema.parse(input);
    const row = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.role !== undefined ? { role: data.role } : {}),
        ...(data.company !== undefined ? { company: data.company } : {}),
        ...(data.quoteEn !== undefined ? { quoteEn: data.quoteEn } : {}),
        ...(data.quoteFr !== undefined ? { quoteFr: data.quoteFr } : {}),
        ...(data.quoteAr !== undefined ? { quoteAr: data.quoteAr || null } : {}),
        ...(data.photoUrl !== undefined ? { photoUrl: data.photoUrl || null } : {}),
        ...(data.instagramHandle !== undefined
          ? { instagramHandle: data.instagramHandle || null }
          : {}),
        ...(data.email !== undefined ? { email: data.email || null } : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
        ...(data.active !== undefined ? { active: data.active } : {}),
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true, data: toTestimonialDto(row) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update testimonial",
    };
  }
}

export async function deleteTestimonial(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete testimonial",
    };
  }
}

export async function resetTestimonialsToDefaults(): Promise<ActionResult<TestimonialDto[]>> {
  try {
    await prisma.testimonial.deleteMany();
    await prisma.testimonial.createMany({ data: DEFAULT_TESTIMONIALS });
    const rows = await prisma.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return { success: true, data: rows.map(toTestimonialDto) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reset testimonials",
    };
  }
}
