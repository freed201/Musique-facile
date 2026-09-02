#!/usr/bin/env node
/**
 * Vérifie que vercel.json déclare bien tous les en-têtes de sécurité attendus.
 *
 * POURQUOI CE SCRIPT EXISTE
 * Ces en-têtes ont longtemps été définis à deux endroits : vercel.json (servi
 * en production) et src/utils/security.ts (jamais exécuté — le middleware
 * Astro n'était pas enregistré). Les deux avaient divergé en silence, et la
 * copie morte était devenue dangereuse : elle autorisait 'unsafe-eval',
 * référençait encore ActiveCampaign — abandonné pour Brevo — et ignorait
 * youtube-nocookie.com et player.ausha.co, dont dépendent aujourd'hui les
 * façades vidéo et le podcast. L'activer aurait cassé le site.
 *
 * Le code mort a été supprimé le 2026-09-02. vercel.json est désormais la
 * source unique, et ce contrôle la garde : il échoue si un en-tête disparaît
 * ou si la CSP perd une directive essentielle.
 *
 * Usage : npm run check:headers
 *         npm run check:headers -- --prod   (interroge le site en ligne)
 */
import { readFileSync } from 'node:fs';

const ATTENDUS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': null, // la valeur peut évoluer, la présence non
  'Strict-Transport-Security': null,
  'Content-Security-Policy': null,
};

/** Directives sans lesquelles la CSP ne protège plus grand-chose. */
const DIRECTIVES = ['default-src', 'object-src', 'base-uri', 'form-action', 'frame-ancestors'];

/** Origines dont dépend le site aujourd'hui — les retirer casserait une page. */
const ORIGINES = {
  'frame-src': ['https://www.youtube-nocookie.com', 'https://player.vimeo.com', 'https://player.ausha.co'],
  'script-src': ['https://www.googletagmanager.com'],
  'font-src': ['https://fonts.gstatic.com'],
};

const soucis = [];

const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
const global = (vercel.headers ?? []).find((h) => h.source === '/(.*)');
if (!global) {
  console.error("✖ vercel.json ne déclare aucun bloc d'en-têtes global (source « /(.*) »).");
  process.exit(1);
}
const servis = Object.fromEntries(global.headers.map((h) => [h.key, h.value]));

for (const [cle, valeur] of Object.entries(ATTENDUS)) {
  if (!(cle in servis)) soucis.push(`en-tête absent : ${cle}`);
  else if (valeur && servis[cle] !== valeur) soucis.push(`${cle} vaut « ${servis[cle] }», attendu « ${valeur} »`);
}

const csp = servis['Content-Security-Policy'] ?? '';
for (const d of DIRECTIVES) {
  if (!new RegExp(`(^|;)\\s*${d}\\s`).test(csp)) soucis.push(`CSP : directive ${d} absente`);
}
if (/'unsafe-eval'/.test(csp)) soucis.push("CSP : 'unsafe-eval' est présent — à retirer sauf raison documentée");

for (const [directive, origines] of Object.entries(ORIGINES)) {
  const m = csp.match(new RegExp(`(^|;)\\s*${directive}\\s([^;]*)`));
  if (!m) { soucis.push(`CSP : directive ${directive} absente`); continue; }
  for (const o of origines) {
    if (!m[2].includes(o)) soucis.push(`CSP ${directive} : ${o} manquant — une page du site en dépend`);
  }
}

// Le middleware Astro ne doit pas réapparaître sans décision : deux sources
// d'en-têtes finissent toujours par diverger.
import { existsSync } from 'node:fs';
for (const f of ['src/middleware.ts', 'src/middleware/index.ts', 'src/utils/security.ts']) {
  if (existsSync(f)) {
    soucis.push(`${f} existe — une seconde source d'en-têtes est réapparue, voir .claude/rules/coherence-en-tetes-securite.md`);
  }
}

if (process.argv.includes('--prod')) {
  const res = await fetch('https://musique-facile.fr/', { method: 'HEAD' });
  for (const cle of Object.keys(ATTENDUS)) {
    if (!res.headers.get(cle)) soucis.push(`en production, ${cle} n'est pas servi`);
  }
  console.log(`  (en-têtes de production interrogés — HTTP ${res.status})`);
}

if (soucis.length) {
  console.error(`✖ ${soucis.length} problème(s) sur les en-têtes de sécurité :\n`);
  for (const s of soucis) console.error(`   ${s}`);
  process.exit(1);
}
console.log(`✓ vercel.json déclare les ${Object.keys(ATTENDUS).length} en-têtes attendus, CSP comprise.`);
