import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Pill,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  AlertTriangle,
  History,
  CheckCircle2,
  XCircle,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { DashboardShell } from "@/features/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { downloadCsv } from "@/lib/export";
import {
  loadDaftarObat,
  saveDaftarObat,
  loadRiwayatObat,
  saveRiwayatObat,
  catatPenggunaanObat,
  LIST_JENIS_OBAT,
  LIST_SATUAN_OBAT,
  type Obat,
  type RiwayatPenggunaanObat,
  type JenisObat,
  type SatuanObat,
} from "@/lib/obat-data";

export const Route = createFileRoute("/obat")({
  head: () => ({
    meta: [
      { title: "Obat & Stok — KARTANING" },
      {
        name: "description",
        content: "Kelola persediaan obat ternak, catat penggunaan obat, dan pantau stok obat yang tersedia.",
      },
    ],
  }),
  component: ObatPage,
});

export function ObatPage() {
  const [activeTab, setActiveTab] = useState<"data" | "riwayat">("data");
  const [daftarObat, setDaftarObat] = useState<Obat[]>([]);
  const [riwayat, setRiwayat] = useState<RiwayatPenggunaanObat[]>([]);
  const [query, setQuery] = useState("");
  const [jenisFilter, setJenisFilter] = useState<string>("semua");

  // Modal State Data Obat
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObat, setEditingObat] = useState<Obat | null>(null);
  const [formObat, setFormObat] = useState({
    namaObat: "",
    jenisObat: "Antibiotik" as JenisObat,
    satuan: "Botol" as SatuanObat,
    stok: "10",
    minimumStok: "3",
    fungsiPenggunaan: "",
    caraPenggunaan: "",
    frekuensiPenggunaan: "1",
    status: "Aktif" as "Aktif" | "Nonaktif",
  });

  // Modal State Catat Penggunaan
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [formUsage, setFormUsage] = useState({
    earTag: "",
    namaTernak: "",
    namaObat: "",
    jumlah: "1",
    petugas: "",
    keterangan: "",
  });

  useEffect(() => {
    setDaftarObat(loadDaftarObat());
    setRiwayat(loadRiwayatObat());
  }, []);

  const syncObatData = (newList: Obat[]) => {
    setDaftarObat(newList);
    saveDaftarObat(newList);
  };

  const syncRiwayatData = (newList: RiwayatPenggunaanObat[]) => {
    setRiwayat(newList);
    saveRiwayatObat(newList);
  };

  // Open Modal Tambah/Edit Obat
  const handleOpenAddModal = () => {
    setEditingObat(null);
    setFormObat({
      namaObat: "",
      jenisObat: "Antibiotik",
      satuan: "Botol",
      stok: "10",
      minimumStok: "3",
      fungsiPenggunaan: "",
      caraPenggunaan: "",
      frekuensiPenggunaan: "1",
      status: "Aktif",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (obat: Obat) => {
    setEditingObat(obat);
    setFormObat({
      namaObat: obat.namaObat,
      jenisObat: obat.jenisObat,
      satuan: obat.satuan,
      stok: String(obat.stok),
      minimumStok: String(obat.minimumStok),
      fungsiPenggunaan: obat.fungsiPenggunaan,
      caraPenggunaan: obat.caraPenggunaan,
      frekuensiPenggunaan: String(obat.frekuensiPenggunaan || 1),
      status: obat.status,
    });
    setIsModalOpen(true);
  };

  // Save Obat Form
  const handleSaveObat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formObat.namaObat.trim()) {
      toast.error("Nama Obat wajib diisi.");
      return;
    }

    const stokNum = Math.max(0, parseInt(formObat.stok, 10) || 0);
    const minStokNum = Math.max(0, parseInt(formObat.minimumStok, 10) || 0);
    const frekuensiNum = Math.max(1, parseInt(formObat.frekuensiPenggunaan, 10) || 1);

    if (editingObat) {
      const updatedList = daftarObat.map((item) =>
        item.id === editingObat.id
          ? {
              ...item,
              namaObat: formObat.namaObat.trim(),
              jenisObat: formObat.jenisObat,
              satuan: formObat.satuan,
              stok: stokNum,
              minimumStok: minStokNum,
              fungsiPenggunaan: formObat.fungsiPenggunaan.trim(),
              caraPenggunaan: formObat.caraPenggunaan.trim(),
              frekuensiPenggunaan: frekuensiNum,
              status: formObat.status,
            }
          : item
      );
      syncObatData(updatedList);
      toast.success(`Data obat ${formObat.namaObat} berhasil diperbarui.`);
    } else {
      const newObat: Obat = {
        id: `obt-${Date.now()}`,
        namaObat: formObat.namaObat.trim(),
        jenisObat: formObat.jenisObat,
        satuan: formObat.satuan,
        stok: stokNum,
        minimumStok: minStokNum,
        fungsiPenggunaan: formObat.fungsiPenggunaan.trim(),
        caraPenggunaan: formObat.caraPenggunaan.trim(),
        frekuensiPenggunaan: frekuensiNum,
        status: formObat.status,
      };
      syncObatData([newObat, ...daftarObat]);
      toast.success(`Obat ${formObat.namaObat} berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
  };

  // Delete Obat
  const handleDeleteObat = (id: string, namaObat: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data obat "${namaObat}"?`)) {
      const filtered = daftarObat.filter((item) => item.id !== id);
      syncObatData(filtered);
      toast.success(`Data obat "${namaObat}" telah dihapus.`);
    }
  };

  // Submit Usage Form
  const handleSaveUsage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsage.namaObat) {
      toast.error("Pilih obat yang digunakan.");
      return;
    }

    const jumlahNum = Math.max(1, parseInt(formUsage.jumlah, 10) || 1);

    const res = catatPenggunaanObat({
      earTag: formUsage.earTag.trim(),
      namaTernak: formUsage.namaTernak.trim(),
      namaObat: formUsage.namaObat,
      jumlah: jumlahNum,
      petugas: formUsage.petugas.trim(),
      keterangan: formUsage.keterangan.trim(),
    });

    if (res.success) {
      setDaftarObat(loadDaftarObat());
      setRiwayat(loadRiwayatObat());
      toast.success(`Penggunaan obat ${formUsage.namaObat} berhasil dicatat.`);
      setIsUsageModalOpen(false);
      setFormUsage({
        earTag: "",
        namaTernak: "",
        namaObat: "",
        jumlah: "1",
        petugas: "",
        keterangan: "",
      });
    } else {
      toast.error(res.message || "Gagal mencatat penggunaan obat.");
    }
  };

  // Export Data
  const handleExportObat = () => {
    downloadCsv("data_obat.csv", daftarObat as unknown as Record<string, unknown>[]);
    toast.success("Data Obat berhasil diekspor CSV.");
  };

  const handleExportRiwayat = () => {
    downloadCsv("riwayat_penggunaan_obat.csv", riwayat as unknown as Record<string, unknown>[]);
    toast.success("Riwayat Penggunaan Obat berhasil diekspor CSV.");
  };

  // Filter Data Obat
  const filteredObat = daftarObat.filter((item) => {
    const matchQuery =
      item.namaObat.toLowerCase().includes(query.toLowerCase()) ||
      item.fungsiPenggunaan.toLowerCase().includes(query.toLowerCase()) ||
      item.caraPenggunaan.toLowerCase().includes(query.toLowerCase());
    const matchJenis = jenisFilter === "semua" || item.jenisObat === jenisFilter;
    return matchQuery && matchJenis;
  });

  // Filter Riwayat
  const filteredRiwayat = riwayat.filter((item) => {
    return (
      item.namaObat.toLowerCase().includes(query.toLowerCase()) ||
      item.earTag.toLowerCase().includes(query.toLowerCase()) ||
      item.namaTernak.toLowerCase().includes(query.toLowerCase()) ||
      item.petugas.toLowerCase().includes(query.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(query.toLowerCase())
    );
  });

  const totalStokKritis = daftarObat.filter(
    (item) => item.status === "Aktif" && item.stok <= item.minimumStok
  ).length;

  return (
    <DashboardShell
      title="Obat & Stok"
      subtitle="Kelola persediaan obat ternak dan pantau riwayat pemakaian medis"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === "data" ? (
            <>
              <Button variant="outline" size="sm" onClick={handleExportObat}>
                <Download className="mr-1.5 h-4 w-4" /> Ekspor CSV
              </Button>
              <Button size="sm" onClick={handleOpenAddModal}>
                <Plus className="mr-1.5 h-4 w-4" /> Tambah Obat Baru
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleExportRiwayat}>
                <Download className="mr-1.5 h-4 w-4" /> Ekspor CSV
              </Button>
              <Button size="sm" onClick={() => setIsUsageModalOpen(true)}>
                <Plus className="mr-1.5 h-4 w-4" /> Catat Penggunaan
              </Button>
            </>
          )}
        </div>
      }
    >
      {/* Overview Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
              <Pill className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Item Obat</p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">{daftarObat.length} Jenis</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/20">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Stok Kritis</p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">{totalStokKritis} Item</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-500 border border-blue-500/20">
              <History className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Pemakaian</p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">{riwayat.length} Kali</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary border border-primary/20">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Obat Aktif</p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                {daftarObat.filter((i) => i.status === "Aktif").length} Item
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submenu Navigation Tabs */}
      <div className="mb-6 flex border-b border-border">
        <button
          onClick={() => {
            setActiveTab("data");
            setQuery("");
          }}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
            activeTab === "data"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Pill className="h-4 w-4" /> Data Obat
        </button>
        <button
          onClick={() => {
            setActiveTab("riwayat");
            setQuery("");
          }}
          className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
            activeTab === "riwayat"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <History className="h-4 w-4" /> Riwayat Penggunaan
        </button>
      </div>

      {/* Filters Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={
              activeTab === "data"
                ? "Cari nama obat, fungsi, atau cara penggunaan..."
                : "Cari ear tag, nama ternak, obat, atau petugas..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {activeTab === "data" && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={jenisFilter} onValueChange={setJenisFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Jenis Obat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Jenis</SelectItem>
                {LIST_JENIS_OBAT.map((jenis) => (
                  <SelectItem key={jenis} value={jenis}>
                    {jenis}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* TAB 1: DATA OBAT */}
      {activeTab === "data" && (
        <Card className="border-border/60">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-base font-semibold">Daftar Persediaan Obat Ternak</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Obat</TableHead>
                    <TableHead>Jenis Obat</TableHead>
                    <TableHead>Fungsi & Cara Penggunaan</TableHead>
                    <TableHead>Frekuensi</TableHead>
                    <TableHead className="text-right">Stok Saat Ini</TableHead>
                    <TableHead className="text-right">Min. Stok</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredObat.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                        Tidak ada data obat yang ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredObat.map((obat) => {
                      const isLowStock = obat.stok <= obat.minimumStok;
                      return (
                        <TableRow key={obat.id} className="hover:bg-muted/40">
                          <TableCell className="font-semibold text-foreground">
                            {obat.namaObat}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              {obat.jenisObat}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs text-xs">
                            <p className="font-medium text-foreground">{obat.fungsiPenggunaan || "-"}</p>
                            <p className="mt-0.5 text-muted-foreground">Cara: {obat.caraPenggunaan || "-"}</p>
                          </TableCell>
                          <TableCell className="text-xs">
                            <span className="font-medium text-foreground">{obat.frekuensiPenggunaan} kali sehari</span>
                          </TableCell>
                          <TableCell className="text-right font-mono font-bold tabular-nums">
                            <span className={isLowStock ? "text-destructive font-extrabold" : "text-emerald-600"}>
                              {obat.stok} {obat.satuan}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs tabular-nums text-muted-foreground">
                            {obat.minimumStok} {obat.satuan}
                          </TableCell>
                          <TableCell>
                            {obat.status === "Aktif" ? (
                              <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                                Aktif
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/30">
                                Nonaktif
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenEditModal(obat)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteObat(obat.id, obat.namaObat)}
                                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
      )}

      {/* TAB 2: RIWAYAT PENGGUNAAN */}
      {activeTab === "riwayat" && (
        <Card className="border-border/60">
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-base font-semibold">Catatan Riwayat Penggunaan Obat Ternak</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Nomor Ear Tag</TableHead>
                    <TableHead>Nama Ternak</TableHead>
                    <TableHead>Nama Obat</TableHead>
                    <TableHead className="text-right">Jumlah Digunakan</TableHead>
                    <TableHead>Petugas</TableHead>
                    <TableHead>Keterangan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRiwayat.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                        Belum ada riwayat penggunaan obat yang tercatat.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRiwayat.map((item) => (
                      <TableRow key={item.id} className="hover:bg-muted/40">
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {item.tanggal}
                        </TableCell>
                        <TableCell className="font-mono font-medium text-foreground">
                          {item.earTag}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{item.namaTernak}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {item.namaObat}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-emerald-600">
                          {item.jumlah} {item.satuan}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-foreground">{item.petugas}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{item.keterangan || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DIALOG 1: TAMBAH / EDIT OBAT */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingObat ? "Edit Data Obat" : "Tambah Obat Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveObat} className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="namaObat">Nama Obat *</Label>
                <Input
                  id="namaObat"
                  placeholder="Contoh: Oxytetracycline"
                  value={formObat.namaObat}
                  onChange={(e) => setFormObat({ ...formObat, namaObat: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Jenis Obat</Label>
                <Select
                  value={formObat.jenisObat}
                  onValueChange={(val) => setFormObat({ ...formObat, jenisObat: val as JenisObat })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis Obat" />
                  </SelectTrigger>
                  <SelectContent>
                    {LIST_JENIS_OBAT.map((j) => (
                      <SelectItem key={j} value={j}>
                        {j}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Satuan Kemasan</Label>
                <Select
                  value={formObat.satuan}
                  onValueChange={(val) => setFormObat({ ...formObat, satuan: val as SatuanObat })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Satuan" />
                  </SelectTrigger>
                  <SelectContent>
                    {LIST_SATUAN_OBAT.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="stok">Stok Saat Ini</Label>
                <Input
                  id="stok"
                  type="number"
                  min="0"
                  value={formObat.stok}
                  onChange={(e) => setFormObat({ ...formObat, stok: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="minimumStok">Minimum Stok (Peringatan)</Label>
                <Input
                  id="minimumStok"
                  type="number"
                  min="0"
                  value={formObat.minimumStok}
                  onChange={(e) => setFormObat({ ...formObat, minimumStok: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="frekuensiPenggunaan">Frekuensi Penggunaan (Per Hari)</Label>
                <Input
                  id="frekuensiPenggunaan"
                  type="number"
                  min="1"
                  placeholder="Contoh: 1, 2, 3"
                  value={formObat.frekuensiPenggunaan}
                  onChange={(e) => setFormObat({ ...formObat, frekuensiPenggunaan: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Disimpan sebagai angka. Tampil: "{formObat.frekuensiPenggunaan || 1} kali sehari"</p>
              </div>

              <div className="space-y-1.5">
                <Label>Status Obat</Label>
                <Select
                  value={formObat.status}
                  onValueChange={(val) => setFormObat({ ...formObat, status: val as "Aktif" | "Nonaktif" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="fungsiPenggunaan">Fungsi Penggunaan</Label>
                <Textarea
                  id="fungsiPenggunaan"
                  placeholder="Contoh: Mengobati diare, mencegah infeksi..."
                  value={formObat.fungsiPenggunaan}
                  onChange={(e) => setFormObat({ ...formObat, fungsiPenggunaan: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="caraPenggunaan">Cara Penggunaan</Label>
                <Textarea
                  id="caraPenggunaan"
                  placeholder="Contoh: Diminum, Disuntik, Dicampur pakan..."
                  value={formObat.caraPenggunaan}
                  onChange={(e) => setFormObat({ ...formObat, caraPenggunaan: e.target.value })}
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan Data Obat</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: CATAT PENGGUNAAN OBAT */}
      <Dialog open={isUsageModalOpen} onOpenChange={setIsUsageModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Catat Penggunaan Obat</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveUsage} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="uEarTag">Nomor Ear Tag Ternak</Label>
              <Input
                id="uEarTag"
                placeholder="Contoh: MJ-KB-001"
                value={formUsage.earTag}
                onChange={(e) => setFormUsage({ ...formUsage, earTag: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="uNamaTernak">Nama / Jenis Ternak</Label>
              <Input
                id="uNamaTernak"
                placeholder="Contoh: Kambing Etawa PE"
                value={formUsage.namaTernak}
                onChange={(e) => setFormUsage({ ...formUsage, namaTernak: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Pilih Obat yang Diberikan *</Label>
              <Select
                value={formUsage.namaObat}
                onValueChange={(val) => setFormUsage({ ...formUsage, namaObat: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Obat dari Persediaan" />
                </SelectTrigger>
                <SelectContent>
                  {daftarObat
                    .filter((o) => o.status === "Aktif")
                    .map((o) => (
                      <SelectItem key={o.id} value={o.namaObat}>
                        {o.namaObat} (Stok: {o.stok} {o.satuan})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="uJumlah">Jumlah Digunakan *</Label>
              <Input
                id="uJumlah"
                type="number"
                min="1"
                value={formUsage.jumlah}
                onChange={(e) => setFormUsage({ ...formUsage, jumlah: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="uPetugas">Nama Petugas</Label>
              <Input
                id="uPetugas"
                placeholder="Contoh: Drh. Ahmad / Pak Tono"
                value={formUsage.petugas}
                onChange={(e) => setFormUsage({ ...formUsage, petugas: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="uKeterangan">Keterangan / Alasan Penggunaan</Label>
              <Textarea
                id="uKeterangan"
                placeholder="Contoh: Injeksi pencegahan infeksi pasca perawatan"
                value={formUsage.keterangan}
                onChange={(e) => setFormUsage({ ...formUsage, keterangan: e.target.value })}
                rows={2}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsUsageModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit">Simpan & Kurangi Stok</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
