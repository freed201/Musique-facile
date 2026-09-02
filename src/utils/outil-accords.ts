/**
 * Calculs de l'outil « Quel accord apprendre ensuite ? ».
 *
 * Isolés ici parce qu'ils servent deux pages — guitare et ukulélé — et parce
 * qu'ils sont testables à la main : ce sont des fonctions pures sur des
 * tableaux d'accords, sans rien qui touche au DOM ni à Astro.
 */

export interface MorceauOutil {
  titre: string;
  artiste?: string | null;
  accords: string[];
  /** Lien vers le tutoriel — article dédié, ou ancre dans un article-liste. */
  lien: string;
  tempo?: number | null;
  difficulte?: string | null;
}

/** Les accords du répertoire, du plus fréquent au plus rare. */
export function classerAccords(morceaux: MorceauOutil[]): [string, number][] {
  const frequence = new Map<string, number>();
  for (const m of morceaux) {
    for (const accord of m.accords) frequence.set(accord, (frequence.get(accord) ?? 0) + 1);
  }
  return [...frequence.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

/**
 * Trois groupes d'accords.
 *
 * Le seuil sépare ce qu'on montre d'emblée de ce qu'on replie : trente cases
 * d'un bloc font un mur sur un écran de téléphone. Les accords qui n'existent
 * que dans un seul morceau ne sont pas proposés du tout — les cocher
 * n'apprendrait rien à l'outil.
 */
export function grouperAccords(classement: [string, number][], seuilCourant = 4) {
  return {
    courants: classement.filter(([, n]) => n >= seuilCourant).map(([c]) => c),
    secondaires: classement.filter(([, n]) => n >= 2 && n < seuilCourant).map(([c]) => c),
    rares: classement.filter(([, n]) => n < 2).map(([c]) => c),
  };
}

/** Combien de morceaux sont jouables en entier avec les n accords les plus courants. */
export function jouablesAvec(morceaux: MorceauOutil[], classement: [string, number][], n: number) {
  const connus = new Set(classement.slice(0, n).map(([c]) => c));
  return morceaux.filter((m) => m.accords.every((a) => connus.has(a))).length;
}

/** Nombre d'accords du morceau médian. */
export function medianeAccords(morceaux: MorceauOutil[]) {
  if (!morceaux.length) return 0;
  const tailles = morceaux.map((m) => m.accords.length).sort((a, b) => a - b);
  return tailles[Math.floor(tailles.length / 2)];
}

/**
 * Nom d'accord → clé de fichier, telle que l'écrit scripts/generate-chord-svgs.mjs.
 * « F#m » → « fdiese-m », « Am/G » → « am-g ».
 */
export const cleDiagramme = (accord: string) =>
  accord.toLowerCase().replace(/#/g, 'diese').replace(/\//g, '-');
