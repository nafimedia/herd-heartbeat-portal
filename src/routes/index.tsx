import { createFileRoute } from "@tanstack/react-router";
import { Activity, Beef, HeartPulse, Milk, Wheat, Plus, Syringe, TriangleAlert } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardShell } from "@/components/dashboard-shell";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  aktivitasTerbaru,
  distribusiStatus,
  populasiBulanan,
  produksiSusu,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — TernakPro" },
      { name: "description", content: "Ringkasan populasi ternak, kesehatan, produksi susu dan stok pakan dalam satu dashboard." },
      { property: "og:title", content: "TernakPro — Sistem Pendataan Ternak" },
      { property: "og:description", content: "Kelola populasi, kesehatan, produksi, dan stok pakan ternak dengan mudah." },
    ],
  }),
  component: DashboardPage,
});

const ikonAktivitas: Record<string, typeof Activity> = {
  activity: Activity,
  milk: Milk,
  wheat: Wheat,
  plus: Plus,
  syringe: Syringe,
};

const toneAktivitas: Record<string, string> = {
  kesehatan: "bg-destructive/10 text-destructive",
  produksi: "bg-primary/10 text-primary",
  pakan: "bg-warning/20 text-warning-foreground",
  ternak: "bg-accent/15 text-accent",
};

function DashboardPage() {
  return (
    <DashboardShell
      title="Selamat datang kembali, Pak Tono 👋"
      subtitle="Ringkasan operasional peternakan hari ini, Minggu 12 Juli 2026."
      actions={
        <>
          <Button variant="outline">Ekspor Laporan</Button>
          <Button>
            <Plus /> Tambah Ternak
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Populasi" value="207" hint="Ekor tercatat aktif" delta={4.2} icon={Beef} tone="primary" />
        <StatCard label="Produksi Susu" value="371 L" hint="Hari ini" delta={2.8} icon={Milk} tone="accent" />
        <StatCard label="Ternak Sehat" value="168" hint="81% dari populasi" delta={1.4} icon={HeartPulse} tone="success" />
        <StatCard label="Stok Pakan Kritis" value="2" hint="Item di bawah minimum" delta={-12} icon={TriangleAlert} tone="warning" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Pertumbuhan Populasi</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Perbandingan populasi 8 bulan terakhir</p>
            </div>
            <Badge variant="secondary">2026</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={populasiBulanan}>
                <defs>
                  <linearGradient id="gSapi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gKambing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gDomba" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="bulan" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="sapi" stroke="var(--color-primary)" fill="url(#gSapi)" strokeWidth={2} />
                <Area type="monotone" dataKey="kambing" stroke="var(--color-accent)" fill="url(#gKambing)" strokeWidth={2} />
                <Area type="monotone" dataKey="domba" stroke="var(--color-chart-3)" fill="url(#gDomba)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Kondisi kesehatan ternak</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={distribusiStatus} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {distribusiStatus.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {distribusiStatus.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                    <span>{d.name}</span>
                  </div>
                  <span className="font-medium tabular-nums">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Produksi Susu Mingguan</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">Total liter yang tercatat per hari</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={produksiSusu}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="hari" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="liter" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {aktivitasTerbaru.map((a, i) => {
              const Icon = ikonAktivitas[a.ikon] ?? Activity;
              return (
                <div key={i} className="flex gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toneAktivitas[a.tipe]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-snug">{a.teks}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.waktu}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
