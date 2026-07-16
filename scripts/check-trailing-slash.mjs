#!/usr/bin/env node
/**
 * Vérifie que les liens internes du build pointent vers la forme canonique
 * AVEC slash final (vercel.json > trailingSlash: true — un lien sans slash
 * provoque une redirection 308 inutile, pénalisée en crawl).
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

const violations = new Map(); // href → [pages]
const HREF_RE = /href=(?:"([^"]*)"|'([^']*)'|([^\s>"']+))/g;

const needsSlash = (href) => {
  const [path] = href.split(/[?#]/);
  if (!path.startsWith('/') || path === '/') return false;
  if (path.endsWith('/')) return false;
  if (path.startsWith('/api/')) return false;
  if (MARKETING_SHORTLINKS.has(path)) return false;
  if (path.split('/').pop().includes('.')) return false; // fichier
  return true;
};

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(HREF_RE)) {
    const href = match[1] ?? match[2] ?? match[3];
    if (needsSlash(href)) {
      const page = file.replace(OUT_DIR, '');
      if (!violations.has(href)) violations.set(href, []);
      const pages = violations.get(href);
      if (pages.length < 3) pages.push(page);
    }
  }
}

if (violations.size === 0) {
  console.log(`✓ ${htmlFiles.length} pages scannées — aucun lien interne sans slash final.`);
  process.exit(0);
}

console.error(`✗ ${violations.size} lien(s) interne(s) sans slash final :`);
for (const [href, pages] of [...violations.entries()].sort()) {
  console.error(`  ${href}\n    vu sur : ${pages.join(', ')}${pages.length === 3 ? '…' : ''}`);
}
process.exit(1);
