/**
 * Règle unique pour les liens sortants du site.
 *
 * POURQUOI UN MODULE PARTAGÉ
 * Trois pipelines produisent du HTML à partir de Markdown, et chacun ignorait
 * les autres :
 *   1. le corps des articles          → remark-affiliate-links.mjs
 *   2. le champ `introduction`        → `marked`, dans blog/[slug].astro
 *   3. les blocs ::: info|tip|warning → un pipeline unified interne au plugin
 * Les liens écrits dans (2) et (3) sortaient sans `rel` ni `target`. Plutôt que
 * de recopier la règle trois fois, elle vit ici.
 *
 * TROIS CAS, PAS DEUX
 *  - marchand / affilié : `sponsored nofollow` — exigence Google sur les liens
 *    commerciaux, sous peine d'action manuelle « lien non naturel » ;
 *  - concurrent : `nofollow` — on cite ce qu'on compare, un comparatif sans
 *    lien n'est pas vérifiable, mais on ne transmet pas d'autorité ;
 *  - source d'autorité (DOI, Wikipédia, fabricant) : lien suivi, c'est
 *    précisément le signal qu'on cherche à envoyer.
 */

const SITE_HOST = 'musique-facile.fr';

/** Domaines marchands ou affiliés. */
export const AFFILIATE_HOSTS = [
  'thomann.',
  'amazon.',
  'amzn.to',
  'woodbrass.com',
  'algam-webstore',
];

/** Plateformes concurrentes citées dans les comparatifs. */
export const COMPETITOR_HOSTS = [
  'hguitare.com',
  'imusic-school.com',
  'yousician.com',
  'guitartuna.com',
  'justinguitar.com',
  'jejouedelaguitare.com',
  'flowkey.com',
  'skilleos.com',
  'tousencoeur',
];

/**
 * `rel` à appliquer à une URL, ou `null` si le lien est interne (rien à faire).
 */
export function relForUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  const host = parsed.hostname.toLowerCase();
  if (host === SITE_HOST || host.endsWith('.' + SITE_HOST)) return null;

  const haystack = host + parsed.pathname.toLowerCase();
  if (AFFILIATE_HOSTS.some((h) => host.includes(h))) return 'sponsored nofollow noopener';
  if (COMPETITOR_HOSTS.some((h) => haystack.includes(h))) return 'nofollow noopener noreferrer';
  return 'noopener noreferrer';
}

/**
 * Ajoute `target` et `rel` aux liens externes d'un fragment de HTML déjà rendu.
 * Les balises qui portent déjà un `rel` sont laissées telles quelles.
 */
export function secureExternalLinks(html) {
  return String(html).replace(/<a\s([^>]*?)href="(https?:\/\/[^"]+)"([^>]*)>/gi, (match, before, url, after) => {
    if (/\brel=/i.test(before + after)) return match;
    const rel = relForUrl(url);
    if (!rel) return match;
    return `<a ${before}href="${url}"${after} target="_blank" rel="${rel}">`;
  });
}
