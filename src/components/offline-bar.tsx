import { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw, Bell, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getOfflineQueue,
  syncOfflineQueue,
  requestAndroidNotificationPermission,
} from "@/lib/offline-sync";
import { toast } from "sonner";

export function OfflineSyncBar() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== "undefined" ? navigator.onLine : true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const updateStatus = () => {
    setIsOnline(navigator.onLine);
    setPendingCount(getOfflineQueue().length);
  };

  useEffect(() => {
    updateStatus();

    const handleOnline = () => {
      setIsOnline(true);
      toast.success("🌐 Internet terhubung! Memulai sinkronisasi otomatis...");
      handleSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("📶 Modus Offline (Kandang) Aktif. Data akan disimpan di HP.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    const interval = setInterval(updateStatus, 3000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    await syncOfflineQueue();
    setPendingCount(getOfflineQueue().length);
    setIsSyncing(false);
  };

  const handleRequestNotif = async () => {
    await requestAndroidNotificationPermission();
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      {/* Network Status Badge */}
      {isOnline ? (
        <Badge variant="outline" className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
          <Wifi className="h-3 w-3" /> Online
        </Badge>
      ) : (
        <Badge variant="outline" className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-600 border-amber-500/40 font-bold animate-pulse">
          <WifiOff className="h-3 w-3" /> Offline Kandang ({pendingCount})
        </Badge>
      )}

      {/* Sync Action Button when offline actions pending */}
      {pendingCount > 0 && isOnline && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleSync}
          disabled={isSyncing}
          className="h-7 text-xs gap-1 border-primary/40 text-primary hover:bg-primary/10"
        >
          <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
          Sinkronkan ({pendingCount})
        </Button>
      )}
    </div>
  );
}
