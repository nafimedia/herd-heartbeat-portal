import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Save, ArrowLeft, Camera, Beef, ShieldCheck, Sparkles, Upload } from "lucide-react";
import { DashboardShell } from "@/features/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAnimal } from "@/lib/api";
import { saveOfflineAction } from "@/lib/offline-sync";
import { toast } from "sonner";

export const Route = createFileRoute("/ternak/tambah")({
  head: () => ({
    meta: [
      { title: "Form Tambah Ternak Baru — KARTANING" },
      { name: "description", content: "Form pendaftaran ternak baru: identitas, ras, pemilik, ukuran tubuh, dan foto." },
    ],
  }),
  component: TambahTernakPage,
});

function TambahTernakPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const [form, setForm] = useState({
    tag: "",
    name: "",
    jenis: "Kambing",
    ras: "Etawa",
    jenisKelamin: "Betina",
    umur: "12",
    berat: "40",
    kandang: "Kandang A-01",
    status: "Sehat",
    tanggalMasuk: new Date().toISOString().slice(0, 10),
    ciriCiri: "",
    namaPemilik: "Pak Tono",
    umurPemilik: "45",
    statusKepemilikan: "Kepemilikan sendiri",
    tinggiBadan: "72",
    panjangBadan: "68",
    lebarDada: "24",
    catatan: "",
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewPhoto(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tag) {
      toast.error("Ear Tag ID wajib diisi!");
      return;
    }

    setLoading(true);
    const payload = {
      ...form,
      fotoKambing: previewPhoto || "",
      umur: Number(form.umur) || 0,
      berat: Number(form.berat) || 0,
    };

    try {
      if (navigator.onLine) {
        await createAnimal(payload);
        toast.success(`Ternak ${form.tag} (${form.jenis}) berhasil ditambahkan ke database!`);
      } else {
        saveOfflineAction("CREATE_ANIMAL", payload, `Tambah Ternak ${form.tag} (${form.jenis})`);
      }
      navigate({ to: "/ternak" });
    } catch {
      saveOfflineAction("CREATE_ANIMAL", payload, `Tambah Ternak ${form.tag} (${form.jenis})`);
      navigate({ to: "/ternak" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell
      title="Form Pendaftaran Ternak Baru"
      subtitle="Tambahkan data ternak sapi, kambing, domba, atau unggas baru ke sistem KARTANING"
      actions={
        <Button variant="outline" asChild className="gap-1.5">
          <Link to="/ternak">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Tabel
          </Link>
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* SECTION A: IDENTITAS TERNAK */}
        <Card className="border-emerald-500/30">
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Beef className="h-5 w-5" /> A. Identitas Utama Ternak
            </CardTitle>
            <CardDescription>Nomor Ear Tag, jenis hewan, ras, dan lokasi kandang</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tag" className="font-semibold">
                Ear Tag ID / Kode Identitas <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tag"
                placeholder="Contoh: MJ-KB-015 atau SP-003"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value.toUpperCase() })}
                required
                className="font-mono uppercase font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama Panggilan / Alias</Label>
              <Input
                id="name"
                placeholder="Contoh: Si Black, Limou Unggul"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jenis">Jenis Ternak</Label>
              <Select value={form.jenis} onValueChange={(val) => setForm({ ...form, jenis: val })}>
                <SelectTrigger id="jenis">
                  <SelectValue placeholder="Pilih Jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sapi">🐄 Sapi</SelectItem>
                  <SelectItem value="Kambing">🐐 Kambing</SelectItem>
                  <SelectItem value="Domba">🐑 Domba</SelectItem>
                  <SelectItem value="Ayam">🐔 Ayam</SelectItem>
                  <SelectItem value="Bebek">🦆 Bebek</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ras">Ras / Varietas</Label>
              <Input
                id="ras"
                placeholder="Contoh: Etawa PE, Limousin, Garut"
                value={form.ras}
                onChange={(e) => setForm({ ...form, ras: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
              <Select value={form.jenisKelamin} onValueChange={(val) => setForm({ ...form, jenisKelamin: val })}>
                <SelectTrigger id="jenisKelamin">
                  <SelectValue placeholder="Pilih Kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Betina">Betina</SelectItem>
                  <SelectItem value="Jantan">Jantan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kandang">Lokasi Kandang</Label>
              <Input
                id="kandang"
                placeholder="Contoh: Kandang Sapi A-01"
                value={form.kandang}
                onChange={(e) => setForm({ ...form, kandang: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* SECTION B: IDENTITAS PEMILIK */}
        <Card>
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" /> B. Identitas Pemilik / Kelompok
            </CardTitle>
            <CardDescription>Nama pemilik ternak dan status kepemilikan kemitraan</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="namaPemilik">Nama Pemilik / Mitra</Label>
              <Input
                id="namaPemilik"
                placeholder="Contoh: Bpk. Suparjo, Pak Tono"
                value={form.namaPemilik}
                onChange={(e) => setForm({ ...form, namaPemilik: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="umurPemilik">Umur Pemilik (Tahun)</Label>
              <Input
                id="umurPemilik"
                type="number"
                placeholder="45"
                value={form.umurPemilik}
                onChange={(e) => setForm({ ...form, umurPemilik: e.target.value })}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="statusKepemilikan">Status Kepemilikan</Label>
              <Select
                value={form.statusKepemilikan}
                onValueChange={(val) => setForm({ ...form, statusKepemilikan: val })}
              >
                <SelectTrigger id="statusKepemilikan">
                  <SelectValue placeholder="Pilih Status Kepemilikan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kepemilikan sendiri">👤 Kepemilikan Sendiri (Peternak Utama)</SelectItem>
                  <SelectItem value="Kepemilikan kelompok">👥 Kepemilikan Kelompok (KTT Mindajaya)</SelectItem>
                  <SelectItem value="Kepemilikan mitra">🤝 Kepemilikan Mitra / Plasma (Program PKM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* SECTION C: UKURAN TUBUH & FISIK */}
        <Card>
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-lg">C. Ukuran Tubuh & Status Kesehatan</CardTitle>
            <CardDescription>Hasil pengukuran bobot, tinggi, dan kondisi fisik</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="berat">Bobot Badan (kg)</Label>
              <Input
                id="berat"
                type="number"
                placeholder="40"
                value={form.berat}
                onChange={(e) => setForm({ ...form, berat: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tinggiBadan">Tinggi Badan (cm)</Label>
              <Input
                id="tinggiBadan"
                type="number"
                placeholder="72"
                value={form.tinggiBadan}
                onChange={(e) => setForm({ ...form, tinggiBadan: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="panjangBadan">Panjang Badan (cm)</Label>
              <Input
                id="panjangBadan"
                type="number"
                placeholder="68"
                value={form.panjangBadan}
                onChange={(e) => setForm({ ...form, panjangBadan: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status Kesehatan</Label>
              <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val })}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sehat">Sehat</SelectItem>
                  <SelectItem value="Bunting Sehat">Bunting Sehat</SelectItem>
                  <SelectItem value="Bunting Sakit">Bunting Sakit</SelectItem>
                  <SelectItem value="Sakit">Sakit</SelectItem>
                  <SelectItem value="Karantina">Karantina</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="ciriCiri">Ciri-Ciri Fisik Khusus</Label>
              <Input
                id="ciriCiri"
                placeholder="Contoh: Bulu putih bercak hitam di kaki belakang"
                value={form.ciriCiri}
                onChange={(e) => setForm({ ...form, ciriCiri: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* SECTION D: FOTO TERNAK */}
        <Card>
          <CardHeader className="border-b border-border/60 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="h-5 w-5 text-emerald-600" /> D. Upload Foto Ternak
            </CardTitle>
            <CardDescription>Foto dokumentasi ternak untuk identifikasi visual</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-dashed border-emerald-500/40 bg-muted flex items-center justify-center relative">
                {previewPhoto ? (
                  <img src={previewPhoto} alt="Preview Foto" className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="photoFile" className="cursor-pointer">
                  <Button variant="outline" type="button" asChild className="gap-2">
                    <span>
                      <Upload className="h-4 w-4" /> Pilih Foto / Ambil Kamera
                    </span>
                  </Button>
                  <input id="photoFile" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </Label>
                <p className="text-xs text-muted-foreground">Format JPG, PNG, WebP (Maksimal 5MB)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/ternak" })}>
            Batal
          </Button>
          <Button type="submit" disabled={loading} className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 shadow-md">
            <Save className="h-4 w-4" /> {loading ? "Menyimpan..." : "Simpan Data Ternak"}
          </Button>
        </div>
      </form>
    </DashboardShell>
  );
}
