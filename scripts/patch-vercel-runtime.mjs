#!/usr/bin/env node
/**
 * Postbuild : force le runtime Node.js des serverless functions Vercel à 20.x.
 *
 * Raison : l'adapter @astrojs/vercel v7 (compatible Astro 4) sélectionne
 * nodejs18.x quand la version locale est > 20. Node 18 atteint son end-of-life
 * en avril 2025 ; on patche les .vc-config.json en post-build pour rester
 * sur Node 20 LTS (support jusqu'en avril 2026).
 *
 * Idempotent : peut être lancé plusieurs fois sans souci.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const TARGET_RUNTIME = 'nodejs20.x';
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
