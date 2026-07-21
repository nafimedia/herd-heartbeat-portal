import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Wheat, TriangleAlert, Package, Plus, Save, Download } from "lucide-react";
import { DashboardShell, StatCard } from "@/features/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { createFeedStock, getFeedStock } from "@/lib/api";
import { downloadCsv } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/pakan")({
  head: () => ({
    meta: [
      { title: "Pakan & Stok — TernakPro" },
      { name: "description", content: "Manajemen stok pakan, konsentrat, dan suplemen ternak." },
    ],
  }),
  component: PakanPage,
});

function PakanPage() {
  const [feedStock, setFeedStock] = useState<Array<Record<string, unknown>>>([]);
  const [form, setForm] = useState({ nama: "", kategori: "Konsentrat", stok: "0", satuan: "kg", minimum: "0", supplier: "" });
  const [query, setQuery] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState<string>("semua");
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingData(true);

    getFeedStock()
      .then((data) => {
        if (isMounted) {
          setFeedStock(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setFeedStock([]);
          toast.error("Gagal memuat data pakan.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingData(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = feedStock.filter((s) => {
    const data = s as Record<string, unknown>;
    const haystack = [String(data.nama || ""), String(data.kategori || ""), String(data.supplier || "")].join(" ").toLowerCase();
    const match = haystack.includes(query.toLowerCase());
    const kategoriOk = kategoriFilter === "semua" || data.kategori === kategoriFilter;
    return match && kategoriOk;
  });

  const kritis = feedStock.filter((s) => Number((s as Record<string, number>).stok || 0) < Number((s as Record<string, number>).minimum || 0)).length;
  const totalItem = feedStock.length;
  const totalStok = feedStock.reduce((a, s) => a + Number((s as Record<string, number>).stok || 0), 0);

  const handleExport = () => {
    downloadCsv("pakan.csv", filtered.length > 0 ? filtered : feedStock);
    toast.success("Data pakan berhasil diekspor sebagai CSV.");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const created = await createFeedStock({ ...form, stok: Number(form.stok), minimum: Number(form.minimum) });
      setFeedStock((current) => [...current, created]);
      setForm({ nama: "", kategori: "Konsentrat", stok: "0", satuan: "kg", minimum: "0", supplier: "" });
      toast.success("Stok pakan berhasil disimpan.");
    } catch {
      toast.error("Gagal menyimpan stok pakan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell
      title="Pakan & Stok"
      subtitle="Pantau ketersediaan pakan, konsentrat, dan suplemen"
      actions={
        <>
          <Button variant="outline" onClick={handleExport}>
            <Download /> Ekspor
          </Button>
          <Button>
            <Plus /> Tambah Stok
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Item" value={String(totalItem)} hint="Jenis pakan terdaftar" icon={Package} tone="primary" />
        <StatCard label="Total Stok" value={totalStok.toLocaleString("id-ID")} hint="kg + pcs gabungan" icon={Wheat} tone="accent" />
        <StatCard label="Item Kritis" value={String(kritis)} hint="Di bawah stok minimum" icon={TriangleAlert} tone="warning" />
      </div>

      <Card className="mt-6 mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Input placeholder="Nama pakan" value={form.nama} onChange={(e) => setForm((current) => ({ ...current, nama: e.target.value }))} required />
            <Select value={form.kategori} onValueChange={(value) => setForm((current) => ({ ...current, kategori: value }))}>
              <SelectTrigger><SelectValue placeholder="Kategori" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Hijauan">Hijauan</SelectItem>
                <SelectItem value="Konsentrat">Konsentrat</SelectItem>
                <SelectItem value="Fermentasi">Fermentasi</SelectItem>
                <SelectItem value="Suplemen">Suplemen</SelectItem>
              </SelectContent>
            </Select>
            <Input type="number" placeholder="Stok" value={form.stok} onChange={(e) => setForm((current) => ({ ...current, stok: e.target.value }))} />
            <Input placeholder="Satuan" value={form.satuan} onChange={(e) => setForm((current) => ({ ...current, satuan: e.target.value }))} />
            <Input type="number" placeholder="Minimum" value={form.minimum} onChange={(e) => setForm((current) => ({ ...current, minimum: e.target.value }))} />
            <Input placeholder="Supplier" value={form.supplier} onChange={(e) => setForm((current) => ({ ...current, supplier: e.target.value }))} />
            <Button type="submit" disabled={loading} className="md:col-span-2 xl:col-span-1">
              <Save className="mr-2 h-4 w-4" /> {loading ? "Menyimpan..." : "Simpan Stok"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Daftar Stok Pakan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
            <Input
              placeholder="Cari nama, kategori, atau supplier..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="md:max-w-sm"
            />
            <Select value={kategoriFilter} onValueChange={setKategoriFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Semua kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua kategori</SelectItem>
                <SelectItem value="Hijauan">Hijauan</SelectItem>
                <SelectItem value="Konsentrat">Konsentrat</SelectItem>
                <SelectItem value="Fermentasi">Fermentasi</SelectItem>
                <SelectItem value="Suplemen">Suplemen</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto text-sm text-muted-foreground">
              Menampilkan <span className="font-medium text-foreground">{filtered.length}</span> item
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Pakan</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="w-64">Level Stok</TableHead>
                  <TableHead className="text-right">Stok</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingData ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {Array.from({ length: 6 }).map((__, cellIndex) => (
                        <TableCell key={`skeleton-cell-${cellIndex}`}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Tidak ada stok yang cocok dengan filter.
                    </TableCell>
                  </TableRow>
                ) : feedStock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Belum ada stok pakan. Tambahkan data pertama Anda.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s) => {
                    const data = s as Record<string, unknown>;
                    const stok = Number(data.stok || 0);
                    const minimum = Number(data.minimum || 0);
                    const ratio = Math.min(100, (stok / (minimum * 3 || 1)) * 100);
                    const kritis = stok < minimum;
                    return (
                      <TableRow key={String(data.id)}>
                        <TableCell className="font-medium">{String(data.nama || "-")}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{String(data.kategori || "-")}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{String(data.supplier || "-")}</TableCell>
                        <TableCell>
                          <Progress value={ratio} className={kritis ? "[&>div]:bg-destructive" : "[&>div]:bg-success"} />
                          <div className="mt-1 text-xs text-muted-foreground">Min. {minimum} {String(data.satuan || "-")}</div>
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium tabular-nums">
                          {stok.toLocaleString("id-ID")} {String(data.satuan || "-")}
                        </TableCell>
                        <TableCell>
                          {kritis ? (
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                              Kritis
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-success/15 text-success border-success/30">
                              Aman
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
    </DashboardShell>
  );
}
