#!/usr/bin/env node
/**
 * Vérifie la forme des liens internes du build. Deux contrôles :
 *
 *  1. Slash final manquant — vercel.json > trailingSlash: true fait du slash
 *     la forme canonique ; un lien sans slash coûte une redirection 308.
 *  2. Double slash (`//`) — typiquement une concaténation `${base}/${x}` dont
 *     la base porte déjà un slash. Produit un vrai 404, pas une redirection.
 *     Ce cas est arrivé en juillet 2026 en normalisant les slashs : d'où ce
 *     second contrôle.
 *
 * Usage : node scripts/check-trailing-slash.mjs  (après npm run build)
 * Scanne les href="..." internes des HTML de .vercel/output/static/.
 * Exceptions : fichiers (.xml, .pdf, .webp…), /api/*, liens courts marketing
 * définis dans vercel.json > redirects (destinations externes).
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = '.vercel/output/static';

// Sources de redirection vercel.json vers des destinations externes :
// ce sont des liens courts voulus, on ne les slashe pas.
const MARKETING_SHORTLINKS = new Set([
  '/Z1', '/PENTA', '/songbook', '/ete', '/vote', '/IMAGINE', '/imagine', '/test',
]);

if (!existsSync(OUT_DIR)) {
  console.error(`✗ ${OUT_DIR} introuvable — lancer « npm run build » d'abord.`);
  process.exit(1);
}

const htmlFiles = [];
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith('.html')) htmlFiles.push(full);
  }
};
walk(OUT_DIR);

const missingSlash = new Map(); // href → [pages]
const doubleSlash = new Map();
const HREF_RE = /href=(?:"([^"]*)"|'([^']*)'|([^\s>"']+))/g;

const needsSlash = (path) => {
  if (!path.startsWith('/') || path === '/') return false;
  if (path.endsWith('/')) return false;
  if (path.startsWith('/api/')) return false;
  if (MARKETING_SHORTLINKS.has(path)) return false;
  if (path.split('/').pop().includes('.')) return false; // fichier
  return true;
};

const record = (map, href, page) => {
  if (!map.has(href)) map.set(href, []);
  const pages = map.get(href);
  if (pages.length < 3) pages.push(page);
};

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const page = file.replace(OUT_DIR, '');
  for (const match of html.matchAll(HREF_RE)) {
    const href = match[1] ?? match[2] ?? match[3];
    if (!href || !href.startsWith('/') || href.startsWith('//')) continue;
    const [path] = href.split(/[?#]/);
    if (path.includes('//')) record(doubleSlash, path, page);
    else if (needsSlash(path)) record(missingSlash, path, page);
  }
}

const report = (map, label) => {
  if (map.size === 0) return 0;
  console.error(`✗ ${map.size} lien(s) interne(s) ${label} :`);
  for (const [href, pages] of [...map.entries()].sort()) {
    console.error(`  ${href}\n    vu sur : ${pages.join(', ')}${pages.length === 3 ? '…' : ''}`);
  }
  return map.size;
};

const failures = report(doubleSlash, 'avec un double slash (404)')
  + report(missingSlash, 'sans slash final (redirection 308)');

if (failures === 0) {
  console.log(`✓ ${htmlFiles.length} pages scannées — liens internes conformes (slash final, pas de //).`);
  process.exit(0);
}
process.exit(1);
