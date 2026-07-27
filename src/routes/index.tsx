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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    tag: "MJ-KB-001 Kambing PE Etawa",
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
    species: "Domba Garut & Unggas Pekarangan",
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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-emerald-600/15 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-teal-600/15 blur-[160px]" />
        <div className="absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[150px]" />
      </div>

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-1.5 backdrop-blur shadow-inner">
              <img
                src="/images/logomindajaya.png"
                alt="Logo KARTANING"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">KARTANING</span>
                <Badge variant="outline" className="hidden sm:inline-flex border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-400 font-bold">
                  v1.0 Ready
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">PKM UNU Purwokerto x Mindajaya Farm</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="hidden sm:inline-flex text-xs text-slate-300 hover:text-white hover:bg-white/10">
              <Link to="/panduan">
                <BookOpen className="mr-1.5 h-4 w-4 text-emerald-400" /> Buku Panduan
              </Link>
            </Button>

            <Button asChild className="gap-2 rounded-xl bg-emerald-500 px-5 font-bold text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/25 transition-all">
              <Link to="/login">
                Masuk Portal Admin <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-10 pb-20 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Content */}
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
              Sistem Manajemen Peternakan Presisi 4.0
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.15]">
              Pendataan & Rekam Medis Peternakan{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                Digital Terpadu.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Aplikasi manajemen peternakan berbasis web & PWA mobile. Kelola populasi ternak (Sapi, Kambing, Domba, Ayam, Bebek), cetak label QR tag 88mm, operasional Hari Posyandu, dan pemantauan stok pakan secara efisien.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button asChild size="lg" className="rounded-2xl bg-emerald-500 px-7 font-bold text-slate-950 hover:bg-emerald-400 shadow-xl shadow-emerald-500/30 transition-all text-sm">
                <Link to="/login">
                  Buka Portal Administrator <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/15 bg-slate-900/80 px-6 text-white hover:bg-slate-800 backdrop-blur text-sm">
                <Link to="/panduan">
                  <Smartphone className="mr-2 h-5 w-5 text-emerald-400" /> Download APK & PWA
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2 backdrop-blur">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>100% Dukungan Offline Kandang</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2 backdrop-blur">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Format Rekap Resmi A4</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/60 px-3.5 py-2 backdrop-blur">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Database MySQL & JSON</span>
              </div>
            </div>
          </div>

          {/* Right Hero Showcase Visual Card with MULTI-SPECIES TABBED GALLERY */}
          <div className="lg:col-span-5">
            <div className="relative group">
              {/* BACKDROP GLOW EFFECT */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 opacity-30 blur-xl transition duration-500 group-hover:opacity-60" />

              <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/95 via-slate-900/85 to-emerald-950/50 p-5 shadow-2xl backdrop-blur-2xl">
                
                {/* SPECIES TAB SELECTOR */}
                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-white/10 mb-4 overflow-x-auto">
                  {livestockShowcase.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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
                <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-950/80 mb-3 h-64 sm:h-72">
                  <img
                    src={currentLivestock.image}
                    alt={currentLivestock.species}
                    className="h-full w-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* FLOATING OVERLAY BADGES ON IMAGE */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge variant="outline" className="border-emerald-500/50 bg-slate-950/80 text-emerald-400 text-xs font-bold backdrop-blur">
                      {currentLivestock.tag}
                    </Badge>
                  </div>

                  <div className="absolute top-3 right-3">
                    <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/20 text-emerald-300 text-xs font-bold backdrop-blur">
                      {currentLivestock.status}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur">
                      <Activity className="h-4 w-4 text-emerald-400" />
                      <span className="font-bold">Bobot: {currentLivestock.weight}</span>
                    </div>
                    <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-slate-300 backdrop-blur">
                      Pemilik: {currentLivestock.owner}
                    </div>
                  </div>
                </div>

                {/* DETAILS MINI CARD */}
                <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-slate-800/80 p-3 shadow-md backdrop-blur text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 font-medium truncate">{currentLivestock.details}</span>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-[10px] shrink-0">
                    Terverifikasi
                  </Badge>
                </div>

                {/* Bottom Quick Link */}
                <div className="mt-3 pt-2.5 border-t border-white/10 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-xs font-bold text-emerald-400 hover:underline gap-1"
                  >
                    Buka Rekam Medis & Kartu Kesehatan Digital <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRIC STATS STRIP */}
      <section className="relative z-10 border-y border-white/10 bg-slate-900/60 py-10 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1 text-center sm:text-left">
                <p className="text-3xl font-black text-emerald-400 sm:text-4xl">{stat.value}</p>
                <p className="text-xs font-bold text-white">{stat.label}</p>
                <p className="text-[11px] text-slate-400">{stat.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS GRID */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-400 font-bold px-3 py-1">
            Fitur Unggulan Sistem
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Solusi Lengkap Manajemen Peternakan Modern
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Dirancang khusus untuk memenuhi kebutuhan operasional kelompok ternak, dokter hewan, dan peternak di lapangan.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <Card key={idx} className="border-white/10 bg-slate-900/80 hover:border-emerald-500/40 transition-all duration-300 backdrop-blur-xl shadow-lg">
                <CardHeader>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br border ${item.color} mb-2`}>
                    <IconComp className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg font-bold text-white">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* DOWNLOAD APK & PWA SECTION */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="space-y-4 lg:col-span-8">
              <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-400 font-bold">
                Aplikasi Mobile & PWA Offline
              </Badge>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Akses KARTANING Langsung dari Smartphone Android Anda
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Unduh file penginstalan aplikasi Android (.APK) atau aktifkan Progressive Web App (PWA) di HP untuk penginputan data cepat di area kandang yang minim sinyal internet.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild className="rounded-xl bg-emerald-500 font-bold text-slate-950 hover:bg-emerald-400 shadow-lg text-xs">
                  <a href="/downloads/kartaning-v1.0.apk" download="kartaning-v1.0.apk">
                    <Download className="mr-1.5 h-4 w-4" /> Download APK Android (kartaning-v1.0.apk)
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-xl border-white/20 bg-white/5 text-white hover:bg-white/10 text-xs">
                  <Link to="/panduan">
                    <BookOpen className="mr-1.5 h-4 w-4 text-emerald-400" /> Petunjuk Install PWA
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:col-span-4">
              <div className="flex flex-col items-center p-6 rounded-2xl border border-white/15 bg-slate-900/90 text-center space-y-3 shadow-xl">
                <QrCode className="h-16 w-16 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">Scan QR / Buka di HP</p>
                  <p className="text-[11px] text-slate-400">Aplikasi Ringan & Responsif</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950 py-10 text-center text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <img src="/images/logomindajaya.png" alt="Minda Jaya Logo" className="h-6 w-6 object-contain" />
            <span className="font-bold text-white">KARTANING System</span>
          </div>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
            Dibuat dan dikembangkan oleh <strong>Tim PKM Posyandu Ternak UNU Purwokerto</strong> bekerjasama dengan <strong>Kelompok Tani Ternak Mindajaya Farm 2026</strong>.
          </p>
          <p className="text-[11px] text-slate-300">© 2026 KARTANING. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
