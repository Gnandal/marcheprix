// Fiche d'un marché : marche.html?id=dembe

const m = marche(new URLSearchParams(location.search).get("id"));
let marqueur = null;

function rendre() {
  if (!m) return;
  document.title = t("titre_marche", { nom: tr(m.nom) });
  $("#marche-nom").textContent = tr(m.nom);
  $("#marche-description").textContent = tr(m.description);
  $("#marche-caracteristiques").replaceChildren(...m.caracteristiques.map((c) =>
    el("li", {}, el("span", { class: "icone", "aria-hidden": "true" }, c.icone), tr(c.texte))));

  const actuels = prixActuels({ marche: m.id })
    .sort((a, b) => tr(produit(a.produit).nom).localeCompare(tr(produit(b.produit).nom), locale()));
  $("#marche-prix").replaceChildren(...actuels.map((r) => el("li", { class: "anime-item" }, carteReleve(r))));

  if (marqueur) marqueur.setPopupContent(tr(m.nom));
}

function initialiserCarte() {
  $("#itineraire").href = `https://www.openstreetmap.org/?mlat=${m.lat}&mlon=${m.lng}#map=17/${m.lat}/${m.lng}`;
  if (typeof L === "undefined") {
    $("#carte").hidden = true;
    $("#carte-secours").hidden = false;
    return;
  }
  const carte = L.map("carte", { scrollWheelZoom: false }).setView([m.lat, m.lng], 16);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    crossOrigin: true, // réponses lisibles : le service worker les garde pour le mode hors connexion
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(carte);
  marqueur = L.marker([m.lat, m.lng]).addTo(carte).bindPopup(tr(m.nom));
}

if (m) {
  const cover = image("marches", m, { classe: "marche-cover-img", tailles: "100vw" });
  cover.alt = "";
  cover.loading = "eager";
  $("#marche-cover").prepend(cover);
  initialiserCarte();
} else {
  $("#fiche-marche").hidden = true;
  $("#marche-introuvable").hidden = false;
}

demarrerPage(rendre);
