import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Wheat, TriangleAlert, Package, Plus, Save, Download, Search, Filter, CheckCircle2 } from "lucide-react";
import { DashboardShell, StatCard } from "@/features/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { createFeedStock, getFeedStock } from "@/lib/api";
import { saveOfflineAction } from "@/lib/offline-sync";
import { downloadCsv } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/pakan")({
  head: () => ({
    meta: [
      { title: "Pakan & Stok — KARTANING" },
      { name: "description", content: "Manajemen persediaan pakan ternak, konsentrat, fermentasi, dan suplemen." },
    ],
  }),
  component: PakanPage,
});

export function PakanPage() {
  const [feedStock, setFeedStock] = useState<Array<Record<string, unknown>>>([]);
  const [query, setQuery] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState<string>("semua");
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    nama: "",
    kategori: "Konsentrat",
    stok: "100",
    satuan: "kg",
    minimum: "30",
    supplier: "PT Mindajaya Feed",
  });

  const loadFeedData = async () => {
    setIsLoadingData(true);
    try {
      const data = await getFeedStock();
      setFeedStock(data);
    } catch {
      setFeedStock([]);
      toast.error("Gagal memuat data pakan.");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadFeedData();
  }, []);

  const filtered = feedStock.filter((s) => {
    const data = s as Record<string, unknown>;
    const haystack = [String(data.nama || ""), String(data.kategori || ""), String(data.supplier || "")].join(" ").toLowerCase();
    const match = haystack.includes(query.toLowerCase());
    
    let kategoriOk = true;
    if (kategoriFilter === "kritis") {
      kategoriOk = Number(data.stok || 0) < Number(data.minimum || 0);
    } else if (kategoriFilter !== "semua") {
      kategoriOk = data.kategori === kategoriFilter;
    }

    return match && kategoriOk;
  });

  const kritisCount = feedStock.filter(
    (s) => Number((s as Record<string, number>).stok || 0) < Number((s as Record<string, number>).minimum || 0)
  ).length;
  const totalItem = feedStock.length;
  const totalStok = feedStock.reduce((a, s) => a + Number((s as Record<string, number>).stok || 0), 0);

  const handleExport = () => {
    downloadCsv("stok-pakan.csv", filtered.length > 0 ? filtered : feedStock);
    toast.success("Data pakan berhasil diekspor sebagai CSV.");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.nama) {
      toast.error("Nama pakan wajib diisi!");
      return;
    }

    setLoading(true);
    const payload = {
      id: `feed-${Date.now()}`,
      nama: form.nama,
      kategori: form.kategori,
      stok: Number(form.stok) || 0,
      satuan: form.satuan || "kg",
      minimum: Number(form.minimum) || 0,
      supplier: form.supplier || "Pemasok Lokal",
    };

    try {
      if (navigator.onLine) {
        const created = await createFeedStock(payload);
        setFeedStock((current) => [...current, created]);
        toast.success(`Stok pakan ${form.nama} berhasil disimpan!`);
      } else {
        saveOfflineAction("FEED_USAGE", payload, `Tambah Stok Pakan ${form.nama}`);
        setFeedStock((current) => [...current, payload]);
        toast.info("Offline: Stok pakan disimpan ke antrean lokal.");
      }
      setForm({ nama: "", kategori: "Konsentrat", stok: "100", satuan: "kg", minimum: "30", supplier: "PT Mindajaya Feed" });
      setIsModalOpen(false);
    } catch {
      saveOfflineAction("FEED_USAGE", payload, `Tambah Stok Pakan ${form.nama}`);
      setFeedStock((current) => [...current, payload]);
      setIsModalOpen(false);
      toast.info("Stok pakan disimpan ke antrean offline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell
      title="Pakan & Stok"
      subtitle="Pantau persediaan pakan ternak, konsentrat, silase fermentasi, dan suplemen"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-1.5">
            <Download className="h-4 w-4" /> Ekspor CSV
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md">
            <Plus className="h-4 w-4" /> Tambah Stok Pakan
          </Button>
        </div>
      }
    >
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Jenis Pakan" value={String(totalItem)} hint="Item terdaftar di gudang" icon={Package} tone="primary" />
        <StatCard label="Total Stok Gabungan" value={`${totalStok.toLocaleString("id-ID")} kg`} hint="Tersedia di gudang/silo" icon={Wheat} tone="accent" />
        <StatCard label="Pakan Kritis" value={String(kritisCount)} hint="Di bawah batas minimum" icon={TriangleAlert} tone="warning" />
      </div>

      {/* TABLE CARD */}
      <Card className="mt-6 border-border/80">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wheat className="h-5 w-5 text-emerald-600" /> Daftar Persediaan Stok Pakan
              </CardTitle>
              <CardDescription>Status ketersediaan stok pakan, batas peringatan minimum, dan supplier</CardDescription>
            </div>

            {/* SEARCH & CATEGORY FILTER */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari pakan, kategori, supplier..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-8 text-xs h-8 w-48 sm:w-60"
                />
              </div>

              <Select value={kategoriFilter} onValueChange={setKategoriFilter}>
                <SelectTrigger className="h-8 text-xs w-36">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Kategori</SelectItem>
                  <SelectItem value="Hijauan">🌾 Hijauan</SelectItem>
                  <SelectItem value="Konsentrat">🌽 Konsentrat</SelectItem>
                  <SelectItem value="Fermentasi">🧪 Fermentasi / Silase</SelectItem>
                  <SelectItem value="Suplemen">💊 Suplemen / Premix</SelectItem>
                  <SelectItem value="kritis">⚠️ Item Kritis ({kritisCount})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Nama Pakan</TableHead>
                  <TableHead className="font-bold">Kategori</TableHead>
                  <TableHead className="font-bold">Supplier / Pemasok</TableHead>
                  <TableHead className="w-64 font-bold">Tingkat Ketersediaan Stok</TableHead>
                  <TableHead className="text-right font-bold">Stok Tersedia</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/40 text-xs">
                {isLoadingData ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {Array.from({ length: 6 }).map((__, cellIndex) => (
                        <TableCell key={`cell-${cellIndex}`}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Tidak ada stok pakan yang cocok dengan filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s) => {
                    const data = s as Record<string, unknown>;
                    const stok = Number(data.stok || 0);
                    const minimum = Number(data.minimum || 0);
                    const ratio = Math.min(100, (stok / (minimum * 3 || 1)) * 100);
                    const isKritis = stok < minimum;
                    return (
                      <TableRow key={String(data.id)} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="font-bold text-foreground">{String(data.nama || "-")}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                            {String(data.kategori || "Konsentrat")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{String(data.supplier || "-")}</TableCell>
                        <TableCell>
                          <Progress value={ratio} className={isKritis ? "[&>div]:bg-destructive" : "[&>div]:bg-emerald-600"} />
                          <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>Min. Safe: {minimum} {String(data.satuan || "kg")}</span>
                            <span>{Math.round(ratio)}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-foreground">
                          {stok.toLocaleString("id-ID")} {String(data.satuan || "kg")}
                        </TableCell>
                        <TableCell>
                          {isKritis ? (
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 font-bold animate-pulse">
                              ⚠️ Kritis
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 font-bold">
                              🟢 Safe / Aman
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL: TAMBAH STOK PAKAN */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Plus className="h-5 w-5" /> Tambah Persediaan Stok Pakan
            </DialogTitle>
            <DialogDescription>
              Input item pakan, konsentrat, fermentasi silase, atau suplemen baru ke gudang.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label htmlFor="nama" className="font-bold">Nama Pakan</Label>
              <Input
                id="nama"
                placeholder="Contoh: Konsentrat PE Super, Silase Jagung"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="kategori" className="font-bold">Kategori Pakan</Label>
                <Select value={form.kategori} onValueChange={(val) => setForm({ ...form, kategori: val })}>
                  <SelectTrigger id="kategori">
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hijauan">🌾 Hijauan Segar</SelectItem>
                    <SelectItem value="Konsentrat">🌽 Konsentrat Granul</SelectItem>
                    <SelectItem value="Fermentasi">🧪 Fermentasi Silase</SelectItem>
                    <SelectItem value="Suplemen">💊 Suplemen / Premix</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="satuan">Satuan Pakan</Label>
                <Input
                  id="satuan"
                  placeholder="kg / sak / ton"
                  value={form.satuan}
                  onChange={(e) => setForm({ ...form, satuan: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="stok">Jumlah Stok Masuk</Label>
                <Input
                  id="stok"
                  type="number"
                  placeholder="100"
                  value={form.stok}
                  onChange={(e) => setForm({ ...form, stok: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="minimum">Stok Minimum (Alert)</Label>
                <Input
                  id="minimum"
                  type="number"
                  placeholder="30"
                  value={form.minimum}
                  onChange={(e) => setForm({ ...form, minimum: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="supplier">Supplier / Pemasok</Label>
              <Input
                id="supplier"
                placeholder="Contoh: PT Mindajaya Feed, Koperasi Desa"
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={loading} className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                <Save className="h-4 w-4" /> {loading ? "Menyimpan..." : "Simpan Stok Pakan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
