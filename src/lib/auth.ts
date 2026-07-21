const SESSION_KEY = "farm_session";

export type AuthSession = {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
};

function readStoredSession(storage: Storage | null): AuthSession | null {
  if (!storage) {
    return null;
  }

  try {
    const raw = storage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  const serialized = JSON.stringify(session);
  window.sessionStorage.setItem(SESSION_KEY, serialized);
  window.localStorage.setItem(SESSION_KEY, serialized);
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  return readStoredSession(window.sessionStorage) || readStoredSession(window.localStorage);
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(SESSION_KEY);
}

export function getAuthHeaders() {
  const session = getAuthSession();

  return session ? { Authorization: `Bearer ${session.token}` } : {};
}
