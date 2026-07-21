import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { IdCard, Printer, Plus, Search, Sprout, Camera, TrendingUp, AlertTriangle } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { daftarKartu, type KartuKesehatanKambing } from "@/lib/kartu-data";

export const Route = createFileRoute("/kartu")({
  head: () => ({
    meta: [
      { title: "Kartu Kesehatan Kambing — TernakPro" },
      {
        name: "description",
        content:
          "Kartu kesehatan kambing digital: identitas, ukuran tubuh, status kesehatan, dan riwayat tindakan.",
      },
    ],
  }),
  component: KartuPage,
});

function KartuPage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<KartuKesehatanKambing | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return daftarKartu.filter(
      (k) =>
        k.idKambing.toLowerCase().includes(q) ||
        k.namaPemilik.toLowerCase().includes(q) ||
        k.ras.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <DashboardShell
      title="Kartu Kesehatan Kambing"
      subtitle="Kelompok Tani Ternak Mindajaya — pendataan lengkap per ekor"
      actions={
        <Dialog open={openForm} onOpenChange={setOpenForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus /> Kartu Baru
            </Button>
          </DialogTrigger>
          <KartuFormDialog onClose={() => setOpenForm(false)} />
        </Dialog>
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

      <div className="relative mb-4 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cari ID, pemilik, atau ras..."
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
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
                    <div className="text-xs font-medium text-muted-foreground">
                      {k.ras}
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
        <div className="flex items-center justify-between gap-3">
          <div>
            <DialogTitle className="font-mono text-xl">{kartu.idKambing}</DialogTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Kartu Kesehatan Kambing — Kelompok Tani Ternak Mindajaya
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer /> Cetak
          </Button>
        </div>
      </DialogHeader>

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
  return (
    <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Buat Kartu Kesehatan Kambing</DialogTitle>
        <p className="text-sm text-muted-foreground">
          Isi data sesuai format resmi Kelompok Tani Ternak Mindajaya.
        </p>
      </DialogHeader>

      <FormSection title="A. Identitas Kambing">
        <FormField label="ID / Nomor" placeholder="MJ-KB-005" />
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
          <RadioGroup defaultValue="Sehat" className="mt-2 flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Sehat" id="ks" />
              <Label htmlFor="ks" className="font-normal">Sehat</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Sakit" id="kk" />
              <Label htmlFor="kk" className="font-normal">Sakit</Label>
            </div>
          </RadioGroup>
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
      </FormSection>

      <div className="mt-4">
        <Label className="text-sm font-semibold">F. Catatan</Label>
        <Textarea className="mt-2" rows={3} placeholder="Catatan tambahan..." />
      </div>

      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onClose}>Batal</Button>
        <Button onClick={onClose}>Simpan Kartu</Button>
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
