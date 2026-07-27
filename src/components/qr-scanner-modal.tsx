import { useState } from "react";
import { QrCode, Search, Camera, Check, X, ArrowRight, Beef, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEMO_TAGS = [
  { tag: "SP-001", name: "Sapi Limousin A-01", jenis: "Sapi", status: "Sehat", kandang: "Kandang Sapi A" },
  { tag: "SP-002", name: "Sapi Simmental A-02", jenis: "Sapi", status: "Bunting Sehat", kandang: "Kandang Sapi A" },
  { tag: "KB-014", name: "Kambing Etawa PE B-01", jenis: "Kambing", status: "Sehat", kandang: "Kandang Kambing B" },
  { tag: "DM-007", name: "Domba Garut C-01", jenis: "Domba", status: "Sehat", kandang: "Kandang Domba C" },
  { tag: "AY-101", name: "Ayam Layer Petelur D-01", jenis: "Ayam", status: "Sehat", kandang: "Kandang Unggas D" },
  { tag: "BK-201", name: "Bebek Mojosari E-01", jenis: "Bebek", status: "Sehat", kandang: "Kandang Unggas E" },
];

export function QrScannerModal({ isOpen, onClose }: QrScannerModalProps) {
  const navigate = useNavigate();
  const [scannedInput, setScannedInput] = useState("");
  const [isScanningSimulated, setIsScanningSimulated] = useState(false);

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTag = scannedInput.trim().toUpperCase();
    if (!cleanTag) {
      toast.error("Masukkan atau pindai Tag ID Ternak.");
      return;
    }

    toast.success(`Tag ${cleanTag} berhasil dipindai! Membuka data medis...`);
    onClose();
    navigate({ to: "/ternak", search: { q: cleanTag } as any });
  };

  const handleSelectDemo = (tag: string) => {
    setIsScanningSimulated(true);
    setTimeout(() => {
      setIsScanningSimulated(false);
      toast.success(`Tag ${tag} terdeteksi via QR Scanner!`);
      onClose();
      navigate({ to: "/ternak", search: { q: tag } as any });
    }, 600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-border/80 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <QrCode className="h-5 w-5 text-primary" /> Pemindai QR Tag Ternak
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Simulated Camera Viewfinder */}
          <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-slate-950 p-6 text-white overflow-hidden shadow-inner min-h-[190px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,197,94,0.15),_transparent_70%)] pointer-events-none" />

            {/* Scanning Line Animation */}
            <div className="absolute inset-x-4 top-1/2 h-0.5 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-pulse" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-bounce">
                <Camera className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold text-emerald-300">
                {isScanningSimulated ? "Memproses Pemindaian Tag..." : "Arahkan Kamera ke QR Tag Ternak"}
              </p>
              <p className="text-[10px] text-slate-400 max-w-xs">
                Kamera aktif secara otomatis. Pemindaian real-time akan mendeteksi Ear Tag ternak secara instan.
              </p>
            </div>
          </div>

          {/* Manual Input Fallback */}
          <form onSubmit={handleScanSubmit} className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Ketik / Tempel Hasil Scan Ear Tag ID:</label>
            <div className="flex gap-2">
              <Input
                placeholder="Contoh: KB-014 / SP-001"
                value={scannedInput}
                onChange={(e) => setScannedInput(e.target.value)}
                className="font-mono text-sm uppercase"
              />
              <Button type="submit">
                Cari <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Quick Demo Scan Selectors */}
          <div className="space-y-1.5 pt-2 border-t border-border/60">
            <p className="text-[11px] font-semibold text-muted-foreground">Atau Uji Coba Pindai Tag Demo:</p>
            <div className="grid grid-cols-2 gap-1.5">
              {DEMO_TAGS.map((item) => (
                <button
                  key={item.tag}
                  type="button"
                  onClick={() => handleSelectDemo(item.tag)}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/40 p-2 text-left text-xs hover:bg-muted transition-colors"
                >
                  <div className="font-mono font-bold text-foreground">{item.tag}</div>
                  <Badge variant="outline" className="text-[10px]">
                    {item.jenis}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
