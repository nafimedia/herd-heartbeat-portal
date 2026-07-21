import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Filter, Download, Save, Pencil, Trash2 } from "lucide-react";
import { DashboardShell } from "@/features/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { createAnimal, deleteAnimal, getAnimals, updateAnimal } from "@/lib/api";
import { validateAnimalForm } from "@/lib/validation";
import { downloadCsv } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/ternak")({
  head: () => ({
    meta: [
      { title: "Data Ternak — TernakPro" },
      { name: "description", content: "Kelola daftar ternak dengan profil lengkap, identitas pemilik, ukuran tubuh, dan riwayat kesehatan." },
    ],
  }),
  component: TernakPage,
});

const statusVariant: Record<StatusTernak, string> = {
  Sehat: "bg-success/15 text-success border-success/30",
  Sakit: "bg-destructive/10 text-destructive border-destructive/30",
  Bunting: "bg-primary/10 text-primary border-primary/30",
  Karantina: "bg-warning/20 text-warning-foreground border-warning/40",
};

function buildHealthHistory(value: string) {
  return value
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [rawDate, ...rest] = entry.split("|");
      const tanggal = rawDate?.trim() || new Date().toISOString().slice(0, 10);
      const keterangan = rest.join("|").trim() || entry;
      return { tanggal, keterangan, status: "Catatan" };
    });
}

function normalizeAnimalRecord(data: Record<string, unknown>) {
  return {
    ...data,
    jenisKelamin: String(data.jenisKelamin ?? data.jenis_kelamin ?? ""),
    tanggalMasuk: String(data.tanggalMasuk ?? data.tanggal_masuk ?? ""),
    umurKambing: String(data.umurKambing ?? data.umur_kambing ?? ""),
    ciriCiri: String(data.ciriCiri ?? data.ciri_ciri ?? ""),
    namaPemilik: String(data.namaPemilik ?? data.nama_pemilik ?? ""),
    umurPemilik: String(data.umurPemilik ?? data.umur_pemilik ?? ""),
    tinggiBadan: String(data.tinggiBadan ?? data.tinggi_badan ?? ""),
    panjangBadan: String(data.panjangBadan ?? data.panjang_badan ?? ""),
    lebarDada: String(data.lebarDada ?? data.lebar_dada ?? ""),
    riwayatSingkat: String(data.riwayatSingkat ?? data.riwayat_singkat ?? ""),
    fotoKambing: String(data.fotoKambing ?? data.foto_kambing ?? ""),
    catatan: String(data.catatan ?? ""),
    status: String(data.status ?? ""),
    kandang: String(data.kandang ?? ""),
  };
}

export function TernakPage() {
  const [query, setQuery] = useState("");
  const [jenisFilter, setJenisFilter] = useState<string>("semua");
  const [statusFilter, setStatusFilter] = useState<string>("semua");
  const [ownerFilter, setOwnerFilter] = useState<string>("semua");
  const [animals, setAnimals] = useState<Array<Record<string, unknown>>>([]);
  const [form, setForm] = useState({
    tag: "",
    name: "",
    jenis: "Kambing",
    ras: "Etawa",
    jenisKelamin: "Betina",
    umur: "0",
    berat: "0",
    kandang: "A-01",
    status: "Sehat",
    tanggalMasuk: new Date().toISOString().slice(0, 10),
    umurKambing: "",
    ciriCiri: "",
    namaPemilik: "",
    umurPemilik: "",
    tinggiBadan: "",
    panjangBadan: "",
    lebarDada: "",
    kondisi: "Sehat",
    nafsuMakan: "Baik",
    feses: "Normal",
    riwayatSingkat: "",
    catatan: "",
    fotoKambing: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingData(true);

    getAnimals()
      .then((data) => {
        if (isMounted) {
          setAnimals(data.map((item) => normalizeAnimalRecord(item as Record<string, unknown>)));
        }
      })
      .catch(() => {
        if (isMounted) {
          setAnimals([]);
          toast.error("Gagal memuat data ternak.");
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

  const filtered = animals.filter((t) => {
    const data = t as Record<string, string | number>;
    const q = query.toLowerCase();
    const haystack = [
      String(data.tag || ""),
      String(data.name || ""),
      String(data.ras || ""),
      String(data.kandang || ""),
      String(data.status || ""),
      String(data.jenis || ""),
      String(data.namaPemilik || ""),
      String(data.catatan || ""),
    ].join(" ").toLowerCase();
    const match = haystack.includes(q);
    const jenisOk = jenisFilter === "semua" || data.jenis === jenisFilter;
    const statusOk = statusFilter === "semua" || String(data.status || "") === statusFilter;
    const ownerOk = ownerFilter === "semua" || String(data.namaPemilik || "") === ownerFilter;
    return match && jenisOk && statusOk && ownerOk;
  });

  const selectedAnimal = animals.find((item) => String(item.id) === selectedAnimalId) || null;
  const detailHistory = Array.isArray((selectedAnimal as Record<string, unknown> | null)?.riwayatKesehatan)
    ? ((selectedAnimal as Record<string, unknown>).riwayatKesehatan as Array<Record<string, string>>)
    : buildHealthHistory(String((selectedAnimal as Record<string, unknown> | null)?.riwayatSingkat || ""));

  const handleExport = () => {
    downloadCsv("ternak.csv", filtered.length > 0 ? filtered : animals);
    toast.success("Data ternak berhasil diekspor sebagai CSV.");
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setForm((current) => ({ ...current, fotoKambing: result }));
      toast.success(`Foto ${file.name} siap disimpan.`);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setForm({
      tag: "",
      name: "",
      jenis: "Kambing",
      ras: "Etawa",
      jenisKelamin: "Betina",
      umur: "0",
      berat: "0",
      kandang: "A-01",
      status: "Sehat",
      tanggalMasuk: new Date().toISOString().slice(0, 10),
      umurKambing: "",
      ciriCiri: "",
      namaPemilik: "",
      umurPemilik: "",
      tinggiBadan: "",
      panjangBadan: "",
      lebarDada: "",
      kondisi: "Sehat",
      nafsuMakan: "Baik",
      feses: "Normal",
      riwayatSingkat: "",
      catatan: "",
      fotoKambing: "",
    });
    setErrors({});
    setIsEditing(false);
    setEditingId(null);
  };

  const buildAnimalPayload = (riwayatKesehatan: Array<Record<string, string>>) => ({
    ...form,
    name: form.tag || form.name || "Kambing",
    tag: form.tag,
    jenis: form.jenis || "Kambing",
    ras: form.ras || "Etawa",
    jenisKelamin: form.jenisKelamin,
    umur: Number(form.umurKambing || form.umur || 0),
    berat: Number(form.berat || 0),
    status: form.kondisi || form.status,
    tanggalMasuk: form.tanggalMasuk,
    umurKambing: form.umurKambing,
    ciriCiri: form.ciriCiri,
    namaPemilik: form.namaPemilik,
    umurPemilik: form.umurPemilik,
    tinggiBadan: form.tinggiBadan,
    panjangBadan: form.panjangBadan,
    lebarDada: form.lebarDada,
    kondisi: form.kondisi,
    nafsuMakan: form.nafsuMakan,
    feses: form.feses,
    riwayatSingkat: form.riwayatSingkat,
    riwayatKesehatan,
    catatan: form.catatan,
    fotoKambing: form.fotoKambing,
    kandang: form.kandang || "A-01",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateAnimalForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const riwayatKesehatan = buildHealthHistory(form.riwayatSingkat || "");
      const payload = buildAnimalPayload(riwayatKesehatan);
      const sanitizedPayload = {
        ...payload,
        namaPemilik: String(payload.namaPemilik ?? "").trim(),
        umurPemilik: String(payload.umurPemilik ?? "").trim(),
        catatan: String(payload.catatan ?? "").trim(),
      };
      if (isEditing && editingId) {
        const updated = await updateAnimal(editingId, sanitizedPayload);
        const normalizedUpdated = normalizeAnimalRecord(updated as Record<string, unknown>);
        setAnimals((current) => current.map((item) => (String(item.id) === editingId ? { ...item, ...normalizedUpdated, namaPemilik: sanitizedPayload.namaPemilik, umurPemilik: sanitizedPayload.umurPemilik, catatan: sanitizedPayload.catatan } : item)));
        setSelectedAnimalId(String(editingId));
        toast.success("Data ternak berhasil diperbarui.");
      } else {
        const created = await createAnimal(sanitizedPayload);
        const normalizedCreated = normalizeAnimalRecord(created as Record<string, unknown>);
        setAnimals((current) => [...current, normalizedCreated]);
        setSelectedAnimalId(String(created.id));
        toast.success("Data ternak berhasil disimpan.");
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save animal", error);
      toast.error("Gagal menyimpan data ternak. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (animal: Record<string, unknown>) => {
    const data = animal as Record<string, string | number | undefined>;
    setForm({
      tag: String(data.tag || ""),
      name: String(data.name || ""),
      jenis: String(data.jenis || "Kambing"),
      ras: String(data.ras || "Etawa"),
      jenisKelamin: String(data.jenisKelamin || "Betina"),
      umur: String(data.umur || "0"),
      berat: String(data.berat || "0"),
      kandang: String(data.kandang || "A-01"),
      status: String(data.status || "Sehat"),
      tanggalMasuk: String(data.tanggalMasuk || new Date().toISOString().slice(0, 10)),
      umurKambing: String(data.umurKambing || ""),
      ciriCiri: String(data.ciriCiri || ""),
      namaPemilik: String(data.namaPemilik || ""),
      umurPemilik: String(data.umurPemilik || ""),
      tinggiBadan: String(data.tinggiBadan || ""),
      panjangBadan: String(data.panjangBadan || ""),
      lebarDada: String(data.lebarDada || ""),
      kondisi: String(data.kondisi || "Sehat"),
      nafsuMakan: String(data.nafsuMakan || "Baik"),
      feses: String(data.feses || "Normal"),
      riwayatSingkat: String(data.riwayatSingkat || ""),
      catatan: String(data.catatan || ""),
      fotoKambing: String(data.fotoKambing || ""),
    });
    setEditingId(String(data.id));
    setIsEditing(true);
    setSelectedAnimalId(String(data.id));
  };

  const handleDelete = async (animal: Record<string, unknown>) => {
    const id = String(animal.id);
    if (!window.confirm(`Hapus data ${String(animal.tag || animal.name || id)}?`)) {
      return;
    }

    try {
      await deleteAnimal(id);
      setAnimals((current) => current.filter((item) => String(item.id) !== id));
      if (selectedAnimalId === id) {
        setSelectedAnimalId(null);
      }
      toast.success("Data ternak berhasil dihapus.");
    } catch {
      toast.error("Gagal menghapus data ternak.");
    }
  };

  return (
    <DashboardShell
      title="Data Ternak"
      subtitle={`${animals.length} ekor tercatat dalam sistem`}
      actions={
        <>
          <Button variant="outline" onClick={handleExport}>
            <Download /> Ekspor
          </Button>
          <Button type="button" onClick={resetForm}>
            <Plus /> Tambah Ternak
          </Button>
        </>
      }
    >
      <Card className="mb-6">
        <CardContent className="p-4">
          <form id="animal-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-4 rounded-xl border border-border/60 bg-background/40 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Identitas Kambing</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1 md:col-span-2">
                    <label htmlFor="tag" className="text-sm font-medium">ID / Nomor</label>
                    <Input id="tag" placeholder="ID / Nomor" value={form.tag} onChange={(e) => {
                      setForm((current) => ({ ...current, tag: e.target.value }));
                      setErrors((current) => ({ ...current, tag: "" }));
                    }} />
                    {errors.tag ? <p className="text-sm text-destructive">{errors.tag}</p> : null}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="jenis" className="text-sm font-medium">Jenis Ternak</label>
                    <Input id="jenis" placeholder="Jenis Ternak" value={form.jenis} onChange={(e) => {
                      setForm((current) => ({ ...current, jenis: e.target.value }));
                      setErrors((current) => ({ ...current, jenis: "" }));
                    }} />
                    {errors.jenis ? <p className="text-sm text-destructive">{errors.jenis}</p> : null}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="ras" className="text-sm font-medium">Ras</label>
                    <Input id="ras" placeholder="Ras" value={form.ras} onChange={(e) => {
                      setForm((current) => ({ ...current, ras: e.target.value }));
                      setErrors((current) => ({ ...current, ras: "" }));
                    }} />
                    {errors.ras ? <p className="text-sm text-destructive">{errors.ras}</p> : null}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Kelamin</label>
                    <Select value={form.jenisKelamin} onValueChange={(value) => setForm((current) => ({ ...current, jenisKelamin: value }))}>
                      <SelectTrigger><SelectValue placeholder="Kelamin" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Jantan">Jantan</SelectItem>
                        <SelectItem value="Betina">Betina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="umurKambing" className="text-sm font-medium">Umur Kambing</label>
                    <Input id="umurKambing" type="number" min="0" placeholder="Umur Kambing" value={form.umurKambing} onChange={(e) => {
                      setForm((current) => ({ ...current, umurKambing: e.target.value }));
                      setErrors((current) => ({ ...current, umurKambing: "" }));
                    }} />
                    {errors.umurKambing ? <p className="text-sm text-destructive">{errors.umurKambing}</p> : null}
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label htmlFor="ciriCiri" className="text-sm font-medium">Ciri-ciri</label>
                    <Textarea id="ciriCiri" placeholder="Ciri-ciri" value={form.ciriCiri} onChange={(e) => setForm((current) => ({ ...current, ciriCiri: e.target.value }))} rows={3} />
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-xl border border-border/60 bg-background/40 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Identitas Pemilik</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1 md:col-span-2">
                    <label htmlFor="namaPemilik" className="text-sm font-medium">Nama Pemilik</label>
                    <Input id="namaPemilik" placeholder="Nama Pemilik" value={form.namaPemilik} onChange={(e) => {
                      setForm((current) => ({ ...current, namaPemilik: e.target.value }));
                      setErrors((current) => ({ ...current, namaPemilik: "" }));
                    }} />
                    {errors.namaPemilik ? <p className="text-sm text-destructive">{errors.namaPemilik}</p> : null}
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label htmlFor="umurPemilik" className="text-sm font-medium">Umur Pemilik</label>
                    <Input id="umurPemilik" placeholder="Umur Pemilik" value={form.umurPemilik} onChange={(e) => setForm((current) => ({ ...current, umurPemilik: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-border/60 bg-background/40 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Ukuran Tubuh Kambing</h3>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="space-y-1">
                  <label htmlFor="berat" className="text-sm font-medium">Bobot Badan</label>
                  <Input id="berat" type="number" min="0" placeholder="Bobot Badan" value={form.berat} onChange={(e) => {
                    setForm((current) => ({ ...current, berat: e.target.value }));
                    setErrors((current) => ({ ...current, berat: "" }));
                  }} />
                  {errors.berat ? <p className="text-sm text-destructive">{errors.berat}</p> : null}
                </div>
                <div className="space-y-1">
                  <label htmlFor="tinggiBadan" className="text-sm font-medium">Tinggi Badan</label>
                  <Input id="tinggiBadan" type="number" min="0" placeholder="Tinggi Badan" value={form.tinggiBadan} onChange={(e) => setForm((current) => ({ ...current, tinggiBadan: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label htmlFor="panjangBadan" className="text-sm font-medium">Panjang Badan</label>
                  <Input id="panjangBadan" type="number" min="0" placeholder="Panjang Badan" value={form.panjangBadan} onChange={(e) => setForm((current) => ({ ...current, panjangBadan: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label htmlFor="lebarDada" className="text-sm font-medium">Lebar Dada</label>
                  <Input id="lebarDada" type="number" min="0" placeholder="Lebar Dada" value={form.lebarDada} onChange={(e) => setForm((current) => ({ ...current, lebarDada: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-border/60 bg-background/40 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Status Kesehatan</h3>
              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Kondisi</label>
                  <Select value={form.kondisi} onValueChange={(value) => setForm((current) => ({ ...current, kondisi: value }))}>
                    <SelectTrigger><SelectValue placeholder="Kondisi" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sehat">Sehat</SelectItem>
                      <SelectItem value="Sakit">Sakit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Nafsu Makan</label>
                  <Select value={form.nafsuMakan} onValueChange={(value) => setForm((current) => ({ ...current, nafsuMakan: value }))}>
                    <SelectTrigger><SelectValue placeholder="Nafsu makan" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baik">Baik</SelectItem>
                      <SelectItem value="Tidak">Tidak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Feses</label>
                  <Select value={form.feses} onValueChange={(value) => setForm((current) => ({ ...current, feses: value }))}>
                    <SelectTrigger><SelectValue placeholder="Feses" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Diare">Diare</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-border/60 bg-background/40 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Foto Kambing</h3>
              <Input type="file" accept="image/*" onChange={handlePhotoChange} />
              {form.fotoKambing ? (
                <img src={form.fotoKambing} alt="Preview kambing" className="h-40 w-full rounded-lg object-cover" />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                  Belum ada foto yang dipilih.
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-xl border border-border/60 bg-background/40 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Riwayat Singkat</h3>
              <Textarea placeholder="Contoh: 2026-07-21 | Vaksin PMK" value={form.riwayatSingkat} onChange={(e) => setForm((current) => ({ ...current, riwayatSingkat: e.target.value }))} rows={4} />
              <p className="text-sm text-muted-foreground">Setiap baris akan menjadi satu catatan riwayat kesehatan.</p>
            </div>

            <div className="space-y-4 rounded-xl border border-border/60 bg-background/40 p-4">
              <label htmlFor="catatan" className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Catatan</label>
              <Textarea id="catatan" placeholder="Catatan" value={form.catatan} onChange={(e) => setForm((current) => ({ ...current, catatan: e.target.value }))} rows={4} />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 p-4">
              <div className="text-sm text-muted-foreground">Form ini menampung identitas kambing, pemilik, ukuran tubuh, status kesehatan, dan riwayat singkat.</div>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" /> {loading ? "Menyimpan..." : isEditing ? "Perbarui Data Kambing" : "Simpan Data Kambing"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Input
              placeholder="Cari tag, nama, ras, kandang, atau status..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="md:max-w-sm"
            />
            <Select value={jenisFilter} onValueChange={setJenisFilter}>
              <SelectTrigger className="md:w-48">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Semua jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua jenis</SelectItem>
                <SelectItem value="Sapi">Sapi</SelectItem>
                <SelectItem value="Kambing">Kambing</SelectItem>
                <SelectItem value="Domba">Domba</SelectItem>
                <SelectItem value="Kerbau">Kerbau</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Semua status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua status</SelectItem>
                <SelectItem value="Sehat">Sehat</SelectItem>
                <SelectItem value="Sakit">Sakit</SelectItem>
                <SelectItem value="Bunting">Bunting</SelectItem>
                <SelectItem value="Karantina">Karantina</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Semua pemilik" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua pemilik</SelectItem>
                {Array.from(new Set(animals.map((item) => String((item as Record<string, unknown>).namaPemilik || "")).filter(Boolean))).map((owner) => (
                  <SelectItem key={owner} value={owner}>{owner}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="ml-auto text-sm text-muted-foreground">
              Menampilkan <span className="font-medium text-foreground">{filtered.length}</span> ekor
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag</TableHead>
                  <TableHead>Jenis / Ras</TableHead>
                  <TableHead>Kelamin</TableHead>
                  <TableHead className="text-right">Umur (bln)</TableHead>
                  <TableHead className="text-right">Berat (kg)</TableHead>
                  <TableHead>Pemilik</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tgl Masuk</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingData ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {Array.from({ length: 9 }).map((__, cellIndex) => (
                        <TableCell key={`skeleton-cell-${cellIndex}`}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <>
                    {filtered.map((t) => {
                      const data = t as Record<string, string | number>;
                      return (
                        <TableRow key={String(data.id)} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedAnimalId(String(data.id))}>
                          <TableCell className="font-mono font-medium">{String(data.tag || "-")}</TableCell>
                          <TableCell>
                            <div className="font-medium">{String(data.jenis || "-")}</div>
                            <div className="text-xs text-muted-foreground">{String(data.ras || "-")}</div>
                          </TableCell>
                          <TableCell>{String(data.jenisKelamin || "-")}</TableCell>
                          <TableCell className="text-right tabular-nums">{String(data.umur || "-")}</TableCell>
                          <TableCell className="text-right tabular-nums">{String(data.berat || "-")}</TableCell>
                          <TableCell>{String(data.namaPemilik || "-")}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusVariant[String(data.status) as StatusTernak] || ""}>
                              {String(data.status || "-")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {String(data.tanggalMasuk || "-")}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button type="button" variant="outline" size="sm" onClick={(event) => { event.stopPropagation(); handleEdit(t as Record<string, unknown>); }}>
                                <Pencil className="mr-1 h-4 w-4" /> Edit
                              </Button>
                              <Button type="button" variant="destructive" size="sm" onClick={(event) => { event.stopPropagation(); handleDelete(t as Record<string, unknown>); }}>
                                <Trash2 className="mr-1 h-4 w-4" /> Hapus
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                          {animals.length === 0 ? "Belum ada data ternak. Tambahkan data pertama Anda." : "Tidak ada ternak yang cocok dengan filter."}
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </TableBody>
            </Table>
          </div>

          {selectedAnimal ? (
            <div className="mt-6 rounded-xl border border-border/60 bg-background/40 p-4">
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="flex min-w-55 items-center justify-center rounded-lg border border-dashed border-border bg-background/70 p-3">
                  {((selectedAnimal as Record<string, unknown>).fotoKambing as string | undefined) ? (
                    <img src={String((selectedAnimal as Record<string, unknown>).fotoKambing)} alt="Foto kambing" className="h-44 w-full rounded-lg object-cover" />
                  ) : (
                    <div className="text-center text-sm text-muted-foreground">Foto kambing belum tersedia.</div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-semibold">{String((selectedAnimal as Record<string, unknown>).tag || "-")}</h3>
                    <Badge variant="outline">{String((selectedAnimal as Record<string, unknown>).jenis || "-")}</Badge>
                    <Badge variant="outline">{String((selectedAnimal as Record<string, unknown>).status || "-")}</Badge>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium">Pemilik</p>
                      <p className="text-sm text-muted-foreground">{String((selectedAnimal as Record<string, unknown>).namaPemilik || "-")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Ukuran</p>
                      <p className="text-sm text-muted-foreground">{String((selectedAnimal as Record<string, unknown>).berat || "0")} kg · {String((selectedAnimal as Record<string, unknown>).tinggiBadan || "-")} cm</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Ciri-ciri</p>
                      <p className="text-sm text-muted-foreground">{String((selectedAnimal as Record<string, unknown>).ciriCiri || "-")}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Catatan</p>
                      <p className="text-sm text-muted-foreground">{String((selectedAnimal as Record<string, unknown>).catatan || "-")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Riwayat Kesehatan</h4>
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Keterangan</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detailHistory.length > 0 ? detailHistory.map((item, index) => (
                        <TableRow key={`${String((selectedAnimal as Record<string, unknown>).id)}-history-${index}`}>
                          <TableCell>{item.tanggal}</TableCell>
                          <TableCell>{item.keterangan}</TableCell>
                          <TableCell>{item.status}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={3} className="h-16 text-center text-muted-foreground">Belum ada riwayat kesehatan untuk kambing ini.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
