#!/usr/bin/env node
/**
 * Postbuild : force le runtime Node.js des serverless functions Vercel à 24.x.
 *
 * Raison : l'adapter @astrojs/vercel v7 (compatible Astro 4) sélectionne
 * nodejs18.x quand la version locale est plus récente, et il ne connaît pas
 * les runtimes sortis après lui. On réécrit donc les .vc-config.json en
 * post-build.
 *
 * Historique : nodejs18.x à l'origine, puis nodejs20.x, et nodejs24.x depuis
 * le 2026-09-24. Vercel fait échouer les builds en Node 20 à partir du
 * 1er octobre 2026 (fin de vie, plus de correctifs de sécurité).
 *
 * À retenir : la version de build, elle, vient de `engines.node` dans
 * package.json, qui surcharge le réglage du tableau de bord Vercel. Les deux
 * doivent être changés ensemble, sinon le build tourne sur une version et les
 * fonctions sur une autre.
 *
 * Idempotent : peut être lancé plusieurs fois sans souci.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const TARGET_RUNTIME = 'nodejs24.x';
const FUNCTIONS_DIR = '.vercel/output/functions';

function findVcConfigs(dir) {
  const results = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return results;
  }
  for (const name of entries) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      results.push(...findVcConfigs(path));
    } else if (name === '.vc-config.json') {
      results.push(path);
    }
  }
  return results;
}

const configs = findVcConfigs(FUNCTIONS_DIR);
if (configs.length === 0) {
  console.log('[patch-vercel-runtime] No .vc-config.json found, skipping.');
  process.exit(0);
}

let patched = 0;
for (const path of configs) {
  const raw = readFileSync(path, 'utf8');
  const cfg = JSON.parse(raw);
  if (cfg.runtime && cfg.runtime !== TARGET_RUNTIME) {
    cfg.runtime = TARGET_RUNTIME;
    writeFileSync(path, JSON.stringify(cfg, null, '\t') + '\n');
    patched++;
    console.log(`[patch-vercel-runtime] ${path} → ${TARGET_RUNTIME}`);
  }
}

if (patched === 0) {
  console.log(`[patch-vercel-runtime] All functions already on ${TARGET_RUNTIME}.`);
} else {
  console.log(`[patch-vercel-runtime] Patched ${patched} function config(s) to ${TARGET_RUNTIME}.`);
}
