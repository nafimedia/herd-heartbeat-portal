import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  MapPin,
  Users,
  ClipboardCheck,
  ArrowRight,
  Plus,
  Send,
  CheckCircle2,
  Stethoscope,
  Scale,
  Sparkles,
  QrCode,
  Share2,
  Copy,
  Beef,
  Activity,
  Save,
} from "lucide-react";
import { DashboardShell } from "@/features/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { langkahPosyandu, jadwalPosyandu as initialJadwal } from "@/lib/kartu-data";
import { getAnimals, updateAnimal } from "@/lib/api";
import { saveOfflineAction } from "@/lib/offline-sync";
import { toast } from "sonner";

export const Route = createFileRoute("/posyandu")({
  head: () => ({
    meta: [
      { title: "Hari Posyandu Ternak — KARTANING" },
      {
        name: "description",
        content:
          "Portal Operasional Hari Posyandu Ternak: Sesi pemeriksaan live, penimbangan, pendaftaran, dan kirim undangan WA.",
      },
    ],
  }),
  component: PosyanduPage,
});

export function PosyanduPage() {
  const [jadwalList, setJadwalList] = useState(initialJadwal);
  const [animals, setAnimals] = useState<Array<Record<string, unknown>>>([]);
  const [isLiveSessionOpen, setIsLiveSessionOpen] = useState(false);
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);
  const [isAddJadwalOpen, setIsAddJadwalOpen] = useState(false);

  // Live session state
  const [selectedAnimalId, setSelectedAnimalId] = useState("");
  const [sessionForm, setSessionForm] = useState({
    bobot: "45",
    tinggi: "70",
    panjang: "65",
    lebarDada: "22",
    kondisi: "Sehat",
    tindakan: "Vaksinasi PMK",
    petugas: "drh. Fitri Nurbaeti",
    catatan: "Kondisi fisik prima, nafsu makan baik.",
  });

  // Add schedule state
  const [newJadwal, setNewJadwal] = useState({
    tanggal: new Date().toISOString().slice(0, 10),
    tema: "Posyandu & Pemeriksaan Kebuntingan",
    lokasi: "Kandang Komunal Mindajaya",
    peserta: 15,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAnimals();
        setAnimals(data);
        if (data.length > 0) {
          setSelectedAnimalId(String(data[0].id));
        }
      } catch {
        console.warn("Failed to load animals for posyandu");
      }
    }
    loadData();
  }, []);

  const nextEvent = jadwalList[0] || {
    tanggal: "2026-08-01",
    tema: "Posyandu Rutin Mindajaya",
    lokasi: "Kandang Komunal",
    peserta: 15,
  };

  const selectedAnimal = animals.find((a) => String(a.id) === String(selectedAnimalId));

  // Generate WA Invite Text
  const waInviteText = `📣 *UNDANGAN POSYANDU TERNAK KTT MINDAJAYA FARM* 📣\n---------------------------------------------------\nHalo Bapak/Ibu Peternak,\n\nDiberitahukan bahwa kegiatan Posyandu Ternak bulanan akan dilaksanakan pada:\n\n📅 *Hari/Tgl* : ${new Date(
    nextEvent.tanggal
  ).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })}\n⏰ *Waktu*    : 08:00 WIB - Selesai\n📍 *Lokasi*   : ${nextEvent.lokasi}\n🎯 *Agenda*   : ${
    nextEvent.tema
  }\n👨‍⚕️ *Tim Medis*: Tim PKM UNU Purwokerto & Dokter Hewan\n\n📌 *Himbauan*: Mohon membawa ternak (Sapi, Kambing, Domba) dan Kartu Kesehatan digital masing-masing.\n\nTerima kasih! 🙏`;

  const handleOpenWaWeb = () => {
    const encoded = encodeURIComponent(waInviteText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
    toast.success("Membuka WhatsApp untuk mengirim undangan...");
  };

  const handleCopyWaText = () => {
    navigator.clipboard.writeText(waInviteText);
    toast.success("Teks undangan WhatsApp berhasil disalin ke clipboard!");
  };

  const handleSaveLiveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnimal) {
      toast.error("Pilih ternak yang diperiksa!");
      return;
    }

    const payload = {
      ...selectedAnimal,
      berat: Number(sessionForm.bobot) || 0,
      tinggiBadan: sessionForm.tinggi,
      panjangBadan: sessionForm.panjang,
      lebarDada: sessionForm.lebarDada,
      kondisi: sessionForm.kondisi,
      status: sessionForm.kondisi,
      riwayatSingkat: `${new Date().toISOString().slice(0, 10)} | Sesi Posyandu: ${sessionForm.tindakan} (${sessionForm.petugas})`,
      catatan: sessionForm.catatan,
    };

    try {
      if (navigator.onLine) {
        await updateAnimal(selectedAnimal.id, payload);
        toast.success(`Sesi Posyandu untuk ${selectedAnimal.tag} (${selectedAnimal.name || selectedAnimal.jenis}) berhasil disimpan!`);
      } else {
        saveOfflineAction("UPDATE_ANIMAL", payload, `Posyandu Ternak ${selectedAnimal.tag}`);
        toast.info("Offline: Sesi Posyandu disimpan ke antrean lokal.");
      }
      setIsLiveSessionOpen(false);
    } catch {
      saveOfflineAction("UPDATE_ANIMAL", payload, `Posyandu Ternak ${selectedAnimal.tag}`);
      toast.info("Sesi Posyandu disimpan ke antrean offline.");
      setIsLiveSessionOpen(false);
    }
  };

  const handleAddJadwalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJadwalList([newJadwal, ...jadwalList]);
    toast.success(`Jadwal Posyandu baru (${newJadwal.tema}) berhasil ditambahkan!`);
    setIsAddJadwalOpen(false);
  };

  return (
    <DashboardShell
      title="Hari Posyandu Ternak"
      subtitle="Sistem Operasional Posyandu Bulanan Kelompok Tani Ternak Mindajaya x UNU Purwokerto"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setIsAddJadwalOpen(true)} className="gap-1.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            <Plus className="h-4 w-4" /> Tambah Jadwal
          </Button>
          <Button onClick={() => setIsLiveSessionOpen(true)} className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md">
            <ClipboardCheck className="h-4 w-4" /> Mulai Sesi Posyandu Live
          </Button>
        </div>
      }
    >
      {/* HEADER HERO CARD: NEXT POSYANDU EVENT */}
      <Card className="mb-6 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent shadow-sm">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" /> Agenda Posyandu Berikutnya
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">{nextEvent.tema}</h2>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <CalendarDays className="h-4 w-4 text-emerald-600" />
                {new Date(nextEvent.tanggal).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-emerald-600" />
                {nextEvent.lokasi}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-600" />
                {nextEvent.peserta} Peternak Terdaftar
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setIsWaModalOpen(true)} className="gap-2 bg-background border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40">
              <Send className="h-4 w-4 text-emerald-600" /> Kirim Undangan WA
            </Button>
            <Button onClick={() => setIsLiveSessionOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
              <Activity className="h-4 w-4" /> Mulai Cek Ternak
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 5 STEPS ALUR POSYANDU */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Alur 5 Langkah Posyandu Ternak KARTANING
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5 mb-8">
        {langkahPosyandu.map((l, i) => (
          <div key={l.no} className="relative">
            <Card className="h-full border-border/80 hover:border-emerald-500/40 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-xs">
                    {l.no}
                  </div>
                  <CardTitle className="text-sm font-bold">{l.judul}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <p className="text-xs text-muted-foreground leading-relaxed">{l.deskripsi}</p>
                <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  PJ: {l.pj}
                </Badge>
              </CardContent>
            </Card>
            {i < langkahPosyandu.length - 1 && (
              <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-emerald-500 xl:block z-10" />
            )}
          </div>
        ))}
      </div>

      {/* UPCOMING SCHEDULES TABLE */}
      <Card className="border-border/80">
        <CardHeader className="border-b border-border/60 pb-4">
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-emerald-600" /> Daftar Agenda Posyandu Mendatang
            </span>
            <Button size="sm" variant="outline" onClick={() => setIsAddJadwalOpen(true)} className="gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" /> Agenda Baru
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 text-left border-b border-border/60">
                <tr>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Tanggal Sesi</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Tema & Agenda Kegiatan</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Lokasi Kandang / Tempat</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground">Target Peserta</th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {jadwalList.map((j, idx) => (
                  <tr key={idx} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-foreground">
                      {new Date(j.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">{j.tema}</td>
                    <td className="px-4 py-3 text-muted-foreground">{j.lokasi}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-600">
                        {j.peserta} Peternak
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setIsWaModalOpen(true)} className="h-7 text-xs text-emerald-600 hover:text-emerald-700">
                        <Send className="mr-1 h-3 w-3" /> Undangan WA
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL 1: LIVE POSYANDU WIZARD */}
      <Dialog open={isLiveSessionOpen} onOpenChange={setIsLiveSessionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ClipboardCheck className="h-5 w-5" /> Sesi Pemeriksaan Posyandu Live
            </DialogTitle>
            <DialogDescription>
              Input penimbangan, bobot badan, dan tindakan medis untuk ternak yang hadir di Posyandu hari ini.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveLiveSession} className="space-y-4 pt-2">
            {/* SELECT ANIMAL */}
            <div className="space-y-1.5">
              <Label className="font-bold">Pilih Ternak yang Diperiksa</Label>
              <Select value={selectedAnimalId} onValueChange={setSelectedAnimalId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Tag ID Ternak" />
                </SelectTrigger>
                <SelectContent>
                  {animals.map((a) => (
                    <SelectItem key={String(a.id)} value={String(a.id)}>
                      {String(a.tag)} — {String(a.name || a.jenis)} ({String(a.namaPemilik || "Peternak")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* WEIGHT & MEASUREMENTS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-muted/40 border border-border/60">
              <div className="space-y-1">
                <Label htmlFor="bobot" className="text-xs">Bobot (kg)</Label>
                <Input
                  id="bobot"
                  type="number"
                  value={sessionForm.bobot}
                  onChange={(e) => setSessionForm({ ...sessionForm, bobot: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="tinggi" className="text-xs">Tinggi (cm)</Label>
                <Input
                  id="tinggi"
                  type="number"
                  value={sessionForm.tinggi}
                  onChange={(e) => setSessionForm({ ...sessionForm, tinggi: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="panjang" className="text-xs">Panjang (cm)</Label>
                <Input
                  id="panjang"
                  type="number"
                  value={sessionForm.panjang}
                  onChange={(e) => setSessionForm({ ...sessionForm, panjang: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lebarDada" className="text-xs">Lebar Dada (cm)</Label>
                <Input
                  id="lebarDada"
                  type="number"
                  value={sessionForm.lebarDada}
                  onChange={(e) => setSessionForm({ ...sessionForm, lebarDada: e.target.value })}
                />
              </div>
            </div>

            {/* MEDICAL STATUS & ACTIONS */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Kondisi Kesehatan</Label>
                <Select
                  value={sessionForm.kondisi}
                  onValueChange={(val) => setSessionForm({ ...sessionForm, kondisi: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kondisi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sehat">🟢 Sehat</SelectItem>
                    <SelectItem value="Bunting Sehat">🤰 Bunting Sehat</SelectItem>
                    <SelectItem value="Bunting Sakit">⚠️ Bunting Sakit</SelectItem>
                    <SelectItem value="Sakit">🔴 Sakit</SelectItem>
                    <SelectItem value="Karantina">🟡 Karantina</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Tindakan Medis Posyandu</Label>
                <Select
                  value={sessionForm.tindakan}
                  onValueChange={(val) => setSessionForm({ ...sessionForm, tindakan: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Tindakan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vaksinasi PMK">💉 Vaksinasi PMK</SelectItem>
                    <SelectItem value="Deworming (Obat Cacing)">💊 Deworming / Obat Cacing</SelectItem>
                    <SelectItem value="Injeksi Vitamin & Mineral">🧪 Injeksi Vitamin B-Complex</SelectItem>
                    <SelectItem value="Inseminasi Buatan (IB)">🧬 Inseminasi Buatan (IB)</SelectItem>
                    <SelectItem value="Pemeriksaan Kebuntingan (PKb)">🔍 Cek Kehamilan / Kebuntingan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="catatan" className="text-xs font-bold">Catatan Petugas / Rekomendasi Pakan</Label>
              <Textarea
                id="catatan"
                rows={2}
                value={sessionForm.catatan}
                onChange={(e) => setSessionForm({ ...sessionForm, catatan: e.target.value })}
                placeholder="Contoh: Diberi vitamin, diimbau tambah konsentrat 0.5kg"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsLiveSessionOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                <Save className="h-4 w-4" /> Simpan Hasil Pemeriksaan
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: WHATSAPP INVITATION GENERATOR */}
      <Dialog open={isWaModalOpen} onOpenChange={setIsWaModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Send className="h-5 w-5" /> Generator Undangan WhatsApp
            </DialogTitle>
            <DialogDescription>
              Kirim teks undangan resmi Hari Posyandu ke grup WhatsApp peternak KTT Mindajaya.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono whitespace-pre-line border border-slate-800 leading-relaxed max-h-60 overflow-y-auto">
              {waInviteText}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button variant="outline" onClick={handleCopyWaText} className="gap-1.5 text-xs">
                <Copy className="h-3.5 w-3.5" /> Salin Teks
              </Button>
              <Button onClick={handleOpenWaWeb} className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs">
                <Share2 className="h-3.5 w-3.5" /> Kirim via WA
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: ADD NEW POSYANDU SCHEDULE */}
      <Dialog open={isAddJadwalOpen} onOpenChange={setIsAddJadwalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Plus className="h-5 w-5" /> Buat Jadwal Posyandu Baru
            </DialogTitle>
            <DialogDescription>
              Jadwalkan tanggal dan lokasi sesi Posyandu Ternak berikutnya.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddJadwalSubmit} className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label htmlFor="tanggal">Tanggal Posyandu</Label>
              <Input
                id="tanggal"
                type="date"
                value={newJadwal.tanggal}
                onChange={(e) => setNewJadwal({ ...newJadwal, tanggal: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="tema">Tema & Agenda Kegiatan</Label>
              <Input
                id="tema"
                value={newJadwal.tema}
                onChange={(e) => setNewJadwal({ ...newJadwal, tema: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="lokasi">Lokasi Kandang / Tempat</Label>
              <Input
                id="lokasi"
                value={newJadwal.lokasi}
                onChange={(e) => setNewJadwal({ ...newJadwal, lokasi: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="peserta">Target Kuota Peserta (Peternak)</Label>
              <Input
                id="peserta"
                type="number"
                value={newJadwal.peserta}
                onChange={(e) => setNewJadwal({ ...newJadwal, peserta: Number(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddJadwalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold">
                Simpan Agenda Posyandu
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
