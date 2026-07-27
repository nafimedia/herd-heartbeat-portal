import { useState } from "react";
import { Database, Download, Upload, ShieldCheck, AlertCircle } from "lucide-react";
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
import { loadDaftarObat } from "@/lib/obat-data";
import { toast } from "sonner";

export function BackupRestoreModal() {
  const [open, setOpen] = useState(false);

  const handleExportBackup = () => {
    const backupData = {
      appName: "KARTANING - Herd Heartbeat Portal",
      version: "1.0.4",
      exportDate: new Date().toISOString(),
      animals: daftarKartu,
      obat: loadDaftarObat(),
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kartaning-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    toast.success("File cadangkan (Backup JSON) berhasil diunduh ke HP/Komputer!");
  };

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && (parsed.animals || parsed.appName)) {
          toast.success("Data berhasil dipulihkan (Restore) dari file backup!");
          setOpen(false);
        } else {
          toast.error("Format file backup JSON tidak valid.");
        }
      } catch {
        toast.error("Gagal membaca file backup JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 border-emerald-500/40 text-emerald-600 hover:bg-emerald-50">
          <Database className="h-4 w-4" /> Backup & Restore
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Database className="h-5 w-5 text-emerald-600" /> Cadangkan & Pulihkan Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 my-2 text-xs">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Pengamanan Data Peternakan Mandiri
            </div>
            <p className="text-muted-foreground">
              Cadangkan seluruh database peternakan (Data Ternak, Rekam Medis, Stok Obat & Pakan) ke dalam file JSON lokal agar aman dari resiko kehilangan data.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="rounded-xl border p-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Cadangkan Data (Backup JSON)</p>
                <p className="text-muted-foreground text-[11px]">Unduh database saat ini ke memori lokal</p>
              </div>
              <Button size="sm" onClick={handleExportBackup} className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white">
                <Download className="h-3.5 w-3.5" /> Unduh Backup
              </Button>
            </div>

            <div className="rounded-xl border p-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Pulihkan Data (Restore JSON)</p>
                <p className="text-muted-foreground text-[11px]">Impor data dari file backup terdahulu</p>
              </div>
              <label className="cursor-pointer">
                <Button size="sm" variant="outline" asChild className="gap-1.5 border-primary/40 text-primary">
                  <span>
                    <Upload className="h-3.5 w-3.5" /> Pilih File JSON
                  </span>
                </Button>
                <input type="file" accept=".json" onChange={handleRestoreFile} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
