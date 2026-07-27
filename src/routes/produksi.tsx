import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Milk,
  Beef,
  Egg,
  TrendingUp,
  Save,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardShell, StatCard } from "@/features/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProduction, getProduction, getAnimals } from "@/lib/api";
import { saveOfflineAction } from "@/lib/offline-sync";
import { downloadCsv } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/produksi")({
  head: () => ({
    meta: [
      { title: "Manajemen Produksi — KARTANING" },
      { name: "description", content: "Catatan produksi harian susu, daging, dan telur peternakan." },
    ],
  }),
  component: ProduksiPage,
});

export function ProduksiPage() {
  const [production, setProduction] = useState<Array<Record<string, unknown>>>([]);
  const [animals, setAnimals] = useState<Array<Record<string, unknown>>>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().slice(0, 10),
    tag: "SP-001",
    susu: "15",
    daging: "0",
    telur: "0",
    catatan: "Pemerahan Pagi Sapi Limousin",
  });

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      const [prodData, animData] = await Promise.all([getProduction(), getAnimals()]);
      setProduction(prodData);
      setAnimals(animData);
      if (animData.length > 0 && !form.tag) {
        setForm((prev) => ({ ...prev, tag: String(animData[0].tag || "SP-001") }));
      }
    } catch {
      setProduction([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = production.filter((item) => {
    const data = item as Record<string, unknown>;
    const tag = String(data.tag || "").toLowerCase();
    const tanggal = String(data.tanggal || "").toLowerCase();
    const catatan = String(data.catatan || "").toLowerCase();
    const haystack = `${tag} ${tanggal} ${catatan}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const susuTotal = production.reduce((sum, item) => sum + Number((item as Record<string, number>).susu || 0), 0);
  const dagingTotal = production.reduce((sum, item) => sum + Number((item as Record<string, number>).daging || 0), 0);
  const telurTotal = production.reduce((sum, item) => sum + Number((item as Record<string, number>).telur || 0), 0);
  const avgSusuHarian = Math.round(susuTotal / Math.max(1, production.length));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const payload = {
      id: `prod-${Date.now()}`,
      tanggal: form.tanggal,
      tag: form.tag,
      susu: Number(form.susu) || 0,
      daging: Number(form.daging) || 0,
      telur: Number(form.telur) || 0,
      catatan: form.catatan,
    };

    try {
      if (navigator.onLine) {
        const created = await createProduction(payload);
        setProduction((current) => [created, ...current]);
        toast.success("Catatan produksi berhasil disimpan ke database!");
      } else {
        saveOfflineAction("PRODUCTION_LOG", payload, `Produksi ${form.tag}`);
        setProduction((current) => [payload, ...current]);
        toast.info("Offline: Catatan produksi disimpan ke antrean lokal.");
      }
      setForm({
        tanggal: new Date().toISOString().slice(0, 10),
        tag: animals.length > 0 ? String(animals[0].tag || "SP-001") : "SP-001",
        susu: "0",
        daging: "0",
        telur: "0",
        catatan: "",
      });
      setIsModalOpen(false);
    } catch {
      saveOfflineAction("PRODUCTION_LOG", payload, `Produksi ${form.tag}`);
      setProduction((current) => [payload, ...current]);
      setIsModalOpen(false);
      toast.info("Catatan produksi disimpan ke antrean offline.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    downloadCsv("laporan-produksi.csv", filtered.length > 0 ? filtered : production);
    toast.success("Data produksi berhasil diekspor sebagai CSV.");
  };

  return (
    <DashboardShell
      title="Manajemen Produksi"
      subtitle="Ringkasan dan pencatatan histori hasil susu, daging (karkas), dan telur peternakan"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-1.5">
            <Download className="h-4 w-4" /> Ekspor CSV
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md">
            <Plus className="h-4 w-4" /> Input Hasil Produksi
          </Button>
        </div>
      }
    >
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Susu Bulan Ini" value={`${susuTotal.toLocaleString("id-ID")} L`} delta={4.8} icon={Milk} tone="primary" />
        <StatCard label="Daging (Karkas)" value={`${dagingTotal.toLocaleString("id-ID")} kg`} delta={7.9} icon={Beef} tone="accent" />
        <StatCard label="Telur Unggas" value={telurTotal.toLocaleString("id-ID")} hint="butir" delta={5.2} icon={Egg} tone="warning" />
        <StatCard label="Rata-rata Susu Harian" value={`${avgSusuHarian.toLocaleString("id-ID")} L`} delta={2.1} icon={TrendingUp} tone="success" />
      </div>

      {/* TABLE HISTORI PRODUKSI CARD */}
      <Card className="mt-6 border-border/80">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Milk className="h-5 w-5 text-emerald-600" /> Tabel Histori Catatan Produksi
              </CardTitle>
              <CardDescription>Catatan pengambilan hasil produksi susu, karkas daging, dan telur</CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari tag, tanggal, catatan..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-8 text-xs h-8 w-48 sm:w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Tanggal</TableHead>
                  <TableHead className="font-bold">Tag ID / Ternak</TableHead>
                  <TableHead className="font-bold">Hasil Susu (L)</TableHead>
                  <TableHead className="font-bold">Hasil Daging (kg)</TableHead>
                  <TableHead className="font-bold">Hasil Telur (butir)</TableHead>
                  <TableHead className="font-bold">Catatan / Keterangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/40 text-xs">
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Belum ada data produksi yang tercatat.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item, idx) => {
                    const data = item as Record<string, unknown>;
                    return (
                      <TableRow key={String(data.id || idx)} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="font-semibold text-foreground">
                          {new Date(String(data.tanggal || new Date().toISOString())).toLocaleDateString("id-ID", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                            {String(data.tag || "Kolektif")}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">
                          {Number(data.susu || 0) > 0 ? `${Number(data.susu)} Liter` : "-"}
                        </TableCell>
                        <TableCell className="font-bold text-amber-600">
                          {Number(data.daging || 0) > 0 ? `${Number(data.daging)} kg` : "-"}
                        </TableCell>
                        <TableCell className="font-bold text-purple-600">
                          {Number(data.telur || 0) > 0 ? `${Number(data.telur)} Butir` : "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{String(data.catatan || "-")}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* CHARTS SECTION */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-base">Tren Produksi 6 Bulan</CardTitle>
            <CardDescription>Perbandingan tren hasil susu, telur, dan karkas daging</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="flex h-72 items-center justify-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart
                  data={
                    production.length > 0
                      ? production.map((item) => ({
                          tanggal: String((item as Record<string, unknown>).tanggal || "-"),
                          susu: Number((item as Record<string, number>).susu || 0),
                          telur: Number((item as Record<string, number>).telur || 0),
                          daging: Number((item as Record<string, number>).daging || 0),
                        }))
                      : []
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="tanggal" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="susu" name="Susu (L)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="telur" name="Telur (butir)" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="daging" name="Daging (kg)" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="text-base">Hasil Susu Harian (Liter)</CardTitle>
            <CardDescription>Grafik pemerahan susu per sesi produksi</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="flex h-72 items-center justify-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={
                    production.length > 0
                      ? production.map((item) => ({
                          hari: String((item as Record<string, unknown>).tanggal || "-"),
                          liter: Number((item as Record<string, number>).susu || 0),
                        }))
                      : []
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="hari" stroke="var(--color-muted-foreground)" fontSize={11} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="liter" name="Susu (L)" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* MODAL: INPUT HASIL PRODUKSI */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Plus className="h-5 w-5" /> Catat Hasil Produksi Baru
            </DialogTitle>
            <DialogDescription>
              Input jumlah pemerahan susu, pemotongan karkas daging, atau panen telur.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="tanggal">Tanggal Pengambilan</Label>
                <Input
                  id="tanggal"
                  type="date"
                  value={form.tanggal}
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tag">Tag ID / Kelompok</Label>
                {animals.length > 0 ? (
                  <Select value={form.tag} onValueChange={(val) => setForm({ ...form, tag: val })}>
                    <SelectTrigger id="tag">
                      <SelectValue placeholder="Pilih Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {animals.map((a) => (
                        <SelectItem key={String(a.id)} value={String(a.tag)}>
                          {String(a.tag)} — {String(a.name || a.jenis)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="tag"
                    placeholder="SP-001 atau Kolektif"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value.toUpperCase() })}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label htmlFor="susu" className="text-xs font-bold text-emerald-600">Susu (Liter)</Label>
                <Input
                  id="susu"
                  type="number"
                  step="0.1"
                  value={form.susu}
                  onChange={(e) => setForm({ ...form, susu: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="daging" className="text-xs font-bold text-amber-600">Daging (kg)</Label>
                <Input
                  id="daging"
                  type="number"
                  step="0.1"
                  value={form.daging}
                  onChange={(e) => setForm({ ...form, daging: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="telur" className="text-xs font-bold text-purple-600">Telur (butir)</Label>
                <Input
                  id="telur"
                  type="number"
                  value={form.telur}
                  onChange={(e) => setForm({ ...form, telur: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="catatan">Catatan / Keterangan</Label>
              <Textarea
                id="catatan"
                rows={2}
                value={form.catatan}
                onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                placeholder="Contoh: Pemerahan pagi, kualitas super"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={loading} className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                <Save className="h-4 w-4" /> {loading ? "Menyimpan..." : "Simpan Produksi"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
