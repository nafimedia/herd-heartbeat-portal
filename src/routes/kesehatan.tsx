import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlus, HeartPulse, Syringe, Stethoscope, ShieldAlert } from "lucide-react";
import { DashboardShell, StatCard } from "@/features/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { jadwalKesehatan } from "@/lib/mock-data";

export const Route = createFileRoute("/kesehatan")({
  head: () => ({
    meta: [
      { title: "Kesehatan — TernakPro" },
      { name: "description", content: "Jadwal vaksinasi, pengobatan, dan pemeriksaan rutin ternak." },
    ],
  }),
  component: KesehatanPage,
});

const statusColor: Record<string, string> = {
  Terjadwal: "bg-primary/10 text-primary border-primary/30",
  Selesai: "bg-success/15 text-success border-success/30",
  Tertunda: "bg-destructive/10 text-destructive border-destructive/30",
};

function KesehatanPage() {
  return (
    <DashboardShell
      title="Manajemen Kesehatan"
      subtitle="Pantau vaksinasi, pengobatan, dan pemeriksaan rutin"
      actions={
        <Button>
          <CalendarPlus /> Jadwalkan Tindakan
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Ternak Sehat" value="168" hint="81% populasi" icon={HeartPulse} tone="success" />
        <StatCard label="Perlu Pengobatan" value="9" hint="Aktif dalam perawatan" icon={Stethoscope} tone="destructive" />
        <StatCard label="Vaksinasi Bulan Ini" value="42" hint="Selesai dari target 50" icon={Syringe} tone="primary" />
        <StatCard label="Dalam Karantina" value="6" hint="Isolasi khusus" icon={ShieldAlert} tone="warning" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Jadwal Tindakan Kesehatan</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">Agenda 7 hari ke depan dan riwayat terbaru</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tag Ternak</TableHead>
                  <TableHead>Tindakan</TableHead>
                  <TableHead>Petugas</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jadwalKesehatan.map((j) => (
                  <TableRow key={j.id}>
                    <TableCell>
                      {new Date(j.tanggal).toLocaleDateString("id-ID", { weekday: "short", day: "2-digit", month: "short" })}
                    </TableCell>
                    <TableCell className="font-mono font-medium">{j.tag}</TableCell>
                    <TableCell>{j.tindakan}</TableCell>
                    <TableCell className="text-muted-foreground">{j.petugas}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColor[j.status]}>
                        {j.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
