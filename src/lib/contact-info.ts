import type { SiteSettingsDto } from "@/lib/site-settings-defaults";

export type PublicContactInfo = Pick<
  SiteSettingsDto,
  | "contactEmail"
  | "contactPhone"
  | "contactAddress"
  | "contactCity"
  | "contactHoursFr"
  | "contactHoursEn"
  | "whatsappNumber"
  | "instagramHandle"
  | "facebookUrl"
  | "tiktokHandle"
  | "youtubeUrl"
  | "linkedinUrl"
  | "mapsUrl"
>;

export function toPublicContactInfo(settings: SiteSettingsDto): PublicContactInfo {
  return {
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    contactAddress: settings.contactAddress,
    contactCity: settings.contactCity,
    contactHoursFr: settings.contactHoursFr,
    contactHoursEn: settings.contactHoursEn,
    whatsappNumber: settings.whatsappNumber,
    instagramHandle: settings.instagramHandle,
    facebookUrl: settings.facebookUrl,
    tiktokHandle: settings.tiktokHandle,
    youtubeUrl: settings.youtubeUrl,
    linkedinUrl: settings.linkedinUrl,
    mapsUrl: settings.mapsUrl,
  };
}

export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

export function mailtoHref(email: string): string {
  return `mailto:${email.trim()}`;
}

export function whatsappHref(number: string, message?: string): string {
  const digits = number.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function instagramHref(handle: string): string {
  const clean = handle.replace(/^@/, "").trim();
  return `https://instagram.com/${clean}`;
}

export function tiktokHref(handle: string): string {
  const clean = handle.replace(/^@/, "").trim();
  return `https://tiktok.com/@${clean}`;
}

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  kind: "instagram" | "facebook" | "youtube" | "linkedin" | "tiktok" | "whatsapp";
};

export function buildSocialLinks(info: PublicContactInfo): SocialLink[] {
  const links: SocialLink[] = [];

  if (info.instagramHandle?.trim()) {
    links.push({
      id: "instagram",
      label: "Instagram",
      href: instagramHref(info.instagramHandle),
      kind: "instagram",
    });
  }
  if (info.facebookUrl?.trim()) {
    links.push({
      id: "facebook",
      label: "Facebook",
      href: info.facebookUrl.trim(),
      kind: "facebook",
    });
  }
  if (info.youtubeUrl?.trim()) {
    links.push({
      id: "youtube",
      label: "YouTube",
      href: info.youtubeUrl.trim(),
      kind: "youtube",
    });
  }
  if (info.linkedinUrl?.trim()) {
    links.push({
      id: "linkedin",
      label: "LinkedIn",
      href: info.linkedinUrl.trim(),
      kind: "linkedin",
    });
  }
  if (info.tiktokHandle?.trim()) {
    links.push({
      id: "tiktok",
      label: "TikTok",
      href: tiktokHref(info.tiktokHandle),
      kind: "tiktok",
    });
  }
  if (info.whatsappNumber?.trim()) {
    links.push({
      id: "whatsapp",
      label: "WhatsApp",
      href: whatsappHref(info.whatsappNumber),
      kind: "whatsapp",
    });
  }

  return links;
}

export function hasContactDetails(info: PublicContactInfo): boolean {
  return Boolean(
    info.contactEmail ||
      info.contactPhone ||
      info.contactAddress ||
      info.contactCity ||
      info.whatsappNumber ||
      info.instagramHandle ||
      info.facebookUrl ||
      info.youtubeUrl ||
      info.linkedinUrl ||
      info.tiktokHandle,
  );
}
