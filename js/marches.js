// Page « Les marchés ».

function rendre() {
  $("#marches").replaceChildren(...MARCHES.map((m) => {
    const nb = prixActuels({ marche: m.id }).length;
    return el("li", { class: "anime-item" },
      el("a", { class: "carte-marche", href: "marche.html?id=" + encodeURIComponent(m.id) },
        image("marches", m, { tailles: "(min-width: 700px) 50vw, 100vw" }),
        el("span", { class: "carte-marche-corps" },
          el("strong", {}, tr(m.nom)),
          el("span", {}, tr(m.description)),
          el("span", { class: "carte-marche-pied" },
            el("span", {}, t("nb_prix", { n: formatNombre(nb) })),
            el("span", { class: "lien-fleche" }, t("voir_marche"))))));
  }));
}

demarrerPage(rendre);
