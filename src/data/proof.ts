/**
 * src/data/proof.ts — source unique des chiffres de preuve sociale.
 *
 * POURQUOI CE FICHIER
 * Ces chiffres étaient recopiés à la main dans une dizaine de composants et de
 * pages, avec des variantes incohérentes (« 95 % de satisfaction » d'un côté,
 * « 4,7/5 » de l'autre). Toute valeur affichée publiquement passe désormais par
 * ici, pour qu'une correction se fasse à un seul endroit.
 *
 * RÈGLE — cf. .claude/rules/contenu-credibilite.md
 * Aucun chiffre n'entre dans ce fichier sans une provenance écrite dans le champ
 * `source`. Un chiffre dont on ne sait plus d'où il vient se retire, il ne se
 * reformule pas.
 *
 * RENDU STATIQUE
 * `display` est la chaîne écrite dans le HTML au build : un robot qui n'exécute
 * pas JavaScript et ne scrolle pas doit lire « 80 000+ », jamais « 0 ».
 * `counter` n'est qu'une surcouche d'animation, facultative par construction.
 */

export interface ProofStat {
  /** Valeur finale, telle qu'elle apparaît dans le HTML rendu au build. */
  display: string;
  /** Cible de l'animation de comptage. `null` = valeur non animable (on l'affiche telle quelle). */
  counter: number | null;
  /** Suffixe ajouté par l'animation ; doit produire exactement `display` à l'arrivée. */
  suffix?: string;
  /** Durée de l'animation en millisecondes. */
  duration?: number;
  /** Provenance du chiffre. Obligatoire. */
  source: string;
}

/**
 * Page publique d'où viennent la note et le nombre d'avis.
 * Vérifiée le 1er septembre 2026 : « 4,7/5 », « 929 avis », 88 853 élèves.
 */
export const reviewsSource = {
  name: 'Skilleos',
  url: 'https://www.skilleos.com/expert/frederic-fieffe',
  /** Date du dernier relevé sur la page source (format ISO). */
  checkedOn: '2026-09-01',
  /** Formulation courte réutilisable sous une note affichée. */
  label: 'avis vérifiés sur Skilleos',
} as const;

/** Nombre d'élèves formés, toutes plateformes confondues. */
export const students: ProofStat = {
  display: '80 000+',
  counter: 80000,
  suffix: '+',
  duration: 2000,
  source:
    'Chiffre officiel Musique Facile (contenu-credibilite.md). Cohérent avec les 88 853 élèves affichés sur la page Skilleos de Fred Fieffé au 2026-09-01 — volontairement arrondi à la baisse.',
};

/** Variante compacte du même chiffre, pour les emplacements étroits (hero mobile). */
export const studentsShort: ProofStat = {
  display: '80 K+',
  counter: 80,
  suffix: ' K+',
  duration: 2000,
  source: students.source,
};

/**
 * Note moyenne. Volontairement NON animée : un compteur qui affiche « 0,7/5 »
 * puis « 4,7/5 » en cours de route donne à lire un chiffre faux.
 */
export const rating: ProofStat = {
  display: '4,7/5',
  counter: null,
  source: `Page publique ${reviewsSource.url}, relevé le ${reviewsSource.checkedOn}.`,
};

/** Valeur numérique de la note, pour le JSON-LD (séparateur décimal anglo-saxon). */
export const ratingValue = '4.7';
export const bestRating = '5';

/** Nombre d'avis ayant produit la note. */
export const reviews: ProofStat = {
  display: '929',
  counter: 929,
  duration: 1500,
  source: rating.source,
};

/** Nombre de vidéos de cours disponibles sur la plateforme. */
export const videos: ProofStat = {
  display: '1 400+',
  counter: 1400,
  suffix: '+',
  duration: 2000,
  source:
    'Décompte interne des vidéos de cours disponibles sur la plateforme de diffusion, confirmé par Fred Fieffé le 2026-09-01.',
};

/** Années d'enseignement de Fred Fieffé. */
export const teachingYears: ProofStat = {
  display: '15 ans',
  counter: 15,
  suffix: ' ans',
  duration: 1500,
  source: 'Chiffre officiel Musique Facile (contenu-credibilite.md).',
};

/** Phrase courte « note + nombre d'avis », utilisée dans les badges. */
export const ratingSummary = `${rating.display} sur ${reviews.display} avis`;

/**
 * Attributs à étaler sur l'élément qui affiche une statistique.
 * Retourne un objet vide quand la valeur n'est pas animable : dans ce cas
 * `display` est simplement écrit dans le HTML, sans surcouche JavaScript.
 *
 * Usage : <span class="stat" {...counterAttrs(students)}>{students.display}</span>
 */
export function counterAttrs(stat: ProofStat): Record<string, string | number> {
  if (stat.counter === null) return {};
  const attrs: Record<string, string | number> = { 'data-counter': stat.counter };
  if (stat.suffix) attrs['data-counter-suffix'] = stat.suffix;
  if (stat.duration) attrs['data-duration'] = stat.duration;
  return attrs;
}
