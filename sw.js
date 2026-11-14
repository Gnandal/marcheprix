// Service worker de MarchéPrix : l'app marche hors connexion.
// Après une modification d'un fichier du site, augmenter VERSION pour que
// les téléphones téléchargent la nouvelle version.
const VERSION = "v1";
const CACHE_APP = `marcheprix-app-${VERSION}`;
const CACHE_CARTE = "marcheprix-carte";
const MAX_TUILES = 200;

const FICHIERS = [
  "./", "index.html", "prix.html", "marches.html", "marche.html", "manifest.json",
  "css/style.css",
  "js/data.js", "js/i18n.js", "js/commun.js",
  "js/accueil.js", "js/prix.js", "js/marches.js", "js/marche.js",
  "images/defaut.svg", "images/hero-800.jpg", "images/hero-1280.jpg",
  "images/icones/icone.svg", "images/icones/icone-192.png", "images/icones/icone-512.png", "images/icones/apple-touch-icon.png",
  ...["riz", "oignon", "huile", "sucre", "viande", "tomate", "mil", "arachide"]
    .map((id) => `images/produits/${id}.svg`),
  ...["grand-marche", "dembe", "farcha", "champ-de-fils"]
    .flatMap((id) => [`images/marches/${id}.svg`, `images/marches/${id}-600.jpg`, `images/marches/${id}-1000.jpg`]),
];

// Bibliothèques chargées depuis cdnjs (versions figées, donc jamais modifiées).
const CDN = [
  "https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.2/anime.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_APP);
    await cache.addAll(FICHIERS);
    // Le CDN est facultatif : sans lui, le site marche sans animations ni carte.
    await Promise.allSettled(CDN.map((url) => cache.add(new Request(url, { mode: "cors" }))));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const noms = await caches.keys();
    await Promise.all(noms
      .filter((n) => n.startsWith("marcheprix-app-") && n !== CACHE_APP)
      .map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.hostname.endsWith("tile.openstreetmap.org")) {
    e.respondWith(tuile(req));
  } else if (url.origin === location.origin) {
    e.respondWith(local(e));
  } else if (url.hostname === "cdnjs.cloudflare.com") {
    e.respondWith(caches.match(req).then((r) => r || fetch(req)));
  }
});

// Fichiers du site : réponse immédiate depuis le cache, mise à jour en arrière-plan.
// Les pages avec paramètres (marche.html?id=dembe, prix.html?q=riz) utilisent la même page en cache.
async function local(e) {
  const req = e.request;
  const page = req.mode === "navigate";
  const cache = await caches.open(CACHE_APP);
  const enCache = await cache.match(req, { ignoreSearch: page });
  const reseau = fetch(req).then((rep) => {
    if (rep.ok) {
      const cle = page ? new URL(req.url).pathname : req;
      return cache.put(cle, rep.clone()).then(() => rep);
    }
    return rep;
  });
  if (enCache) {
    e.waitUntil(reseau.catch(() => {}));
    return enCache;
  }
  try {
    return await reseau;
  } catch (err) {
    if (page) return (await cache.match("index.html")) || Response.error();
    return Response.error();
  }
}

// Tuiles de la carte : réseau d'abord (règles d'OpenStreetMap), cache si hors connexion.
async function tuile(req) {
  const cache = await caches.open(CACHE_CARTE);
  try {
    const rep = await fetch(req);
    if (rep.ok || rep.type === "opaque") {
      await cache.put(req, rep.clone());
      const cles = await cache.keys();
      await Promise.all(cles.slice(0, Math.max(0, cles.length - MAX_TUILES)).map((k) => cache.delete(k)));
    }
    return rep;
  } catch (err) {
    return (await cache.match(req)) || Response.error();
  }
}
