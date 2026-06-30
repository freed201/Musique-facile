/**
 * Remark plugin — sécurise les liens sortants des articles.
 *
 * Sur les liens externes (http/https hors musique-facile.fr) :
 *   - ajoute target="_blank" + rel sécurisé ;
 *   - sur les domaines affiliés/marchands (Thomann, Amazon, Woodbrass…),
 *     force rel="sponsored nofollow noopener" — exigence Google pour les
 *     liens commerciaux rémunérés (évite l'action manuelle « lien non naturel »).
 *
 * Les liens internes (chemins relatifs, ancres, musique-facile.fr) ne sont pas touchés.
 */

import { visit } from 'unist-util-visit';

const SITE_HOST = 'musique-facile.fr';

// Sous-chaînes de hostname considérées comme affiliées / marchandes.
const AFFILIATE_HOSTS = [
  'thomann.',
  'amazon.',
  'amzn.to',
  'woodbrass.com',
  'algam-webstore',
];

export function remarkAffiliateLinks() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      const url = node.url || '';
      if (!/^https?:\/\//i.test(url)) return; // interne / ancre → on ignore

      let host = '';
      try {
        host = new URL(url).hostname.toLowerCase();
      } catch {
        return; // URL invalide → on n'y touche pas
      }

      if (host === SITE_HOST || host.endsWith('.' + SITE_HOST)) return; // lien interne absolu

      const isAffiliate = AFFILIATE_HOSTS.some((h) => host.includes(h));

      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.target = '_blank';
      node.data.hProperties.rel = isAffiliate
        ? 'sponsored nofollow noopener'
        : 'noopener noreferrer';
    });
  };
}

export default remarkAffiliateLinks;
