import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "../src/routes/login";
import { TernakPage } from "../src/routes/ternak";
import { AppSidebar } from "../src/components/app-sidebar";
import { createAnimal, deleteAnimal, getAnimals, updateAnimal } from "../src/lib/api";
import { clearAuthSession, getAuthHeaders, getAuthSession, saveAuthSession } from "../src/lib/auth";
import { toast } from "sonner";

const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: unknown) => config,
  useRouter: () => ({ navigate }),
  useRouterState: () => "/dashboard",
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/components/ui/sidebar", () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarGroupContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarGroupLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarMenuButton: ({ children, asChild, ...props }: { children: React.ReactNode; asChild?: boolean }) => (asChild ? <div {...props}>{children}</div> : <button {...props}>{children}</button>),
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarTrigger: (props: Record<string, unknown>) => <button {...props}>Toggle</button>,
  SidebarInset: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("../src/lib/api", () => ({
  getAnimals: vi.fn(),
  createAnimal: vi.fn(),
  updateAnimal: vi.fn(),
  deleteAnimal: vi.fn(),
}));

vi.mock("@/features/layout", () => ({
  DashboardShell: ({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) => (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </div>
  ),
}));

vi.mock("@/features/layout/index", () => ({
  DashboardShell: ({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) => (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {children}
    </div>
  ),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    navigate.mockReset();
    window.sessionStorage.clear();
    window.localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    vi.stubGlobal("confirm", vi.fn(() => true));
  });

  it("shows validation errors for empty inputs", async () => {
    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/email admin/i), { target: { value: "" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

    expect(await screen.findByText(/email wajib diisi/i)).toBeInTheDocument();
    expect(screen.getByText(/password wajib diisi/i)).toBeInTheDocument();
  });

  it("submits valid credentials and navigates to home", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: "abc123", user: { id: "1", email: "admin@farm.local", role: "admin" } }),
    } as Response);

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText(/email admin/i), { target: { value: "admin@farm.local" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: /masuk/i }));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith({ to: "/dashboard" });
    });
    expect(toast.success).toHaveBeenCalledWith("Login berhasil. Selamat datang.");
  });

  it("persists auth session for protected routes", () => {
    const session = { token: "abc123", user: { id: "1", email: "admin@farm.local", role: "admin" } };

    saveAuthSession(session);
    window.sessionStorage.removeItem("farm_session");

    expect(getAuthSession()).toEqual(session);
    expect(getAuthHeaders()).toEqual({ Authorization: "Bearer abc123" });
  });
});

describe("AppSidebar", () => {
  it("clears the session and redirects to login on logout", () => {
    saveAuthSession({ token: "abc123", user: { id: "1", email: "admin@farm.local", role: "admin" } });

    render(<AppSidebar />);
    fireEvent.click(screen.getByRole("button", { name: /keluar/i }));

    expect(clearAuthSession).toBeDefined();
    expect(window.sessionStorage.getItem("farm_session")).toBeNull();
    expect(window.localStorage.getItem("farm_session")).toBeNull();
    expect(navigate).toHaveBeenCalledWith({ to: "/login" });
  });
});

describe("TernakPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getAnimals).mockResolvedValue([] as Array<Record<string, unknown>>);
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    vi.stubGlobal("confirm", vi.fn(() => true));
  });

  it("renders the detailed goat profile form sections", async () => {
    render(<TernakPage />);

    expect(await screen.findByText("Identitas Kambing")).toBeInTheDocument();
    expect(screen.getByText("Identitas Pemilik")).toBeInTheDocument();
    expect(screen.getByText("Status Kesehatan")).toBeInTheDocument();
    expect(screen.getByText("Riwayat Singkat")).toBeInTheDocument();
  });

  it("submits the extended animal profile data", async () => {
    vi.mocked(createAnimal).mockResolvedValue({ id: "animal-999", tag: "KB-100" } as Record<string, unknown>);

    render(<TernakPage />);

    fireEvent.change(screen.getByLabelText(/id \/ nomor/i), { target: { value: "KB-100" } });
    fireEvent.change(screen.getByLabelText(/jenis ternak/i), { target: { value: "Sapi" } });
    fireEvent.change(screen.getByLabelText(/ras/i), { target: { value: "Etawa" } });
    fireEvent.change(screen.getByLabelText(/umur kambing/i), { target: { value: "18" } });
    fireEvent.change(screen.getByLabelText(/ciri-ciri/i), { target: { value: "Bulu hitam, telinga panjang" } });
    fireEvent.change(screen.getByLabelText(/nama pemilik/i), { target: { value: "Budi" } });
    fireEvent.change(screen.getByLabelText(/umur pemilik/i), { target: { value: "42" } });
    fireEvent.change(screen.getByLabelText(/bobot badan/i), { target: { value: "34" } });
    fireEvent.change(screen.getByLabelText(/tinggi badan/i), { target: { value: "68" } });
    fireEvent.change(screen.getByLabelText(/panjang badan/i), { target: { value: "72" } });
    fireEvent.change(screen.getByLabelText(/lebar dada/i), { target: { value: "34" } });
    fireEvent.change(screen.getByLabelText(/catatan/i), { target: { value: "Kambing aktif" } });
    fireEvent.click(screen.getByRole("button", { name: /simpan data kambing/i }));

    await waitFor(() => {
      expect(createAnimal).toHaveBeenCalledWith(expect.objectContaining({
        tag: "KB-100",
        jenis: "Sapi",
        ras: "Etawa",
        umurKambing: "18",
        namaPemilik: "Budi",
        catatan: "Kambing aktif",
      }));
    });
  });

  it("lets the user edit or delete an existing animal", async () => {
    vi.mocked(getAnimals).mockResolvedValue([
      { id: "animal-1", tag: "KB-001", name: "Mina", jenis: "Kambing", ras: "Etawa", namaPemilik: "Budi", status: "Sehat" },
    ] as Array<Record<string, unknown>>);
    vi.mocked(updateAnimal).mockResolvedValue({ id: "animal-1", tag: "KB-001", namaPemilik: "Sari" } as Record<string, unknown>);
    vi.mocked(deleteAnimal).mockResolvedValue({ ok: true });

    render(<TernakPage />);

    expect(await screen.findByText("KB-001")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.click(screen.getByRole("button", { name: /hapus/i }));

    await waitFor(() => {
      expect(deleteAnimal).toHaveBeenCalledWith("animal-1");
    });
  });
});
