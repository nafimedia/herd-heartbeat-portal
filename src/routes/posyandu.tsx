import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin, Users, ClipboardCheck, ArrowRight } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { langkahPosyandu, jadwalPosyandu } from "@/lib/kartu-data";

export const Route = createFileRoute("/posyandu")({
  head: () => ({
    meta: [
      { title: "Hari Posyandu Ternak — TernakPro" },
      {
        name: "description",
        content:
          "Alur 5 langkah Posyandu Ternak KARTANING: pendaftaran, penimbangan, pemeriksaan, tindakan, pencatatan.",
      },
    ],
  }),
  component: PosyanduPage,
});

function PosyanduPage() {
  const berikutnya = jadwalPosyandu[0];
  return (
    <DashboardShell
      title="Hari Posyandu Ternak"
      subtitle="Alur kegiatan bulanan Kelompok Tani Ternak Mindajaya"
      actions={<Button><ClipboardCheck /> Mulai Sesi</Button>}
    >
      <Card className="mb-5 border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-primary">
              Jadwal Berikutnya
            </div>
            <div className="mt-1 text-lg font-semibold">{berikutnya.tema}</div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {new Date(berikutnya.tanggal).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {berikutnya.lokasi}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {berikutnya.peserta} peternak
              </span>
            </div>
          </div>
          <Button variant="outline" className="bg-background">
            Kirim Undangan
          </Button>
        </CardContent>
      </Card>

      <div className="mb-2 text-sm font-semibold">Alur 5 Langkah</div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        {langkahPosyandu.map((l, i) => (
          <div key={l.no} className="relative">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {l.no}
                  </div>
                  <CardTitle className="text-base">{l.judul}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <p className="text-sm text-muted-foreground">{l.deskripsi}</p>
                <Badge variant="secondary" className="text-xs">
                  PJ: {l.pj}
                </Badge>
              </CardContent>
            </Card>
            {i < langkahPosyandu.length - 1 && (
              <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-primary xl:block" />
            )}
          </div>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Jadwal Mendatang</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-3 py-2 font-medium">Tanggal</th>
                  <th className="px-3 py-2 font-medium">Tema</th>
                  <th className="px-3 py-2 font-medium">Lokasi</th>
                  <th className="px-3 py-2 font-medium">Peserta</th>
                </tr>
              </thead>
              <tbody>
                {jadwalPosyandu.map((j) => (
                  <tr key={j.tanggal} className="border-t">
                    <td className="px-3 py-2">
                      {new Date(j.tanggal).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-3 py-2 font-medium">{j.tema}</td>
                    <td className="px-3 py-2 text-muted-foreground">{j.lokasi}</td>
                    <td className="px-3 py-2">{j.peserta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
