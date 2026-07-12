import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Filter, Download } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { daftarTernak, type StatusTernak } from "@/lib/mock-data";

export const Route = createFileRoute("/ternak")({
  head: () => ({
    meta: [
      { title: "Data Ternak — TernakPro" },
      { name: "description", content: "Kelola daftar ternak, tag identitas, ras, umur, berat, dan kandang." },
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

function TernakPage() {
  const [query, setQuery] = useState("");
  const [jenisFilter, setJenisFilter] = useState<string>("semua");

  const filtered = daftarTernak.filter((t) => {
    const q = query.toLowerCase();
    const match = t.tag.toLowerCase().includes(q) || t.ras.toLowerCase().includes(q) || t.kandang.toLowerCase().includes(q);
    const jenisOk = jenisFilter === "semua" || t.jenis === jenisFilter;
    return match && jenisOk;
  });

  return (
    <DashboardShell
      title="Data Ternak"
      subtitle={`${daftarTernak.length} ekor tercatat dalam sistem`}
      actions={
        <>
          <Button variant="outline">
            <Download /> Ekspor
          </Button>
          <Button>
            <Plus /> Tambah Ternak
          </Button>
        </>
      }
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Input
              placeholder="Cari tag, ras, atau kandang..."
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
                  <TableHead>Kandang</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tgl Masuk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono font-medium">{t.tag}</TableCell>
                    <TableCell>
                      <div className="font-medium">{t.jenis}</div>
                      <div className="text-xs text-muted-foreground">{t.ras}</div>
                    </TableCell>
                    <TableCell>{t.jenisKelamin}</TableCell>
                    <TableCell className="text-right tabular-nums">{t.umur}</TableCell>
                    <TableCell className="text-right tabular-nums">{t.berat}</TableCell>
                    <TableCell className="font-mono text-sm">{t.kandang}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusVariant[t.status]}>
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(t.tanggalMasuk).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      Tidak ada ternak yang cocok dengan filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
