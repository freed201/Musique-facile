/**
 * Détection des articles-liste et extraction de leurs entrées.
 *
 * Un article comme « 15 chansons faciles ukulélé » est un listicle : Google
 * et les moteurs de réponse exploitent le schema `ItemList` pour ce format,
 * mais il n'était généré que pour les guides d'achat (via `products[]`).
 *
 * Les entrées sont déduites des titres de l'article plutôt que d'un nouveau
 * champ de frontmatter : les ~100 articles existants restent inchangés, et un
 * article rédigé plus tard en bénéficie sans rien déclarer.
 *
 * On travaille sur les `headings` fournis par `entry.render()`, qui portent
 * déjà le `slug` calculé par Astro — le reproduire à la main donnerait des
 * ancres fausses : l'algorithme conserve les caractères Unicode, l'ancre de
 * « Somewhere Over the Rainbow — Israel Kamakawiwoʻole » garde son ʻokina.
 */

/** Un titre d'article tel que le fournit `entry.render()`. */
export interface AstroHeading {
  depth: number;
  slug: string;
  text: string;
}

/** Une entrée de liste, nettoyée de ses décorations. */
export interface ListEntry {
  position: number;
  name: string;
  slug: string;
}

/**
 * Retire les décorations que portent les titres des articles 2024-2025 :
 * emojis de puce, gras résiduel, guillemets.
 *
 * Les guillemets droits sont retirés partout et non seulement aux extrémités :
 * un titre comme `1. "Imagine" - John Lennon` place le guillemet fermant au
 * milieu de la chaîne une fois le numéro détaché.
 */
function cleanHeading(raw: string): string {
  return raw
    .replace(
      /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2190}-\u{21FF}\u{25A0}-\u{25FF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu,
      ''
    )
    .replace(/\*\*/g, '')
    .replace(/["«»]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Extrait les entrées numérotées des titres d'un article.
 *
 * Les deux niveaux (H2 et H3) sont examinés séparément, et seul celui qui
 * porte la liste la plus longue est retenu : dans un article où les chansons
 * sont en H3, les H2 servent de paliers de niveau et ne doivent pas se
 * mélanger aux entrées.
 *
 * Renvoie un tableau vide en dessous de `minItems` : un article ordinaire ne
 * doit pas être décrit comme une liste.
 */
export function extractListEntries(headings: AstroHeading[], minItems = 3): ListEntry[] {
  const candidates: ListEntry[][] = [];

  for (const depth of [2, 3]) {
    const entries: ListEntry[] = [];

    for (const heading of headings.filter(h => h.depth === depth)) {
      const cleaned = cleanHeading(heading.text);
      const numbered = cleaned.match(/^(\d{1,2})\s*[.)]\s*(.+)$/);
      if (!numbered) continue;

      const name = numbered[2].trim();
      if (!name) continue;

      entries.push({ position: parseInt(numbered[1], 10), name, slug: heading.slug });
    }

    // La numérotation doit se suivre : « 1, 2, 3 » est une liste,
    // « 3, 7, 12 » est une coïncidence.
    const consecutive = entries.filter((e, i) => e.position === i + 1);
    if (consecutive.length >= minItems) candidates.push(consecutive);
  }

  if (candidates.length === 0) return [];
  return candidates.sort((a, b) => b.length - a.length)[0];
}

/**
 * Construit le schema `ItemList` d'un article-liste.
 * Renvoie `null` si l'article n'en est pas un.
 */
export function buildItemListSchema(
  headings: AstroHeading[],
  { name, description, url }: { name: string; description?: string; url: string }
): Record<string, unknown> | null {
  const entries = extractListEntries(headings);
  if (entries.length === 0) return null;

  const base = url.split('#')[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    ...(description ? { description } : {}),
    numberOfItems: entries.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: entries.map(entry => ({
      '@type': 'ListItem',
      position: entry.position,
      name: entry.name,
      url: `${base}#${entry.slug}`,
    })),
  };
}
