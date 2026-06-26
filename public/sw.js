const CACHE_NAME = "kp-cache-v1";
const OFFLINE_URL = "/offline.html";

const INITIAL_ASSETS = [
  "/",
  "/archive",
  "/finder",
  "/about",
  OFFLINE_URL,
  "/favicon.ico"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        INITIAL_ASSETS.map((asset) => {
          return cache.add(asset).catch((err) => {
            console.warn(`Failed to pre-cache asset: ${asset}`, err);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip Sanity Studio, Next.js hot-reloads, API calls, and external requests
  if (
    url.pathname.startsWith("/studio") ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next/webpack-hmr") ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
          return Promise.reject("offline-failure");
        });
      })
  );
});
