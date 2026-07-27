import { toast } from "sonner";

export interface OfflineAction {
  id: string;
  type: "CREATE_ANIMAL" | "UPDATE_ANIMAL" | "HEALTH_CHECK" | "FEED_USAGE" | "MEDICINE_USAGE" | "PRODUCTION_LOG";
  payload: Record<string, unknown>;
  timestamp: string;
  description: string;
}

const OFFLINE_QUEUE_KEY = "kartaning_offline_actions_queue";

// Get all pending offline actions
export function getOfflineQueue(): OfflineAction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? (JSON.parse(raw) as OfflineAction[]) : [];
  } catch {
    return [];
  }
}

// Add an action to the offline queue
export function saveOfflineAction(type: OfflineAction["type"], payload: Record<string, unknown>, description: string): void {
  if (typeof window === "undefined") return;

  const queue = getOfflineQueue();
  const newAction: OfflineAction = {
    id: `off-${Date.now()}`,
    type,
    payload,
    timestamp: new Date().toISOString(),
    description,
  };

  const updatedQueue = [newAction, ...queue];
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updatedQueue));

  toast.info(`📶 Modus Offline (Kandang): ${description} disimpan ke HP.`);
  triggerAndroidNotification("📶 Modus Offline Kandang", {
    body: `${description} tersimpan di memori HP. Akan disinkronkan begitu internet kembali.`,
  });
}

// Clear offline queue
export function clearOfflineQueue(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
}

// Flush and sync all queued actions to backend API
export async function syncOfflineQueue(): Promise<number> {
  const queue = getOfflineQueue();
  if (queue.length === 0) return 0;

  toast.loading(`Disinkronkan: Mengirim ${queue.length} data offline ke server...`, { id: "sync-toast" });

  let successCount = 0;
  for (const action of queue) {
    try {
      if (action.type === "CREATE_ANIMAL" || action.type === "UPDATE_ANIMAL") {
        await fetch("/api/animals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(action.payload),
        });
      }
      successCount++;
    } catch (err) {
      console.warn("Failed to sync offline action:", action, err);
    }
  }

  clearOfflineQueue();
  toast.dismiss("sync-toast");
  toast.success(`✅ Berhasil! ${successCount} data offline tersinkronisasi ke server.`, { duration: 5000 });

  triggerAndroidNotification("✅ Sinkronisasi Offline Sukses", {
    body: `${successCount} data dari kandang berhasil diunggah ke database KARTANING.`,
  });

  return successCount;
}

// ANDROID PUSH / LOCAL NOTIFICATION HELPER
export async function requestAndroidNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    toast.error("Perangkat ini tidak mendukung notifikasi push.");
    return false;
  }

  if (Notification.permission === "granted") {
    toast.success("Notifikasi Android sudah aktif.");
    return true;
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    toast.success("Notifikasi Android berhasil diaktifkan!");
    triggerAndroidNotification("🔔 Notifikasi KARTANING Aktif", {
      body: "Anda akan menerima notifikasi peringatan kesehatan & pakan di layar HP Android Anda.",
    });
    return true;
  } else {
    toast.error("Izin notifikasi ditolak oleh pengguna.");
    return false;
  }
}

export function triggerAndroidNotification(title: string, options?: NotificationOptions & { url?: string }): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  if (Notification.permission === "granted") {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          icon: "/images/logomindajaya.png",
          badge: "/images/logomindajaya.png",
          vibrate: [200, 100, 200],
          ...options,
        } as unknown as NotificationOptions);
      });
    } else {
      new Notification(title, {
        icon: "/images/logomindajaya.png",
        ...options,
      });
    }
  }
}

// Service Worker Registration
export function registerServiceWorker(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("Service Worker registered:", reg.scope);
      })
      .catch((err) => {
        console.warn("Service Worker registration failed:", err);
      });
  });
}
