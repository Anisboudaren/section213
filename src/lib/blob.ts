import { put } from "@vercel/blob";

import { assertBlobConfigured } from "@/lib/blob-config";

/** Logical upload destinations — mapped to folder paths in the blob store */
export type BlobFolder =
  | "clients/logos"
  | "clients/avatars"
  | "team/avatars"
  | "testimonials/avatars"
  | "case-studies/videos"
  | "case-studies/thumbnails"
  | "bookings/deposit-proofs"
  | "bookings/project-files"
  | "brand/platform";

const MIME_LIMITS: Record<
  string,
  { maxBytes: number; folders: BlobFolder[] }
> = {
  "image/jpeg": {
    maxBytes: 10 * 1024 * 1024,
    folders: [
      "clients/logos",
      "clients/avatars",
      "team/avatars",
      "testimonials/avatars",
      "case-studies/thumbnails",
      "bookings/deposit-proofs",
      "bookings/project-files",
      "brand/platform",
    ],
  },
  "image/png": {
    maxBytes: 10 * 1024 * 1024,
    folders: [
      "clients/logos",
      "clients/avatars",
      "team/avatars",
      "testimonials/avatars",
      "case-studies/thumbnails",
      "bookings/deposit-proofs",
      "bookings/project-files",
      "brand/platform",
    ],
  },
  "image/webp": {
    maxBytes: 10 * 1024 * 1024,
    folders: [
      "clients/logos",
      "clients/avatars",
      "team/avatars",
      "testimonials/avatars",
      "case-studies/thumbnails",
      "bookings/deposit-proofs",
      "bookings/project-files",
      "brand/platform",
    ],
  },
  "image/svg+xml": {
    maxBytes: 2 * 1024 * 1024,
    folders: ["clients/logos", "brand/platform"],
  },
  "video/mp4": {
    maxBytes: 100 * 1024 * 1024,
    folders: ["case-studies/videos"],
  },
  "video/webm": {
    maxBytes: 100 * 1024 * 1024,
    folders: ["case-studies/videos"],
  },
  "application/pdf": {
    maxBytes: 10 * 1024 * 1024,
    folders: ["bookings/deposit-proofs", "bookings/project-files"],
  },
};

export const PUBLIC_UPLOAD_FOLDERS: BlobFolder[] = [
  "bookings/deposit-proofs",
  "bookings/project-files",
];

export function validateBlobUpload(
  mimeType: string,
  sizeBytes: number,
  folder: BlobFolder,
): { ok: true } | { ok: false; error: string } {
  const rule = MIME_LIMITS[mimeType];
  if (!rule) {
    return { ok: false, error: "Unsupported file type" };
  }
  if (!rule.folders.includes(folder)) {
    return { ok: false, error: "File type not allowed for this folder" };
  }
  if (sizeBytes > rule.maxBytes) {
    return { ok: false, error: "File too large" };
  }
  return { ok: true };
}

function buildPathname(folder: BlobFolder, filename: string): string {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const datePrefix = new Date().toISOString().slice(0, 10);
  return `${folder}/${datePrefix}/${Date.now()}-${safeName}`;
}

export async function uploadToBlob(
  file: File | Blob,
  folder: BlobFolder,
  filename: string,
): Promise<{ url: string; pathname: string }> {
  // Prefer the read-write token alone — store ID is already embedded in it.
  // Passing a mismatched BLOB_STORE_ID can cause "Access denied".
  const { token } = assertBlobConfigured();

  const mimeType = file.type || "application/octet-stream";
  const validation = validateBlobUpload(mimeType, file.size, folder);
  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const pathname = buildPathname(folder, filename);

  try {
    const blob = await put(pathname, file, {
      access: "public",
      token,
      contentType: mimeType,
      addRandomSuffix: false,
    });

    return { url: blob.url, pathname: blob.pathname };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/access denied|valid token/i.test(message)) {
      throw new Error(
        "Vercel Blob rejected the upload token. Refresh BLOB_READ_WRITE_TOKEN from your Vercel Blob store settings, update .env, and restart the dev server. (The media library can still show old public URLs from the database.)",
      );
    }
    throw error instanceof Error ? error : new Error(message);
  }
}
