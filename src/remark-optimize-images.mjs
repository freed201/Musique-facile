/**
 * Plugin Remark pour optimiser automatiquement les images dans les articles Markdown
 * - Ajoute width/height pour éviter CLS (Cumulative Layout Shift)
 * - Ajoute loading="lazy" pour améliorer LCP (Largest Contentful Paint)
 * - Optimise les alt text pour l'accessibilité et les LLMs
 */

import { visit } from 'unist-util-visit';
import fs from 'fs';
import { imageSize } from 'image-size';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mapping des dimensions d'images communes (optimisation de performance)
const imageDimensionsCache = new Map();

/**
 * Obtient les dimensions d'une image locale
 */
function getImageDimensions(imagePath) {
  // Vérifier le cache d'abord
  if (imageDimensionsCache.has(imagePath)) {
    return imageDimensionsCache.get(imagePath);
  }

  try {
    // Résoudre le chemin absolu de l'image (gérer les URLs absolues /images/...)
    const normalizedPath = imagePath.replace(/^\//, '');
    const publicPath = path.join(__dirname, '..', 'public', normalizedPath);
    const buffer = fs.readFileSync(publicPath);
    const dimensions = imageSize(buffer);

    const result = {
      width: dimensions.width,
      height: dimensions.height
    };

    // Mettre en cache pour les prochains usages
    imageDimensionsCache.set(imagePath, result);

    return result;
  } catch (error) {
    // Si l'image n'est pas trouvée ou erreur, retourner null
    console.warn(`Could not get dimensions for image: ${imagePath}`);
    return null;
  }
}

/**
 * Améliore le texte alt pour l'accessibilité et les LLMs
 */
function improveAltText(alt, imagePath) {
  // Si pas d'alt text, en générer un basé sur le nom du fichier
  if (!alt || alt.trim() === '') {
    const filename = path.basename(imagePath, path.extname(imagePath));
    // Remplacer les tirets/underscores par des espaces et capitaliser
    return filename
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // Si l'alt text est trop court (< 10 caractères), l'améliorer
  if (alt.length < 10) {
    const filename = path.basename(imagePath, path.extname(imagePath));
    return `${alt} - ${filename.replace(/[-_]/g, ' ')}`;
  }

  return alt;
}

/**
 * Plugin Remark principal
 */
export default function remarkOptimizeImages() {
  return (tree) => {
    visit(tree, 'image', (node) => {
      const { url, alt } = node;

      // Ignorer les images externes (HTTP/HTTPS)
      if (url.startsWith('http://') || url.startsWith('https://')) {
        // Pour les images externes, juste améliorer l'alt text
        node.alt = improveAltText(alt, url);
        return;
      }

      // Pour les images locales, obtenir les dimensions
      const dimensions = getImageDimensions(url);

      // Améliorer l'alt text
      node.alt = improveAltText(alt, url);

      // Créer les propriétés de données pour Astro
      if (!node.data) {
        node.data = {};
      }

      if (!node.data.hProperties) {
        node.data.hProperties = {};
      }

      // Ajouter loading="lazy" pour toutes les images (sauf la première qui sera eager)
      node.data.hProperties.loading = 'lazy';

      // Ajouter decoding="async" pour améliorer les performances
      node.data.hProperties.decoding = 'async';

      // Ajouter les dimensions si disponibles
      if (dimensions) {
        node.data.hProperties.width = dimensions.width;
        node.data.hProperties.height = dimensions.height;
      }

      // Ajouter une classe pour le styling CSS
      node.data.hProperties.className = 'optimized-image';
    });
  };
}
