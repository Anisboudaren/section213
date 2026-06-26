import { resolveFaviconResponse } from "@/lib/favicon";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export default async function AppleIcon() {
  return resolveFaviconResponse();
}
