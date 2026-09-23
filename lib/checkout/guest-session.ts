const GUEST_SESSION_KEY = "oho:guest-session";

export function getGuestSessionId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(GUEST_SESSION_KEY);
}

export function ensureGuestSessionId(): string {
  const existingId = getGuestSessionId();

  if (existingId) {
    return existingId;
  }

  const id = crypto.randomUUID();

  window.sessionStorage.setItem(GUEST_SESSION_KEY, id);

  return id;
}
