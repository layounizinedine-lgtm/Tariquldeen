// sw.js — einfacher Service Worker für Offline-Nutzung (App-Shell-Caching)
const CACHE_NAME = "tariqul-deen-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/app.js",
  "./js/prayerTimes.js",
  "./js/adhan.js",
  "./js/planner.js",
  "./js/storage.js",
  "./data/adhkar.js",
  "./data/tajweed.js",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/favicon.png",
  "./assets/logo.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // Niemals API-Aufrufe (z. B. an api.anthropic.com) cachen oder abfangen.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
