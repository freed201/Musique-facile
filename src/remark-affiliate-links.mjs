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
import { relForUrl } from './utils/external-link-rel.mjs';

export function remarkAffiliateLinks() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      const url = node.url || '';
      if (!/^https?:\/\//i.test(url)) return; // interne / ancre → on ignore
      const rel = relForUrl(url);
      if (!rel) return;                        // lien interne absolu → on ignore
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.target = '_blank';
      node.data.hProperties.rel = rel;
    });
  };
}

export default remarkAffiliateLinks;
