#!/usr/bin/env node

/**
 * Contrôleur qualité des articles de blog — applique la partie mécaniquement
 * vérifiable du standard `.claude/rules/article-parfait.md`.
 *
 * Usage :
 *   node scripts/check-article-quality.mjs <fichier.md|slug> [...]   # un ou plusieurs articles
 *   node scripts/check-article-quality.mjs --all                     # tout le corpus
 *   node scripts/check-article-quality.mjs --all --json              # sortie JSON
 *
 * Sortie : ERREURS (bloquantes, verdict NO-GO) et AVERTISSEMENTS (à corriger).
 * Code de sortie 1 si au moins une erreur.
 */

import { readdir, readFile, access } from 'fs/promises';
import { join, basename } from 'path';
import matter from 'gray-matter';

const BLOG_DIR = './src/content/blog';
const PUBLIC_DIR = './public';

const DESCRIPTION_MIN = 80;
const DESCRIPTION_MAX = 165;
const INTRO_MIN_MOTS = 40;
const INTRO_MAX_MOTS = 70;
const MIN_H2 = 3;
const MIN_LIENS_INTERNES = 2;
const MIN_FAQS_PILIER_GUIDE = 3;

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/** Retire les blocs de code ``` pour ne pas y détecter de faux H1/liens. */
function stripCodeFences(body) {
  return body.replace(/```[\s\S]*?```/g, '');
}

function countWords(text) {
  return (text || '').trim().split(/\s+/).filter(Boolean).length;
}

async function loadCorpus() {
  const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith('.md'));
  const corpus = new Map();
  for (const file of files) {
    const raw = await readFile(join(BLOG_DIR, file), 'utf-8');
    const parsed = matter(raw);
    corpus.set(basename(file, '.md'), { file, data: parsed.data, body: parsed.content });
  }
  return corpus;
}

/** Astro lowercase les slugs de content collection : une résolution de lien/silo
 * doit matcher insensible à la casse, même si le nom de fichier a des majuscules. */
function resolveSlug(corpus, slug) {
  if (corpus.has(slug)) return corpus.get(slug);
  const lower = slug.toLowerCase();
  for (const [key, entry] of corpus) {
    if (key.toLowerCase() === lower) return entry;
  }
  return undefined;
}

function isPublished(entry) {
  if (!entry) return false;
  const { data } = entry;
  if (data.prod !== 'Y') return false;
  const date = data.datePublished ? new Date(data.datePublished) : null;
  return !!date && !isNaN(date) && date <= new Date();
}

async function checkArticle(slug, entry, corpus) {
  const { data, body } = entry;
  const errors = [];
  const warnings = [];
  const cleanBody = stripCodeFences(body);

  // --- Frontmatter ---
  if (data.prod === undefined) {
    errors.push('E-PROD-MANQUANT : champ `prod` absent — article listé/sitemap mais page 404');
  } else if (data.prod !== 'Y' && data.prod !== 'N') {
    errors.push(`E-PROD-FORMAT : \`prod: ${JSON.stringify(data.prod)}\` — seuls "Y" et "N" sont valides`);
  }

  const desc = data.description || '';
  if (desc.length < DESCRIPTION_MIN || desc.length > DESCRIPTION_MAX) {
    errors.push(`E-DESCRIPTION : ${desc.length} caractères (attendu ${DESCRIPTION_MIN}-${DESCRIPTION_MAX})`);
  }

  if (data.datePublished && data.dateModified) {
    const pub = new Date(data.datePublished);
    const mod = new Date(data.dateModified);
    if (!isNaN(pub) && !isNaN(mod) && mod < pub) {
      errors.push(`E-DATES : dateModified (${data.dateModified}) antérieure à datePublished (${data.datePublished})`);
    }
  }

  if (data.siloSlug) {
    const pilier = resolveSlug(corpus, data.siloSlug);
    if (!pilier) {
      errors.push(`E-SILO-CASSE : siloSlug "${data.siloSlug}" ne correspond à aucun article`);
    } else if (pilier.data.pillar !== true) {
      errors.push(`E-SILO-CASSE : la cible "${data.siloSlug}" n'a pas \`pillar: true\` — PillarLink et breadcrumb cassés`);
    }
  }

  const estPilier = data.pillar === true;
  const estGuideAchat = Array.isArray(data.products) && data.products.length > 0;
  const nbFaqs = Array.isArray(data.faqs) ? data.faqs.length : 0;
  if ((estPilier || estGuideAchat) && nbFaqs < MIN_FAQS_PILIER_GUIDE) {
    errors.push(`E-FAQS : ${nbFaqs} FAQ (≥${MIN_FAQS_PILIER_GUIDE} requises pour un ${estPilier ? 'pilier' : 'guide d’achat'})`);
  }

  if (data.ogImage && !/^https?:\/\//.test(data.ogImage)) {
    if (!(await fileExists(join(PUBLIC_DIR, data.ogImage)))) {
      errors.push(`E-OGIMAGE : "${data.ogImage}" introuvable dans public/`);
    }
  }

  if (data.meta !== undefined || data.keywords !== undefined) {
    warnings.push('W-LEGACY : champs `meta`/`keywords` hérités — redondants avec `description`, à supprimer');
  }

  for (const champ of ['instrument', 'category', 'level']) {
    if (data[champ] === undefined) warnings.push(`W-METADONNEES : champ \`${champ}\` absent`);
  }
  const nbTags = Array.isArray(data.tags) ? data.tags.length : 0;
  if (nbTags < 3 || nbTags > 6) {
    warnings.push(`W-TAGS : ${nbTags} tags (attendu 3-6, pilote index et RelatedArticles)`);
  }

  if (!data.introduction) {
    warnings.push('W-INTRODUCTION : pas de bloc réponse directe `introduction` (levier de citation LLM n°1)');
  } else {
    const mots = countWords(data.introduction);
    if (mots < INTRO_MIN_MOTS || mots > INTRO_MAX_MOTS) {
      warnings.push(`W-INTRODUCTION : ${mots} mots (attendu ${INTRO_MIN_MOTS}-${INTRO_MAX_MOTS})`);
    }
  }

  if (estPilier && nbFaqs === 0) {
    // déjà en erreur ci-dessus, rien à ajouter
  } else if (nbFaqs === 0) {
    warnings.push('W-AUTOFAQ : pas de `faqs[]` — une AutoFAQ générique sera publiée avec son JSON-LD FAQPage');
  }

  // --- Corps ---
  const h1s = cleanBody.match(/^#\s+.+$/gm) || [];
  if (h1s.length > 0) {
    errors.push(`E-H1-CORPS : ${h1s.length} H1 dans le corps (le layout génère déjà le H1) — ex. "${h1s[0].slice(0, 60)}"`);
  }

  const h2s = cleanBody.match(/^##\s+.+$/gm) || [];
  if (h2s.length < MIN_H2) {
    warnings.push(`W-H2 : ${h2s.length} H2 (≥${MIN_H2} requis pour l'InlineOptIn, ≥5 H2/H3 pour la table des matières)`);
  }
  if (!h2s.some((h) => h.includes('?'))) {
    warnings.push('W-H2-QUESTION : aucun H2 formulé en question (les moteurs IA matchent les questions)');
  }
  if (h2s.length > 0 && !/en bref/i.test(h2s[0])) {
    warnings.push(`W-EN-BREF : le premier H2 n'est pas « En bref » (answer-first + ancre CRO) — actuel : "${h2s[0].replace(/^##\s+/, '').slice(0, 50)}"`);
  }

  if (/<style[\s>]/i.test(cleanBody)) {
    warnings.push('W-HTML-INLINE : bloc <style> dans le markdown — interdit, utiliser les tokens CSS du site');
  }
  // <figure class="chord-chart"> est un pattern légitime (grille de diagrammes d'accords SVG,
  // cf. scripts/generate-chord-svgs.mjs) — seuls les <div> hors de ce wrapper sont du HTML legacy.
  const bodyWithoutChordFigures = cleanBody.replace(/<figure class="chord-chart"[\s\S]*?<\/figure>/gi, '');
  if (/<div[\s>]/i.test(bodyWithoutChordFigures)) {
    warnings.push('W-HTML-INLINE : <div> dans le markdown — utiliser les blocs `::: info|tip|warning`');
  }

  const urlsAbsolues = cleanBody.match(/https?:\/\/(?:www\.)?musique-facile\.fr[^\s)"']*/g) || [];
  if (urlsAbsolues.length > 0) {
    warnings.push(`W-URL-ABSOLUE : ${urlsAbsolues.length} lien(s) interne(s) en URL absolue — utiliser des chemins relatifs`);
  }

  // Liens internes : markdown [txt](/blog/...) ou href="/blog/..." (legacy HTML)
  const liensInternes = [
    ...cleanBody.matchAll(/\]\((\/(?:blog|cours|livres|ressources)[^)#?\s]*)\)/g),
    ...cleanBody.matchAll(/href="(\/(?:blog|cours|livres|ressources)[^"#?]*)"/g),
  ].map((m) => m[1]);
  const totalLiensInternes = liensInternes.length + urlsAbsolues.filter((u) => /musique-facile\.fr\/(blog|cours|livres|ressources)/.test(u)).length;
  if (totalLiensInternes < MIN_LIENS_INTERNES) {
    warnings.push(`W-MAILLAGE : ${totalLiensInternes} lien(s) interne(s) dans le corps (≥${MIN_LIENS_INTERNES} attendus)`);
  }

  for (const lien of liensInternes) {
    const m = lien.match(/^\/blog\/([^/]+)\/?$/);
    if (!m) continue;
    const cible = resolveSlug(corpus, m[1]);
    if (!cible) {
      errors.push(`E-LIEN-MORT : ${lien} — aucun article ne correspond`);
    } else if (!isPublished(cible)) {
      errors.push(`E-LIEN-MORT : ${lien} — article non publié (prod: ${cible.data.prod ?? 'absent'})`);
    }
  }

  if (data.siloSlug && !estPilier) {
    const versPilier = liensInternes.some((l) => l.includes(`/blog/${data.siloSlug}`))
      || urlsAbsolues.some((u) => u.includes(`/blog/${data.siloSlug}`));
    if (!versPilier) {
      warnings.push(`W-LIEN-PILIER : satellite sans lien vers son pilier /blog/${data.siloSlug}/ dans le corps`);
    }
  }

  // Images du corps : existence sur disque + alt
  for (const m of cleanBody.matchAll(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g)) {
    const [, alt, src] = m;
    if (!alt.trim()) warnings.push(`W-ALT-VIDE : image ${src} sans texte alt`);
    if (src.startsWith('/') && !(await fileExists(join(PUBLIC_DIR, src)))) {
      errors.push(`E-IMAGE-MANQUANTE : ${src} introuvable dans public/ (pas d'anti-CLS au build)`);
    }
  }

  return { slug, file: entry.file, errors, warnings };
}

function printResult(r) {
  const statut = r.errors.length > 0 ? '❌' : r.warnings.length > 0 ? '⚠️ ' : '✅';
  console.log(`\n${statut} ${r.file}`);
  for (const e of r.errors) console.log(`   ❌ ${e}`);
  for (const w of r.warnings) console.log(`   ⚠️  ${w}`);
}

async function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const all = args.includes('--all');
  const cibles = args.filter((a) => !a.startsWith('--'));

  const corpus = await loadCorpus();

  let slugs;
  if (all) {
    slugs = [...corpus.keys()].sort();
  } else if (cibles.length > 0) {
    slugs = cibles.map((c) => basename(c, '.md'));
    const inconnus = slugs.filter((s) => !corpus.has(s));
    if (inconnus.length > 0) {
      console.error(`❌ Article(s) introuvable(s) dans ${BLOG_DIR} : ${inconnus.join(', ')}`);
      process.exit(2);
    }
  } else {
    console.error('Usage : node scripts/check-article-quality.mjs <fichier.md|slug> [...] | --all [--json]');
    process.exit(2);
  }

  const results = [];
  for (const slug of slugs) {
    results.push(await checkArticle(slug, corpus.get(slug), corpus));
  }

  const totalErreurs = results.reduce((n, r) => n + r.errors.length, 0);
  const totalAvertissements = results.reduce((n, r) => n + r.warnings.length, 0);
  const propres = results.filter((r) => r.errors.length === 0 && r.warnings.length === 0).length;

  if (json) {
    console.log(JSON.stringify({
      date: new Date().toISOString(),
      articles: results.length,
      propres,
      erreurs: totalErreurs,
      avertissements: totalAvertissements,
      details: results.filter((r) => r.errors.length || r.warnings.length),
    }, null, 2));
  } else {
    for (const r of results) {
      if (all && r.errors.length === 0 && r.warnings.length === 0) continue;
      printResult(r);
    }
    console.log('\n' + '='.repeat(60));
    console.log(`Articles contrôlés : ${results.length}   ✅ propres : ${propres}`);
    console.log(`❌ Erreurs (bloquantes) : ${totalErreurs}   ⚠️  Avertissements : ${totalAvertissements}`);
    console.log('='.repeat(60));
    console.log('Standard : .claude/rules/article-parfait.md');
  }

  // process.exitCode (et non process.exit) : ne tronque pas la sortie JSON volumineuse
  process.exitCode = totalErreurs > 0 ? 1 : 0;
}

main().catch((err) => {
  console.error('❌ Erreur inattendue :', err);
  process.exit(2);
});
