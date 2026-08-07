// Service worker: приложение работает офлайн и обновляется само.
// Меняй VERSION при каждом обновлении, чтобы телефон подхватил новое.
const VERSION = "migue-v7";

self.addEventListener("install", e => self.skipWaiting());

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  const isPhoto = /\.(jpg|jpeg|png|webp)$/i.test(new URL(req.url).pathname);

  if (isPhoto) {
    // картинки: сначала кэш (они не меняются)
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy));
        return res;
      }))
    );
  } else {
    // код и разметка: сначала сеть, кэш как запасной вариант
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
  }
});
