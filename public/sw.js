const CACHE_NAME = "kartaning-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/dashboard",
  "/login",
  "/ternak",
  "/kartu",
  "/posyandu",
  "/kesehatan",
  "/produksi",
  "/pakan",
  "/obat",
  "/users",
  "/profile",
  "/images/logomindajaya.png",
  "/manifest.json",
];

// Install Event - Pre-cache Static Assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn("Service Worker pre-cache warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network First with Cache Fallback for Offline Kandang
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          event.request.url.startsWith(self.location.origin)
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Return cached page when offline in barn
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/dashboard");
          }
          return new Response("Offline Mode", { status: 503, statusText: "Offline Mode" });
        });
      })
  );
});

// ANDROID PUSH NOTIFICATIONS EVENT LISTENER
self.addEventListener("push", (event) => {
  let data = { title: "KARTANING Notifikasi", body: "Ada pembaruan data peternakan." };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body || "Informasi operasional peternakan.",
    icon: "/images/logomindajaya.png",
    badge: "/images/logomindajaya.png",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/dashboard",
    },
    actions: [
      { action: "explore", title: "Buka Aplikasi" },
      { action: "close", title: "Tutup" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title || "KARTANING Admin", options));
});

// Notification Click Event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  const targetUrl = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
