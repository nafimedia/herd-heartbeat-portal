import { createFileRoute } from "@tanstack/react-router";
import { FileBarChart, Download, FileText, TrendingUp, DollarSign } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardShell } from "@/components/dashboard-shell";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { produksiBulanan } from "@/lib/mock-data";

export const Route = createFileRoute("/laporan")({
  head: () => ({
    meta: [
      { title: "Laporan — TernakPro" },
      { name: "description", content: "Laporan bulanan produksi, kesehatan, dan keuangan peternakan." },
    ],
  }),
  component: LaporanPage,
});

const laporan = [
  { nama: "Laporan Populasi Juli 2026", tipe: "Populasi", tanggal: "01 Jul 2026", ukuran: "245 KB" },
  { nama: "Laporan Produksi Juni 2026", tipe: "Produksi", tanggal: "30 Jun 2026", ukuran: "312 KB" },
  { nama: "Laporan Kesehatan Q2 2026", tipe: "Kesehatan", tanggal: "28 Jun 2026", ukuran: "480 KB" },
  { nama: "Laporan Keuangan Juni 2026", tipe: "Keuangan", tanggal: "30 Jun 2026", ukuran: "198 KB" },
  { nama: "Laporan Pakan Juni 2026", tipe: "Pakan", tanggal: "30 Jun 2026", ukuran: "156 KB" },
];

function LaporanPage() {
  return (
    <DashboardShell
      title="Laporan"
      subtitle="Unduh laporan bulanan dan tahunan"
      actions={
        <Button>
          <FileBarChart /> Buat Laporan
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Pendapatan Bulan Ini" value="Rp 84,2 Jt" delta={6.4} icon={DollarSign} tone="success" />
        <StatCard label="Pertumbuhan Produksi" value="+4,8%" hint="vs bulan lalu" icon={TrendingUp} tone="primary" />
        <StatCard label="Laporan Tersedia" value="24" hint="6 bulan terakhir" icon={FileText} tone="accent" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Produksi Susu Bulanan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={produksiBulanan}>
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
                <Bar dataKey="susu" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Laporan Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {laporan.map((l) => (
              <div key={l.nama} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{l.nama}</div>
                  <div className="text-xs text-muted-foreground">
                    {l.tipe} • {l.tanggal} • {l.ukuran}
                  </div>
                </div>
                <Button size="icon" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
