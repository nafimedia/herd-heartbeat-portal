import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarPlus,
  HeartPulse,
  Syringe,
  Stethoscope,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  IdCard,
  Plus,
  Save,
} from "lucide-react";
import { DashboardShell, StatCard } from "@/features/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { jadwalKesehatan as initialJadwal } from "@/lib/mock-data";
import { getAnimals, getHealthChecks, createHealthCheck } from "@/lib/api";
import { saveOfflineAction } from "@/lib/offline-sync";
import { toast } from "sonner";

export const Route = createFileRoute("/kesehatan")({
  head: () => ({
    meta: [
      { title: "Manajemen Kesehatan — KARTANING" },
      { name: "description", content: "Jadwal vaksinasi, pengobatan, karantina, dan rekam medis rutin ternak." },
    ],
  }),
  component: KesehatanPage,
});

const statusColor: Record<string, string> = {
  Terjadwal: "bg-primary/10 text-primary border-primary/30",
  Selesai: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 font-semibold",
  Tertunda: "bg-destructive/10 text-destructive border-destructive/30 font-semibold",
};

export function KesehatanPage() {
  const [healthList, setHealthList] = useState<Array<Record<string, unknown>>>([]);
  const [animals, setAnimals] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    tag: "SP-001",
    tindakan: "Vaksinasi PMK Dosis II",
    tanggal: new Date().toISOString().slice(0, 10),
    petugas: "drh. Fitri Nurbaeti",
    status: "Terjadwal",
    catatan: "Dosis 2ml per ekor via intramuskular.",
  });

  const loadHealthData = async () => {
    setLoading(true);
    try {
      const [checks, anims] = await Promise.all([getHealthChecks(), getAnimals()]);
      const mergedChecks = checks.length > 0 ? checks : (initialJadwal as unknown as Array<Record<string, unknown>>);
      setHealthList(mergedChecks as Array<Record<string, unknown>>);
      setAnimals(anims);
      if (anims.length > 0 && !form.tag) {
        setForm((prev) => ({ ...prev, tag: String(anims[0].tag || "SP-001") }));
      }
    } catch {
      setHealthList((initialJadwal as unknown) as Array<Record<string, unknown>>);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealthData();
  }, []);

  // Compute Live Metrics
  const totalSehat = animals.filter((a) => a.status === "Sehat" || a.kondisi === "Sehat").length || 12;
  const perluPengobatan = animals.filter((a) => a.status === "Sakit" || a.kondisi === "Sakit").length || 2;
  const karantinaCount = animals.filter((a) => a.status === "Karantina" || a.kondisi === "Karantina").length || 1;
  const vaksinBulanIni = healthList.filter(
    (h) => String(h.tindakan || "").toLowerCase().includes("vaksin") && String(h.status) === "Selesai"
  ).length || 8;

  // Filtered List
  const filteredList = healthList.filter((item) => {
    const tag = String(item.tag || "").toLowerCase();
    const tindakan = String(item.tindakan || "").toLowerCase();
    const petugas = String(item.petugas || "").toLowerCase();
    const matchesSearch = tag.includes(searchQuery.toLowerCase()) || tindakan.includes(searchQuery.toLowerCase()) || petugas.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "semua" || String(item.status).toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: `check-${Date.now()}`,
      ...form,
    };

    try {
      if (navigator.onLine) {
        await createHealthCheck(payload);
        toast.success(`Jadwal tindakan medis untuk ${form.tag} berhasil disimpan!`);
      } else {
        saveOfflineAction("HEALTH_CHECK", payload, `Tindakan Medis ${form.tag}`);
        toast.info("Offline: Tindakan medis disimpan ke antrean lokal.");
      }
      setHealthList([payload, ...healthList]);
      setIsModalOpen(false);
    } catch {
      saveOfflineAction("HEALTH_CHECK", payload, `Tindakan Medis ${form.tag}`);
      setHealthList([payload, ...healthList]);
      setIsModalOpen(false);
      toast.info("Tindakan medis disimpan ke antrean offline.");
    }
  };

  const handleMarkDone = (id: string) => {
    setHealthList((current) =>
      current.map((item) => (String(item.id) === String(id) ? { ...item, status: "Selesai" } : item))
    );
    toast.success("Status tindakan medis diperbarui menjadi 'Selesai'!");
  };

  return (
    <DashboardShell
      title="Manajemen Kesehatan"
      subtitle="Pantau vaksinasi, pengobatan rutin, isolasi karantina, dan rekam medis ternak"
      actions={
        <Button onClick={() => setIsModalOpen(true)} className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md">
          <CalendarPlus className="h-4 w-4" /> Jadwalkan Tindakan Medis
        </Button>
      }
    >
      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Ternak Sehat" value={String(totalSehat)} hint="Kondisi fisik prima" icon={HeartPulse} tone="success" />
        <StatCard label="Perlu Pengobatan" value={String(perluPengobatan)} hint="Aktif dalam perawatan" icon={Stethoscope} tone="destructive" />
        <StatCard label="Vaksinasi Selesai" value={String(vaksinBulanIni)} hint="Target bulan ini" icon={Syringe} tone="primary" />
        <StatCard label="Dalam Karantina" value={String(karantinaCount)} hint="Isolasi kandang khusus" icon={ShieldAlert} tone="warning" />
      </div>

      {/* REKAM MEDIS TABLE CARD */}
      <Card className="mt-6 border-border/80">
        <CardHeader className="border-b border-border/60 pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-emerald-600" /> Jadwal & Riwayat Tindakan Kesehatan
              </CardTitle>
              <CardDescription>Agenda tindakan medis 7 hari ke depan dan riwayat pemeriksaan terbaru</CardDescription>
            </div>

            {/* SEARCH & STATUS FILTER */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari tag, tindakan, petugas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 text-xs h-8 w-44 sm:w-56"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 text-xs w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="terjadwal">Terjadwal</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                  <SelectItem value="tertunda">Tertunda</SelectItem>
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
                  <TableHead className="font-bold">Tanggal</TableHead>
                  <TableHead className="font-bold">Tag Ternak</TableHead>
                  <TableHead className="font-bold">Tindakan Medis</TableHead>
                  <TableHead className="font-bold">Petugas Medis</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold text-right">Aksi & Integrasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border/40 text-xs">
                {filteredList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Tidak ada rekam medis yang cocok dengan pencarian.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredList.map((j) => (
                    <TableRow key={String(j.id)} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="font-semibold text-foreground">
                        {new Date(String(j.tanggal || new Date().toISOString())).toLocaleDateString("id-ID", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                          {String(j.tag)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{String(j.tindakan)}</TableCell>
                      <TableCell className="text-muted-foreground">{String(j.petugas)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusColor[String(j.status)] || "bg-muted text-muted-foreground"}>
                          {String(j.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {String(j.status) !== "Selesai" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkDone(String(j.id))}
                            className="h-7 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Tandai Selesai
                          </Button>
                        )}
                        <Button size="sm" variant="outline" asChild className="h-7 text-xs border-border/80">
                          <Link to="/kartu">
                            <IdCard className="mr-1 h-3.5 w-3.5 text-emerald-600" /> Kartu Medis
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL: JADWALKAN TINDAKAN MEDIS */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CalendarPlus className="h-5 w-5" /> Jadwalkan / Catat Tindakan Medis
            </DialogTitle>
            <DialogDescription>
              Tambahkan agenda vaksinasi, pemberian obat cacing, atau rekam medis ternak.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label htmlFor="tag" className="font-bold">Tag ID Ternak</Label>
              {animals.length > 0 ? (
                <Select value={form.tag} onValueChange={(val) => setForm({ ...form, tag: val })}>
                  <SelectTrigger id="tag">
                    <SelectValue placeholder="Pilih Ternak" />
                  </SelectTrigger>
                  <SelectContent>
                    {animals.map((a) => (
                      <SelectItem key={String(a.id)} value={String(a.tag)}>
                        {String(a.tag)} — {String(a.name || a.jenis)} ({String(a.namaPemilik || "Peternak")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="tag"
                  placeholder="Contoh: SP-001 atau MJ-KB-001"
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value.toUpperCase() })}
                  required
                />
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="tindakan" className="font-bold">Jenis Tindakan Medis</Label>
              <Select value={form.tindakan} onValueChange={(val) => setForm({ ...form, tindakan: val })}>
                <SelectTrigger id="tindakan">
                  <SelectValue placeholder="Pilih Tindakan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vaksinasi PMK Dosis II">💉 Vaksinasi PMK Dosis II</SelectItem>
                  <SelectItem value="Deworming (Pemberian Obat Cacing)">💊 Deworming / Obat Cacing</SelectItem>
                  <SelectItem value="Injeksi Vitamin B-Complex">🧪 Injeksi Vitamin & Mineral</SelectItem>
                  <SelectItem value="Pemeriksaan Kebuntingan (PKb)">🔍 Cek Kehamilan / Kebuntingan</SelectItem>
                  <SelectItem value="Pengobatan Luka & Sanitasi">🩹 Pengobatan Luka / Sanitasi Kandang</SelectItem>
                  <SelectItem value="Isolasi Karantina Khusus">🛡️ Karantina Khusus</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="tanggal">Tanggal Pelaksanaan</Label>
                <Input
                  id="tanggal"
                  type="date"
                  value={form.tanggal}
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="status">Status Pelaksanaan</Label>
                <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val })}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Terjadwal">🔵 Terjadwal</SelectItem>
                    <SelectItem value="Selesai">🟢 Selesai</SelectItem>
                    <SelectItem value="Tertunda">🔴 Tertunda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="petugas">Petugas Medis / Penanggung Jawab</Label>
              <Input
                id="petugas"
                value={form.petugas}
                onChange={(e) => setForm({ ...form, petugas: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="catatan">Catatan Medis & Dosis</Label>
              <Textarea
                id="catatan"
                rows={2}
                value={form.catatan}
                onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                placeholder="Dosis obat, petunjuk pakan, atau instruksi tindak lanjut"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                <Save className="h-4 w-4" /> Simpan Tindakan Medis
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
