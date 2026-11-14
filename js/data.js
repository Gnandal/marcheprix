// Données de MarchéPrix.
// Les prix, horaires et caractéristiques sont des EXEMPLES à remplacer par des relevés réels.
// Images : par défaut l'illustration images/produits/<id>.svg (ou images/marches/<id>.svg).
// Après avoir téléchargé une photo (voir CREDITS.md), ajoutez-la à l'objet :
//   { id: "riz", image: "images/produits/riz.jpg", ... }
// Si la photo ne charge pas, l'illustration revient automatiquement.

const PRODUITS = [
  { id: "riz",      ordre: 1, unites: ["sac", "kg", "koro"],   nom: { fr: "Riz",      en: "Rice",      ar: "أرز" } },
  { id: "oignon",   ordre: 2, unites: ["tas", "kg", "sac"],    nom: { fr: "Oignon",   en: "Onion",     ar: "بصل" } },
  { id: "huile",    ordre: 3, unites: ["litre"],               nom: { fr: "Huile",    en: "Oil",       ar: "زيت" } },
  { id: "sucre",    ordre: 4, unites: ["kg", "sac"],           nom: { fr: "Sucre",    en: "Sugar",     ar: "سكر" } },
  { id: "viande",   ordre: 5, unites: ["kg"],                  nom: { fr: "Viande",   en: "Meat",      ar: "لحم" } },
  { id: "tomate",   ordre: 6, unites: ["tas", "kg"],           nom: { fr: "Tomate",   en: "Tomato",    ar: "طماطم" } },
  { id: "mil",      ordre: 7, unites: ["koro", "sac"],         nom: { fr: "Mil",      en: "Millet",    ar: "دخن" } },
  { id: "arachide", ordre: 8, unites: ["koro", "kg"],          nom: { fr: "Arachide", en: "Groundnut", ar: "فول سوداني" } },
];

// Coordonnées tirées d'OpenStreetMap (amenity=marketplace).
const MARCHES = [
  {
    id: "grand-marche", image: "images/marches/grand-marche-600.jpg", imageGrande: "images/marches/grand-marche-1000.jpg", lat: 12.10804, lng: 15.05047,
    nom: { fr: "Grand Marché", en: "Grand Market", ar: "السوق الكبير" },
    description: {
      fr: "Le marché central de N'Djamena, au cœur de la ville. On y trouve presque tout : céréales, épices, tissus et produits importés.",
      en: "N'Djamena's central market, in the heart of the city. Almost everything is sold here: grains, spices, fabrics and imported goods.",
      ar: "السوق المركزي في انجمينا، في قلب المدينة. يُباع فيه كل شيء تقريبًا: الحبوب والتوابل والأقمشة والسلع المستوردة.",
    },
    caracteristiques: [
      { icone: "🕖", texte: { fr: "Tous les jours, 7 h – 18 h", en: "Every day, 7am – 6pm", ar: "كل يوم، 7 صباحًا – 6 مساءً" } },
      { icone: "🛒", texte: { fr: "Gros et détail", en: "Wholesale and retail", ar: "جملة وتجزئة" } },
      { icone: "🌶️", texte: { fr: "Spécialités : céréales, épices", en: "Specialities: grains, spices", ar: "التخصص: الحبوب والتوابل" } },
      { icone: "🚕", texte: { fr: "Très fréquenté, venir tôt", en: "Very busy, come early", ar: "مزدحم جدًا، تعال مبكرًا" } },
    ],
  },
  {
    id: "dembe", image: "images/marches/dembe-600.jpg", imageGrande: "images/marches/dembe-1000.jpg", lat: 12.10556, lng: 15.08126,
    nom: { fr: "Marché de Dembé", en: "Dembé Market", ar: "سوق دامبي" },
    description: {
      fr: "Grand marché populaire du sud-est de la ville, réputé pour ses prix bas sur les produits frais et la viande.",
      en: "Large popular market in the south-east of the city, known for low prices on fresh produce and meat.",
      ar: "سوق شعبي كبير في جنوب شرق المدينة، معروف بأسعاره المنخفضة للمنتجات الطازجة واللحوم.",
    },
    caracteristiques: [
      { icone: "🕖", texte: { fr: "Tous les jours, 6 h – 18 h", en: "Every day, 6am – 6pm", ar: "كل يوم، 6 صباحًا – 6 مساءً" } },
      { icone: "🥩", texte: { fr: "Spécialités : viande, poisson, légumes", en: "Specialities: meat, fish, vegetables", ar: "التخصص: اللحوم والسمك والخضروات" } },
      { icone: "💰", texte: { fr: "Prix souvent plus bas", en: "Often cheaper", ar: "أسعار أقل غالبًا" } },
    ],
  },
  {
    id: "farcha", image: "images/marches/farcha-600.jpg", imageGrande: "images/marches/farcha-1000.jpg", lat: 12.12682, lng: 14.98803,
    nom: { fr: "Marché de Farcha", en: "Farcha Market", ar: "سوق فرشة" },
    description: {
      fr: "Marché de quartier à l'ouest de la ville, pratique pour les courses du quotidien.",
      en: "Neighbourhood market in the west of the city, handy for everyday shopping.",
      ar: "سوق حي في غرب المدينة، مناسب للتسوق اليومي.",
    },
    caracteristiques: [
      { icone: "🕖", texte: { fr: "Tous les jours, 7 h – 17 h", en: "Every day, 7am – 5pm", ar: "كل يوم، 7 صباحًا – 5 مساءً" } },
      { icone: "🧅", texte: { fr: "Spécialités : légumes, oignons", en: "Specialities: vegetables, onions", ar: "التخصص: الخضروات والبصل" } },
      { icone: "🅿️", texte: { fr: "Stationnement facile", en: "Easy parking", ar: "موقف سيارات سهل" } },
    ],
  },
  {
    id: "champ-de-fils", image: "images/marches/champ-de-fils-600.jpg", imageGrande: "images/marches/champ-de-fils-1000.jpg", lat: 12.11067, lng: 15.06944,
    nom: { fr: "Marché de Champ de Fils", en: "Champ de Fils Market", ar: "سوق حقول الأبناء" },
    description: {
      fr: "Marché animé entre le centre et Dembé, apprécié des étudiants pour ses petites quantités.",
      en: "Lively market between the centre and Dembé, popular with students for its small quantities.",
      ar: "سوق نشيط بين وسط المدينة ودامبي، يحبه الطلاب لبيعه بكميات صغيرة.",
    },
    caracteristiques: [
      { icone: "🕖", texte: { fr: "Tous les jours, 7 h – 19 h", en: "Every day, 7am – 7pm", ar: "كل يوم، 7 صباحًا – 7 مساءً" } },
      { icone: "🎒", texte: { fr: "Vente au détail, petites quantités", en: "Retail, small quantities", ar: "بيع بالتجزئة وبكميات صغيرة" } },
      { icone: "🍅", texte: { fr: "Spécialités : tomates, huile, sucre", en: "Specialities: tomatoes, oil, sugar", ar: "التخصص: الطماطم والزيت والسكر" } },
    ],
  },
];

// Historique : [produit, marché, unité, qualité, dernier relevé, [prix semaine -3, -2, -1, dernier]]
// Chaque prix précédent est daté 7 jours plus tôt.
const HISTORIQUE = [
  ["riz",      "grand-marche",  "sac",   "standard",   "2026-11-13T09:10", [21500, 22000, 22000, 22500]],
  ["riz",      "dembe",         "sac",   "standard",   "2026-11-14T08:20", [20500, 21000, 21000, 21000]],
  ["riz",      "farcha",        "sac",   "premier",    "2026-11-12T10:05", [22500, 22500, 23000, 23000]],
  ["riz",      "champ-de-fils", "koro",  "standard",   "2026-11-13T16:40", [1100, 1100, 1150, 1150]],
  ["oignon",   "grand-marche",  "tas",   "standard",   "2026-11-14T07:45", [1250, 1100, 1000, 1000]],
  ["oignon",   "farcha",        "tas",   "premier",    "2026-11-13T11:30", [1500, 1400, 1250, 1250]],
  ["oignon",   "dembe",         "tas",   "economique", "2026-11-12T08:00", [1000, 900, 900, 850]],
  ["huile",    "dembe",         "litre", "standard",   "2026-11-13T10:15", [1250, 1250, 1300, 1300]],
  ["huile",    "champ-de-fils", "litre", "standard",   "2026-11-14T09:50", [1350, 1400, 1400, 1400]],
  ["huile",    "grand-marche",  "litre", "premier",    "2026-11-11T12:00", [1500, 1500, 1500, 1550]],
  ["sucre",    "grand-marche",  "kg",    "standard",   "2026-11-13T08:35", [850, 900, 900, 900]],
  ["sucre",    "champ-de-fils", "kg",    "standard",   "2026-11-12T15:20", [850, 850, 850, 850]],
  ["viande",   "farcha",        "kg",    "premier",    "2026-11-14T07:10", [3300, 3400, 3500, 3500]],
  ["viande",   "dembe",         "kg",    "standard",   "2026-11-13T06:50", [3200, 3200, 3300, 3300]],
  ["tomate",   "champ-de-fils", "tas",   "standard",   "2026-11-14T10:25", [700, 600, 550, 500]],
  ["tomate",   "grand-marche",  "tas",   "standard",   "2026-11-13T09:40", [750, 700, 650, 600]],
  ["mil",      "dembe",         "koro",  "standard",   "2026-11-12T09:00", [700, 700, 750, 750]],
  ["mil",      "grand-marche",  "koro",  "standard",   "2026-11-11T10:30", [750, 800, 800, 800]],
  ["arachide", "dembe",         "koro",  "standard",   "2026-11-10T11:15", [950, 1000, 1000, 1000]],
];

const RELEVES = HISTORIQUE.flatMap(([produit, marche, unite, qualite, dernier, prix]) =>
  prix.map((p, i) => {
    const d = new Date(dernier);
    d.setDate(d.getDate() - 7 * (prix.length - 1 - i));
    return { produit, marche, unite, qualite, prix: p, date: d.toISOString() };
  })
);

// Photo de fond de l'accueil (null → un dégradé s'affiche).
const IMAGE_HERO = { petite: "images/hero-800.jpg", grande: "images/hero-1280.jpg" };

// Crédits des photos, affichés dans le pied de page (voir aussi CREDITS.md).
const CREDITS_PHOTOS = [
  { auteur: "Ademola Adeola",       source: "Pexels", url: "https://www.pexels.com/photo/39308542/" },
  { auteur: "Darkside Photography", source: "Pexels", url: "https://www.pexels.com/photo/36827824/" },
  { auteur: "Darkside Photography", source: "Pexels", url: "https://www.pexels.com/photo/36827830/" },
  { auteur: "Detty Images",         source: "Pexels", url: "https://www.pexels.com/photo/30179960/" },
];
