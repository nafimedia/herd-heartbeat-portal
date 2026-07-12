import { createFileRoute } from "@tanstack/react-router";
import { Wheat, TriangleAlert, Package, Plus } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { stokPakan } from "@/lib/mock-data";

export const Route = createFileRoute("/pakan")({
  head: () => ({
    meta: [
      { title: "Pakan & Stok — TernakPro" },
      { name: "description", content: "Manajemen stok pakan, konsentrat, dan suplemen ternak." },
    ],
  }),
  component: PakanPage,
});

function PakanPage() {
  const kritis = stokPakan.filter((s) => s.stok < s.minimum).length;
  const totalItem = stokPakan.length;
  const totalStok = stokPakan.reduce((a, s) => a + s.stok, 0);

  return (
    <DashboardShell
      title="Pakan & Stok"
      subtitle="Pantau ketersediaan pakan, konsentrat, dan suplemen"
      actions={
        <Button>
          <Plus /> Tambah Stok
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Item" value={String(totalItem)} hint="Jenis pakan terdaftar" icon={Package} tone="primary" />
        <StatCard label="Total Stok" value={totalStok.toLocaleString("id-ID")} hint="kg + pcs gabungan" icon={Wheat} tone="accent" />
        <StatCard label="Item Kritis" value={String(kritis)} hint="Di bawah stok minimum" icon={TriangleAlert} tone="warning" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Daftar Stok Pakan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Pakan</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="w-64">Level Stok</TableHead>
                  <TableHead className="text-right">Stok</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stokPakan.map((s) => {
                  const ratio = Math.min(100, (s.stok / (s.minimum * 3)) * 100);
                  const kritis = s.stok < s.minimum;
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.nama}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{s.kategori}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{s.supplier}</TableCell>
                      <TableCell>
                        <Progress value={ratio} className={kritis ? "[&>div]:bg-destructive" : "[&>div]:bg-success"} />
                        <div className="mt-1 text-xs text-muted-foreground">Min. {s.minimum} {s.satuan}</div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-medium tabular-nums">
                        {s.stok.toLocaleString("id-ID")} {s.satuan}
                      </TableCell>
                      <TableCell>
                        {kritis ? (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                            Kritis
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-success/15 text-success border-success/30">
                            Aman
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
