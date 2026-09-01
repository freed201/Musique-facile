#!/usr/bin/env node
/**
 * check-seo.mjs — contrôle mécanique du HTML réellement produit.
 *
 * Parcourt la sortie du build et refuse ce qui se mesure sans jugement :
 * title trop long, description hors gabarit, canonical incohérente avec le
 * chemin du fichier, <h2> commençant par un dièse (fuite de Markdown), <img>
 * sans alt, <a> sans texte ni aria-label.
 *
 * ⚠ Le build écrit dans .vercel/output/static/, PAS dans dist/ : c'est
 * l'adapter @astrojs/vercel qui décide. Les deux chemins sont tentés.
 *
 * DETTE HÉRITÉE
 * Le site comptait déjà 50 défauts le jour où ce contrôle a été écrit : des
 * titles et des descriptions hors gabarit sur des articles publiés, dont la
 * réécriture demande une validation éditoriale. Ils sont listés un par un dans
 * scripts/seo-baseline.json. Le contrôle les affiche mais n'échoue pas dessus ;
 * il échoue sur tout défaut NOUVEAU. La liste est faite pour se vider, pas pour
 * s'allonger : n'y ajouter une ligne qu'avec une raison, jamais pour faire
 * passer un build.
 *
 * Usage : npm run build && npm run check:seo
 *         npm run check:seo -- --verbose            (détail des avertissements)
 *         npm run check:seo -- --update-baseline    (fige la dette actuelle)
 */
import { readdirSync, readFileSync, existsSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOTS = ['.vercel/output/static', 'dist'];
const root = ROOTS.find((r) => existsSync(r) && statSync(r).isDirectory());
if (!root) {
  console.error(`✖ Aucun dossier de build trouvé (${ROOTS.join(', ')}). Lance d'abord npm run build.`);
  process.exit(2);
}

const SITE = 'https://musique-facile.fr';
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 160;

/**
 * Exemptions de longueur de title, explicites et justifiées.
 *
 * Les articles « morceau » du blog portent un title enrichi par `songInfo`
 * (« … | 7 Accords | Difficulté 3/5 »), ce qui les pousse à 78-90 caractères.
 * C'est un choix éditorial assumé, pas un oubli : ils sont donc tolérés
 * jusqu'à SONG_TITLE_MAX au lieu d'être signalés en erreur. La décision de
 * raccourcir ou non ces titles est ouverte (docs/seo/A-FAIRE.md, point 5) —
 * le jour où elle est tranchée, cette exemption saute.
 */
const SONG_TITLE_MAX = 90;
const isSongArticle = (html) => /\|\s*\d+\s*Accords?\s*\|/i.test(html) || /\|\s*Difficulté\s/i.test(html);

const errors = [];
const warnings = [];
const verbose = process.argv.includes('--verbose');
const updateBaseline = process.argv.includes('--update-baseline');

const BASELINE_PATH = 'scripts/seo-baseline.json';
const baseline = existsSync(BASELINE_PATH)
  ? new Set(JSON.parse(readFileSync(BASELINE_PATH, 'utf8')).accepted ?? [])
  : new Set();

/** Clé stable d'un défaut, insensible à sa formulation exacte. */
const key = (e) => `${e.file} :: ${e.rule}`;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Décode les entités que le minifieur laisse dans les attributs et le texte. */
function decode(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
}

/** Valeur d'un attribut, avec ou sans guillemets (le HTML est minifié). */
function attr(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}=("[^"]*"|'[^']*'|[^\\s>]+)`, 'i'));
  if (!m) return null;
  return decode(m[1].replace(/^["']|["']$/g, ''));
}

/** Chemin d'URL attendu pour un fichier de build donné. */
function expectedPath(file) {
  const rel = relative(root, file).split('\\').join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

const files = walk(root).sort();
const add = (list, file, rule, message) =>
  list.push({ file: relative(root, file), rule, message });

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(root, file);

  // Les pages non indexables ne sont pas soumises au gabarit. Le minifieur
  // réordonne les attributs : on cherche la balise, puis noindex dedans, sans
  // présumer que `name` précède `content`.
  const robotsTag = [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((m) => m[0])
    .find((tag) => /\bname=["']?robots\b/i.test(tag));
  if (robotsTag && /noindex/i.test(robotsTag)) continue;
  if (rel === '404.html') continue;

  // --- title ---
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!titleMatch) {
    add(errors, file, 'title-manquant', 'aucune balise <title>');
  } else {
    const title = decode(titleMatch[1]).trim();
    const len = [...title].length;
    const max = isSongArticle(title) ? SONG_TITLE_MAX : TITLE_MAX;
    if (len > max) {
      add(
        errors,
        file,
        'title-trop-long',
        `${len} caractères (max ${max})${max === SONG_TITLE_MAX ? ' — article morceau' : ''} : « ${title} »`,
      );
    }
  }

  // --- description ---
  const descTag = html.match(/<meta[^>]*name=["']?description["']?[^>]*>/i);
  if (!descTag) {
    add(errors, file, 'description-manquante', 'aucune meta description');
  } else {
    const desc = attr(descTag[0], 'content') ?? '';
    const len = [...desc].length;
    if (len > DESC_MAX) {
      add(errors, file, 'description-trop-longue', `${len} caractères (max ${DESC_MAX})`);
    } else if (len < DESC_MIN) {
      // Avertissement seulement : le schéma Zod du blog autorise dès 80
      // caractères, et une description courte reste affichable.
      add(warnings, file, 'description-courte', `${len} caractères (cible ${DESC_MIN}-${DESC_MAX})`);
    }
  }

  // --- canonical ---
  const canonicalTag = html.match(/<link[^>]*rel=["']?canonical["']?[^>]*>/i)
    ?? html.match(/<link[^>]*canonical[^>]*>/i);
  if (!canonicalTag) {
    add(errors, file, 'canonical-manquante', 'aucun <link rel="canonical">');
  } else {
    const href = attr(canonicalTag[0], 'href');
    const expected = `${SITE}${expectedPath(file)}`;
    if (href !== expected) {
      add(errors, file, 'canonical-incoherente', `${href} — attendu ${expected}`);
    }
  }

  // --- <h2> commençant par un dièse (fuite de Markdown) ---
  for (const m of html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)) {
    const text = decode(m[2].replace(/<[^>]*>/g, '')).trim();
    if (text.startsWith('#')) {
      add(errors, file, 'markdown-non-rendu', `<h${m[1]}> commence par « # » : « ${text.slice(0, 70)} »`);
    }
  }

  // --- images sans alt ---
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt\s*=/i.test(m[0])) {
      const src = attr(m[0], 'src') ?? '(sans src)';
      add(errors, file, 'img-sans-alt', `<img> sans attribut alt : ${src}`);
    }
  }

  // --- liens sans texte accessible ---
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const [, attrs, inner] = m;
    if (/\baria-label\s*=/i.test(attrs) || /\baria-labelledby\s*=/i.test(attrs)) continue;
    if (/\btitle\s*=/i.test(attrs)) continue;
    // Un <img alt="…"> non vide, ou un <svg><title>, suffit à nommer le lien.
    const labelledByImage = [...inner.matchAll(/<img\b[^>]*>/gi)].some(
      (img) => (attr(img[0], 'alt') ?? '').trim().length > 0,
    );
    if (labelledByImage) continue;
    if (/<svg[\s\S]*?<title>/i.test(inner)) continue;
    const text = decode(inner.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
    if (text.length === 0) {
      const href = attr(m[0], 'href') ?? '(sans href)';
      add(errors, file, 'lien-sans-texte', `<a> sans texte ni aria-label : ${href}`);
    }
  }
}

const byRule = (list) =>
  list.reduce((acc, e) => ((acc[e.rule] = (acc[e.rule] ?? 0) + 1), acc), {});

if (updateBaseline) {
  const accepted = [...new Set(errors.map(key))].sort();
  writeFileSync(
    BASELINE_PATH,
    `${JSON.stringify(
      {
        _comment:
          "Défauts SEO déjà présents quand check:seo a été mis en place. Le contrôle ne les fait pas échouer, mais échoue sur tout défaut nouveau. Cette liste doit se vider : retirer une entrée dès que le défaut est corrigé, n'en ajouter qu'avec une raison assumée.",
        _generatedAt: 'npm run check:seo -- --update-baseline',
        accepted,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
  console.log(`✓ ${BASELINE_PATH} — ${accepted.length} défauts hérités figés.`);
  process.exit(0);
}

const inherited = errors.filter((e) => baseline.has(key(e)));
const fresh = errors.filter((e) => !baseline.has(key(e)));
const fixed = [...baseline].filter((k) => !errors.some((e) => key(e) === k));

console.log(`check:seo — ${files.length} pages analysées dans ${root}/\n`);

if (warnings.length) {
  console.log(`⚠ ${warnings.length} avertissement(s) :`, JSON.stringify(byRule(warnings)));
  if (verbose) for (const w of warnings) console.log(`    ${w.file} — ${w.rule} — ${w.message}`);
  else console.log('    (relance avec --verbose pour le détail)');
  console.log('');
}

if (inherited.length) {
  console.log(`● ${inherited.length} défaut(s) hérité(s), tolérés :`, JSON.stringify(byRule(inherited)));
  if (verbose) for (const e of inherited) console.log(`    ${e.file} — ${e.rule} — ${e.message}`);
  else console.log(`    (détail dans ${BASELINE_PATH}, ou --verbose)`);
  console.log('');
}

if (fixed.length) {
  console.log(`✓ ${fixed.length} défaut(s) hérité(s) corrigé(s) — à retirer de ${BASELINE_PATH} :`);
  for (const k of fixed) console.log(`    ${k}`);
  console.log('');
}

if (fresh.length === 0) {
  console.log('✓ Aucun défaut nouveau.');
  process.exit(0);
}

console.log(`✖ ${fresh.length} défaut(s) NOUVEAU(X) :`, JSON.stringify(byRule(fresh)), '\n');
for (const e of fresh) console.log(`  ${e.file}\n      ${e.rule} — ${e.message}`);
process.exit(1);
