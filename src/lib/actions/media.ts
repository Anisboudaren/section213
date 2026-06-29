"use server";

import { revalidatePath } from "next/cache";
import { BlobNotFoundError, del, list } from "@vercel/blob";

import { MEDIA_ASSET_SEED } from "@/lib/case-studies-seed-data";
import { assertBlobConfigured, getBlobEnv } from "@/lib/blob-config";
import { prisma } from "@/lib/prisma";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export type MediaAssetDto = {
  id: string;
  url: string;
  pathname: string;
  filename: string;
  mimeType: string;
  folder: string;
  sizeBytes: number;
  label?: string;
  createdAt: string;
};

function toMediaDto(row: {
  id: string;
  url: string;
  pathname: string;
  filename: string;
  mimeType: string;
  folder: string;
  sizeBytes: number;
  label: string | null;
  createdAt: Date;
}): MediaAssetDto {
  return {
    id: row.id,
    url: row.url,
    pathname: row.pathname,
    filename: row.filename,
    mimeType: row.mimeType,
    folder: row.folder,
    sizeBytes: row.sizeBytes,
    label: row.label ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

async function ensureDefaultMediaAssets() {
  const count = await prisma.mediaAsset.count();
  if (count > 0) return;

  for (const item of MEDIA_ASSET_SEED) {
    await prisma.mediaAsset.upsert({
      where: { url: item.url },
      create: {
        url: item.url,
        pathname: item.pathname,
        filename: item.filename,
        mimeType: item.mimeType,
        folder: item.folder,
        label: item.label,
      },
      update: {},
    });
  }
}

export type RegisterMediaInput = {
  url: string;
  pathname: string;
  filename: string;
  mimeType: string;
  folder: string;
  sizeBytes?: number;
  label?: string;
};

export async function registerMediaAsset(
  input: RegisterMediaInput,
): Promise<MediaAssetDto | null> {
  try {
    const row = await prisma.mediaAsset.upsert({
      where: { url: input.url },
      create: {
        url: input.url,
        pathname: input.pathname,
        filename: input.filename,
        mimeType: input.mimeType,
        folder: input.folder,
        sizeBytes: input.sizeBytes ?? 0,
        label: input.label ?? null,
      },
      update: {
        pathname: input.pathname,
        filename: input.filename,
        mimeType: input.mimeType,
        folder: input.folder,
        sizeBytes: input.sizeBytes ?? 0,
        ...(input.label !== undefined ? { label: input.label || null } : {}),
      },
    });
    return toMediaDto(row);
  } catch {
    return null;
  }
}

export type MediaFilters = {
  mimePrefix?: "image" | "video";
  folder?: string;
};

export async function getMediaAssets(
  filters?: MediaFilters,
): Promise<ActionResult<MediaAssetDto[]>> {
  try {
    await ensureDefaultMediaAssets();
    const rows = await prisma.mediaAsset.findMany({
      where: {
        ...(filters?.folder ? { folder: filters.folder } : {}),
        ...(filters?.mimePrefix
          ? { mimeType: { startsWith: `${filters.mimePrefix}/` } }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: rows.map(toMediaDto) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch media",
    };
  }
}

export async function syncMediaFromBlob(): Promise<ActionResult<MediaAssetDto[]>> {
  try {
    const { token, storeId } = assertBlobConfigured();
    let cursor: string | undefined;
    let imported = 0;

    do {
      const result = await list({
        token,
        ...(storeId ? { storeId } : {}),
        limit: 1000,
        cursor,
      });

      for (const blob of result.blobs) {
        const mimeType = blob.pathname.match(/\.(mp4|webm)$/i)
          ? "video/mp4"
          : blob.pathname.match(/\.(png|jpe?g|webp|svg)$/i)
            ? "image/jpeg"
            : "application/octet-stream";

        const folder = blob.pathname.includes("/")
          ? blob.pathname.split("/").slice(0, -1).join("/")
          : "root";

        await prisma.mediaAsset.upsert({
          where: { url: blob.url },
          create: {
            url: blob.url,
            pathname: blob.pathname,
            filename: blob.pathname.split("/").pop() ?? blob.pathname,
            mimeType,
            folder,
            sizeBytes: blob.size,
          },
          update: {
            sizeBytes: blob.size,
            mimeType,
          },
        });
        imported += 1;
      }

      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);

    revalidatePath("/admin/media");
    const rows = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
    return { success: true, data: rows.map(toMediaDto) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to sync media from blob",
    };
  }
}

export async function deleteMediaAsset(id: string): Promise<ActionResult<{ id: string }>> {
  try {
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      return { success: false, error: "Media not found" };
    }

    const isVercelBlob =
      asset.url.includes(".vercel-storage.com") || asset.url.includes("blob.vercel");

    if (isVercelBlob) {
      const { token, storeId, isConfigured } = getBlobEnv();
      if (isConfigured && token) {
        try {
          await del(asset.url, {
            token,
            ...(storeId ? { storeId } : {}),
          });
        } catch (error) {
          if (!(error instanceof BlobNotFoundError)) {
            throw error;
          }
        }
      }
    }

    await prisma.mediaAsset.delete({ where: { id } });
    revalidatePath("/admin/media");
    return { success: true, data: { id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete media",
    };
  }
}
