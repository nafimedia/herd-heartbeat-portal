import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  HelpCircle,
  Smartphone,
  QrCode,
  WifiOff,
  Stethoscope,
  Download,
  BookOpen,
  FileSpreadsheet,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { DashboardShell } from "@/features/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/panduan")({
  head: () => ({
    meta: [
      { title: "Pusat Panduan & Buku Petunjuk — KARTANING" },
      {
        name: "description",
        content: "Buku petunjuk penggunaan aplikasi KARTANING, install APK Android, cetak QR tag, dan operasi offline kandang.",
      },
    ],
  }),
  component: PanduanPage,
});

function PanduanPage() {
  return (
    <DashboardShell
      title="Pusat Panduan & Buku Petunjuk Digital"
      subtitle="Panduan langkah-demi-langkah penggunaan sistem KARTANING untuk kader posyandu & peternak"
    >
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <Smartphone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Aplikasi Mobile</p>
              <h3 className="font-bold text-base text-foreground">Android APK & PWA</h3>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">Siap Akses Offline Kandang</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ear Tag Presisi</p>
              <h3 className="font-bold text-base text-foreground">Cetak Label & Scan QR</h3>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">Ukuran Standar 88mm</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Posyandu Ternak</p>
              <h3 className="font-bold text-base text-foreground">5 Langkah Posyandu</h3>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">UNU Purwokerto x Mindajaya</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="h-5 w-5 text-emerald-600" /> Panduan Lengkap Penggunaan Sistem
            </CardTitle>
            <CardDescription>
              Pilih topik panduan di bawah ini untuk melihat petunjuk bergambar dan langkah penggunaan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Topik 1: APK & PWA */}
            <div className="rounded-2xl border p-5 space-y-3 bg-card">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                  <Smartphone className="h-5 w-5 text-emerald-600" /> 1. Cara Install & Menjalankan APK Android / PWA
                </h3>
                <Badge className="bg-emerald-600">Langkah Siap Pakai</Badge>
              </div>
              <ol className="space-y-2.5 text-sm text-muted-foreground list-decimal list-inside pl-2">
                <li>
                  <strong className="text-foreground">Download APK Android:</strong> Buka halaman depan aplikasi, lalu klik tombol <span className="text-emerald-600 font-bold">"Download APK Android"</span> untuk mengunduh installer <code className="bg-muted px-1.5 py-0.5 rounded text-xs">kartaning-v1.0.apk</code>.
                </li>
                <li>
                  <strong className="text-foreground">Install di HP:</strong> Buka file installer di HP Android Anda dan setujui izin penginstalan aplikasi dari sumber ini.
                </li>
                <li>
                  <strong className="text-foreground">Opsi PWA (Tanpa File APK):</strong> Buka website di Google Chrome HP Android Anda, klik menu 3 titik di kanan atas Chrome, lalu pilih <span className="text-emerald-600 font-bold">"Tambahkan ke Layar Utama"</span>.
                </li>
                <li>
                  <strong className="text-foreground">Penggunaan Offline di Kandang:</strong> Aplikasi siap dibuka tanpa koneksi internet di area kandang. Data yang diisi akan tersimpan di memori HP dan otomatis terunggah saat HP terhubung internet kembali.
                </li>
              </ol>
            </div>

            {/* Topik 2: Cetak Tag & Scan QR */}
            <div className="rounded-2xl border p-5 space-y-3 bg-card">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                  <QrCode className="h-5 w-5 text-emerald-600" /> 2. Cara Cetak Label Tag (88mm) & Scan Kamera QR
                </h3>
                <Badge variant="outline" className="border-emerald-500 text-emerald-600">Presisi tinggi</Badge>
              </div>
              <ol className="space-y-2.5 text-sm text-muted-foreground list-decimal list-inside pl-2">
                <li>
                  <strong className="text-foreground">Cetak Single Label Tag:</strong> Masuk ke halaman <span className="text-foreground font-semibold">Data Ternak (/ternak)</span> atau <span className="text-foreground font-semibold">Kartu Kesehatan (/kartu)</span>, lalu klik tombol <span className="text-emerald-600 font-bold">"QR Tag"</span> di baris ternak target.
                </li>
                <li>
                  <strong className="text-foreground">Cetak Massal (Batch Print):</strong> Di header modul Kartu Kesehatan, klik tombol <span className="text-emerald-600 font-bold">"Cetak Massal Tag Label"</span> untuk mencetak seluruh label ear tag sekaligus pada lembar A4 / printer stiker.
                </li>
                <li>
                  <strong className="text-foreground">Scan Kamera di Kandang:</strong> Tekan tombol lonceng pemindai QR di header pencarian atas, arahkan kamera HP ke stiker ear tag ternak untuk membuka rekam medis instan.
                </li>
              </ol>
            </div>

            {/* Topik 3: Alur Posyandu Ternak */}
            <div className="rounded-2xl border p-5 space-y-3 bg-card">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-lg flex items-center gap-2 text-foreground">
                  <Stethoscope className="h-5 w-5 text-emerald-600" /> 3. Alur 5 Langkah Posyandu Ternak Mindajaya
                </h3>
                <Badge variant="secondary">UNU Purwokerto 2026</Badge>
              </div>
              <div className="grid gap-3 sm:grid-cols-5 text-xs pt-1">
                <div className="rounded-xl border p-3 bg-muted/40 text-center space-y-1">
                  <span className="font-extrabold text-emerald-600 text-sm">Langkah 1</span>
                  <p className="font-bold text-foreground">Pendaftaran</p>
                  <p className="text-muted-foreground text-[11px]">Kader mencatat kehadiran & buku kartu.</p>
                </div>
                <div className="rounded-xl border p-3 bg-muted/40 text-center space-y-1">
                  <span className="font-extrabold text-emerald-600 text-sm">Langkah 2</span>
                  <p className="font-bold text-foreground">Pengukuran</p>
                  <p className="text-muted-foreground text-[11px]">Ukur bobot, tinggi, panjang, dada.</p>
                </div>
                <div className="rounded-xl border p-3 bg-muted/40 text-center space-y-1">
                  <span className="font-extrabold text-emerald-600 text-sm">Langkah 3</span>
                  <p className="font-bold text-foreground">Pemeriksaan</p>
                  <p className="text-muted-foreground text-[11px]">Pemeriksaan fisik oleh Dokter Hewan.</p>
                </div>
                <div className="rounded-xl border p-3 bg-muted/40 text-center space-y-1">
                  <span className="font-extrabold text-emerald-600 text-sm">Langkah 4</span>
                  <p className="font-bold text-foreground">Tindakan</p>
                  <p className="text-muted-foreground text-[11px]">Pemberian obat cacing & vaksinasi.</p>
                </div>
                <div className="rounded-xl border p-3 bg-muted/40 text-center space-y-1">
                  <span className="font-extrabold text-emerald-600 text-sm">Langkah 5</span>
                  <p className="font-bold text-foreground">Evaluasi</p>
                  <p className="text-muted-foreground text-[11px]">Sinkronisasi data ke KARTANING.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
