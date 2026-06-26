function sanitizeEnv(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim() || undefined;
  }
  return trimmed || undefined;
}

export function getBlobEnv() {
  const token = sanitizeEnv(
    process.env.BLOB_READ_WRITE_TOKEN ?? process.env.VERCEL_BLOB_READ_WRITE_TOKEN,
  );
  const storeId = sanitizeEnv(
    process.env.BLOB_STORE_ID ?? process.env.VERCEL_BLOB_STORE_ID,
  );

  return {
    token,
    storeId,
    isConfigured: Boolean(token),
  };
}

export function assertBlobConfigured(): { token: string; storeId?: string } {
  const { token, storeId, isConfigured } = getBlobEnv();
  if (!isConfigured || !token) {
    throw new Error(
      "Blob storage is not configured. Add BLOB_READ_WRITE_TOKEN to .env (without quotes), then restart the dev server.",
    );
  }
  return { token, storeId };
}
