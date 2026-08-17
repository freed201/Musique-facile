import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Indique si un chemin public (`/images/...`) correspond à un fichier réel.
 *
 * Les fiches cours référencent leurs visuels par convention de nommage, sans
 * garantie que le fichier ait été produit : `piano-force-agilite` ne possède
 * que son `hero.webp` et demandait six images de programme absentes, soit six
 * requêtes 404 et autant de cadres vides.
 *
 * Les pages cours étant statiques, la vérification a lieu au build : rien
 * n'est envoyé au navigateur pour un visuel manquant, et aucun JavaScript
 * n'est nécessaire pour le rattraper.
 */
export function publicAssetExists(publicPath: string | undefined | null): boolean {
  if (!publicPath) return false;
  if (/^https?:\/\//.test(publicPath)) return true; // ressource distante : non vérifiable ici
  return existsSync(join(process.cwd(), 'public', publicPath.replace(/^\//, '')));
}
