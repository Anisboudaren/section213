export const AUTH_STORAGE_KEY = "s213_admin_auth";

export function setAdminAuthed(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, "1");
  }
}

export function clearAdminAuth(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  return localStorage.getItem(AUTH_STORAGE_KEY) === "1";
}
