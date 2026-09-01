/**
 * src/data/testimonials.ts — témoignages d'élèves affichés sur la page d'accueil.
 *
 * VIDE, ET C'EST VOULU.
 * Les trois témoignages qui occupaient cette place (Marie Dubois, Thomas Martin,
 * Sophie Laurent) étaient du contenu de démonstration, présent depuis le commit
 * initial du site, avec des photos de banque d'images. Fred l'a confirmé le
 * 1er septembre 2026. Un témoignage inventé est une pratique commerciale
 * trompeuse (DGCCRF) — cf. .claude/rules/contenu-credibilite.md.
 *
 * Tant que ce tableau est vide, la section n'affiche pas de carrousel : elle se
 * réduit à la note agrégée et à sa source vérifiable. Il n'y a rien à modifier
 * dans les composants pour la faire réapparaître — il suffit d'ajouter des
 * entrées ici.
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
export const testimonials: Testimonial[] = [];

/** Mois et année en toutes lettres, pour l'affichage sous un témoignage. */
export function formatTestimonialDate(date: string): string {
  const [year, month] = date.split('-');
  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
  ];
  const label = months[Number(month) - 1];
  return label ? `${label} ${year}` : year;
}
