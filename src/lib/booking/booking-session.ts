const BOOKING_SESSION_KEY = "s213_booking_session_id";

export function getOrCreateBookingSessionId(): string {
  if (typeof window === "undefined") return "";
  const existing = sessionStorage.getItem(BOOKING_SESSION_KEY);
  if (existing) return existing;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `bk-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  sessionStorage.setItem(BOOKING_SESSION_KEY, id);
  return id;
}

export function clearBookingSessionId(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(BOOKING_SESSION_KEY);
}
