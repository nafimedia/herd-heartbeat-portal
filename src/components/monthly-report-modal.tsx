import { useState } from "react";
import { FileText, Printer, Download, Sparkles, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { daftarKartu } from "@/lib/kartu-data";
import { toast } from "sonner";

export function MonthlyReportModal() {
  const [open, setOpen] = useState(false);
  const monthName = "Juli 2026";

  const totalTernak = daftarKartu.length;
  const sehatCount = daftarKartu.filter((k) => k.kondisi.includes("Sehat")).length;
  const sakitCount = daftarKartu.filter((k) => k.kondisi.includes("Sakit")).length;

  const handleExportCSV = () => {
    let csv = "ID Ear Tag,Jenis,Ras,Pemilik,Status Kesehatan,Bobot (kg)\n";
    daftarKartu.forEach((k) => {
      csv += `"${k.idKambing}","${k.jenis || "Kambing"}","${k.ras}","${k.namaPemilik}","${k.kondisi}","${k.bobot}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan_Rekapitulasi_KARTANING_${monthName.replace(/\s+/g, "_")}.csv`;
    link.click();
    toast.success("File Laporan CSV/Excel berhasil diunduh!");
  };

  const handlePrintPDF = () => {
    const printWindow = window.open("", "_blank", "width=850,height=900");
    if (!printWindow) {
      window.print();
      return;
    }

    const rowsHtml = daftarKartu
      .map(
        (k, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td style="font-family: monospace; font-weight: bold;">${k.idKambing}</td>
          <td>${k.jenis || "Kambing"}</td>
          <td>${k.ras}</td>
          <td>${k.namaPemilik}</td>
          <td>${k.bobot} kg</td>
          <td><span class="badge ${k.kondisi.includes("Sehat") ? "bg-green" : "bg-red"}">${k.kondisi}</span></td>
        </tr>
      `
      )
      .join("\n");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Rekapitulasi Operasional - ${monthName}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { font-family: system-ui, sans-serif; color: #000; padding: 10px; }
            .header-report { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 16px; }
            .title { font-size: 18px; font-weight: bold; text-transform: uppercase; }
            .subtitle { font-size: 11px; color: #475569; }
            .summary-box { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
            .stat-card { border: 1.5px solid #000; padding: 10px; border-radius: 8px; text-align: center; }
            .stat-num { font-size: 20px; font-weight: 900; }
            .stat-label { font-size: 10px; color: #475569; text-transform: uppercase; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
            th { background: #f1f5f9; font-weight: bold; }
            .badge { padding: 2px 6px; border-radius: 99px; font-size: 9.5px; font-weight: bold; }
            .bg-green { background: #dcfce7; color: #166534; border: 1px solid #22c55e; }
            .bg-red { background: #fee2e2; color: #991b1b; border: 1px solid #ef4444; }
            .footer-sign { margin-top: 30px; display: flex; justify-content: space-between; font-size: 11px; }
            .sign-box { text-align: center; width: 200px; }
          </style>
        </head>
        <body>
          <div class="header-report">
            <div>
              <div class="title">LAPORAN REKAPITULASI POSYANDU TERNAK</div>
              <div class="subtitle">Kelompok Tani Ternak Mindajaya x UNU Purwokerto • Kemendiktisaintek 2026</div>
            </div>
            <div style="text-align: right; font-size: 11px;">
              <div><strong>Periode:</strong> ${monthName}</div>
              <div><strong>Tanggal Cetak:</strong> ${new Date().toLocaleDateString("id-ID")}</div>
            </div>
          </div>

          <div class="summary-box">
            <div class="stat-card">
              <div class="stat-num">${totalTernak}</div>
              <div class="stat-label">Total Ternak</div>
            </div>
            <div class="stat-card">
              <div class="stat-num" style="color: #166534;">${sehatCount}</div>
              <div class="stat-label">Status Sehat</div>
            </div>
            <div class="stat-card">
              <div class="stat-num" style="color: #991b1b;">${sakitCount}</div>
              <div class="stat-label">Perlu Tindakan</div>
            </div>
            <div class="stat-card">
              <div class="stat-num">100%</div>
              <div class="stat-label">Terdata Digital</div>
            </div>
          </div>

          <h3>Daftar Detail Rekam Medis & Identitas Ternak</h3>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Ear Tag ID</th>
                <th>Jenis</th>
                <th>Ras</th>
                <th>Nama Pemilik</th>
                <th>Bobot</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="footer-sign">
            <div class="sign-box">
              <p>Mengetahui,</p>
              <p><strong>Ketua KTT Mindajaya</strong></p>
              <br/><br/><br/>
              <p>( Pak Tono )</p>
            </div>
            <div class="sign-box">
              <p>Purwokerto, ${new Date().toLocaleDateString("id-ID")}</p>
              <p><strong>Tim PKM UNU Purwokerto</strong></p>
              <br/><br/><br/>
              <p>( Tim Peneliti 2026 )</p>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 border-emerald-500/40 text-emerald-600 hover:bg-emerald-50">
          <FileText className="h-4 w-4" /> Laporan Rekap Bulanan
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-emerald-600" /> Ekspor Laporan Rekap Bulanan
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-foreground">
              <span>Periode Laporan:</span>
              <Badge variant="outline" className="border-emerald-500 text-emerald-600">{monthName}</Badge>
            </div>
            <p className="text-muted-foreground">
              Dokumen rekap resmi populasi ternak, kesehatan, produksi, dan pendataan Posyandu Ternak KTT Mindajaya.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="rounded-lg bg-background p-2 border">
                <p className="font-extrabold text-sm text-foreground">{totalTernak}</p>
                <p className="text-[10px] text-muted-foreground">Ternak</p>
              </div>
              <div className="rounded-lg bg-background p-2 border">
                <p className="font-extrabold text-sm text-emerald-600">{sehatCount}</p>
                <p className="text-[10px] text-muted-foreground">Sehat</p>
              </div>
              <div className="rounded-lg bg-background p-2 border">
                <p className="font-extrabold text-sm text-red-600">{sakitCount}</p>
                <p className="text-[10px] text-muted-foreground">Sakit</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleExportCSV} className="gap-1.5 flex-1">
            <Download className="h-4 w-4" /> Unduh CSV / Excel
          </Button>
          <Button onClick={handlePrintPDF} className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white flex-1 font-semibold">
            <Printer className="h-4 w-4" /> Cetak Laporan A4 (PDF)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
