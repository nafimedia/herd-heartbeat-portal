import { createFileRoute } from "@tanstack/react-router";
import { Activity, Beef, HeartPulse, Milk, Wheat, Plus, Syringe, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
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
import { DashboardShell, StatCard } from "@/features/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import {
  aktivitasTerbaru,
  distribusiStatus,
  populasiBulanan,
  produksiSusu,
} from "@/lib/mock-data";
import { peringatanDini } from "@/lib/kartu-data";
import { getOverview } from "@/lib/api";
import { downloadCsv } from "@/lib/export";
import { toast } from "sonner";

const levelStyle: Record<string, string> = {
  kritis: "border-destructive/40 bg-destructive/10 text-destructive",
  peringatan: "border-warning/40 bg-warning/15 text-warning-foreground",
  info: "border-primary/30 bg-primary/10 text-primary",
};

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TernakPro" },
      { name: "description", content: "Ringkasan populasi ternak, kesehatan, produksi susu dan stok pakan dalam satu dashboard." },
      { property: "og:title", content: "Dashboard — TernakPro" },
      { property: "og:description", content: "Ringkasan populasi ternak, kesehatan, produksi susu dan stok pakan dalam satu dashboard." },
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
  const [overview, setOverview] = useState<{ totalAnimals: number; sehat: number; stokKritis: number; totalProduksi: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getOverview()
      .then((data) => {
        if (active) {
          setOverview(data);
        }
      })
      .catch(() => {
        if (active) {
          setOverview({ totalAnimals: 207, sehat: 168, stokKritis: 2, totalProduksi: 371 });
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const totalPopulasi = overview?.totalAnimals ?? 207;
  const activityRows = [
    { waktu: "10 menit lalu", tipe: "Kesehatan", detail: "Pemeriksaan kebuntingan SP-002" },
    { waktu: "1 jam lalu", tipe: "Produksi", detail: "Produksi susu pagi tercatat 186 liter" },
    { waktu: "3 jam lalu", tipe: "Pakan", detail: "Stok konsentrat di bawah minimum" },
  ];
  const totalProduksi = overview?.totalProduksi ? `${overview.totalProduksi} L` : "371 L";
  const ternakSehat = overview?.sehat ?? 168;
  const stokKritis = overview?.stokKritis ?? 2;

  const handleExport = () => {
    downloadCsv("dashboard-ringkasan.csv", activityRows);
    toast.success("Ringkasan dashboard berhasil diekspor.");
  };

  return (
    <DashboardShell
      title="Selamat datang kembali, Pak Tono 👋"
      subtitle="Ringkasan operasional peternakan hari ini, Minggu 12 Juli 2026."
      actions={
        <>
          <Button variant="outline" onClick={handleExport}>Ekspor Laporan</Button>
          <Button>
            <Plus /> Tambah Ternak
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Populasi" value={loading ? "—" : `${totalPopulasi}`} hint="Ekor tercatat aktif" delta={4.2} icon={Beef} tone="primary" />
        <StatCard label="Produksi Susu" value={loading ? "—" : totalProduksi} hint="Hari ini" delta={2.8} icon={Milk} tone="accent" />
        <StatCard label="Ternak Sehat" value={loading ? "—" : `${ternakSehat}`} hint="81% dari populasi" delta={1.4} icon={HeartPulse} tone="success" />
        <StatCard label="Stok Pakan Kritis" value={loading ? "—" : `${stokKritis}`} hint="Item di bawah minimum" delta={-12} icon={TriangleAlert} tone="warning" />
      </div>

      <Card className="mt-6 border-destructive/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
              <TriangleAlert className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Peringatan Dini</CardTitle>
              <p className="mt-0.5 text-sm text-muted-foreground">Kondisi ternak yang perlu perhatian segera</p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/kartu">Lihat Kartu</Link>
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {peringatanDini.map((p) => (
            <div
              key={p.id}
              className={`flex items-start gap-3 rounded-lg border p-3 ${levelStyle[p.level]}`}
            >
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-semibold">{p.idKambing}</span>
                  <Badge variant="outline" className="border-current bg-background/50 text-[10px] uppercase">
                    {p.level}
                  </Badge>
                </div>
                <p className="mt-1 text-sm leading-snug">{p.pesan}</p>
                <p className="mt-1 text-xs opacity-70">{p.waktu}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

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
            <div className="rounded-lg border border-dashed p-3">
              <p className="text-sm font-medium">Riwayat sistem</p>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                {activityRows.map((item) => (
                  <li key={item.waktu} className="flex items-start justify-between gap-2">
                    <span>{item.detail}</span>
                    <span className="text-xs">{item.waktu}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
