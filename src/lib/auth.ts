const SESSION_KEY = "farm_session";

export type UserRole = "admin" | "medis" | "operator" | "peternak";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  jobTitle?: string;
}

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export const ROLE_LABELS: Record<UserRole, { label: string; title: string; badge: string; color: string }> = {
  admin: {
    label: "Super Admin",
    title: "Ketua Kelompok Tani",
    badge: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
    color: "emerald",
  },
  medis: {
    label: "Petugas Medis",
    title: "Dokter Hewan / Mantri",
    badge: "bg-blue-500/15 text-blue-600 border-blue-500/30",
    color: "blue",
  },
  operator: {
    label: "Operator Lapangan",
    title: "Petugas Pakan & Kandang",
    badge: "bg-amber-500/15 text-amber-600 border-amber-500/30",
    color: "amber",
  },
  peternak: {
    label: "Mitra Peternak",
    title: "Pemilik Ternak",
    badge: "bg-purple-500/15 text-purple-600 border-purple-500/30",
    color: "purple",
  },
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

export function updateAuthUserProfile(fields: Partial<AuthUser>) {
  const session = getAuthSession();
  if (!session) return;
  const updatedSession: AuthSession = {
    ...session,
    user: {
      ...session.user,
      ...fields,
    },
  };
  saveAuthSession(updatedSession);
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
