import { type ReactNode, useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  CheckCheck,
  X,
  Beef,
  Pill,
  Wheat,
  Calendar,
  ChevronRight,
  TriangleAlert,
  Info,
  CheckCircle2,
  User,
  QrCode,
} from "lucide-react";
import { getAuthSession } from "@/lib/auth";
import { QrScannerModal } from "@/components/qr-scanner-modal";
import { OfflineSyncBar } from "@/components/offline-bar";
import { requestAndroidNotificationPermission } from "@/lib/offline-sync";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

interface SearchItem {
  id: string;
  category: "Ternak" | "Obat" | "Pakan" | "Navigasi";
  title: string;
  subtitle: string;
  url: string;
  icon: typeof Beef;
}

const SEARCH_DATABASE: SearchItem[] = [
  // Ternak
  { id: "s1", category: "Ternak", title: "SP-001 — Sapi Limousin", subtitle: "Kandang Sapi A-01 · Sehat", url: "/ternak", icon: Beef },
  { id: "s2", category: "Ternak", title: "SP-002 — Sapi Simmental", subtitle: "Kandang Sapi A-02 · Bunting", url: "/ternak", icon: Beef },
  { id: "s3", category: "Ternak", title: "KB-014 — Kambing Etawa PE", subtitle: "Kandang Kambing B-01 · Sehat", url: "/ternak", icon: Beef },
  { id: "s4", category: "Ternak", title: "DM-007 — Domba Garut", subtitle: "Kandang Domba C-01 · Sehat", url: "/ternak", icon: Beef },
  { id: "s5", category: "Ternak", title: "AY-101 — Ayam Layer Petelur", subtitle: "Kandang Unggas D-01 · Sehat", url: "/ternak", icon: Beef },
  { id: "s6", category: "Ternak", title: "BK-201 — Bebek Mojosari", subtitle: "Kandang Unggas E-01 · Sehat", url: "/ternak", icon: Beef },

  // Obat
  { id: "o1", category: "Obat", title: "Oxytetracycline", subtitle: "Antibiotik · Stok: 25 Botol", url: "/obat", icon: Pill },
  { id: "o2", category: "Obat", title: "Vet-Diar Stop", subtitle: "Anti Diare · Stok: 40 Sachet", url: "/obat", icon: Pill },
  { id: "o3", category: "Obat", title: "Albendazole Oral", subtitle: "Obat Cacing · Stok: 12 Botol", url: "/obat", icon: Pill },
  { id: "o4", category: "Obat", title: "B-Complex Injection", subtitle: "Vitamin · Stok: 18 Botol", url: "/obat", icon: Pill },

  // Pakan
  { id: "p1", category: "Pakan", title: "Hijauan Rumput Gajah", subtitle: "Stok: 1,240 kg · Cukup", url: "/pakan", icon: Wheat },
  { id: "p2", category: "Pakan", title: "Konsentrat Sapi Perah", subtitle: "Stok: 380 kg · Stok Kritis", url: "/pakan", icon: Wheat },
  { id: "p3", category: "Pakan", title: "Dedak Padi", subtitle: "Stok: 920 kg · Cukup", url: "/pakan", icon: Wheat },
  { id: "p4", category: "Pakan", title: "Silase Jagung", subtitle: "Stok: 210 kg · Stok Kritis", url: "/pakan", icon: Wheat },

  // Navigasi Halaman
  { id: "n1", category: "Navigasi", title: "Hari Posyandu Ternak", subtitle: "Jadwal dan pemeriksaan kesehatan posyandu", url: "/posyandu", icon: Calendar },
  { id: "n2", category: "Navigasi", title: "Kartu Kesehatan Kambing", subtitle: "Cetakan & rekaman kartu kesehatan medis", url: "/kartu", icon: Beef },
  { id: "n3", category: "Navigasi", title: "Laporan & Analisis", subtitle: "Laporan hasil produksi, populasi & stok", url: "/laporan", icon: Calendar },
];

interface NotificationItem {
  id: string;
  type: "kesehatan" | "pakan" | "obat" | "posyandu";
  title: string;
  desc: string;
  time: string;
  read: boolean;
  link: string;
  level: "Kritis" | "Peringatan" | "Info";
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "kesehatan",
    title: "Peringatan Dini Kesehatan (SP-002)",
    desc: "Sapi Simmental SP-002 terdeteksi demam dan membutuhkan pemeriksaan ulang.",
    time: "10 menit lalu",
    read: false,
    link: "/kartu",
    level: "Kritis",
  },
  {
    id: "notif-2",
    type: "pakan",
    title: "Stok Pakan di Bawah Minimum",
    desc: "Konsentrat Sapi Perah tersisa 380 kg (di bawah minimum 400 kg).",
    time: "45 menit lalu",
    read: false,
    link: "/pakan",
    level: "Peringatan",
  },
  {
    id: "notif-3",
    type: "obat",
    title: "Penggunaan Obat Terbuku",
    desc: "Penggunaan 2 Botol Oxytetracycline telah dicatat ke Riwayat Penggunaan.",
    time: "2 jam lalu",
    read: false,
    link: "/obat",
    level: "Info",
  },
  {
    id: "notif-4",
    type: "posyandu",
    title: "Jadwal Posyandu Ternak",
    desc: "Posyandu Kesehatan KTT Mindajaya akan diselenggarakan 3 hari lagi.",
    time: "1 hari lalu",
    read: true,
    link: "/posyandu",
    level: "Info",
  },
];

export function DashboardShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();

  // Search & Scanner State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Notification State
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filtered Search Results
  const searchResults = searchQuery.trim()
    ? SEARCH_DATABASE.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_DATABASE.slice(0, 6);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("Semua notifikasi telah ditandai dibaca.");
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    navigate({ to: notif.link as any });
  };

  const handleSelectSearchItem = (url: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate({ to: url as any });
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          {/* Top Header */}
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-emerald-500/20 bg-background/90 px-4 backdrop-blur-md shadow-xs md:px-6">
            <SidebarTrigger className="hover:bg-emerald-500/10 hover:text-emerald-600" />

            {/* ENHANCED LIVE SEARCH BAR */}
            <div className="relative flex-1 max-w-md hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Cari tag ternak, obat, pakan, laporan... (Ctrl + K)"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                className="pl-9 pr-16 bg-muted/40 border-border/60 hover:bg-muted/60 focus:bg-background focus:border-emerald-500/50 text-xs transition-all rounded-xl"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-muted/80 px-1.5 font-mono text-[10px] text-muted-foreground font-semibold">
                  Ctrl K
                </kbd>
              </div>

              {/* SEARCH DROPDOWN OVERLAY */}
              {isSearchOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsSearchOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-1.5 z-40 w-full max-h-96 overflow-y-auto rounded-2xl border border-emerald-500/30 bg-popover/95 p-2 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-border/60 pb-1.5 mb-1 px-3">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        {searchQuery ? "Hasil Pencarian" : "Pencarian Cepat & Rekomendasi"}
                      </span>
                      <button
                        onClick={() => setIsQrScannerOpen(true)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <QrCode className="h-3.5 w-3.5" /> Scan QR Tag
                      </button>
                    </div>

                    {searchResults.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground">
                        Tidak ada hasil yang cocok dengan "{searchQuery}".
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {searchResults.map((item) => {
                          const IconComp = item.icon;
                          return (
                            <div
                              key={item.id}
                              onClick={() => handleSelectSearchItem(item.url)}
                              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-500/10 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                  <IconComp className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">{item.title}</p>
                                  <p className="text-[11px] text-muted-foreground">{item.subtitle}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                                {item.category}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* QUICK QR SCANNER ICON BUTTON */}
            <Button
              onClick={() => setIsQrScannerOpen(true)}
              variant="ghost"
              size="icon"
              title="Pemindai Kamera QR Tag"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
            >
              <QrCode className="h-4 w-4" />
            </Button>

            {/* RIGHT SIDE ACTIONS: NOTIFICATION BELL & OFFLINE SYNC */}
            <div className="ml-auto flex items-center gap-2">
              <OfflineSyncBar />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => requestAndroidNotificationPermission()}
                    className="relative h-9 w-9 rounded-full hover:bg-emerald-500/10"
                    title="Notifikasi & Peringatan System"
                  >
                    <Bell className="h-4 w-4 text-foreground" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-sm">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 sm:w-96 p-0 border-border/80 shadow-2xl">
                  {/* Popover Header */}
                  <div className="flex items-center justify-between border-b border-border/60 p-4">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <h4 className="text-sm font-bold text-foreground">Notifikasi Sistem</h4>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                          {unreadCount} Baru
                        </Badge>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllRead}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <CheckCheck className="mr-1 h-3.5 w-3.5" /> Tandai Dibaca
                      </Button>
                    )}
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-muted-foreground">
                        Tidak ada notifikasi saat ini.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`flex items-start gap-3 p-3.5 text-xs cursor-pointer transition-colors ${
                            notif.read ? "bg-background opacity-80 hover:bg-muted/40" : "bg-primary/5 hover:bg-primary/10"
                          }`}
                        >
                          <div className="mt-0.5">
                            {notif.level === "Kritis" ? (
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                                <TriangleAlert className="h-3.5 w-3.5" />
                              </div>
                            ) : notif.level === "Peringatan" ? (
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                                <TriangleAlert className="h-3.5 w-3.5" />
                              </div>
                            ) : (
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                                <Info className="h-3.5 w-3.5" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`font-semibold ${notif.read ? "text-muted-foreground" : "text-foreground"}`}>
                                {notif.title}
                              </p>
                              {!notif.read && (
                                <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                              )}
                            </div>
                            <p className="text-muted-foreground leading-snug text-[11px] line-clamp-2">
                              {notif.desc}
                            </p>
                            <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
                              <span>{notif.time}</span>
                              <span className="flex items-center text-primary font-medium hover:underline">
                                Buka <ChevronRight className="h-3 w-3 ml-0.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Popover Footer */}
                  <div className="border-t border-border/60 bg-muted/30 p-2.5 text-center">
                    <Link
                      to="/kartu"
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center justify-center"
                    >
                      Lihat Semua Aktivitas & Peringatan Medis
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>

              {/* USER PROFILE AVATAR TRIGGER */}
              <Link to="/profile" title="Buka Profil Saya">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full overflow-hidden border border-border/80 hover:border-primary/50">
                  {getAuthSession()?.user?.avatar ? (
                    <img src={getAuthSession()?.user?.avatar} alt="Profile Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-foreground" />
                  )}
                </Button>
              </Link>
            </div>
          </header>

          {/* Main Page Content */}
          <div className="flex-1 p-4 md:p-8">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
              </div>
              {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
            </div>
            {children}
          </div>

          {/* Footer */}
          <footer className="border-t border-border/60 px-4 py-4 text-center text-xs text-muted-foreground">
            Created by : tim PKM posyandu ternak unu purwokerto dan kelompok ternak mindajaya farm 2026
          </footer>
        </SidebarInset>
      </div>

      {/* QR CAMERA SCANNER MODAL */}
      <QrScannerModal isOpen={isQrScannerOpen} onClose={() => setIsQrScannerOpen(false)} />
    </SidebarProvider>
  );
}
