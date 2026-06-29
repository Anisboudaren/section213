import { NextResponse } from "next/server";

import { registerMediaAsset } from "@/lib/actions/media";
import { getBlobEnv } from "@/lib/blob-config";
import {
  PUBLIC_UPLOAD_FOLDERS,
  uploadToBlob,
  type BlobFolder,
} from "@/lib/blob";

const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const ALLOWED_FOLDERS: BlobFolder[] = [
  "clients/logos",
  "clients/avatars",
  "case-studies/videos",
  "case-studies/thumbnails",
  "bookings/deposit-proofs",
  "bookings/project-files",
  "brand/platform",
];

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

function isAdminUploadAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_UPLOAD_SECRET?.trim().replace(/^["']|["']$/g, "");
  if (!secret) return true;
  return request.headers.get("x-upload-token") === secret;
}

export async function POST(request: Request) {
  try {
    if (!getBlobEnv().isConfigured) {
      return NextResponse.json(
        {
          error:
            "Blob storage is not configured. Set BLOB_READ_WRITE_TOKEN in .env and restart the dev server.",
        },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") as BlobFolder | null;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!folder || !ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
    }

    const isPublicFolder = PUBLIC_UPLOAD_FOLDERS.includes(folder);

    if (isPublicFolder) {
      const ip = getClientIp(request);
      if (!checkRateLimit(ip)) {
        return NextResponse.json({ error: "Too many uploads" }, { status: 429 });
      }
    } else if (!isAdminUploadAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await uploadToBlob(file, folder, file.name);

    await registerMediaAsset({
      url: result.url,
      pathname: result.pathname,
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      folder,
      sizeBytes: file.size,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
