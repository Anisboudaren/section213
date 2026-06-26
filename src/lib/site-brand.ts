import { LOGO_PATH } from "@/components/Section213Logo";

export { LOGO_PATH };

export const FAVICON_PATH = "/icon";

export function effectiveLogoUrl(url?: string | null) {
  return url?.trim() || LOGO_PATH;
}

export function effectiveFaviconUrl(url?: string | null) {
  return url?.trim() || FAVICON_PATH;
}
