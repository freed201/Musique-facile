/**
 * Remark plugin pour ajouter lazy loading aux images
 * Ajoute loading="lazy" et decoding="async" à toutes les images sauf hero
 */

import { visit } from 'unist-util-visit';

export function remarkLazyImages() {
  return (tree) => {
    let isFirstImage = true;

    visit(tree, 'image', (node) => {
      // La première image (hero) est en eager, les autres en lazy
      if (isFirstImage) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.loading = 'eager';
        node.data.hProperties.decoding = 'async';
        node.data.hProperties.fetchpriority = 'high';
        isFirstImage = false;
      } else {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.loading = 'lazy';
        node.data.hProperties.decoding = 'async';
      }

      // Ajouter une classe pour le styling
      node.data.hProperties.class = 'article-image';
    });
  };
}

export default remarkLazyImages;
