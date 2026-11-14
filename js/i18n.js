// Traductions : français (défaut), anglais, arabe (de droite à gauche).

const LANGUES = {
  fr: { nom: "Français", court: "FR", dir: "ltr", locale: "fr-FR" },
  en: { nom: "English", court: "EN", dir: "ltr", locale: "en-GB" },
  ar: { nom: "العربية", court: "ع", dir: "rtl", locale: "ar-TD-u-nu-latn" }, // chiffres latins
};

const TEXTES = {
  fr: {
    titre_accueil: "MarchéPrix — Les prix des marchés de N'Djamena",
    titre_prix: "Tous les prix — MarchéPrix",
    titre_marches: "Les marchés — MarchéPrix",
    titre_marche: "{nom} — MarchéPrix",
    nav_accueil: "Accueil", nav_prix: "Prix", nav_marches: "Marchés", nav_ajouter: "Ajouter un prix",
    menu: "Menu", langue: "Langue",
    hero_titre: "Payez le juste prix au marché",
    hero_sous_titre: "Comparez les prix du riz, de l'oignon, de l'huile… dans les marchés de N'Djamena, relevés par des ménagères et des étudiants.",
    hero_recherche: "Quel produit cherchez-vous ?", hero_recherche_placeholder: "Ex. riz, oignon, huile…", hero_recherche_btn: "Chercher",
    stat_prix: "prix relevés", stat_marches: "marchés", stat_produits: "produits",
    populaires_titre: "Les plus consultés", populaires_sous: "Les produits que l'on regarde le plus",
    a_partir_de: "à partir de", voir_tout: "Voir tous les prix",
    cta_titre: "Vous étiez au marché aujourd'hui ?", cta_texte: "Partagez un prix en 30 secondes et aidez votre quartier à mieux acheter.", cta_btn: "Partager un prix",
    nouveaux_titre: "Nouveaux prix", nouveaux_sous: "Les derniers relevés",
    newsletter_titre: "Les prix de la semaine dans votre boîte mail", newsletter_texte: "Un résumé chaque lundi : ce qui monte, ce qui baisse, où acheter moins cher.",
    newsletter_label: "Adresse e-mail", newsletter_placeholder: "vous@exemple.com", newsletter_btn: "S'inscrire",
    newsletter_merci: "Merci ! La newsletter arrive bientôt.",
    footer_apropos: "MarchéPrix aide les familles et les étudiants de N'Djamena à comparer les prix des marchés.",
    footer_liens: "Liens", footer_langues: "Langues", footer_photos: "Photos", footer_illustrations: "Illustrations provisoires — photos Pexels et Pixabay à venir.",
    footer_note: "Prix indicatifs relevés par la communauté.",
    prix_titre: "Tous les prix", prix_sous: "Le dernier prix relevé dans chaque marché",
    filtre_marche: "Marché", tous_marches: "Tous les marchés", filtre_produit: "Produit", recherche_placeholder: "Ex. riz, oignon…",
    aucun_prix: "Aucun prix trouvé.", moins_cher: "Moins cher", nb_prix: "{n} prix",
    marches_titre: "Les marchés", marches_sous: "Où acheter à N'Djamena", voir_marche: "Voir le marché",
    introuvable: "Ce marché est introuvable.", retour_marches: "Retour aux marchés",
    caracteristiques: "Caractéristiques", localisation: "Localisation", itineraire: "Ouvrir dans OpenStreetMap",
    carte_indispo: "La carte n'a pas pu se charger (connexion ?).", prix_du_marche: "Les prix à ce marché",
    ajout_titre: "Ajouter un prix", champ_produit: "Produit", champ_marche: "Marché", champ_prix: "Prix (FCFA)",
    champ_unite: "Unité", champ_qualite: "Qualité", champ_photo: "Photo (facultatif)",
    btn_ajouter: "Ajouter", btn_annuler: "Annuler", fermer: "Fermer",
    ajout_ok: "Prix ajouté. Merci !", ajout_erreur: "Impossible d'enregistrer sur cet appareil.",
    ajout_plein: "Prix ajouté, mais la photo n'a pas pu être gardée (mémoire pleine).", photo_illisible: "Prix ajouté, photo illisible ignorée.",
    verifier_champs: "Vérifiez le produit, le marché et le prix.",
    fiche_historique: "Historique", fiche_releve: "Relevé le {date} à {heure}", nouveau_prix: "Nouveau prix", fiche_aucun: "Pas encore de prix pour ce produit.",
    fcfa: "FCFA",
    unites: { sac: "sac", kg: "kg", koro: "koro", tas: "tas", litre: "litre", piece: "pièce" },
    qualites: { premier: "1er choix", standard: "Standard", economique: "Économique" },
  },
  en: {
    titre_accueil: "MarchéPrix — Market prices in N'Djamena",
    titre_prix: "All prices — MarchéPrix",
    titre_marches: "Markets — MarchéPrix",
    titre_marche: "{nom} — MarchéPrix",
    nav_accueil: "Home", nav_prix: "Prices", nav_marches: "Markets", nav_ajouter: "Add a price",
    menu: "Menu", langue: "Language",
    hero_titre: "Pay the right price at the market",
    hero_sous_titre: "Compare prices of rice, onions, oil… across N'Djamena's markets, collected by households and students.",
    hero_recherche: "What are you looking for?", hero_recherche_placeholder: "e.g. rice, onion, oil…", hero_recherche_btn: "Search",
    stat_prix: "prices collected", stat_marches: "markets", stat_produits: "products",
    populaires_titre: "Most viewed", populaires_sous: "The products people check the most",
    a_partir_de: "from", voir_tout: "See all prices",
    cta_titre: "Were you at the market today?", cta_texte: "Share a price in 30 seconds and help your neighbourhood shop smarter.", cta_btn: "Share a price",
    nouveaux_titre: "New prices", nouveaux_sous: "The latest reports",
    newsletter_titre: "This week's prices in your inbox", newsletter_texte: "A summary every Monday: what's going up, what's going down, where to buy for less.",
    newsletter_label: "Email address", newsletter_placeholder: "you@example.com", newsletter_btn: "Subscribe",
    newsletter_merci: "Thank you! The newsletter is coming soon.",
    footer_apropos: "MarchéPrix helps families and students in N'Djamena compare market prices.",
    footer_liens: "Links", footer_langues: "Languages", footer_photos: "Photos", footer_illustrations: "Temporary illustrations — Pexels and Pixabay photos coming soon.",
    footer_note: "Indicative prices reported by the community.",
    prix_titre: "All prices", prix_sous: "The latest price reported at each market",
    filtre_marche: "Market", tous_marches: "All markets", filtre_produit: "Product", recherche_placeholder: "e.g. rice, onion…",
    aucun_prix: "No prices found.", moins_cher: "Cheapest", nb_prix: "{n} prices",
    marches_titre: "Markets", marches_sous: "Where to shop in N'Djamena", voir_marche: "See market",
    introuvable: "This market could not be found.", retour_marches: "Back to markets",
    caracteristiques: "Features", localisation: "Location", itineraire: "Open in OpenStreetMap",
    carte_indispo: "The map could not load (connection?).", prix_du_marche: "Prices at this market",
    ajout_titre: "Add a price", champ_produit: "Product", champ_marche: "Market", champ_prix: "Price (FCFA)",
    champ_unite: "Unit", champ_qualite: "Quality", champ_photo: "Photo (optional)",
    btn_ajouter: "Add", btn_annuler: "Cancel", fermer: "Close",
    ajout_ok: "Price added. Thank you!", ajout_erreur: "Could not save on this device.",
    ajout_plein: "Price added, but the photo could not be kept (storage full).", photo_illisible: "Price added, unreadable photo ignored.",
    verifier_champs: "Check the product, market and price.",
    fiche_historique: "History", fiche_releve: "Reported on {date} at {heure}", nouveau_prix: "New price", fiche_aucun: "No prices for this product yet.",
    fcfa: "FCFA",
    unites: { sac: "bag", kg: "kg", koro: "koro", tas: "heap", litre: "litre", piece: "piece" },
    qualites: { premier: "Premium", standard: "Standard", economique: "Budget" },
  },
  ar: {
    titre_accueil: "MarchéPrix — أسعار أسواق انجمينا",
    titre_prix: "كل الأسعار — MarchéPrix",
    titre_marches: "الأسواق — MarchéPrix",
    titre_marche: "{nom} — MarchéPrix",
    nav_accueil: "الرئيسية", nav_prix: "الأسعار", nav_marches: "الأسواق", nav_ajouter: "أضف سعرًا",
    menu: "القائمة", langue: "اللغة",
    hero_titre: "ادفع السعر الصحيح في السوق",
    hero_sous_titre: "قارن أسعار الأرز والبصل والزيت… في أسواق انجمينا، يجمعها ربّات البيوت والطلاب.",
    hero_recherche: "عن أي منتج تبحث؟", hero_recherche_placeholder: "مثلًا: أرز، بصل، زيت…", hero_recherche_btn: "بحث",
    stat_prix: "سعرًا مسجلًا", stat_marches: "أسواق", stat_produits: "منتجات",
    populaires_titre: "الأكثر مشاهدة", populaires_sous: "المنتجات التي يتابعها الناس أكثر",
    a_partir_de: "ابتداءً من", voir_tout: "عرض كل الأسعار",
    cta_titre: "هل كنت في السوق اليوم؟", cta_texte: "شارك سعرًا في 30 ثانية وساعد حيّك على الشراء بذكاء.", cta_btn: "شارك سعرًا",
    nouveaux_titre: "أسعار جديدة", nouveaux_sous: "آخر الأسعار المسجلة",
    newsletter_titre: "أسعار الأسبوع في بريدك", newsletter_texte: "ملخص كل يوم اثنين: ما يرتفع، ما ينخفض، وأين تشتري بأقل.",
    newsletter_label: "البريد الإلكتروني", newsletter_placeholder: "you@example.com", newsletter_btn: "اشترك",
    newsletter_merci: "شكرًا! النشرة قادمة قريبًا.",
    footer_apropos: "يساعد MarchéPrix العائلات والطلاب في انجمينا على مقارنة أسعار الأسواق.",
    footer_liens: "روابط", footer_langues: "اللغات", footer_photos: "الصور", footer_illustrations: "رسوم مؤقتة — صور Pexels وPixabay قريبًا.",
    footer_note: "أسعار تقريبية يسجلها المجتمع.",
    prix_titre: "كل الأسعار", prix_sous: "آخر سعر مسجل في كل سوق",
    filtre_marche: "السوق", tous_marches: "كل الأسواق", filtre_produit: "المنتج", recherche_placeholder: "مثلًا: أرز، بصل…",
    aucun_prix: "لا توجد أسعار.", moins_cher: "الأرخص", nb_prix: "{n} سعر",
    marches_titre: "الأسواق", marches_sous: "أين تتسوق في انجمينا", voir_marche: "عرض السوق",
    introuvable: "هذا السوق غير موجود.", retour_marches: "العودة إلى الأسواق",
    caracteristiques: "المميزات", localisation: "الموقع", itineraire: "افتح في OpenStreetMap",
    carte_indispo: "تعذر تحميل الخريطة (الاتصال؟).", prix_du_marche: "الأسعار في هذا السوق",
    ajout_titre: "أضف سعرًا", champ_produit: "المنتج", champ_marche: "السوق", champ_prix: "السعر (فرنك)",
    champ_unite: "الوحدة", champ_qualite: "الجودة", champ_photo: "صورة (اختياري)",
    btn_ajouter: "أضف", btn_annuler: "إلغاء", fermer: "إغلاق",
    ajout_ok: "تمت إضافة السعر. شكرًا!", ajout_erreur: "تعذر الحفظ على هذا الجهاز.",
    ajout_plein: "تمت إضافة السعر، لكن تعذر حفظ الصورة (الذاكرة ممتلئة).", photo_illisible: "تمت إضافة السعر، وتم تجاهل صورة غير صالحة.",
    verifier_champs: "تحقق من المنتج والسوق والسعر.",
    fiche_historique: "السجل", fiche_releve: "سُجل في {date} الساعة {heure}", nouveau_prix: "سعر جديد", fiche_aucun: "لا توجد أسعار لهذا المنتج بعد.",
    fcfa: "فرنك",
    unites: { sac: "كيس", kg: "كغ", koro: "كورو", tas: "كوم", litre: "لتر", piece: "حبة" },
    qualites: { premier: "ممتاز", standard: "عادي", economique: "اقتصادي" },
  },
};

const CLE_LANGUE = "marcheprix.langue";

let langue = langueInitiale();

function langueInitiale() {
  let choix = null;
  try { choix = localStorage.getItem(CLE_LANGUE); } catch {}
  if (choix in LANGUES) return choix;
  const nav = (navigator.language || "fr").slice(0, 2);
  return nav in LANGUES ? nav : "fr";
}

// t("cle") ou t("unites.sac"), avec remplacement de {variables}.
function t(cle, vars = {}) {
  const chercher = (dico) => cle.split(".").reduce((o, k) => (o == null ? o : o[k]), dico);
  const texte = chercher(TEXTES[langue]) ?? chercher(TEXTES.fr) ?? cle;
  return String(texte).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

// Nom traduit d'un objet { fr, en, ar }.
const tr = (obj) => (obj && (obj[langue] || obj.fr)) || "";

const locale = () => LANGUES[langue].locale;

function traduirePage(racine = document) {
  racine.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  racine.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  racine.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
}

function changerLangue(nouvelle) {
  if (!(nouvelle in LANGUES)) return;
  langue = nouvelle;
  try { localStorage.setItem(CLE_LANGUE, nouvelle); } catch {}
  appliquerLangue();
}

function appliquerLangue() {
  document.documentElement.lang = langue;
  document.documentElement.dir = LANGUES[langue].dir;
  traduirePage();
  document.dispatchEvent(new CustomEvent("mp:langue"));
}
