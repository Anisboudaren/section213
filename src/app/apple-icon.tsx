import { resolveFaviconResponse } from "@/lib/favicon";

export const revalidate = 3600;
export const runtime = "nodejs";

export default async function AppleIcon() {
  return resolveFaviconResponse();
}
