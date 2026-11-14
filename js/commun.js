// Code partagé par toutes les pages : données, formats, navbar, footer,
// boîte de dialogue d'ajout, fiche produit, notifications, animations.

// ---------- Outils DOM ----------

// el("a", { href: "x", class: "y", onclick: fn }, "texte", autreElement)
function el(tag, attrs = {}, ...enfants) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") n.className = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v === true ? "" : v);
  }
  n.append(...enfants.flat().filter((e) => e != null && e !== false));
  return n;
}

const $ = (sel, racine = document) => racine.querySelector(sel);

const normaliser = (texte) =>
  String(texte).trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

// ---------- Stockage local ----------

const CLE_RELEVES = "marcheprix.releves";
const CLE_VUES = "marcheprix.vues";

function lire(cle, defaut) {
  try {
    const brut = localStorage.getItem(cle);
    return brut ? JSON.parse(brut) : defaut;
  } catch {
    return defaut;
  }
}

function ecrire(cle, valeur) {
  try {
    localStorage.setItem(cle, JSON.stringify(valeur));
    return true;
  } catch {
    return false;
  }
}

const QUALITES = ["premier", "standard", "economique"];
const PRIX_MAX = 10000000;

// Les données du localStorage sont vérifiées avant d'être affichées.
function releveValide(r) {
  const p = r && produit(r.produit);
  return Boolean(
    p && marche(r.marche) &&
    p.unites.includes(r.unite) && QUALITES.includes(r.qualite) &&
    Number.isInteger(r.prix) && r.prix >= 1 && r.prix <= PRIX_MAX &&
    !isNaN(new Date(r.date)) &&
    (r.photo == null || (typeof r.photo === "string" && r.photo.startsWith("data:image/jpeg;base64,")))
  );
}

// ---------- Accès aux données ----------

const produit = (id) => PRODUITS.find((p) => p.id === id);
const marche = (id) => MARCHES.find((m) => m.id === id);

// Relevés ajoutés sur cet appareil (chargés après la définition de produit/marche, utilisés par releveValide).
let ajouts = (() => {
  const brut = lire(CLE_RELEVES, []);
  return Array.isArray(brut) ? brut.filter(releveValide) : [];
})();

const tousReleves = () => RELEVES.concat(ajouts);
const parDate = (a, b) => new Date(a.date) - new Date(b.date);

function historique(idProduit, idMarche) {
  return tousReleves().filter((r) => r.produit === idProduit && r.marche === idMarche).sort(parDate);
}

// Dernier relevé de chaque couple produit + marché (filtres facultatifs).
function prixActuels({ produit: idProduit, marche: idMarche } = {}) {
  const derniers = new Map();
  for (const r of tousReleves()) {
    if (idProduit && r.produit !== idProduit) continue;
    if (idMarche && r.marche !== idMarche) continue;
    const cle = r.produit + "|" + r.marche;
    const actuel = derniers.get(cle);
    if (!actuel || new Date(r.date) >= new Date(actuel.date)) derniers.set(cle, r);
  }
  return [...derniers.values()];
}

const plusRecents = (n) => tousReleves().sort(parDate).reverse().slice(0, n);

// Les relevés les moins chers par produit + unité, seulement s'il y a au moins 2 prix à comparer.
function moinsChers(releves) {
  const groupes = {};
  for (const r of releves) (groupes[r.produit + "|" + r.unite] ||= []).push(r);
  const resultat = new Set();
  for (const g of Object.values(groupes)) {
    if (g.length < 2) continue;
    const min = Math.min(...g.map((r) => r.prix));
    g.filter((r) => r.prix === min).forEach((r) => resultat.add(r));
  }
  return resultat;
}

// Prix le plus bas actuel d'un produit, dans son unité principale si possible.
function meilleurPrix(p) {
  const actuels = prixActuels({ produit: p.id });
  const memeUnite = actuels.filter((r) => r.unite === p.unites[0]);
  const choix = memeUnite.length ? memeUnite : actuels;
  return choix.sort((a, b) => a.prix - b.prix)[0] || null;
}

function compterVue(id) {
  const vues = lire(CLE_VUES, {});
  vues[id] = (Number(vues[id]) || 0) + 1;
  ecrire(CLE_VUES, vues);
}

function plusConsultes(n) {
  const vues = lire(CLE_VUES, {});
  return PRODUITS.slice()
    .sort((a, b) => (Number(vues[b.id]) || 0) - (Number(vues[a.id]) || 0) || a.ordre - b.ordre)
    .slice(0, n);
}

// ---------- Formats ----------

const formatNombre = (n) => new Intl.NumberFormat(locale()).format(n);
const formatPrix = (n) => formatNombre(n) + " " + t("fcfa");
const formatDate = (d) => new Intl.DateTimeFormat(locale(), { day: "numeric", month: "short" }).format(new Date(d));
const formatHeure = (d) => new Intl.DateTimeFormat(locale(), { hour: "2-digit", minute: "2-digit" }).format(new Date(d));
const nomUnite = (u) => t("unites." + u);
const nomQualite = (q) => t("qualites." + q);

function ilYa(d) {
  const secondes = (new Date(d) - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale(), { numeric: "auto" });
  const abs = Math.abs(secondes);
  if (abs < 60) return rtf.format(0, "second"); // « maintenant »
  if (abs < 3600) return rtf.format(Math.round(secondes / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(secondes / 3600), "hour");
  return rtf.format(Math.round(secondes / 86400), "day");
}

// ---------- Images ----------

// Essaie la photo du relevé, puis l'image de l'objet, puis son illustration SVG, puis l'image par défaut.
// Si l'objet a une imageGrande (600 px / 1000 px), le navigateur choisit selon l'écran.
function image(type, objet, { photo, classe, tailles } = {}) {
  const sources = [photo, objet.image, `images/${type}/${objet.id}.svg`, "images/defaut.svg"]
    .filter((s, i, a) => s && a.indexOf(s) === i);
  let i = 0;
  const srcset = !photo && objet.image && objet.imageGrande ? `${objet.image} 600w, ${objet.imageGrande} 1000w` : null;
  const img = el("img", { src: sources[0], srcset, sizes: srcset ? tailles || "100vw" : null,
    alt: tr(objet.nom), class: classe, loading: "lazy", decoding: "async" });
  img.addEventListener("error", () => {
    img.removeAttribute("srcset");
    if (++i < sources.length) img.src = sources[i];
  });
  return img;
}

// ---------- Cartes réutilisables ----------

function carteProduit(p) {
  const meilleur = meilleurPrix(p);
  return el("button", { type: "button", class: "carte-produit", onclick: () => ouvrirFiche(p.id) },
    image("produits", p),
    el("span", { class: "carte-produit-nom" }, tr(p.nom)),
    meilleur && el("span", { class: "carte-produit-prix" },
      el("small", {}, t("a_partir_de")), " ",
      el("strong", {}, formatPrix(meilleur.prix)), " / " + nomUnite(meilleur.unite)),
    meilleur && el("span", { class: "carte-produit-lieu" }, tr(marche(meilleur.marche).nom))
  );
}

function carteReleve(r, { badge = false, depuis = false } = {}) {
  const p = produit(r.produit);
  const quand = depuis ? ilYa(r.date) : formatDate(r.date);
  return el("button", { type: "button", class: "carte-releve" + (badge ? " moins-cher" : ""), onclick: () => ouvrirFiche(r.produit) },
    image("produits", p, { photo: r.photo }),
    el("span", { class: "infos" },
      el("strong", {}, tr(p.nom)),
      el("span", { class: "lieu" }, tr(marche(r.marche).nom)),
      el("span", { class: "meta" }, el("span", { class: "puce-qualite q-" + r.qualite }, nomQualite(r.qualite)), " · " + quand)
    ),
    el("span", { class: "prix" },
      formatPrix(r.prix),
      el("span", { class: "unite" }, "/ " + nomUnite(r.unite)),
      badge && el("span", { class: "badge" }, t("moins_cher"))
    )
  );
}

// Petit graphique de l'historique des prix.
function sparkline(valeurs) {
  if (valeurs.length < 2) return null;
  const L = 120, H = 36, m = 4;
  const min = Math.min(...valeurs), max = Math.max(...valeurs), ecart = max - min || 1;
  const points = valeurs.map((v, i) => [m + (i * (L - 2 * m)) / (valeurs.length - 1), H - m - ((v - min) / ecart) * (H - 2 * m)]);
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${L} ${H}`);
  svg.setAttribute("class", "sparkline");
  svg.setAttribute("aria-hidden", "true");
  const ligne = document.createElementNS(ns, "polyline");
  ligne.setAttribute("points", points.map((p) => p.join(",")).join(" "));
  const dernier = document.createElementNS(ns, "circle");
  dernier.setAttribute("cx", points.at(-1)[0]);
  dernier.setAttribute("cy", points.at(-1)[1]);
  dernier.setAttribute("r", 3);
  svg.append(ligne, dernier);
  return svg;
}

function tendance(valeurs) {
  if (valeurs.length < 2) return null;
  const [avant, apres] = valeurs.slice(-2);
  const sens = apres > avant ? "hausse" : apres < avant ? "baisse" : "stable";
  const symbole = { hausse: "▲", baisse: "▼", stable: "=" }[sens];
  return el("span", { class: "tendance " + sens, "aria-hidden": "true" }, symbole);
}

// ---------- Navbar et footer ----------

function selecteurLangue(id) {
  return el("span", { class: "langue" },
    el("label", { for: id, class: "visuellement-cache", "data-i18n": "langue" }, t("langue")),
    el("select", { id, class: "select-langue", onchange: (e) => changerLangue(e.target.value) },
      Object.entries(LANGUES).map(([code, l]) => el("option", { value: code, lang: code }, l.nom)))
  );
}

function rendreNavbar() {
  const page = document.body.dataset.page;
  const lien = (href, cle, id) =>
    el("li", {}, el("a", { href, "data-i18n": cle, "aria-current": page === id ? "page" : null }, t(cle)));

  const liens = el("ul", { class: "nav-liens", id: "nav-liens" },
    lien("index.html", "nav_accueil", "accueil"),
    lien("prix.html", "nav_prix", "prix"),
    lien("marches.html", "nav_marches", "marches"),
    el("li", {}, el("button", { type: "button", class: "btn btn-petit", "data-i18n": "nav_ajouter",
      onclick: () => { basculerMenu(false); ouvrirAjout(); } }, t("nav_ajouter"))),
    el("li", {}, selecteurLangue("langue-nav"))
  );

  const bouton = el("button", { type: "button", class: "nav-toggle", "aria-expanded": "false", "aria-controls": "nav-liens",
    "data-i18n-aria": "menu", "aria-label": t("menu"), onclick: () => basculerMenu() },
    el("span", { class: "barres", "aria-hidden": "true" }));

  $("#navbar").replaceChildren(el("nav", { class: "navbar" },
    el("a", { href: "index.html", class: "logo" }, "Marché", el("span", {}, "Prix")), bouton, liens));
}

function basculerMenu(ouvrir) {
  const nav = $(".navbar");
  const ouvert = ouvrir ?? !nav.classList.contains("ouvert");
  nav.classList.toggle("ouvert", ouvert);
  $(".nav-toggle").setAttribute("aria-expanded", String(ouvert));
  if (ouvert) animer({ targets: "#nav-liens li", opacity: [0, 1], translateY: [-8, 0], delay: (_, i) => i * 40, duration: 250, easing: "easeOutQuad" });
}

function rendreFooter() {
  const credits = CREDITS_PHOTOS.length
    ? el("ul", { class: "credits" }, CREDITS_PHOTOS.map((c) =>
        el("li", {}, el("a", { href: c.url, rel: "noopener", target: "_blank" }, c.auteur), " — " + c.source)))
    : el("p", { "data-i18n": "footer_illustrations" }, t("footer_illustrations"));

  $("#footer").replaceChildren(el("div", { class: "footer-grille" },
    el("div", {},
      el("a", { href: "index.html", class: "logo" }, "Marché", el("span", {}, "Prix")),
      el("p", { "data-i18n": "footer_apropos" }, t("footer_apropos"))),
    el("div", {},
      el("h2", { "data-i18n": "footer_liens" }, t("footer_liens")),
      el("ul", {},
        el("li", {}, el("a", { href: "index.html", "data-i18n": "nav_accueil" }, t("nav_accueil"))),
        el("li", {}, el("a", { href: "prix.html", "data-i18n": "nav_prix" }, t("nav_prix"))),
        el("li", {}, el("a", { href: "marches.html", "data-i18n": "nav_marches" }, t("nav_marches"))))),
    el("div", {},
      el("h2", { "data-i18n": "footer_langues" }, t("footer_langues")),
      el("ul", { class: "footer-langues" }, Object.entries(LANGUES).map(([code, l]) =>
        el("li", {}, el("button", { type: "button", lang: code, onclick: () => changerLangue(code) }, l.nom))))),
    el("div", {},
      el("h2", { "data-i18n": "footer_photos" }, t("footer_photos")),
      credits)
  ), el("p", { class: "footer-note" },
    el("span", { "data-i18n": "footer_note" }, t("footer_note")),
    " · © " + new Date().getFullYear() + " MarchéPrix · ",
    el("a", { href: "https://www.openstreetmap.org/copyright", rel: "noopener", target: "_blank" }, "© OpenStreetMap")));
}

// ---------- Boîtes de dialogue ----------

function ouvrirDialog(d) {
  d.showModal();
  animer({ targets: d, opacity: [0, 1], scale: [0.95, 1], duration: 260, easing: "easeOutCubic" });
}

function fermerDialog(d) {
  if (!d.open) return;
  animer({ targets: d, opacity: 0, scale: 0.95, duration: 160, easing: "easeInQuad",
    complete: () => { d.close(); d.style.opacity = ""; d.style.transform = ""; } });
}

function creerDialog(id, titreId) {
  const d = el("dialog", { id, class: "dialog", "aria-labelledby": titreId });
  d.addEventListener("cancel", (e) => { e.preventDefault(); fermerDialog(d); }); // Échap
  d.addEventListener("click", (e) => { if (e.target === d) fermerDialog(d); }); // clic sur le fond
  document.body.append(d);
  return d;
}

const boutonFermer = (d) =>
  el("button", { type: "button", class: "btn-fermer", "aria-label": t("fermer"), onclick: () => fermerDialog(d) }, "✕");

// --- Ajout d'un prix ---

function ouvrirAjout({ produit: idProduit, marche: idMarche } = {}) {
  const d = $("#dialog-ajout") || creerDialog("dialog-ajout", "ajout-titre");
  const options = (liste, valeur) => liste.map(([v, texte]) => el("option", { value: v, selected: v === valeur }, texte));
  const tries = (liste) => liste.slice().sort((a, b) => tr(a.nom).localeCompare(tr(b.nom), locale()));

  const selProduit = el("select", { id: "a-produit", name: "produit", required: true },
    options(tries(PRODUITS).map((p) => [p.id, tr(p.nom)]), idProduit));
  const selUnite = el("select", { id: "a-unite", name: "unite", required: true });
  const majUnites = () => selUnite.replaceChildren(...options(produit(selProduit.value).unites.map((u) => [u, nomUnite(u)])));
  selProduit.addEventListener("change", majUnites);
  majUnites();

  const champ = (id, cle, controle) => el("div", { class: "champ" }, el("label", { for: id }, t(cle)), controle);
  const message = el("p", { class: "message erreur", role: "alert" });

  const form = el("form", { class: "form-ajout", onsubmit: (e) => envoyerAjout(e, d, message) },
    el("div", { class: "dialog-tete" }, el("h2", { id: "ajout-titre" }, t("ajout_titre")), boutonFermer(d)),
    champ("a-produit", "champ_produit", selProduit),
    champ("a-marche", "champ_marche", el("select", { id: "a-marche", name: "marche", required: true },
      options(tries(MARCHES).map((m) => [m.id, tr(m.nom)]), idMarche))),
    el("div", { class: "ligne" },
      champ("a-prix", "champ_prix", el("input", { id: "a-prix", name: "prix", type: "number", min: 1, max: PRIX_MAX, step: 1, inputmode: "numeric", required: true })),
      champ("a-unite", "champ_unite", selUnite)),
    champ("a-qualite", "champ_qualite", el("select", { id: "a-qualite", name: "qualite" },
      options(QUALITES.map((q) => [q, nomQualite(q)]), "standard"))),
    champ("a-photo", "champ_photo", el("input", { id: "a-photo", name: "photo", type: "file", accept: "image/*", capture: "environment" })),
    message,
    el("div", { class: "actions" },
      el("button", { type: "button", class: "btn btn-secondaire", onclick: () => fermerDialog(d) }, t("btn_annuler")),
      el("button", { type: "submit", class: "btn" }, t("btn_ajouter")))
  );

  d.replaceChildren(form);
  ouvrirDialog(d);
  $("#a-prix").focus();
}

async function envoyerAjout(e, d, message) {
  e.preventDefault();
  const donnees = new FormData(e.target);
  const nouveau = {
    produit: donnees.get("produit"),
    marche: donnees.get("marche"),
    prix: Number(donnees.get("prix")),
    unite: donnees.get("unite"),
    qualite: donnees.get("qualite"),
    date: new Date().toISOString(),
  };
  if (!releveValide(nouveau)) {
    message.textContent = t("verifier_champs");
    return;
  }

  let avis = "ajout_ok";
  const fichier = donnees.get("photo");
  if (fichier && fichier.size > 0) {
    try {
      nouveau.photo = await reduirePhoto(fichier);
    } catch {
      avis = "photo_illisible";
    }
  }

  let ok = ecrire(CLE_RELEVES, ajouts.concat(nouveau));
  if (!ok && nouveau.photo) {
    delete nouveau.photo; // mémoire pleine : on garde le prix sans la photo
    ok = ecrire(CLE_RELEVES, ajouts.concat(nouveau));
    avis = "ajout_plein";
  }
  if (!ok) {
    message.textContent = t("ajout_erreur");
    return;
  }

  ajouts.push(nouveau);
  fermerDialog(d);
  notifier(t(avis), avis !== "ajout_ok");
  document.dispatchEvent(new CustomEvent("mp:donnees"));
}

// Réduit la photo à 300 px max et la renvoie en JPEG (~20–30 Ko).
function reduirePhoto(fichier, max = 300) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(fichier);
    const img = new Image();
    img.onload = () => {
      const echelle = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = el("canvas", { width: Math.round(img.width * echelle), height: Math.round(img.height * echelle) });
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("image illisible")); };
    img.src = url;
  });
}

// --- Fiche produit ---

function ouvrirFiche(idProduit) {
  const p = produit(idProduit);
  const d = $("#dialog-fiche") || creerDialog("dialog-fiche", "fiche-titre");
  compterVue(p.id);
  document.dispatchEvent(new CustomEvent("mp:vues"));

  const actuels = prixActuels({ produit: p.id }).sort((a, b) => a.prix - b.prix);
  const moins = moinsChers(actuels);
  const nouveauPrix = (idMarche) => el("button", { type: "button", class: "btn btn-petit btn-secondaire",
    onclick: () => { fermerDialog(d); setTimeout(() => ouvrirAjout({ produit: p.id, marche: idMarche }), 180); } }, "+ " + t("nouveau_prix"));

  const blocs = actuels.map((r) => {
    const m = marche(r.marche);
    const histo = historique(p.id, m.id).filter((h) => h.unite === r.unite);
    const valeurs = histo.map((h) => h.prix);
    return el("li", { class: "bloc-marche" + (moins.has(r) ? " moins-cher" : "") },
      el("div", { class: "bloc-tete" },
        el("a", { href: "marche.html?id=" + encodeURIComponent(m.id) }, tr(m.nom)),
        moins.has(r) && el("span", { class: "badge" }, t("moins_cher"))),
      el("div", { class: "bloc-prix" },
        el("strong", {}, formatPrix(r.prix)), " / " + nomUnite(r.unite), " ", tendance(valeurs),
        el("span", { class: "puce-qualite q-" + r.qualite }, nomQualite(r.qualite))),
      el("p", { class: "meta" }, t("fiche_releve", { date: formatDate(r.date), heure: formatHeure(r.date) })),
      valeurs.length > 1 && el("details", { class: "historique" },
        el("summary", {}, t("fiche_historique"), sparkline(valeurs)),
        el("ol", {}, histo.slice(-5).reverse().map((h) =>
          el("li", {}, el("span", {}, formatDate(h.date)), el("span", {}, formatPrix(h.prix)))))),
      nouveauPrix(m.id)
    );
  });

  d.replaceChildren(el("div", { class: "fiche" },
    el("div", { class: "dialog-tete" },
      el("div", { class: "fiche-titre" }, image("produits", p), el("h2", { id: "fiche-titre" }, tr(p.nom))),
      boutonFermer(d)),
    blocs.length ? el("ul", { class: "blocs" }, blocs) : el("p", {}, t("fiche_aucun")),
    !blocs.length && nouveauPrix()
  ));
  ouvrirDialog(d);
  animer({ targets: d.querySelectorAll(".bloc-marche"), opacity: [0, 1], translateY: [12, 0], delay: (_, i) => 80 + i * 60, duration: 350, easing: "easeOutCubic" });
}

// ---------- Notifications ----------

function notifier(texte, attention = false) {
  let toast = $("#toast");
  if (!toast) {
    toast = el("div", { id: "toast", class: "toast", role: "status", "aria-live": "polite" });
    document.body.append(toast);
  }
  toast.textContent = texte;
  toast.classList.toggle("attention", attention);
  toast.classList.add("visible");
  animer({ targets: toast, translateY: [40, 0], scale: [0.9, 1], duration: 600, easing: "spring(1, 80, 10, 0)" });
  clearTimeout(notifier.minuteur);
  notifier.minuteur = setTimeout(() => toast.classList.remove("visible"), 3500);
}

// ---------- Animations (anime.js, désactivées si « réduire les animations ») ----------

const peutAnimer = () => typeof anime === "function" && !matchMedia("(prefers-reduced-motion: reduce)").matches;

function animer(params) {
  if (peutAnimer()) return anime(params);
  if (params.complete) params.complete();
}

// Les éléments .anime-item d'une section [data-anime] apparaissent en cascade quand elle devient visible.
function observerSections() {
  if (!peutAnimer() || !("IntersectionObserver" in window)) return;
  const obs = new IntersectionObserver((entrees) => {
    for (const e of entrees) {
      if (!e.isIntersecting) continue;
      obs.unobserve(e.target);
      animer({ targets: e.target.querySelectorAll(".anime-item"), opacity: [0, 1], translateY: [20, 0],
        delay: anime.stagger(70), duration: 550, easing: "easeOutCubic" });
    }
  }, { threshold: 0.15 });
  document.querySelectorAll("[data-anime]").forEach((s) => obs.observe(s));
}

function animerCompteur(cible, valeur) {
  if (!peutAnimer()) { cible.textContent = formatNombre(valeur); return; }
  const etat = { v: 0 };
  anime({ targets: etat, v: valeur, round: 1, duration: 1400, easing: "easeOutExpo",
    update: () => { cible.textContent = formatNombre(etat.v); } });
}

// ---------- Démarrage d'une page ----------

// rendre() redessine les parties dynamiques de la page ; elle est rappelée
// après un changement de langue, un ajout de prix ou une consultation.
function demarrerPage(rendre) {
  rendreNavbar();
  rendreFooter();

  const majLangue = () => {
    document.querySelectorAll(".select-langue").forEach((s) => { s.value = langue; });
    const cleTitre = document.body.dataset.titre;
    if (cleTitre) document.title = t(cleTitre);
  };
  document.addEventListener("mp:langue", () => { majLangue(); rendre(); });
  document.addEventListener("mp:donnees", rendre);
  document.addEventListener("mp:vues", rendre);

  appliquerLangue(); // traduit la page puis déclenche mp:langue → rendre()
  observerSections();

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") basculerMenu(false); });

  // Hors connexion (PWA). Impossible en file:// : il faut un serveur http(s) ou localhost.
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}
