#!/usr/bin/env node
/**
 * Contrôle les redirections internes déclarées dans astro.config.mjs.
 *
 * POURQUOI
 * Une redirection cassée est invisible : le build passe, le site se déploie,
 * et seul Google s'en aperçoit — des mois plus tard, dans un rapport que
 * personne ne lit tous les jours. C'est ce qui est arrivé à
 * `/wp-content/uploads/[...slug]` → `/images/[...slug]` : le motif n'est pas
 * substitué dans la destination, si bien que toutes les anciennes URL d'images
 * partaient vers l'URL littérale « /images/[...slug] », en 404.
 *
 * Quatre contrôles :
 *  1. la destination existe dans le build (ou est une URL externe) ;
 *  2. aucun motif non substitué ne subsiste dans une destination ;
 *  3. aucune chaîne — une destination ne doit pas être elle-même redirigée ;
 *  4. aucune redirection ne masque une page vivante.
 *
 * Usage : npm run check:redirects   (après npm run build)
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const RACINES = ['.vercel/output/static', 'dist'];
const racine = RACINES.find((r) => existsSync(r));
if (!racine) {
  console.error(`✖ Aucun dossier de build (${RACINES.join(', ')}). Lance d'abord npm run build.`);
  process.exit(2);
}

const src = readFileSync('astro.config.mjs', 'utf8');
const debut = src.indexOf('redirects: {');
if (debut < 0) {
  console.error('✖ Aucun bloc `redirects` dans astro.config.mjs.');
  process.exit(2);
}
const bloc = src.slice(debut, src.indexOf('\n  },', debut));
const paires = [...bloc.matchAll(/'([^']+)':\s*'([^']+)'/g)].map((m) => [m[1], m[2]]);

/**
 * Inventaire exact des chemins produits par le build.
 *
 * On ne peut pas se fier à existsSync : macOS est insensible à la casse, donc
 * il « trouve » /blog/Nous-on-sait-guitare-tuto/ alors que le serveur Linux,
 * lui, renvoie une 404. On liste donc les vrais noms, et on compare
 * caractère pour caractère.
 */
const construits = new Set();
(function parcourir(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const chemin = join(dir, e.name);
    if (e.isDirectory()) parcourir(chemin);
    else construits.add(relative(racine, chemin).split(sep).join('/'));
  }
})(racine);

const existe = (chemin) => {
  const c = chemin.split('#')[0].split('?')[0].replace(/^\/|\/$/g, '');
  return construits.has(`${c}/index.html`) || construits.has(c) || (c === '' && construits.has('index.html'));
};

const sources = new Set(paires.map(([s]) => s.replace(/\/$/, '')));
const soucis = [];

for (const [source, dest] of paires) {
  if (/\[\.{3}[^\]]+\]|\[[^\]]+\]/.test(dest)) {
    soucis.push(`${source} → ${dest} : motif non substitué dans la destination — la redirection mènera à cette URL littérale`);
    continue; // inutile de tester l'existence d'un chemin littéral
  }
  if (dest.startsWith('http')) continue; // destination externe, hors contrôle
  if (!existe(dest)) {
    soucis.push(`${source} → ${dest} : la destination n'existe pas dans le build`);
  }
  if (sources.has(dest.replace(/\/$/, ''))) {
    soucis.push(`${source} → ${dest} : la destination est elle-même redirigée (chaîne)`);
  }
  if (!source.includes('[') && existe(source)) {
    soucis.push(`${source} → ${dest} : une page existe à cette adresse, la redirection la masque`);
  }
}

if (soucis.length) {
  console.error(`✖ ${soucis.length} problème(s) sur ${paires.length} redirections :\n`);
  for (const s of soucis) console.error(`   ${s}`);
  process.exit(1);
}
console.log(`✓ ${paires.length} redirections contrôlées — destinations existantes, sans motif littéral ni chaîne.`);
