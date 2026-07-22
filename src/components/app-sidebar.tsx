import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Beef, HeartPulse, Milk, Wheat, FileBarChart, Sprout, IdCard, CalendarHeart, LogOut } from "lucide-react";
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { clearAuthSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const menu = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Data Ternak", url: "/ternak", icon: Beef },
  { title: "Kartu Kesehatan", url: "/kartu", icon: IdCard },
  { title: "Hari Posyandu", url: "/posyandu", icon: CalendarHeart },
  { title: "Kesehatan", url: "/kesehatan", icon: HeartPulse },
  { title: "Produksi", url: "/produksi", icon: Milk },
  { title: "Pakan & Stok", url: "/pakan", icon: Wheat },
  { title: "Laporan", url: "/laporan", icon: FileBarChart },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const router = useRouter();

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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Sprout className="h-5 w-5" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <div className="text-sm font-semibold text-sidebar-foreground">TernakPro</div>
            <div className="text-xs text-sidebar-foreground/60">Sistem Pendataan</div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => (
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
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-sm font-semibold">
            PT
          </div>
          <div className="group-data-[collapsible=icon]:hidden flex-1">
            <div className="text-sm font-medium text-sidebar-foreground">Pak Tono</div>
            <div className="text-xs text-sidebar-foreground/60">Peternak Utama</div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span>Keluar</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
