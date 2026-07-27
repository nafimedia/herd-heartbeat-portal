import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Beef,
  HeartPulse,
  Milk,
  Wheat,
  FileBarChart,
  Sprout,
  IdCard,
  CalendarHeart,
  LogOut,
  Pill,
  Users,
  BookOpen,
  Plus,
  ChevronDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { clearAuthSession, getAuthSession, ROLE_LABELS, type UserRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const remainingMenu = [
  { title: "Kartu Kesehatan", url: "/kartu", icon: IdCard },
  { title: "Hari Posyandu", url: "/posyandu", icon: CalendarHeart },
  { title: "Kesehatan", url: "/kesehatan", icon: HeartPulse },
  { title: "Produksi", url: "/produksi", icon: Milk },
  { title: "Pakan & Stok", url: "/pakan", icon: Wheat },
  { title: "Obat & Stok", url: "/obat", icon: Pill },
  { title: "Manajemen User", url: "/users", icon: Users },
  { title: "Laporan", url: "/laporan", icon: FileBarChart },
  { title: "Buku Panduan", url: "/panduan", icon: BookOpen },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const router = useRouter();

  const session = getAuthSession();
  const currentUser = session?.user || {
    name: "Pak Tono (Ketua KTT)",
    role: "admin" as UserRole,
    email: "admin@farm.local",
    avatar: "",
  };
  const roleInfo = ROLE_LABELS[currentUser.role] || ROLE_LABELS.admin;
  const initials = currentUser.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "PT";

  const handleLogout = async () => {
    clearAuthSession();
    try {
      await router.navigate({ to: "/login" });
    } catch {
      window.location.assign("/login");
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-sidebar-primary/10 border border-sidebar-border p-0.5">
            <img src="/images/logomindajaya.png" alt="Minda Jaya Logo" className="h-full w-full object-contain" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <div className="text-sm font-semibold text-sidebar-foreground">KARTANING</div>
            <div className="text-xs text-sidebar-foreground/60">Sistem Pendataan</div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* 1. DASHBOARD */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard">
                  <Link to="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* 2. COLLAPSIBLE DROPDOWN MENU FOR DATA TERNAK (RIGHT UNDER DASHBOARD) */}
              <Collapsible defaultOpen={pathname.startsWith("/ternak")} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={pathname.startsWith("/ternak")}
                      tooltip="Data Ternak"
                      className="w-full justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <Beef className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-semibold">Data Ternak</span>
                      </div>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === "/ternak"}>
                          <Link to="/ternak">
                            <Beef className="h-3.5 w-3.5 text-emerald-600" />
                            <span>📋 Tabel & Data Ternak</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === "/ternak/tambah"}>
                          <Link to="/ternak/tambah">
                            <Plus className="h-3.5 w-3.5 text-emerald-600" />
                            <span>➕ Form Tambah Ternak</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* 3. OTHER GENERAL MENU ITEMS */}
              {remainingMenu.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <Link
          to="/profile"
          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors group cursor-pointer"
          title="Buka Profil Saya"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0 border border-primary/30 overflow-hidden">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="group-data-[collapsible=icon]:hidden flex-1 min-w-0">
            <div className="text-xs font-bold text-sidebar-foreground truncate group-hover:text-primary transition-colors">
              {currentUser.name || "User"}
            </div>
            <Badge variant="outline" className={`mt-0.5 text-[10px] px-1.5 py-0 ${roleInfo.badge}`}>
              {roleInfo.label}
            </Badge>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4 text-destructive" />
          <span>Keluar</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
