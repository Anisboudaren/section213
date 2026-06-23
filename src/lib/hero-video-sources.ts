export const HERO_VIDEO_MOBILE = "/vids/hero%20section.mov";
export const HERO_VIDEO_DESKTOP = "/vids/hero.mov";

export const HERO_FALLBACK_MOBILE = "/vids/fall%20back%20phone%202.png";
export const HERO_FALLBACK_DESKTOP = "/vids/fall%20back%20desktop.png";

export function pickHeroVideoSrc(viewportWidth?: number) {
  const width = viewportWidth ?? (typeof window !== "undefined" ? window.innerWidth : 1024);
  return width <= 767 ? HERO_VIDEO_MOBILE : HERO_VIDEO_DESKTOP;
}

export function pickHeroFallbackSrc(viewportWidth?: number) {
  const width = viewportWidth ?? (typeof window !== "undefined" ? window.innerWidth : 1024);
  return width <= 767 ? HERO_FALLBACK_MOBILE : HERO_FALLBACK_DESKTOP;
}
