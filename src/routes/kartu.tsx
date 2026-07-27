import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { IdCard, Printer, Plus, Search, Sprout, Camera, TrendingUp, AlertTriangle, QrCode, Filter } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardShell } from "@/features/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { daftarKartu, type KartuKesehatanKambing } from "@/lib/kartu-data";
import { loadDaftarObat, catatPenggunaanObat } from "@/lib/obat-data";
import { AnimalQrTagCard, printAnimalQrTag, printBatchQrTags } from "@/components/qr-tag";
import { toast } from "sonner";

export const Route = createFileRoute("/kartu")({
  head: () => ({
    meta: [
      { title: "Kartu Kesehatan Ternak Digital — KARTANING" },
      {
        name: "description",
        content:
          "Kartu kesehatan ternak digital: Sapi, Kambing, Domba, Ayam, Bebek - identitas, ukuran tubuh, status kesehatan, dan cetak label tag.",
      },
    ],
  }),
  component: KartuPage,
});

function KartuPage() {
  const [query, setQuery] = useState("");
  const [jenisFilter, setJenisFilter] = useState("semua");
  const [selected, setSelected] = useState<KartuKesehatanKambing | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return daftarKartu.filter((k) => {
      const itemJenis = k.jenis || "Kambing";
      const matchQ =
        k.idKambing.toLowerCase().includes(q) ||
        k.namaPemilik.toLowerCase().includes(q) ||
        k.ras.toLowerCase().includes(q) ||
        itemJenis.toLowerCase().includes(q);
      const matchJenis = jenisFilter === "semua" || itemJenis === jenisFilter;
      return matchQ && matchJenis;
    });
  }, [query, jenisFilter]);

  const handleBatchPrint = () => {
    const animalsToPrint = filtered.map((k) => ({
      tag: k.idKambing,
      jenis: k.jenis || "Kambing",
      ras: k.ras,
      kandang: "Kandang Utama",
      namaPemilik: k.namaPemilik,
      status: k.kondisi,
    }));
    printBatchQrTags(animalsToPrint);
    toast.success(`Mencetak ${animalsToPrint.length} label tag ternak (Batch Print)...`);
  };

  return (
    <DashboardShell
      title="Kartu Kesehatan Ternak Digital"
      subtitle="Kelompok Tani Ternak Mindajaya — Pendataan & cetak label medis seluruh jenis ternak (Sapi, Kambing, Domba, Unggas)"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={handleBatchPrint} className="gap-1.5 border-emerald-500/40 text-emerald-600 hover:bg-emerald-50">
            <QrCode className="h-4 w-4" /> Cetak Massal Tag Label ({filtered.length})
          </Button>

          <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1.5 h-4 w-4" /> Kartu Baru
              </Button>
            </DialogTrigger>
            <KartuFormDialog onClose={() => setOpenForm(false)} />
          </Dialog>
        </div>
      }
    >
      <Card className="mb-5 border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">Program Kemitraan Masyarakat 2026</div>
              <div className="text-sm text-muted-foreground">
                Didanai Kemendiktisaintek · UNU Purwokerto × Mindajaya Farm
              </div>
            </div>
          </div>
          <Badge variant="outline" className="w-fit border-primary/40 bg-background text-primary">
            {daftarKartu.length} kartu aktif
          </Badge>
        </CardContent>
      </Card>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari ID Ear Tag, nama pemilik, atau ras..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={jenisFilter} onValueChange={setJenisFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Semua Jenis Ternak" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Jenis Ternak</SelectItem>
              <SelectItem value="Sapi">🐄 Sapi</SelectItem>
              <SelectItem value="Kambing">🐐 Kambing</SelectItem>
              <SelectItem value="Domba">🐑 Domba</SelectItem>
              <SelectItem value="Ayam">🐔 Ayam</SelectItem>
              <SelectItem value="Bebek">🦆 Bebek</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((k) => (
          <button
            key={k.id}
            onClick={() => setSelected(k)}
            className="group text-left"
          >
            <Card className="h-full transition hover:border-primary/50 hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {k.jenis || "Kambing"} · {k.ras}
                    </div>
                    <CardTitle className="mt-1 font-mono text-lg">{k.idKambing}</CardTitle>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      k.kondisi === "Sehat"
                        ? "border-success/30 bg-success/15 text-success"
                        : "border-destructive/30 bg-destructive/10 text-destructive"
                    }
                  >
                    {k.kondisi}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <IdCard className="h-4 w-4" />
                  <span>
                    {k.kelamin} · {k.umur}
                  </span>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Info label="Bobot" value={`${k.bobot} kg`} />
                  <Info label="Tinggi" value={`${k.tinggi} cm`} />
                  <Info label="Panjang" value={`${k.panjang} cm`} />
                  <Info label="Dada" value={`${k.lebarDada} cm`} />
                </div>
                <Separator />
                <div className="text-xs">
                  <div className="text-muted-foreground">Pemilik</div>
                  <div className="font-medium">{k.namaPemilik}</div>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && <KartuDetailDialog kartu={selected} />}
      </Dialog>
    </DashboardShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function KartuDetailDialog({ kartu }: { kartu: KartuKesehatanKambing }) {
  return (
    <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
      <DialogHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div>
            <DialogTitle className="font-mono text-2xl flex items-center gap-2">
              <QrCode className="h-5 w-5 text-emerald-600" /> {kartu.idKambing}
            </DialogTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Kartu Kesehatan Ternak Digital — Kelompok Tani Ternak Mindajaya
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                printAnimalQrTag({
                  tag: kartu.idKambing,
                  jenis: "Kambing",
                  ras: kartu.ras,
                  kandang: "Kandang Utama",
                  namaPemilik: kartu.namaPemilik,
                  status: kartu.kondisi,
                })
              }
              className="gap-1.5 border-emerald-500/40 text-emerald-600 hover:bg-emerald-50"
            >
              <QrCode className="h-4 w-4" /> Cetak Tag Label (88mm)
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-1.5">
              <Printer className="h-4 w-4" /> Cetak Laporan (A4)
            </Button>
          </div>
        </div>
      </DialogHeader>

      {/* Visual QR Tag Card Section */}
      <div className="my-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col items-center">
        <AnimalQrTagCard
          animal={{
            tag: kartu.idKambing,
            jenis: "Kambing",
            ras: kartu.ras,
            kandang: "Kandang Utama",
            namaPemilik: kartu.namaPemilik,
            status: kartu.kondisi,
          }}
        />
      </div>

      <Section title="A. Identitas Kambing">
        <Field label="ID / Nomor" value={kartu.idKambing} mono />
        <Field label="Jenis / Ras" value={kartu.ras} />
        <Field label="Kelamin" value={kartu.kelamin} />
        <Field label="Umur" value={kartu.umur} />
        <Field label="Ciri-ciri" value={kartu.ciri} full />
      </Section>

      <Section title="B. Identitas Pemilik">
        <Field label="Nama Pemilik" value={kartu.namaPemilik} />
        <Field label="Umur Pemilik" value={`${kartu.umurPemilik} tahun`} />
        <Field label="Status Kepemilikan" value={kartu.statusKepemilikan || "Kepemilikan sendiri"} />
      </Section>

      <Section title="C. Ukuran Tubuh">
        <Field label="Bobot Badan" value={`${kartu.bobot} kg`} />
        <Field label="Tinggi Badan" value={`${kartu.tinggi} cm`} />
        <Field label="Panjang Badan" value={`${kartu.panjang} cm`} />
        <Field label="Lebar Dada" value={`${kartu.lebarDada} cm`} />
      </Section>

      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <TrendingUp className="h-4 w-4 text-primary" /> Tren Bobot 6 Bulan
        </div>
        <div className="rounded-lg border bg-card p-3">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={kartu.bobotHistory}>
              <defs>
                <linearGradient id="gBobot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="bulan" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} unit=" kg" />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Area type="monotone" dataKey="bobot" stroke="var(--color-primary)" fill="url(#gBobot)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <Section title="D. Status Kesehatan">
        <Field label="Kondisi" value={kartu.kondisi} />
        <Field label="Nafsu Makan" value={kartu.nafsuMakan} />
        <Field label="Feses" value={kartu.feses} />
      </Section>

      <div className="mt-4">
        <div className="mb-2 text-sm font-semibold">E. Riwayat Singkat</div>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Tanggal</th>
                <th className="px-3 py-2 font-medium">Jenis</th>
                <th className="px-3 py-2 font-medium">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              {kartu.riwayat.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-2">
                    {new Date(r.tanggal).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant="outline">{r.jenis}</Badge>
                  </td>
                  <td className="px-3 py-2">{r.keterangan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-sm font-semibold">F. Catatan</div>
        <div className="rounded-lg border bg-muted/30 p-3 text-sm">{kartu.catatan}</div>
      </div>
    </DialogContent>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="mb-2 text-sm font-semibold">{title}</div>
      <div className="grid grid-cols-1 gap-3 rounded-lg border bg-card p-4 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  full,
  mono,
}: {
  label: string;
  value: string;
  full?: boolean;
  mono?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-0.5 text-sm font-medium ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function KartuFormDialog({ onClose }: { onClose: () => void }) {
  const [idKambing, setIdKambing] = useState("MJ-KB-005");
  const [selectedObat, setSelectedObat] = useState("none");
  const [jumlahObat, setJumlahObat] = useState("1");
  const [petugas, setPetugas] = useState("Pak Tono");
  const listObat = useMemo(() => loadDaftarObat(), []);

  const handleSaveKartu = () => {
    if (selectedObat && selectedObat !== "none") {
      const jumlahNum = Math.max(1, parseInt(jumlahObat, 10) || 1);
      const res = catatPenggunaanObat({
        earTag: idKambing || "MJ-KB-005",
        namaTernak: "Kambing Etawa (PE)",
        namaObat: selectedObat,
        jumlah: jumlahNum,
        petugas: petugas || "Pak Tono",
        keterangan: "Pemberian obat saat pengisian Kartu Kesehatan",
      });
      if (res.success) {
        toast.success(`Kartu disimpan! Stok ${selectedObat} berkurang ${jumlahNum} dan tercatat di Riwayat Penggunaan.`);
      } else {
        toast.error(res.message || "Kartu disimpan, tetapi gagal mengurangi stok obat.");
      }
    } else {
      toast.success("Kartu Kesehatan Kambing berhasil disimpan.");
    }
    onClose();
  };

  return (
    <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Buat Kartu Kesehatan Kambing</DialogTitle>
        <p className="text-sm text-muted-foreground">
          Isi data sesuai format resmi Kelompok Tani Ternak Mindajaya.
        </p>
      </DialogHeader>

      <FormSection title="A. Identitas Kambing">
        <div>
          <Label className="text-xs font-medium">ID / Nomor Ear Tag</Label>
          <Input className="mt-1" value={idKambing} onChange={(e) => setIdKambing(e.target.value)} placeholder="MJ-KB-005" />
        </div>
        <FormField label="Jenis / Ras" placeholder="Kambing Etawa (PE)" />
        <div>
          <Label className="text-xs">Kelamin</Label>
          <RadioGroup defaultValue="Jantan" className="mt-2 flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Jantan" id="j" />
              <Label htmlFor="j" className="font-normal">Jantan</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Betina" id="b" />
              <Label htmlFor="b" className="font-normal">Betina</Label>
            </div>
          </RadioGroup>
        </div>
        <FormField label="Umur Kambing" placeholder="12 bulan" />
        <div className="sm:col-span-2">
          <Label className="text-xs">Ciri-ciri</Label>
          <Textarea className="mt-1" placeholder="Warna bulu, tanda khusus..." rows={2} />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs">Foto Kambing</Label>
          <label className="mt-1 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 py-6 text-sm text-muted-foreground hover:border-primary/50 hover:bg-primary/5">
            <Camera className="h-6 w-6" />
            <span>Klik untuk unggah foto (JPG/PNG)</span>
            <input type="file" accept="image/*" className="hidden" />
          </label>
        </div>
      </FormSection>

      <FormSection title="B. Identitas Pemilik">
        <FormField label="Nama Pemilik" placeholder="Bpk. Suparjo" />
        <FormField label="Umur Pemilik" placeholder="45" type="number" />
        <div>
          <Label className="text-xs font-medium">Status Kepemilikan</Label>
          <Select defaultValue="Kepemilikan sendiri">
            <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih Status Kepemilikan" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Kepemilikan sendiri">Kepemilikan sendiri</SelectItem>
              <SelectItem value="Kepemilikan kelompok">Kepemilikan kelompok</SelectItem>
              <SelectItem value="Kepemilikan mitra">Kepemilikan mitra</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FormSection>

      <FormSection title="C. Ukuran Tubuh">
        <FormField label="Bobot Badan (kg)" placeholder="42" type="number" />
        <FormField label="Tinggi Badan (cm)" placeholder="74" type="number" />
        <FormField label="Panjang Badan (cm)" placeholder="68" type="number" />
        <FormField label="Lebar Dada (cm)" placeholder="22" type="number" />
      </FormSection>

      <FormSection title="D. Status Kesehatan">
        <div>
          <Label className="text-xs">Kondisi</Label>
          <Select defaultValue="Sehat">
            <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih Kondisi" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Sehat">Sehat</SelectItem>
              <SelectItem value="Bunting Sehat">Bunting Sehat</SelectItem>
              <SelectItem value="Bunting Sakit">Bunting Sakit</SelectItem>
              <SelectItem value="Sakit">Sakit</SelectItem>
              <SelectItem value="Mati">Mati</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Nafsu Makan</Label>
          <RadioGroup defaultValue="Baik" className="mt-2 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Baik" id="nb" />
              <Label htmlFor="nb" className="font-normal">Baik</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Menurun" id="nm" />
              <Label htmlFor="nm" className="font-normal">Menurun</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Tidak" id="nt" />
              <Label htmlFor="nt" className="font-normal">Tidak</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label className="text-xs">Feses</Label>
          <RadioGroup defaultValue="Normal" className="mt-2 flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Normal" id="fn" />
              <Label htmlFor="fn" className="font-normal">Normal</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Diare" id="fd" />
              <Label htmlFor="fd" className="font-normal">Diare</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Integration: Obat Yang Diberikan */}
        <div className="sm:col-span-2 mt-2 rounded-lg border border-border/80 bg-muted/20 p-3 space-y-3">
          <Label className="text-xs font-semibold text-primary">Obat yang Diberikan</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Pilih Obat</Label>
              <Select value={selectedObat} onValueChange={setSelectedObat}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih Obat (Opsional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Tanpa Obat</SelectItem>
                  {listObat
                    .filter((o) => o.status === "Aktif")
                    .map((o) => (
                      <SelectItem key={o.id} value={o.namaObat}>
                        {o.namaObat} (Stok: {o.stok} {o.satuan})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Jumlah Digunakan</Label>
              <Input
                type="number"
                min="1"
                className="mt-1"
                placeholder="Contoh: 2"
                value={jumlahObat}
                onChange={(e) => setJumlahObat(e.target.value)}
              />
            </div>
          </div>
        </div>
      </FormSection>

      <div className="mt-4">
        <Label className="text-sm font-semibold">F. Catatan & Petugas</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-1">
          <div>
            <Label className="text-xs text-muted-foreground">Nama Petugas</Label>
            <Input className="mt-1" value={petugas} onChange={(e) => setPetugas(e.target.value)} placeholder="Nama Petugas" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Catatan Tambahan</Label>
            <Input className="mt-1" placeholder="Catatan tambahan..." />
          </div>
        </div>
      </div>

      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onClose}>Batal</Button>
        <Button onClick={handleSaveKartu}>Simpan Kartu</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="mb-2 text-sm font-semibold">{title}</div>
      <div className="grid grid-cols-1 gap-3 rounded-lg border bg-card p-4 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

function FormField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input className="mt-1" placeholder={placeholder} type={type} />
    </div>
  );
}
