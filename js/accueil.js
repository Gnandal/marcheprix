// Page d'accueil.

function rendre() {
  $("#populaires").replaceChildren(...plusConsultes(6).map((p) => el("li", { class: "anime-item" }, carteProduit(p))));
  $("#nouveaux").replaceChildren(...plusRecents(6).map((r) => el("li", { class: "anime-item" }, carteReleve(r, { depuis: true }))));
  if (rendre.compteursFaits) majStats(false);
}

function majStats(animer) {
  const stats = { "#stat-prix": tousReleves().length, "#stat-marches": MARCHES.length, "#stat-produits": PRODUITS.length };
  for (const [sel, n] of Object.entries(stats)) {
    if (animer) animerCompteur($(sel), n);
    else $(sel).textContent = formatNombre(n);
  }
}

// Photo de fond
if (IMAGE_HERO) {
  const fond = $("#hero-fond");
  fond.srcset = `${IMAGE_HERO.petite} 800w, ${IMAGE_HERO.grande} 1280w`;
  fond.sizes = "100vw";
  fond.src = IMAGE_HERO.petite;
  fond.hidden = false;
  fond.addEventListener("error", () => { fond.hidden = true; });
}

$("#cta-btn").addEventListener("click", () => ouvrirAjout());

$("#newsletter").addEventListener("submit", (e) => {
  e.preventDefault(); // maquette : rien n'est envoyé
  e.target.reset();
  const msg = $("#newsletter-msg");
  msg.textContent = t("newsletter_merci");
  animer({ targets: msg, opacity: [0, 1], translateY: [8, 0], duration: 400, easing: "easeOutBack" });
});

demarrerPage(rendre);

// Entrée du hero et compteurs
majStats(true);
rendre.compteursFaits = true;
animer({ targets: [".hero-titre", ".hero-texte", ".hero .recherche", ".stats li"], opacity: [0, 1], translateY: [24, 0],
  delay: (_, i) => i * 90, duration: 700, easing: "easeOutCubic" });
