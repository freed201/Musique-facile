/**
 * src/data/home-v2.ts — contenu partagé des maquettes de page d'accueil
 * /home-v2/, /home-v3/ et /home-v4/ (pages cachées, en cours de test).
 *
 * D'OÙ VIENNENT LES CHIFFRES
 * Chaque valeur vient soit de src/data/proof.ts (note, avis, élèves, vidéos),
 * soit du frontmatter des fiches src/content/courses/*.md (élèves par cours,
 * nombre de leçons, durée, prix, facilités, nombre d'avis, étapes du parcours),
 * relevés le 2026-09-04. Rien n'est inventé. Si une fiche cours change, ce
 * fichier change avec elle.
 *
 * RÈGLES — cf. .claude/rules/contenu-credibilite.md
 * Pas d'essai gratuit, pas de fausse urgence, pas de statistique décorative.
 */

export type Theme = 'guitar' | 'piano' | 'ukulele' | 'solfege';

export interface Path {
  id: Theme;
  /** « Guitare » */
  label: string;
  /** « la guitare » — pour « Commencer la guitare ». */
  object: string;
  /** « de la guitare » — pour « Je veux jouer de la guitare ». */
  complement: string;
  /** Promesse concrète, reprise du hero de la fiche cours. */
  tagline: string;
  /** Pour qui c'est fait, en une phrase. */
  audience: string;
  /** Page index de l'instrument (tous les cours). */
  url: string;
  /** Fiche de la formation débutant. */
  courseUrl: string;
  courseName: string;
  lessons: string;
  duration: string;
  price: string;
  priceValue: number;
  /** Facilités de paiement telles qu'affichées sur la fiche. */
  installments: string;
  students: string;
  reviews: string;
  ratingSourceUrl: string;
  /** Capture réelle de l'interface du cours (multi-caméra). */
  image: string;
  imageAlt: string;
  /** Le premier résultat tangible, tel qu'annoncé sur la fiche cours. */
  firstWin: string;
  /** Même promesse, formulée pour le bloc rentrée. */
  promise: string;
  /** Vidéo de présentation de la fiche cours (Vimeo), en façade. */
  videoId: string;
  /** Ce que la page vend pour cet instrument : le Pack quand il existe, sinon le cours. */
  offer: Offer;
}

export interface Offer {
  /** « Pack Guitare » ou « Lire les Notes de Musique ». */
  name: string;
  price: string;
  priceValue: number;
  /** Page d'achat, telle que liée depuis /offre/ ou la fiche cours. */
  url: string;
  /** Ce que contient l'offre, avec le prix de chaque formation prise seule (valeurs de /offre/). */
  includes: { title: string; price: string }[];
  /** Somme des prix des formations prises séparément, tels qu'affichés sur leurs fiches. */
  separately?: string;
  /** Une précision utile, affichée en petit. */
  note?: string;
}

export const paths: Path[] = [
  {
    id: 'guitar',
    label: 'Guitare',
    object: 'la guitare',
    complement: 'de la guitare',
    tagline: 'Vos premiers morceaux en 30 jours',
    audience:
      "Vous n'avez jamais tenu une guitare, ou vous avez laissé tomber il y a des années.",
    url: '/cours/cours-de-guitare/',
    courseUrl: '/cours/apprendre-guitare-debutant/',
    courseName: 'Cours Guitare Débutant',
    lessons: '82 leçons',
    duration: '4 h de vidéo',
    price: '89 €',
    priceValue: 89,
    installments: 'ou 3 × 30 € sans frais',
    students: '9 210 élèves',
    reviews: '199 avis',
    ratingSourceUrl: 'https://www.skilleos.com/cours/apprendre-guitare-en-ligne',
    image: '/images/cours/apprendre-guitare-debutant/timeline-3.webp',
    imageAlt: "Écran du cours de guitare : Fred face caméra, le diagramme de l'accord de C et ses doigts filmés en gros plan",
    firstWin: "Premiers accords en moins d'une semaine",
    promise: 'À la guitare, les premiers morceaux arrivent en 30 jours.',
    videoId: '1056355723',
    offer: {
      name: 'Pack Guitare',
      price: '99 €',
      priceValue: 99,
      url: 'https://ecole.musique-facile.fr/pack-guitare-cadeau',
      includes: [
        { title: 'Cours Guitare Débutant', price: '89 €' },
        { title: 'Guitare Odyssée, un an de progression', price: '149 €' },
        { title: 'Le Shuffle, rythmes blues', price: '29 €' },
      ],
      separately: '267 €',
    },
  },
  {
    id: 'piano',
    label: 'Piano',
    object: 'le piano',
    complement: 'du piano',
    tagline: 'Vos morceaux préférés, en partant de zéro',
    audience: "Vous rêvez de piano, mais le solfège vous a toujours arrêté à la porte.",
    url: '/cours/cours-de-piano/',
    courseUrl: '/cours/piano-facile-apprendre-debutant/',
    courseName: 'Pack Piano Débutant',
    lessons: '148 leçons',
    duration: '10 h de vidéo',
    price: '299 €',
    priceValue: 299,
    installments: 'ou 3 × 99 € sans frais',
    students: '21 000 élèves',
    reviews: '124 avis',
    ratingSourceUrl: 'https://www.skilleos.com/cours/apprendre-jouer-piano-en-ligne-debutant',
    image: '/images/cours/piano-facile-apprendre-debutant/timeline-1.webp',
    imageAlt: 'Écran du cours de piano : Fred face caméra, le clavier virtuel avec la note jouée surlignée, et ses mains filmées du dessus',
    firstWin: 'Vous jouez dès la première leçon, sans solfège pour commencer',
    promise: 'Au piano, vous jouez dès la première leçon ; les premiers morceaux, une ballade et un hymne en version simplifiée, arrivent au chapitre 3.',
    videoId: '1066493251',
    offer: {
      name: 'Pack Piano Débutant',
      price: '99 €',
      priceValue: 99,
      url: 'https://ecole.musique-facile.fr/pack-piano-debutant-cadeau',
      includes: [
        { title: 'Pack Piano Débutant, 148 leçons', price: '299 €' },
        { title: 'Lire les Notes de Musique', price: '79 €' },
      ],
      separately: '378 €',
    },
  },
  {
    id: 'ukulele',
    label: 'Ukulélé',
    object: 'le ukulélé',
    complement: 'du ukulélé',
    tagline: 'Vos premières chansons en 3 semaines',
    audience: "Vous voulez l'instrument le plus simple pour commencer, et vous amuser vite.",
    url: '/cours/cours-de-ukulele/',
    courseUrl: '/cours/apprendre-ukulele-debutant/',
    courseName: 'Cours Ukulélé Débutant',
    lessons: '41 leçons',
    duration: '2 h 30 de vidéo',
    price: '79 €',
    priceValue: 79,
    installments: 'ou 2 × 40 € sans frais',
    students: '4 900 élèves',
    reviews: '112 avis',
    ratingSourceUrl: 'https://www.skilleos.com/cours/apprendre-jouer-ukulele-en-ligne-debutant',
    image: '/images/cours/apprendre-ukulele-debutant/timeline-1.webp',
    imageAlt: "Écran du cours de ukulélé : Fred joue, le diagramme de l'accord E7 s'affiche à côté, ses doigts sont filmés en gros plan",
    firstWin: '4 cordes, des accords à un doigt : la première chanson vient vite',
    promise: 'Au ukulélé, les premières chansons arrivent en 3 semaines.',
    videoId: '1056758347',
    offer: {
      name: 'Pack Ukulélé',
      price: '99 €',
      priceValue: 99,
      url: 'https://ecole.musique-facile.fr/pack-ukulele',
      includes: [
        { title: 'Cours Ukulélé Débutant', price: '79 €' },
        { title: 'La Rythmique au ukulélé', price: '79 €' },
        { title: 'Le Shuffle', price: '29 €' },
      ],
      separately: '187 €',
    },
  },
  {
    id: 'solfege',
    label: 'Solfège',
    object: 'le solfège',
    complement: 'en lisant la musique',
    tagline: 'Lisez une partition en quelques semaines',
    audience: 'Vous jouez déjà un peu, ou pas du tout, et vous voulez enfin comprendre ce que vous lisez.',
    url: '/cours/cours-de-solfege/',
    courseUrl: '/cours/lecture-de-notes-niveau-debutant/',
    courseName: 'Lire les Notes de Musique',
    lessons: '35 leçons',
    duration: '2 h 20 de vidéo',
    price: '79 €',
    priceValue: 79,
    installments: 'ou 2 × 40 € sans frais',
    students: '4 100 élèves',
    reviews: '114 avis',
    ratingSourceUrl: 'https://www.skilleos.com/cours/solfege-fondamentaux-en-ligne',
    image: '/images/cours/lecture-de-notes-niveau-debutant/timeline-1.webp',
    imageAlt: "Écran du cours de solfège : l'ordre des notes en liste et en cercle, Fred en incrustation",
    firstWin: 'Une notion par leçon, des exercices à chaque étape',
    promise: 'En solfège, vous lisez vos premières notes en clé de sol dès le chapitre 2.',
    videoId: '1058583601',
    offer: {
      name: 'Lire les Notes de Musique',
      price: '79 €',
      priceValue: 79,
      url: 'https://ecole.musique-facile.fr/lecture-de-notes-1/buy',
      includes: [{ title: 'Lire les Notes de Musique, 35 leçons', price: '79 €' }],
      note: 'Ce cours est aussi compris dans le Pack Piano Débutant à 99 €.',
    },
  },
];

/** Comment ça se passe, en trois temps. */
export const steps = [
  {
    number: '01',
    title: 'Vous choisissez votre instrument',
    text: "Guitare, piano, ukulélé ou solfège. Si vous hésitez, un test de deux minutes vous oriente. Vous payez une fois, l'accès ne s'arrête jamais.",
    link: { label: 'Je ne sais pas quoi choisir', url: '/quel-instrument-choisir/' },
  },
  {
    number: '02',
    title: 'Vous suivez le parcours, dans l’ordre',
    text: 'Des vidéos courtes, une notion à la fois, un exercice à chaque étape. Quinze minutes par jour suffisent : la régularité compte plus que la durée.',
  },
  {
    number: '03',
    title: 'Vous jouez un morceau en entier',
    text: 'À la guitare, les premiers morceaux arrivent en 30 jours ; au ukulélé, en trois semaines. Ensuite vous enchaînez, à votre rythme, sans abonnement à renouveler.',
  },
];

/** Ce qui nous distingue, sans superlatif : trois faits vérifiables. */
export const differences = [
  {
    title: 'Un seul prof, du début à la fin',
    text: "Sur les quatre parcours débutant, c'est Fred Fieffé sur chaque leçon. Vous n'aurez pas à vous réhabituer à une nouvelle voix tous les trois chapitres.",
  },
  {
    title: 'Vous payez une fois, vous gardez tout',
    text: "Pas d'abonnement, pas de compte à rappeler dans six mois. Vous achetez la formation, vous y revenez dans un an si vous voulez, elle est toujours là.",
  },
  {
    title: 'Pensé pour l’adulte qui débute',
    text: "Vous n'avez jamais lu une note ? C'est le cas de la plupart de mes élèves. Les vidéos partent de zéro et ne supposent rien.",
  },
];

/** Questions posées par les visiteurs, réponses courtes. Alimente aussi le JSON-LD FAQPage. */
export const faq = [
  {
    q: 'Je débute à 50 ans. Ce n’est pas trop tard ?',
    a: "Non. La majorité de mes élèves sont des adultes, beaucoup ont entre 40 et 70 ans. Ils progressent souvent plus vite que les enfants parce qu'ils ont choisi d'être là. Tous les cours partent du niveau zéro.",
  },
  {
    q: 'Combien de temps par jour faut-il pratiquer ?',
    a: "Quinze minutes par jour donnent de meilleurs résultats que deux heures le dimanche. Les vidéos sont courtes, pensées pour des adultes qui ont une journée par ailleurs.",
  },
  {
    q: 'Faut-il connaître le solfège pour commencer la guitare, le piano ou le ukulélé ?',
    a: "Non. Les cours utilisent des diagrammes d'accords, des tablatures et des vidéos pas à pas. Le solfège est une formation à part, pour ceux qui veulent lire la musique.",
  },
  {
    q: 'Combien ça coûte, et y a-t-il un abonnement ?',
    a: "Chaque formation s'achète une fois, et l'accès ne s'arrête jamais. Le Pack par instrument, qui regroupe plusieurs formations et un cadeau expédié chez vous, coûte 99 € à la guitare, au piano et au ukulélé. Le cours de lecture de notes seul coûte 79 €. Il n'y a ni abonnement ni renouvellement.",
  },
  {
    q: 'Comment fonctionne la garantie 15 jours ?',
    a: "Vous suivez les cours pendant 15 jours après l'achat. Si ça ne vous convient pas, vous écrivez depuis la page contact et vous êtes remboursé.",
  },
  {
    q: 'Quel matériel faut-il ?',
    a: "L'instrument, un ordinateur, une tablette ou un téléphone, et c'est tout. Les partitions et les fiches d'accords se téléchargent depuis la formation.",
  },
  {
    q: 'Qui donne les cours ?',
    a: 'Fred Fieffé, musicien depuis plus de 40 ans, enseignant depuis 15 ans, auteur de méthodes chez Hal Leonard et formateur sur LinkedIn Learning. Plus de 80 000 élèves ont suivi ses cours.',
  },
  {
    q: 'Les avis sont-ils vérifiables ?',
    a: 'Oui. La note de 4,7/5 sur 929 avis vient de la page publique de Fred Fieffé sur Skilleos, où les élèves déposent eux-mêmes leur avis. Le lien est affiché sous chaque témoignage.',
  },
];

/**
 * Morceaux que les élèves apprennent avec les tutos du blog. Tous publiés
 * (prod: "Y") : ce sont de vrais liens internes, pas une liste décorative.
 */
export const songs = [
  { title: 'Wonderwall', artist: 'Oasis', url: '/blog/apprendre-wonderwall-guitare/' },
  { title: 'Hallelujah', artist: 'Jeff Buckley', url: '/blog/jouer-hallelujah-jeff-buckley-guitare/' },
  { title: 'Perfect', artist: 'Ed Sheeran', url: '/blog/apprendre-perfect-guitare/' },
  { title: 'Stand by Me', artist: 'Ben E. King', url: '/blog/apprendre-stand-by-me-guitare/' },
  { title: 'Clandestino', artist: 'Manu Chao', url: '/blog/jouer-clandestino-guitare-tutoriel/' },
  { title: 'Hey Jude', artist: 'The Beatles', url: '/blog/apprendre-hey-jude-guitare/' },
  { title: 'Redemption Song', artist: 'Bob Marley', url: '/blog/apprendre-redemption-song-guitare/' },
  { title: 'La Seine', artist: 'Vanessa Paradis & -M-', url: '/blog/jouer-la-seine-vanessa-m/' },
  { title: 'Viva La Vida', artist: 'Coldplay', url: '/blog/apprendre-viva-la-vida-guitare/' },
  { title: 'Une Belle Histoire', artist: 'Michel Fugain', url: '/blog/apprendre-une-belle-histoire-guitare/' },
  { title: 'Fields of Gold', artist: 'Sting', url: '/blog/jouer-fields-of-gold-sting/' },
  { title: 'Respire', artist: 'Mickey 3D', url: '/blog/apprendre-respire-guitare/' },
];

/** Vidéo de présentation utilisée en façade (fiche Cours Guitare Débutant). */
export const presentationVideo = {
  vimeoId: '1056355723',
  poster: '/images/cours/apprendre-guitare-debutant/hero.webp',
  title: 'Fred Fieffé présente le cours de guitare débutant',
};

/** Faits sur Fred, formulés une seule fois. */
export const fred = {
  name: 'Fred Fieffé',
  photo: '/images/prof/fred.webp',
  photoCutout: '/images/cours-piano-guitare-ukulele2.webp',
  credentials: [
    'Musicien depuis plus de 40 ans',
    "15 ans d'enseignement en ligne",
    'Auteur de méthodes chez Hal Leonard',
    'Formateur LinkedIn Learning et Skilleos',
    'Élu meilleur formateur Skilleos 2023/2024',
  ],
  aboutUrl: '/a-propos/',
  authorUrl: '/auteur/fred-fieffe/',
  sameAs: [
    'https://www.youtube.com/@Musique-Facile',
    'https://www.tiktok.com/@musique_facile',
    'https://instagram.com/guitare_et_ukulele_facile/?hl=fr',
    'https://facebook.com/MusiqueFacileFacebook',
  ],
};

/** Le quatrième Pack de /offre/, pour ceux qui jouent déjà du piano. */
export const pianoAdvancedOffer: Offer = {
  name: 'Pack Piano Avancé',
  price: '99 €',
  priceValue: 99,
  url: 'https://ecole.musique-facile.fr/pack-avance-piano-cadeau',
  includes: [
    { title: 'Piano Odyssée, 52 semaines de progression', price: '149 €' },
    { title: 'Le Cycle des Quintes', price: '79 €' },
    { title: 'Maîtriser les Accords au Piano', price: '79 €' },
  ],
  separately: '307 €',
  note: 'Pour ceux qui jouent déjà et veulent aller plus loin.',
};

/** Questions propres à la page de l'offre. Réponses reprises de /offre/, sans promesse invérifiable. */
export const offerFaq = [
  {
    q: "Comment accéder aux cours après l'achat ?",
    a: "Vous recevez vos accès par e-mail dans les 24 heures. Vous vous connectez sur la plateforme de l'école et vous commencez. L'accès n'expire pas.",
  },
  {
    q: 'Peut-on tester avant d’acheter ?',
    a: "Non : vous obtenez tout de suite la formation complète, à vie. La garantie de 15 jours couvre l'achat : si ça ne vous convient pas, un message depuis la page contact suffit et vous êtes remboursé.",
  },
  {
    q: 'Les Packs conviennent-ils à un grand débutant ?',
    a: 'Oui, sauf le Pack Piano Avancé, prévu pour ceux qui jouent déjà. Les trois autres partent du niveau zéro, une notion à la fois, sans prérequis.',
  },
  {
    q: 'Y a-t-il un accompagnement si je bloque ?',
    a: 'Oui, par e-mail, à contact@musique-facile.fr. Fred répond lui-même.',
  },
  {
    q: 'Puis-je avoir une facture ?',
    a: "Oui, elle vous est envoyée par e-mail après l'achat.",
  },
  {
    q: 'Combien de temps par jour faut-il ?',
    a: 'Quinze minutes par jour suffisent. Les leçons sont courtes, et mieux vaut quinze minutes régulières que deux heures le dimanche.',
  },
];

/* =========================================================================
   Angle « rentrée » (maquette /home-v2/)
   ========================================================================= */

/**
 * Calendrier scolaire 2026-2027 (arrêté publié au Journal officiel le
 * 23 octobre 2025) : rentrée le mardi 1er septembre 2026, vacances de la
 * Toussaint du samedi 17 octobre au lundi 2 novembre 2026, toutes zones.
 * Le message « premier morceau avant la Toussaint » s'appuie sur la promesse
 * réelle de la fiche guitare (premiers morceaux en 30 jours).
 */
export const rentree = {
  season: 'Rentrée 2026',
  claim: 'Votre premier morceau avant la Toussaint',
  /**
   * L'offre de rentrée : le Pack à 99 €, sans cadeau, valable jusqu'au
   * 16 octobre 2026 (veille des vacances de la Toussaint). Date validée par
   * Fred le 2026-09-04. Une offre promotionnelle vendue à distance doit
   * afficher sa durée (lignes directrices DGCCRF sur l'encadrement des
   * promotions) : si elle est prolongée, changer la date ici, jamais la
   * laisser courir sans date. Aucun compte à rebours.
   */
  offerLabel: 'Offre de rentrée',
  offerEnds: '2026-10-16',
  offerEndsLabel: 'vendredi 16 octobre 2026',
  offerEndsShort: '16 octobre',
  toussaintStart: '2026-10-17',
  toussaintLabel: 'samedi 17 octobre 2026',
  toussaintRange: 'du 17 octobre au 2 novembre 2026',
  source: 'Calendrier scolaire 2026-2027, arrêté publié au Journal officiel le 23 octobre 2025.',
};

export interface JourneyVariant {
  title: string;
  details: string[];
  image: string;
  imageAlt: string;
}

export interface JourneyStep {
  number: string;
  /** Repère de temps indicatif, à 15 minutes par jour. */
  marker: string;
  byInstrument: Record<Theme, JourneyVariant>;
}

const alt = (instrument: string, sujet: string) => `Écran du cours de ${instrument} : ${sujet}`;

/**
 * Les quatre premiers chapitres de chaque parcours débutant, tels qu'ils
 * figurent dans `timeline[]` des fiches cours. Les captures sont celles des
 * fiches (interface réelle, multi-caméra).
 */
export const journey: JourneyStep[] = [
  {
    number: '1',
    marker: 'Jour 1',
    byInstrument: {
      guitar: {
        title: 'Les bases essentielles',
        details: ['Accorder la guitare, trouver la bonne posture', 'Lire un diagramme d’accords', 'Jouer ses premiers accords : Em et C'],
        image: '/images/cours/apprendre-guitare-debutant/timeline-1.webp',
        imageAlt: alt('guitare', 'Fred joue face caméra, le manche est détouré'),
      },
      piano: {
        title: 'Premiers pas sur le piano',
        details: ['Les notes et le clavier', 'Les touches blanches, exercice après exercice', 'Échauffements et premières notes'],
        image: '/images/cours/piano-facile-apprendre-debutant/timeline-1.webp',
        imageAlt: alt('piano', 'do ré mi fa sol, le clavier virtuel et les mains de Fred'),
      },
      ukulele: {
        title: 'Découverte et fondations',
        details: ['Accorder son ukulélé', 'Lire les diagrammes d’accords', 'Vos premiers accords pour démarrer'],
        image: '/images/cours/apprendre-ukulele-debutant/timeline-1.webp',
        imageAlt: alt('ukulélé', 'l’accord E7 en diagramme et en gros plan'),
      },
      solfege: {
        title: 'Introduction au solfège',
        details: ['L’histoire et l’ordre des notes', 'Exercices sur l’ordre et l’inversion des notes', 'Le document de cours à télécharger'],
        image: '/images/cours/lecture-de-notes-niveau-debutant/timeline-1.webp',
        imageAlt: alt('solfège', 'l’ordre des notes en liste et en cercle'),
      },
    },
  },
  {
    number: '2',
    marker: 'Semaine 1',
    byInstrument: {
      guitar: {
        title: 'La rythmique',
        details: ['Médiator ou doigts', 'Coup vers le bas, coup vers le haut', 'Votre première rythmique de base'],
        image: '/images/cours/apprendre-guitare-debutant/timeline-2.webp',
        imageAlt: alt('guitare', 'les flèches de la rythmique, les accords Am et Em'),
      },
      piano: {
        title: 'Accords et notation',
        details: ['Les intervalles', 'Découverte des accords', 'La notation internationale (C, D, E…)'],
        image: '/images/cours/piano-facile-apprendre-debutant/timeline-2.webp',
        imageAlt: alt('piano', 'accords et notation'),
      },
      ukulele: {
        title: 'Rythmique et tablature',
        details: ['La tenue et la rythmique de base', 'Premiers exercices rythmiques', 'Les accords essentiels et le swing'],
        image: '/images/cours/apprendre-ukulele-debutant/timeline-2.webp',
        imageAlt: alt('ukulélé', 'rythmique et tablature'),
      },
      solfege: {
        title: 'Fondations de la lecture',
        details: ['La portée et les clés', 'La clé de sol et ses repères', 'La clé de fa'],
        image: '/images/cours/lecture-de-notes-niveau-debutant/timeline-2.webp',
        imageAlt: alt('solfège', 'la portée et la clé de sol'),
      },
    },
  },
  {
    number: '3',
    marker: 'Semaines 2 et 3',
    byInstrument: {
      guitar: {
        title: 'Les accords des chansons',
        details: ['D, G, E, A7', 'Des transitions fluides entre les accords', 'Les 4 accords magiques'],
        image: '/images/cours/apprendre-guitare-debutant/timeline-3.webp',
        imageAlt: alt('guitare', 'l’accord de C en diagramme et en gros plan'),
      },
      piano: {
        title: 'Premiers morceaux',
        details: ['Un classique du gospel', 'Une ballade en version simplifiée', 'Un hymne populaire'],
        image: '/images/cours/piano-facile-apprendre-debutant/timeline-3.webp',
        imageAlt: alt('piano', 'premiers morceaux'),
      },
      ukulele: {
        title: 'Accords et agilité',
        details: ['La rythmique aller-retour', 'D, A, A7 et des accords plus mélodieux', 'Initiation au swing'],
        image: '/images/cours/apprendre-ukulele-debutant/timeline-3.webp',
        imageAlt: alt('ukulélé', 'accords et agilité'),
      },
      solfege: {
        title: 'Toutes les notes',
        details: ['Au-dessus et en dessous des repères', 'Exercices complets en clé de sol et de fa', 'Astuces pour lire vite'],
        image: '/images/cours/lecture-de-notes-niveau-debutant/timeline-3.webp',
        imageAlt: alt('solfège', 'lecture complète des notes'),
      },
    },
  },
  {
    number: '4',
    marker: 'Jour 30',
    byInstrument: {
      guitar: {
        title: 'Le premier morceau, puis l’expression',
        details: ['La rythmique feu de camp', 'Arpèges et système PIMA', 'Vos premiers morceaux en entier'],
        image: '/images/cours/apprendre-guitare-debutant/timeline-5.webp',
        imageAlt: alt('guitare', 'le système PIMA, pouce index majeur annulaire'),
      },
      piano: {
        title: 'Rythme et techniques',
        details: ['Le rythme et le contretemps', 'Les syncopes', 'Puis la lecture de partitions, chapitre 5'],
        image: '/images/cours/piano-facile-apprendre-debutant/timeline-4.webp',
        imageAlt: alt('piano', 'rythme et techniques'),
      },
      ukulele: {
        title: 'Diversité et perfectionnement',
        details: ['Les arpèges', 'Les accords barrés', 'Entretien du ukulélé et prochaines étapes'],
        image: '/images/cours/apprendre-ukulele-debutant/timeline-4.webp',
        imageAlt: alt('ukulélé', 'arpèges et accords barrés'),
      },
      solfege: {
        title: 'Intervalles et accords',
        details: ['Tierces et quintes en clé de sol et de fa', 'Octaves et double portée', 'Approche des accords'],
        image: '/images/cours/lecture-de-notes-niveau-debutant/timeline-4.webp',
        imageAlt: alt('solfège', 'intervalles et double portée'),
      },
    },
  },
];

export interface Callout {
  /** Position du repère sur la capture, en pourcentage de sa largeur et de sa hauteur. */
  x: number;
  y: number;
  title: string;
  text: string;
}

/**
 * Ce que le visiteur voit à l'écran pendant une leçon : trois repères posés
 * sur la capture réelle de chaque cours (celle du hero, `paths[].image`).
 * Coordonnées relevées sur les images le 2026-09-04.
 */
export const screenCallouts: Record<Theme, Callout[]> = {
  guitar: [
    { x: 22, y: 22, title: 'Fred, en face de vous', text: 'La caméra principale. Vous voyez la posture et le geste, vous entendez chaque explication.' },
    { x: 22, y: 72, title: 'Le diagramme, au même moment', text: "L'accord s'affiche pendant qu'il est joué : quelle corde, quel doigt, quelle case." },
    { x: 72, y: 62, title: 'Les mains, en gros plan', text: 'Une deuxième caméra sur le manche. Vous copiez la position doigt par doigt.' },
  ],
  piano: [
    { x: 22, y: 26, title: 'Fred, en face de vous', text: 'La caméra principale. Vous entendez chaque explication, note par note.' },
    { x: 50, y: 60, title: 'Le clavier à l’écran', text: 'La touche jouée se colore au moment où Fred la joue, avec le nom de la note et le doigt.' },
    { x: 50, y: 86, title: 'Les mains, filmées du dessus', text: 'Vous voyez exactement quel doigt appuie, et vous refaites la même chose.' },
  ],
  ukulele: [
    { x: 18, y: 32, title: 'Fred, en face de vous', text: 'La caméra principale, avec la tenue de l’instrument.' },
    { x: 56, y: 30, title: 'Le diagramme, au même moment', text: "L'accord s'affiche pendant qu'il est joué, avec les doigts numérotés." },
    { x: 46, y: 80, title: 'Les mains, en gros plan', text: 'Le manche filmé de près, pour copier la position doigt par doigt.' },
  ],
  solfege: [
    { x: 30, y: 30, title: 'La notion, écrite en grand', text: "L'ordre des notes, dans les deux sens, lisible d'un coup d'œil." },
    { x: 78, y: 30, title: 'Le schéma qui aide à retenir', text: 'Le cercle des notes, repris en exercice à la fin du chapitre.' },
    { x: 85, y: 80, title: 'Fred, qui explique', text: 'Toujours à l’écran, jamais une voix off anonyme.' },
  ],
};

/**
 * Le manifeste, révélé mot à mot au défilement. Une version par instrument :
 * celui qui vient de choisir le solfège ne doit pas lire qu'il n'en a pas besoin.
 */
export const manifesto: Record<Theme, string> = {
  guitar:
    "Vous n'êtes pas trop vieux. Vous n'avez pas besoin du solfège. Vous avez besoin de quinze minutes par jour, et d'un prof qui vous parle.",
  piano:
    "Vous n'êtes pas trop vieux. Vous n'avez pas besoin du solfège pour commencer. Vous avez besoin de quinze minutes par jour, et d'un prof qui vous parle.",
  ukulele:
    "Vous n'êtes pas trop vieux. Vous n'avez pas besoin du solfège. Vous avez besoin de quinze minutes par jour, et d'un prof qui vous parle.",
  solfege:
    "Vous n'êtes pas trop vieux. Vous n'avez pas besoin d'un conservatoire. Vous avez besoin de quinze minutes par jour, et d'un prof qui vous parle.",
};

/** Bande de réassurance : quatre engagements, chacun renvoyant à une note sourcée. */
export const reassurance = [
  {
    label: 'Paiement unique',
    note: "Le prix affiché se paie une fois. Il n'y a pas d'abonnement. Chaque fiche cours indique aussi une facilité en 2 ou 3 fois sans frais.",
    href: '/cours/',
    linkLabel: 'les fiches cours',
  },
  {
    label: 'Accès à vie, mises à jour comprises',
    note: "L'accès à une formation achetée n'expire pas, et les mises à jour du cours sont incluses.",
    href: '/offre/',
    linkLabel: "détail sur la page de l'offre",
  },
  {
    label: '15 jours pour changer d’avis',
    note: 'Garantie satisfait ou remboursé de 15 jours, mentionnée sur chaque fiche cours. La demande se fait par la page contact.',
    href: '/contact/',
    linkLabel: 'page contact',
  },
  {
    label: 'Un seul prof sur les parcours débutant',
    note: 'Fred Fieffé enregistre chaque leçon des quatre formations débutant. Des musiciens invités interviennent uniquement sur certains cours avancés.',
    href: '/a-propos/',
    linkLabel: 'à propos de Fred',
  },
];
