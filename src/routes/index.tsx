import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Beef,
  HeartPulse,
  Milk,
  Wheat,
  QrCode,
  Smartphone,
  WifiOff,
  Stethoscope,
  Download,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CalendarHeart,
  FileSpreadsheet,
  Award,
  Layers,
  ChevronRight,
  Activity,
  Egg,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KARTANING — Sistem Pendataan & Rekam Medis Peternakan Digital" },
      {
        name: "description",
        content:
          "KARTANING: Sistem Pendataan & Manajemen Rekam Medis Peternakan Mindajaya Farm x PKM UNU Purwokerto. Multi-jenis ternak (Sapi, Kambing, Domba, Ayam, Bebek), QR Tag 88mm, Posyandu, PWA Offline, dan Laporan Rekap Bulanan A4.",
      },
    ],
  }),
  component: LandingPage,
});

const livestockShowcase = [
  {
    id: "cattle",
    label: "🐄 Sapi Limousin",
    tag: "SP-001 Sapi Limousin",
    species: "Sapi Limousin",
    status: "🟢 Sehat",
    weight: "540 kg (+4.8kg)",
    image: "/images/cattle.png",
    owner: "Pak Tono",
    details: "Kandang A-01 • Inseminasi Buatan • QR Tag 88mm Active",
  },
  {
    id: "goat",
    label: "🐐 Kambing PE",
    tag: "MJ-KB-001 Kambing PE",
    species: "Kambing Peranakan Etawa",
    status: "🤰 Bunting Sehat",
    weight: "75 kg (+2.1kg)",
    image: "/images/goat.png",
    owner: "Pak Tono",
    details: "Kandang B-02 • Posyandu Rutin • Bebas PMK",
  },
  {
    id: "sheep",
    label: "🐑 Domba & Unggas",
    tag: "MJ-DM-003 Domba Garut",
    species: "Domba Garut & Unggas",
    status: "🟢 Prima",
    weight: "62 kg (Optimal)",
    image: "/images/sheep.png",
    owner: "Pak Budi",
    details: "Kandang C-04 • Produksi 45 Telur/hari",
  },
];

export function LandingPage() {
  const [activeTab, setActiveTab] = useState("cattle");
  const currentLivestock = livestockShowcase.find((l) => l.id === activeTab) || livestockShowcase[0];

  const features = [
    {
      icon: Beef,
      title: "Pendataan Multi-Jenis Ternak",
      desc: "Mencakup Sapi (Limousin, Simmental), Kambing (Etawa PE, Jawa), Domba (Garut, Texel), serta Unggas (Ayam & Bebek). Lengkap dengan identitas pemilik & ras.",
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      icon: QrCode,
      title: "Identifikasi QR Tag 88mm & Scan",
      desc: "Format cetak label ear tag 88mm khusus peternakan. Dilengkapi kamera scanner QR interaktif untuk melihat kartu kesehatan digital dalam hitungan detik.",
      color: "from-teal-500/20 to-emerald-500/10 text-teal-400 border-teal-500/30",
    },
    {
      icon: CalendarHeart,
      title: "Alur 5 Langkah Posyandu Ternak",
      desc: "Sistem operasional Posyandu bulanan: Pendaftaran, Penimbangan, Pemeriksaan Dokter Hewan, Tindakan Medis, dan Pencatatan Rekap.",
      color: "from-cyan-500/20 to-emerald-500/10 text-cyan-400 border-cyan-500/30",
    },
    {
      icon: WifiOff,
      title: "Modus PWA Offline Kandang",
      desc: "Penginputan data tetap lancar di area kandang yang tidak ada sinyal internet. Data otomatis tersinkron begitu HP terhubung kembali ke internet.",
      color: "from-amber-500/20 to-emerald-500/10 text-amber-400 border-amber-500/30",
    },
    {
      icon: HeartPulse,
      title: "Kartu Kesehatan Medis Digital",
      desc: "Rekam medis lengkap ternak: kondisi fisik, riwayat vaksinasi PMK, deworming, nafsu makan, feses, dan grafik pertumbuhan bobot badan.",
      color: "from-rose-500/20 to-emerald-500/10 text-rose-400 border-rose-500/30",
    },
    {
      icon: FileSpreadsheet,
      title: "Ekspor Laporan Rekap Bulanan A4",
      desc: "Cetak laporan resmi A4 PDF dengan tanda tangan Ketua KTT & Tim UNU Purwokerto, serta fitur ekspor data instan ke format CSV/Excel.",
      color: "from-purple-500/20 to-emerald-500/10 text-purple-400 border-purple-500/30",
    },
  ];

  const stats = [
    { value: "100%", label: "Dukungan Mode PWA Offline", hint: "Tanpa Sinyal di Kandang" },
    { value: "88 mm", label: "Standar Ukuran QR Ear Tag", hint: "Label Telinga Ternak" },
    { value: "5 Spesies", label: "Multi-Jenis Ternak", hint: "Sapi, Kambing, Domba, Ayam, Bebek" },
    { value: "PDF A4", label: "Laporan Rekapitulasi Resmi", hint: "Dengan Tanda Tangan Digital" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans overflow-x-hidden">
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[350px] sm:h-[500px] w-[350px] sm:w-[500px] rounded-full bg-emerald-600/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[400px] sm:h-[600px] w-[400px] sm:w-[600px] rounded-full bg-teal-600/15 blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 h-[350px] sm:h-[500px] w-[350px] sm:w-[500px] rounded-full bg-emerald-500/10 blur-[130px]" />
      </div>

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-1 sm:p-1.5 backdrop-blur shadow-inner">
              <img
                src="/images/logomindajaya.png"
                alt="Logo KARTANING"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-xl font-black tracking-tight text-white">KARTANING</span>
                <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-[9px] sm:text-[10px] text-emerald-400 font-bold px-1.5 py-0">
                  v1.0
                </Badge>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate max-w-[170px] sm:max-w-none">
                PKM UNU Purwokerto x Mindajaya
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button asChild variant="ghost" className="hidden md:inline-flex text-xs text-slate-300 hover:text-white hover:bg-white/10">
              <Link to="/panduan">
                <BookOpen className="mr-1.5 h-4 w-4 text-emerald-400" /> Buku Panduan
              </Link>
            </Button>

            <Button asChild className="gap-1.5 rounded-xl bg-emerald-500 px-3.5 sm:px-5 py-2 font-bold text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 text-xs sm:text-sm">
              <Link to="/login">
                <span>Masuk Portal</span> <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-14 sm:pb-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] sm:text-xs font-bold text-emerald-400 shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              Sistem Manajemen Peternakan Presisi 4.0
            </div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.18]">
              Pendataan & Rekam Medis Peternakan{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                Digital Terpadu.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 leading-relaxed font-normal">
              Aplikasi manajemen peternakan berbasis web & PWA mobile. Kelola populasi ternak (Sapi, Kambing, Domba, Ayam, Bebek), cetak label QR tag 88mm, operasional Hari Posyandu, dan pemantauan stok pakan secara efisien.
            </p>

            {/* Action Buttons (Mobile-first responsive full-width) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <Button asChild size="lg" className="rounded-xl sm:rounded-2xl bg-emerald-500 px-6 font-bold text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/25 transition-all text-xs sm:text-sm w-full sm:w-auto justify-center">
                <Link to="/login">
                  Buka Portal Administrator <ArrowRight className="ml-1.5 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="rounded-xl sm:rounded-2xl border-white/15 bg-slate-900/80 px-5 text-white hover:bg-slate-800 backdrop-blur text-xs sm:text-sm w-full sm:w-auto justify-center">
                <a href="/downloads/kartaning-v1.0.apk" download="kartaning-v1.0.apk">
                  <Download className="mr-1.5 h-4 w-4 text-emerald-400" /> Download APK Android
                </a>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 text-[11px] sm:text-xs text-slate-400">
              <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/60 px-2.5 py-1.5 backdrop-blur">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>100% Offline Kandang</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/60 px-2.5 py-2 backdrop-blur">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Format Rekap A4</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/60 px-2.5 py-1.5 backdrop-blur">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>MySQL & JSON</span>
              </div>
            </div>
          </div>

          {/* Right Hero Showcase Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 opacity-30 blur-xl transition duration-500 group-hover:opacity-60" />

              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-emerald-950/50 p-3.5 sm:p-5 shadow-2xl backdrop-blur-2xl">
                
                {/* SPECIES TAB SELECTOR (Horizontal Scroll Responsive) */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-white/10 mb-3 overflow-x-auto scrollbar-none">
                  {livestockShowcase.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-1.5 px-2.5 sm:px-3 rounded-lg text-[11px] sm:text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
                        activeTab === tab.id
                          ? "bg-emerald-500 text-slate-950 shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* HERO LIVESTOCK IMAGE CONTAINER */}
                <div className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-slate-950/80 mb-3 h-52 sm:h-72">
                  <img
                    src={currentLivestock.image}
                    alt={currentLivestock.species}
                    className="h-full w-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* FLOATING OVERLAY BADGES */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                    <Badge variant="outline" className="border-emerald-500/50 bg-slate-950/90 text-emerald-400 text-[10px] sm:text-xs font-bold backdrop-blur">
                      {currentLivestock.tag}
                    </Badge>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-bold backdrop-blur">
                      {currentLivestock.status}
                    </Badge>
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap items-center justify-between gap-1 text-[11px] sm:text-xs text-white">
                    <div className="flex items-center gap-1.5 bg-slate-950/90 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur">
                      <Activity className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="font-bold">{currentLivestock.weight}</span>
                    </div>
                    <div className="bg-slate-950/90 px-2.5 py-1 rounded-lg border border-white/10 text-[10px] sm:text-[11px] text-slate-300 backdrop-blur">
                      Pemilik: {currentLivestock.owner}
                    </div>
                  </div>
                </div>

                {/* DETAILS MINI CARD */}
                <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-slate-800/80 p-2.5 shadow-md backdrop-blur text-[11px] sm:text-xs">
                  <div className="flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 font-medium truncate">{currentLivestock.details}</span>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[9px] shrink-0 ml-1">
                    Aktif
                  </Badge>
                </div>

                {/* Bottom Quick Link */}
                <div className="mt-3 pt-2 border-t border-white/10 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-[11px] sm:text-xs font-bold text-emerald-400 hover:underline gap-1"
                  >
                    Buka Kartu Kesehatan Digital <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRIC STATS STRIP */}
      <section className="relative z-10 border-y border-white/10 bg-slate-900/60 py-8 sm:py-10 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-0.5 text-center sm:text-left">
                <p className="text-2xl sm:text-4xl font-black text-emerald-400">{stat.value}</p>
                <p className="text-xs font-bold text-white leading-tight">{stat.label}</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400">{stat.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS GRID */}
      <section className="relative z-10 mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-14">
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-400 font-bold px-3 py-1">
            Fitur Unggulan Sistem
          </Badge>
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
            Solusi Lengkap Manajemen Peternakan Modern
          </h2>
          <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
            Dirancang khusus untuk memenuhi kebutuhan operasional kelompok ternak, dokter hewan, dan peternak di lapangan.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <Card key={idx} className="border-white/10 bg-slate-900/80 hover:border-emerald-500/40 transition-all duration-300 backdrop-blur-xl shadow-lg">
                <CardHeader className="p-4 sm:p-6 pb-2">
                  <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br border ${item.color} mb-2`}>
                    <IconComp className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <CardTitle className="text-base sm:text-lg font-bold text-white">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* DOWNLOAD APK & PWA SECTION (Full Mobile Responsive) */}
      <section className="relative z-10 mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="rounded-2xl sm:rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 p-5 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="space-y-3 sm:space-y-4 lg:col-span-8 text-left">
              <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-400 font-bold">
                Aplikasi Mobile & PWA Offline
              </Badge>
              <h2 className="text-xl sm:text-3xl font-bold text-white">
                Akses KARTANING Langsung dari Smartphone Android Anda
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Unduh file penginstalan aplikasi Android (.APK) atau aktifkan Progressive Web App (PWA) di HP untuk penginputan data cepat di area kandang yang minim sinyal internet.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Button asChild className="rounded-xl bg-emerald-500 font-bold text-slate-950 hover:bg-emerald-400 shadow-lg text-xs sm:text-sm justify-center">
                  <a href="/downloads/kartaning-v1.0.apk" download="kartaning-v1.0.apk">
                    <Download className="mr-1.5 h-4 w-4" /> Download APK Android (kartaning-v1.0.apk)
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs sm:text-sm justify-center">
                  <Link to="/panduan">
                    <BookOpen className="mr-1.5 h-4 w-4 text-emerald-400" /> Petunjuk Install PWA
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:col-span-4">
              <div className="flex flex-col items-center p-5 rounded-xl border border-white/15 bg-slate-900/90 text-center space-y-2 shadow-xl w-full sm:w-auto">
                <QrCode className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">Scan QR / Buka di HP</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">Aplikasi Ringan & Responsif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950 py-8 sm:py-10 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <img src="/images/logomindajaya.png" alt="Minda Jaya Logo" className="h-6 w-6 object-contain" />
            <span className="font-bold text-white">KARTANING System</span>
          </div>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed text-[11px] sm:text-xs">
            Dibuat dan dikembangkan oleh <strong>Tim PKM Posyandu Ternak UNU Purwokerto</strong> bekerjasama dengan <strong>Kelompok Tani Ternak Mindajaya Farm 2026</strong>.
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-300">© 2026 KARTANING. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
