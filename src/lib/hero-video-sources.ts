const BLOB_VIDS_ORIGIN = "https://bbrpqquawbvqnrpw.public.blob.vercel-storage.com";
const BLOB_VIDS_BASE = `${BLOB_VIDS_ORIGIN}/vids`;

export { BLOB_VIDS_ORIGIN };

export const HERO_VIDEO_MOBILE = `${BLOB_VIDS_BASE}/hero_section.mp4`;
export const HERO_VIDEO_DESKTOP = `${BLOB_VIDS_BASE}/hero.mp4`;

export const SCROLL_VIDEO_1 = `${BLOB_VIDS_BASE}/scroll-1.mp4`;
export const SCROLL_VIDEO_2 = `${BLOB_VIDS_BASE}/scroll-2.mp4`;
export const SCROLL_VIDEO_3 = `${BLOB_VIDS_BASE}/scroll-3.mp4`;

export const HERO_FALLBACK_MOBILE = `${BLOB_VIDS_BASE}/fall%20back%20phone%202.png`;
export const HERO_FALLBACK_DESKTOP = `${BLOB_VIDS_BASE}/fall%20back%20desktop.png`;
export const HERO_FALLBACK_DESKTOP_ALT = `${BLOB_VIDS_BASE}/fall%20back%20desktop%202.png`;

export function pickHeroVideoSrc(viewportWidth?: number) {
  const width = viewportWidth ?? (typeof window !== "undefined" ? window.innerWidth : 1024);
  return width <= 767 ? HERO_VIDEO_MOBILE : HERO_VIDEO_DESKTOP;
}

export function pickHeroFallbackSrc(viewportWidth?: number) {
  const width = viewportWidth ?? (typeof window !== "undefined" ? window.innerWidth : 1024);
  return width <= 767 ? HERO_FALLBACK_MOBILE : HERO_FALLBACK_DESKTOP;
}
