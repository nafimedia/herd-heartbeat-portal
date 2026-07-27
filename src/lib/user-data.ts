import { type UserRole } from "./auth";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  status: "Aktif" | "Nonaktif";
  registeredDate: string;
  lastLogin: string;
}

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: "usr-001",
    name: "Pak Tono (Ketua KTT)",
    email: "admin@farm.local",
    role: "admin",
    phone: "0812-3456-7890",
    status: "Aktif",
    registeredDate: "2024-01-15",
    lastLogin: "2026-07-27 15:30",
  },
  {
    id: "usr-002",
    name: "Drh. Ahmad",
    email: "medis@farm.local",
    role: "medis",
    phone: "0813-9876-5432",
    status: "Aktif",
    registeredDate: "2024-02-01",
    lastLogin: "2026-07-27 14:15",
  },
  {
    id: "usr-003",
    name: "Mas Budi",
    email: "operator@farm.local",
    role: "operator",
    phone: "0857-1122-3344",
    status: "Aktif",
    registeredDate: "2024-03-10",
    lastLogin: "2026-07-27 11:40",
  },
  {
    id: "usr-004",
    name: "Bpk. Suparjo",
    email: "peternak@farm.local",
    role: "peternak",
    phone: "0821-5566-7788",
    status: "Aktif",
    registeredDate: "2024-04-05",
    lastLogin: "2026-07-26 16:20",
  },
  {
    id: "usr-005",
    name: "Siti Rahma (Mantri)",
    email: "siti.mantri@farm.local",
    role: "medis",
    phone: "0812-4433-2211",
    status: "Aktif",
    registeredDate: "2024-05-20",
    lastLogin: "2026-07-25 09:10",
  },
];

const STORAGE_KEY_USERS = "kartaning_users_list";

export function loadUserAccounts(): UserAccount[] {
  if (typeof window === "undefined") return INITIAL_USER_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_USER_ACCOUNTS));
      return INITIAL_USER_ACCOUNTS;
    }
    return JSON.parse(raw) as UserAccount[];
  } catch {
    return INITIAL_USER_ACCOUNTS;
  }
}

export function saveUserAccounts(users: UserAccount[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save user accounts:", err);
  }
}
