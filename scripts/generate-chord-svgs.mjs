/**
 * generate-chord-svgs.mjs — Génère des diagrammes d'accords en fichiers SVG autonomes
 * pour le blog (référencés via <img>, donc indexables Google Images + lisibles LLM).
 *
 * Réutilise le même catalogue/rendu que les PDF lead magnets (scripts/lib/chord-diagrams.mjs),
 * donc les positions sont identiques à celles déjà validées par Fred.
 *
 * Usage :  node scripts/generate-chord-svgs.mjs
 * Idempotent : réécrit les mêmes fichiers à chaque exécution.
 */

import { renderChord } from './lib/chord-diagrams.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Diagrammes ukulélé nécessaires aux articles (pilier : C, F, G, Am ; accords : + Dm).
const JOBS = [
  { instrument: 'ukulele', keys: ['c', 'g', 'am', 'f', 'dm'], dir: 'accords-ukulele' },
];

for (const { instrument, keys, dir } of JOBS) {
  const outDir = path.resolve(__dirname, '..', 'public', 'images', 'blog', dir);
  mkdirSync(outDir, { recursive: true });
  for (const key of keys) {
    const svg = renderChord(key, instrument, { width: 200 });
    if (svg.includes('chord-error')) {
      console.error(`✗ ${instrument}/${key} : accord introuvable dans le catalogue`);
      continue;
    }
    const file = path.join(outDir, `accord-${instrument}-${key}.svg`);
    writeFileSync(file, svg, 'utf8');
    console.log(`✓ ${path.relative(path.resolve(__dirname, '..'), file)}`);
  }
}
