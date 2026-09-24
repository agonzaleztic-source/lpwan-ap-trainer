/* Service worker: permite instalar la app y estudiar sin conexión.

   No se procesa como módulo: vite.config.js lo copia a dist/ sustituyendo
   el marcador de version por la huella del bundle de esa compilación. Así cada despliegue
   estrena caché y la anterior se borra entera al activarse. Con un nombre
   fijo, los bundles antiguos —322 KB cada uno— se quedaban dentro para
   siempre, despliegue tras despliegue. */
const CACHE = "lorawan-ap-__BUILD__";

/* Lista de ficheros de esta compilación, la rellena vite.config.js. Incluye
   los chunks que se cargan bajo demanda (el inglés): sin precacharlos, quien
   instalase la app en español y luego perdiese la conexión no podría cambiar
   de idioma. Si algo falla al precachear no se aborta la instalación. */
const PRECACHE = __PRECACHE__;

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  /* Solo lo que sirve este mismo origen. La app no pide nada a terceros —ni
     fuentes, ni analítica, ni APIs— y un service worker que aceptase cualquier
     respuesta ajena sería un almacén de contenido de otros bajo este dominio,
     además de una vía para que algo cacheado sobreviviese a su origen. */
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navegación: intenta red y cae al índice cacheado si no hay conexión.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) => r || caches.match("./index.html"))
        )
    );
    return;
  }

  // Recursos: sirve de caché y refresca en segundo plano.
  e.respondWith(
    caches.match(req).then((cached) => {
      const net = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || net;
    })
  );
});
