// Page « Tous les prix » : filtre par marché et recherche par produit.

const filtreMarche = $("#filtre-marche");
const recherche = $("#recherche");

// Filtres repris de l'adresse : prix.html?q=riz&marche=dembe
const params = new URLSearchParams(location.search);
recherche.value = params.get("q") || "";
let marcheChoisi = marche(params.get("marche")) ? params.get("marche") : "";

// Cherche dans les noms du produit dans les trois langues.
const correspond = (p, texte) => !texte || Object.values(p.nom).some((n) => normaliser(n).includes(texte));

function rendre() {
  filtreMarche.replaceChildren(
    el("option", { value: "" }, t("tous_marches")),
    ...MARCHES.map((m) => el("option", { value: m.id }, tr(m.nom)))
  );
  filtreMarche.value = marcheChoisi;

  const texte = normaliser(recherche.value);
  const resultats = prixActuels({ marche: marcheChoisi || undefined })
    .filter((r) => correspond(produit(r.produit), texte))
    .sort((a, b) => tr(produit(a.produit).nom).localeCompare(tr(produit(b.produit).nom), locale()) || a.prix - b.prix);
  const moins = moinsChers(resultats);

  $("#liste").replaceChildren(...resultats.map((r) => el("li", { class: "anime-item" }, carteReleve(r, { badge: moins.has(r) }))));
  $("#vide").hidden = resultats.length > 0;
  $("#compteur").textContent = t("nb_prix", { n: formatNombre(resultats.length) });
}

filtreMarche.addEventListener("change", () => { marcheChoisi = filtreMarche.value; rendre(); });
recherche.addEventListener("input", rendre);

demarrerPage(rendre);
