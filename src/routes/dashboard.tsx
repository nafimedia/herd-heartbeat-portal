import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Beef,
  HeartPulse,
  Milk,
  Wheat,
  Plus,
  Syringe,
  TriangleAlert,
  Layers,
  Search,
  Filter,
  Download,
  ChevronRight,
  Sparkles,
  Bird,
  Egg,
  Sprout,
  ShieldCheck,
  TrendingDown,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import {
  aktivitasTerbaru,
  distribusiStatus,
  populasiBulanan,
  produksiSusu,
  daftarTernak,
  type Ternak,
  type StatusTernak,
} from "@/lib/mock-data";
import { peringatanDini } from "@/lib/kartu-data";
import { getOverview } from "@/lib/api";
import { downloadCsv } from "@/lib/export";
import { MonthlyReportModal } from "@/components/monthly-report-modal";
import { BackupRestoreModal } from "@/components/backup-restore-modal";
import { toast } from "sonner";

const levelStyle: Record<string, string> = {
  kritis: "border-destructive/40 bg-destructive/10 text-destructive",
  peringatan: "border-warning/40 bg-warning/15 text-warning-foreground",
  info: "border-primary/30 bg-primary/10 text-primary",
};

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — KARTANING" },
      { name: "description", content: "Ringkasan populasi ternak, kesehatan, produksi susu dan pengelompokan jenis ternak." },
      { property: "og:title", content: "Dashboard — KARTANING" },
      { property: "og:description", content: "Ringkasan populasi ternak, kesehatan, produksi susu dan pengelompokan jenis ternak." },
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

const statusVariant: Record<string, string> = {
  Sehat: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  Bunting: "bg-primary/15 text-primary border-primary/30",
  Sakit: "bg-destructive/15 text-destructive border-destructive/30",
  Karantina: "bg-amber-500/15 text-amber-600 border-amber-500/30",
};

type CategoryType = "Semua" | "Kambing" | "Domba" | "Sapi" | "Ayam" | "Bebek";

interface CategoryMeta {
  type: CategoryType;
  label: string;
  emoji: string;
  icon: typeof Beef;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  desc: string;
  defaultUnit: string;
}

const CATEGORIES_CONFIG: CategoryMeta[] = [
  {
    type: "Kambing",
    label: "Kambing",
    emoji: "🐐",
    icon: Beef,
    colorBg: "bg-emerald-500/10",
    colorBorder: "border-emerald-500/30",
    colorText: "text-emerald-600 dark:text-emerald-400",
    desc: "Perah & Potong (Etawa PE, Boer, Saanen)",
    defaultUnit: "Susu & Daging",
  },
  {
    type: "Domba",
    label: "Domba",
    emoji: "🐑",
    icon: Sprout,
    colorBg: "bg-amber-500/10",
    colorBorder: "border-amber-500/30",
    colorText: "text-amber-600 dark:text-amber-400",
    desc: "Potong & Wol (Garut, Merino, Texel)",
    defaultUnit: "Daging & Wol",
  },
  {
    type: "Sapi",
    label: "Sapi",
    emoji: "🐄",
    icon: Beef,
    colorBg: "bg-primary/10",
    colorBorder: "border-primary/30",
    colorText: "text-primary",
    desc: "Potong & Perah (Limousin, Simmental, FH)",
    defaultUnit: "Susu & Daging",
  },
  {
    type: "Ayam",
    label: "Ayam",
    emoji: "🐔",
    icon: Egg,
    colorBg: "bg-rose-500/10",
    colorBorder: "border-rose-500/30",
    colorText: "text-rose-600 dark:text-rose-400",
    desc: "Unggas Petelur & Broiler (Layer, Kampung)",
    defaultUnit: "Telur & Daging",
  },
  {
    type: "Bebek",
    label: "Bebek",
    emoji: "🦆",
    icon: Bird,
    colorBg: "bg-cyan-500/10",
    colorBorder: "border-cyan-500/30",
    colorText: "text-cyan-600 dark:text-cyan-400",
    desc: "Unggas Air (Mojosari, Peking, Alabio)",
    defaultUnit: "Telur & Daging",
  },
];

function DashboardPage() {
  const [overview, setOverview] = useState<{ totalAnimals: number; sehat: number; stokKritis: number; totalProduksi: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter State Pengelompokan Ternak
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("semua");

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

  // Hitung Populasi per Jenis Ternak
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; sehat: number; bunting: number; sakit: number }> = {
      Sapi: { total: 0, sehat: 0, bunting: 0, sakit: 0 },
      Kambing: { total: 0, sehat: 0, bunting: 0, sakit: 0 },
      Domba: { total: 0, sehat: 0, bunting: 0, sakit: 0 },
      Ayam: { total: 0, sehat: 0, bunting: 0, sakit: 0 },
      Bebek: { total: 0, sehat: 0, bunting: 0, sakit: 0 },
    };

    daftarTernak.forEach((t) => {
      if (stats[t.jenis]) {
        stats[t.jenis].total += 1;
        if (t.status === "Sehat") stats[t.jenis].sehat += 1;
        if (t.status === "Bunting") stats[t.jenis].bunting += 1;
        if (t.status === "Sakit") stats[t.jenis].sakit += 1;
      }
    });

    return stats;
  }, []);

  // Filter Data Ternak Berdasarkan Pengelompokan
  const filteredLivestock = useMemo(() => {
    return daftarTernak.filter((item) => {
      const matchCat = selectedCategory === "Semua" || item.jenis === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        item.tag.toLowerCase().includes(q) ||
        item.ras.toLowerCase().includes(q) ||
        item.kandang.toLowerCase().includes(q) ||
        item.jenis.toLowerCase().includes(q);
      const matchStatus = statusFilter === "semua" || item.status === statusFilter;
      return matchCat && matchQuery && matchStatus;
    });
  }, [selectedCategory, searchQuery, statusFilter]);

  const handleExportGroup = () => {
    const exportData = filteredLivestock as unknown as Record<string, unknown>[];
    const filename = `pengelompokan-ternak-${selectedCategory.toLowerCase()}.csv`;
    downloadCsv(filename, exportData.length > 0 ? exportData : (daftarTernak as unknown as Record<string, unknown>[]));
    toast.success(`Data pengelompokan ${selectedCategory} berhasil diekspor.`);
  };

  const handleExport = () => {
    downloadCsv("dashboard-ringkasan.csv", activityRows);
    toast.success("Ringkasan dashboard berhasil diekspor.");
  };

  return (
    <DashboardShell
      title="Selamat datang kembali, Pak Tono 👋"
      subtitle="Ringkasan operasional peternakan hari ini, Minggu 12 Juli 2026."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <MonthlyReportModal />
          <BackupRestoreModal />
          <Button asChild className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
            <Link to="/ternak">
              <Plus className="h-4 w-4" /> Tambah Ternak
            </Link>
          </Button>
        </div>
      }
    >
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total Populasi" value={loading ? "—" : `${totalPopulasi}`} hint="Ekor posyandu aktif" delta={4.2} icon={Beef} tone="primary" />
        <StatCard label="Ternak Sehat" value={loading ? "—" : `${ternakSehat}`} hint="100% Bebas Penyakit" delta={13.3} icon={HeartPulse} tone="success" />
        <StatCard label="Tingkat Kematian" value="0%" hint="Sesudah Posyandu (0 Ekor)" delta={-100} icon={ShieldCheck} tone="success" />
        <StatCard label="Produksi Susu" value={loading ? "—" : totalProduksi} hint="Hari ini" delta={2.8} icon={Milk} tone="accent" />
        <StatCard label="Stok Pakan Kritis" value={loading ? "—" : `${stokKritis}`} hint="Item di bawah minimum" delta={-12} icon={TriangleAlert} tone="warning" />
      </div>

      {/* POSYANDU HEALTH & MORTALITY EVALUATION CARD */}
      <Card className="mt-6 border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-card to-background shadow-md overflow-hidden">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-xl font-bold tracking-tight">Evaluasi Kesehatan & Tingkat Kematian Ternak</CardTitle>
                  <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    Posyandu PKM UNU 2026
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Perbandingan performa kesehatan, kesakitan, dan tingkat kematian ternak Sebelum vs Sesudah program Posyandu.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400 w-fit">
              <TrendingDown className="h-4 w-4 text-emerald-500" />
              <span>Penurunan Kematian: 100%</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {/* SEBELUM POSYANDU */}
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs">
                    Sebelum Posyandu
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">Kondisi Awal</span>
                </div>
                <Badge variant="secondary" className="bg-rose-500/20 text-rose-700 dark:text-rose-300 font-mono text-xs">
                  Resiko Tinggi
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-background/80 p-2.5 border border-rose-500/10 shadow-xs">
                  <p className="text-[11px] text-muted-foreground font-medium">Ternak Sakit</p>
                  <p className="text-lg sm:text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">10 <span className="text-xs font-normal">ekor</span></p>
                  <p className="text-[10px] text-rose-500 font-semibold">(13.3%)</p>
                </div>
                <div className="rounded-lg bg-background/80 p-2.5 border border-rose-500/10 shadow-xs">
                  <p className="text-[11px] text-muted-foreground font-medium">Ternak Sehat</p>
                  <p className="text-lg sm:text-2xl font-black text-slate-700 dark:text-slate-200 mt-1">65 <span className="text-xs font-normal">ekor</span></p>
                  <p className="text-[10px] text-muted-foreground font-semibold">(86.7%)</p>
                </div>
                <div className="rounded-lg bg-background/80 p-2.5 border border-rose-500/10 shadow-xs">
                  <p className="text-[11px] text-muted-foreground font-medium">Kematian Awal</p>
                  <p className="text-sm sm:text-base font-black text-rose-600 dark:text-rose-400 mt-1">1–5 <span className="text-[10px] font-normal">ekor/ptk/thn</span></p>
                  <p className="text-[10px] text-rose-500 font-semibold">Resiko Tinggi</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground bg-background/50 p-3 rounded-lg border border-rose-500/10">
                <div className="flex items-center justify-between font-medium text-foreground">
                  <span>Persentase Ternak Sehat Awal:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">86.7%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: "86.7%" }} />
                </div>
                <p className="text-[11px] text-muted-foreground pt-1">
                  ⚠️ Catatan awal: Terdapat kasus Cacingan & Pink eye serta angka kematian tahunan 1-5 ekor per peternak.
                </p>
              </div>
            </div>

            {/* SESUDAH POSYANDU */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    Sesudah Posyandu
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">Intervensi Posyandu</span>
                </div>
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs">
                  🟢 100% Sehat & Prima
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-background/80 p-2.5 border border-emerald-500/10 shadow-xs">
                  <p className="text-[11px] text-muted-foreground font-medium">Ternak Sakit</p>
                  <p className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">0 <span className="text-xs font-normal">ekor</span></p>
                  <p className="text-[10px] text-emerald-500 font-semibold">(0%)</p>
                </div>
                <div className="rounded-lg bg-background/80 p-2.5 border border-emerald-500/10 shadow-xs">
                  <p className="text-[11px] text-muted-foreground font-medium">Ternak Sehat</p>
                  <p className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">75 <span className="text-xs font-normal">ekor</span></p>
                  <p className="text-[10px] text-emerald-500 font-semibold">(100%)</p>
                </div>
                <div className="rounded-lg bg-background/80 p-2.5 border border-emerald-500/10 shadow-xs">
                  <p className="text-[11px] text-muted-foreground font-medium">Tingkat Kematian</p>
                  <p className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">0 <span className="text-xs font-normal">ekor</span></p>
                  <p className="text-[10px] text-emerald-500 font-semibold">0% (Bebas Kematian)</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground bg-background/50 p-3 rounded-lg border border-emerald-500/10">
                <div className="flex items-center justify-between font-medium text-foreground">
                  <span>Persentase Ternak Sehat Sesudah Posyandu:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">100%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
                </div>
                <p className="text-[11px] text-muted-foreground pt-1">
                  ✨ Hasil intervensi: 100% ternak telah mendapatkan Vitamin, Mineral, Deworming & Vaksinasi PMK.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FITUR PENGELOMPOKAN TERNAK */}
      <Card className="mt-6 border-border/80 bg-gradient-to-br from-card to-background shadow-sm">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/20">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold tracking-tight">Pengelompokan Ternak</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Kelola data, pencarian, pemantauan populasi, dan analisis berdasarkan jenis ternak (Kambing, Domba, Sapi, Ayam, Bebek).
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportGroup} className="w-fit">
              <Download className="mr-1.5 h-4 w-4" /> Ekspor Data {selectedCategory}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Category Cards Summary */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES_CONFIG.map((cat) => {
              const stat = categoryStats[cat.type] || { total: 0, sehat: 0 };
              const isSelected = selectedCategory === cat.type;
              return (
                <div
                  key={cat.type}
                  onClick={() => setSelectedCategory(isSelected ? "Semua" : cat.type)}
                  className={`group relative cursor-pointer rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${
                    isSelected
                      ? `border-primary bg-primary/10 ring-2 ring-primary/30 shadow-sm`
                      : `border-border/60 bg-card hover:border-primary/50`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{cat.emoji}</span>
                    <Badge variant="outline" className={`font-mono font-bold text-xs ${cat.colorBg} ${cat.colorText} ${cat.colorBorder}`}>
                      {stat.total} Ekor
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                      <span>{cat.label}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-1 line-clamp-2">{cat.desc}</p>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 text-[11px]">
                    <span className="text-muted-foreground">Status Sehat:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stat.sehat} Ekor</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Tabs & Filter Controls */}
          <div className="flex flex-col gap-4 border-t border-border/60 pt-4 md:flex-row md:items-center md:justify-between">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border/60 bg-muted/40 p-1">
              <button
                onClick={() => setSelectedCategory("Semua")}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === "Semua"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Semua ({daftarTernak.length})
              </button>
              {CATEGORIES_CONFIG.map((cat) => {
                const count = categoryStats[cat.type]?.total || 0;
                return (
                  <button
                    key={cat.type}
                    onClick={() => setSelectedCategory(cat.type)}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                      selectedCategory === cat.type
                        ? "bg-background text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label} ({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search & Status Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari tag, ras, kandang..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs h-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-36 text-xs h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="Sehat">Sehat</SelectItem>
                  <SelectItem value="Bunting">Bunting</SelectItem>
                  <SelectItem value="Sakit">Sakit</SelectItem>
                  <SelectItem value="Karantina">Karantina</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table List per Group */}
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-24">Ear Tag</TableHead>
                  <TableHead>Jenis & Ras</TableHead>
                  <TableHead>Kelamin & Umur</TableHead>
                  <TableHead>Bobot / Berat</TableHead>
                  <TableHead>Kandang / Lokasi</TableHead>
                  <TableHead>Estimasi Pakan Harian</TableHead>
                  <TableHead>Hasil Produksi</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLivestock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-28 text-center text-muted-foreground text-xs">
                      Tidak ada data ternak untuk kategori atau pencarian ini.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLivestock.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/40 text-xs">
                      <TableCell className="font-mono font-bold text-foreground">
                        {item.tag}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-foreground">{item.ras}</div>
                        <div className="text-[11px] text-muted-foreground">{item.jenis}</div>
                      </TableCell>
                      <TableCell>
                        <div>{item.jenisKelamin}</div>
                        <div className="text-[11px] text-muted-foreground">{item.umur} bulan</div>
                      </TableCell>
                      <TableCell className="font-mono font-semibold tabular-nums">
                        {item.berat} kg
                      </TableCell>
                      <TableCell className="text-muted-foreground font-medium">
                        {item.kandang}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.estimasiPakan || "-"}
                      </TableCell>
                      <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">
                        {item.hasilProduksi || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusVariant[item.status] || ""}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Early Warnings Section */}
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

      {/* Charts Row */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Pertumbuhan Populasi per Jenis</CardTitle>
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
