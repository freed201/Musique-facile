/**
 * src/data/testimonials.ts — témoignages d'élèves affichés sur la page d'accueil.
 *
 * D'OÙ VIENNENT CES AVIS
 * Ils sont relevés le 2026-09-02 sur les fiches publiques de Skilleos, où les
 * élèves les ont eux-mêmes déposés. Rien n'est reformulé : le texte, la note et
 * le prénom abrégé sont exactement ceux affichés par Skilleos, qui tronque
 * déjà les noms (« Valerie B. »). Chaque entrée porte l'URL de la fiche où
 * l'avis est consultable — on peut donc tout vérifier.
 *
 * Ils remplacent trois témoignages de démonstration (Marie Dubois, Thomas
 * Martin, Sophie Laurent) présents depuis le commit initial avec des photos de
 * banque d'images, retirés le 1er septembre 2026 : un témoignage inventé est
 * une pratique commerciale trompeuse (DGCCRF) — cf.
 * .claude/rules/contenu-credibilite.md.
 *
 * COMMENT LA SÉLECTION A ÉTÉ FAITE
 * Skilleos n'expose que trois avis par fiche : 45 ont été relevés sur les
 * 14 fiches, dont 18 portent un texte. Sont retenus ceux qui parlent de
 * l'enseignement (et non de la plateforme), en écartant les réponses d'un seul
 * mot. Aucun avis négatif n'est masqué en trompe-l'œil : la note agrégée
 * réelle (4,7/5 sur 929 avis, toutes notes confondues) reste affichée
 * au-dessus du carrousel, avec son lien vers la source.
 *
 * SUR LES DATES
 * Skilleos n'affiche que des dates relatives (« il y a 11 mois »). Celles qui
 * sont exprimées en mois sont converties en mois exact depuis le 2026-09-02 ;
 * les formulations vagues (« il y a environ 1 an ») sont marquées
 * `datePrecision: 'approchee'` et affichées avec « vers ». Les avis dont la
 * date était trop imprécise (« plus d'un an », « presque 2 ans ») sont écartés.
 *
 * CE QU'IL FAUT POUR AJOUTER UN TÉMOIGNAGE
 * 1. L'accord de l'élève pour une publication nominative.
 * 2. Une identité réduite : prénom + initiale du nom. Jamais le nom complet.
 * 3. Le mois et l'année où l'avis a été donné.
 * 4. Si l'avis existe en ligne (Skilleos, YouTube, e-mail public), son URL.
 * Sans le point 1 et le point 3, on ne publie pas.
 */

export interface Testimonial {
  /** Identifiant stable, utilisé comme clé de rendu. */
  id: string;
  /** Prénom + initiale, jamais le nom complet. Ex. « Camille L. ». */
  name: string;
  /** Instrument travaillé — pilote la couleur de la carte. */
  instrument: 'guitar' | 'piano' | 'ukulele' | 'solfege';
  /** Le texte de l'avis, mot pour mot. On ne le reformule pas. */
  quote: string;
  /** Mois et année de l'avis, au format AAAA-MM. Obligatoire. */
  date: string;
  /**
   * Fiabilité de `date`. Skilleos n'affiche que des dates relatives : « il y a
   * 11 mois » donne un mois exact, « il y a environ 1 an » non. Une date
   * approchée s'affiche précédée de « vers ». Par défaut : exacte.
   */
  datePrecision?: 'exacte' | 'approchee';
  /** Note donnée par l'élève, de 1 à 5. Optionnelle. */
  rating?: number;
  /** URL de l'avis d'origine, si publiquement consultable. */
  sourceUrl?: string;
  /** Nom de la plateforme d'origine. Ex. « Skilleos ». */
  sourceName?: string;
  /** Photo — uniquement une vraie photo de l'élève, avec son accord. */
  image?: string;
}

/**
 * Format d'une entrée, pour mémoire :
 *
 *   {
 *     id: 'camille-l-2026-05',
 *     name: 'Camille L.',
 *     instrument: 'ukulele',
 *     quote: "…",
 *     date: '2026-05',
 *     rating: 5,
 *     sourceUrl: 'https://www.skilleos.com/…',
 *     sourceName: 'Skilleos',
 *   }
 */
const SKILLEOS = 'https://www.skilleos.com/cours';

export const testimonials: Testimonial[] = [
  {
    id: 'cecile-l-2025-11',
    name: 'CECILE L.',
    instrument: 'solfege',
    quote:
      "Frédéric Fieffé pour les cours de solfège est absolument formidable : une progression très graduelle, approche pédagogique très structurée, tout est hyper clair, je comprends enfin des choses que je n'avais jamais comprises de toute ma vie, un grand bravo !!",
    date: '2025-11',
    rating: 5,
    sourceUrl: `${SKILLEOS}/solfege-avance-1-en-ligne`,
    sourceName: 'Skilleos',
  },
  {
    id: 'valerie-b-2025-09',
    name: 'Valerie B.',
    instrument: 'guitar',
    quote:
      "Un grand bravo à Frédéric Fieffé pour la clarté de ses cours. On ne peut que bien progresser avec sa pédagogie, merci !",
    date: '2025-09',
    rating: 5,
    sourceUrl: `${SKILLEOS}/apprendre-guitare-en-ligne`,
    sourceName: 'Skilleos',
  },
  {
    id: 'gaetane-c-2025-10',
    name: 'Gaëtane C.',
    instrument: 'ukulele',
    quote: "La progression,l'adaptation à des novices",
    date: '2025-10',
    rating: 5,
    sourceUrl: `${SKILLEOS}/apprendre-jouer-ukulele-en-ligne-debutant`,
    sourceName: 'Skilleos',
  },
  {
    id: 'jean-pierre-g-2025-09',
    name: 'Jean-Pierre G.',
    instrument: 'ukulele',
    quote: "Très bonne approche de l'instrument, je vais continuer.",
    date: '2025-09',
    datePrecision: 'approchee',
    rating: 5,
    sourceUrl: `${SKILLEOS}/apprendre-jouer-ukulele-en-ligne-debutant`,
    sourceName: 'Skilleos',
  },
  {
    id: 'xavier-d-2025-09',
    name: 'Xavier D.',
    instrument: 'piano',
    quote: 'Vidéos claires et concises, notion par notion.',
    date: '2025-09',
    datePrecision: 'approchee',
    rating: 5,
    sourceUrl: `${SKILLEOS}/apprendre-jouer-piano-en-ligne-debutant`,
    sourceName: 'Skilleos',
  },
  {
    id: 'amelie-v-2025-09',
    name: 'Amélie V.',
    instrument: 'piano',
    quote: 'Clair et bon rythme de progression.',
    date: '2025-09',
    datePrecision: 'approchee',
    rating: 5,
    sourceUrl: `${SKILLEOS}/apprendre-jouer-piano-en-ligne-debutant`,
    sourceName: 'Skilleos',
  },
  {
    id: 'francoise-d-2025-10',
    name: 'Françoise D.',
    instrument: 'solfege',
    quote: "Explications claires Exercices d'application. Le professeur est très pédagogue.",
    date: '2025-10',
    rating: 5,
    sourceUrl: `${SKILLEOS}/solfege-avance-1-en-ligne`,
    sourceName: 'Skilleos',
  },
];

/** Mois et année en toutes lettres, pour l'affichage sous un témoignage. */
export function formatTestimonialDate(date: string, precision?: Testimonial['datePrecision']): string {
  const [year, month] = date.split('-');
  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
  ];
  const label = months[Number(month) - 1];
  const rendu = label ? `${label} ${year}` : year;
  return precision === 'approchee' ? `vers ${rendu}` : rendu;
}
