import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Milk, Beef, Egg, TrendingUp, Save, Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardShell, StatCard } from "@/features/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { createProduction, getProduction } from "@/lib/api";
import { downloadCsv } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/produksi")({
  head: () => ({
    meta: [
      { title: "Produksi — TernakPro" },
      { name: "description", content: "Catatan produksi susu, daging, dan telur dari peternakan." },
    ],
  }),
  component: ProduksiPage,
});

function ProduksiPage() {
  const [production, setProduction] = useState<Array<Record<string, unknown>>>([]);
  const [form, setForm] = useState({ tanggal: new Date().toISOString().slice(0, 10), susu: "0", daging: "0", telur: "0", catatan: "" });
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingData(true);

    getProduction()
      .then((data) => {
        if (isMounted) {
          setProduction(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProduction([]);
          toast.error("Gagal memuat data produksi.");
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

  const filtered = production.filter((item) => {
    const data = item as Record<string, unknown>;
    const haystack = [String(data.tanggal || ""), String(data.catatan || "")].join(" ").toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const susuTotal = production.reduce((sum, item) => sum + Number((item as Record<string, number>).susu || 0), 0);
  const dagingTotal = production.reduce((sum, item) => sum + Number((item as Record<string, number>).daging || 0), 0);
  const telurTotal = production.reduce((sum, item) => sum + Number((item as Record<string, number>).telur || 0), 0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const created = await createProduction({ ...form, susu: Number(form.susu), daging: Number(form.daging), telur: Number(form.telur) });
      setProduction((current) => [...current, created]);
      setForm({ tanggal: new Date().toISOString().slice(0, 10), susu: "0", daging: "0", telur: "0", catatan: "" });
      toast.success("Data produksi berhasil disimpan.");
    } catch {
      toast.error("Gagal menyimpan data produksi.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    downloadCsv("produksi.csv", filtered.length > 0 ? filtered : production);
    toast.success("Data produksi berhasil diekspor sebagai CSV.");
  };

  return (
    <DashboardShell
      title="Produksi"
      subtitle="Ringkasan hasil susu, daging, dan telur"
      actions={
        <Button variant="outline" onClick={handleExport}>
          <Download /> Ekspor
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Susu Bulan Ini" value={`${susuTotal.toLocaleString("id-ID")} L`} delta={4.8} icon={Milk} tone="primary" />
        <StatCard label="Daging (Karkas)" value={`${dagingTotal.toLocaleString("id-ID")} kg`} delta={7.9} icon={Beef} tone="accent" />
        <StatCard label="Telur" value={telurTotal.toLocaleString("id-ID")} hint="butir" delta={5.2} icon={Egg} tone="warning" />
        <StatCard label="Rata-rata Harian Susu" value={`${Math.round(susuTotal / Math.max(1, production.length)).toLocaleString("id-ID")} L`} delta={2.1} icon={TrendingUp} tone="success" />
      </div>

      <Card className="mt-6 mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Input type="date" value={form.tanggal} onChange={(e) => setForm((current) => ({ ...current, tanggal: e.target.value }))} />
            <Input type="number" placeholder="Susu (L)" value={form.susu} onChange={(e) => setForm((current) => ({ ...current, susu: e.target.value }))} />
            <Input type="number" placeholder="Daging (kg)" value={form.daging} onChange={(e) => setForm((current) => ({ ...current, daging: e.target.value }))} />
            <Input type="number" placeholder="Telur (butir)" value={form.telur} onChange={(e) => setForm((current) => ({ ...current, telur: e.target.value }))} />
            <Input placeholder="Catatan" value={form.catatan} onChange={(e) => setForm((current) => ({ ...current, catatan: e.target.value }))} />
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" /> {loading ? "Menyimpan..." : "Simpan Produksi"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Input
              placeholder="Cari berdasarkan tanggal atau catatan..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="md:max-w-sm"
            />
            <div className="ml-auto text-sm text-muted-foreground">
              Menampilkan <span className="font-medium text-foreground">{filtered.length}</span> entri
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tren Produksi 6 Bulan</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="flex h-75 items-center justify-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={production.length > 0 ? production.map((item) => ({
                  tanggal: String((item as Record<string, unknown>).tanggal || "-"),
                  susu: Number((item as Record<string, number>).susu || 0),
                  telur: Number((item as Record<string, number>).telur || 0),
                  daging: Number((item as Record<string, number>).daging || 0),
                })) : []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="tanggal" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="susu" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="telur" stroke="var(--color-accent)" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="daging" stroke="var(--color-chart-3)" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Susu Mingguan (Liter)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="flex h-75 items-center justify-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={production.length > 0 ? production.map((item) => ({ hari: String((item as Record<string, unknown>).tanggal || "-"), liter: Number((item as Record<string, number>).susu || 0) })) : []}>
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
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
