import { createHash } from "crypto";

export function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export type ConversionEventPayload = {
  event: "PageView" | "ViewContent" | "InitiateCheckout" | "Lead";
  eventId: string;
  contentName?: string;
  contentType?: string;
  contentId?: string;
  email?: string;
  phone?: string;
  eventSourceUrl?: string;
  clientUserAgent?: string;
  clientIpAddress?: string;
  fbc?: string;
  fbp?: string;
  ttp?: string;
};

export function buildHashedUserData(payload: ConversionEventPayload) {
  const userData: Record<string, string> = {};

  if (payload.email?.trim()) {
    userData.em = sha256(payload.email);
  }
  if (payload.phone?.trim()) {
    userData.ph = sha256(normalizePhone(payload.phone));
  }
  if (payload.clientIpAddress) {
    userData.client_ip_address = payload.clientIpAddress;
  }
  if (payload.clientUserAgent) {
    userData.client_user_agent = payload.clientUserAgent;
  }
  if (payload.fbc) {
    userData.fbc = payload.fbc;
  }
  if (payload.fbp) {
    userData.fbp = payload.fbp;
  }

  return userData;
}
