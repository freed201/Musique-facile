#!/usr/bin/env node
/**
 * Relève les métadonnées réelles des vidéos YouTube citées dans le blog et
 * dans src/data/chord-videos.json (l'outil « Quel accord apprendre ensuite ? »),
 * et télécharge leurs miniatures en WebP.
 *
 * POURQUOI
 * Le VideoObject des articles datait chaque vidéo du jour de publication de
 * l'article (`uploadDate: isoDatePublished`) et ne déclarait aucune durée.
 * C'était une date inventée, du même ordre que les témoignages sans date. Les
 * vraies valeurs sont publiques : la page de visionnage expose `uploadDate` et
 * `lengthSeconds`. On les relève une fois et on versionne le résultat.
 *
 * Sortie :
 *   src/data/video-metadata.json          — uploadDate, durée ISO, titre, état
 *   public/images/video-thumbs/<id>.webp  — miniature pour la façade
 *
 * Une vidéo supprimée ou passée en privé est marquée `"status": "indisponible"` :
 * l'article continue de se construire, mais sans VideoObject ni lecteur.
 *
 * Usage : npm run videos:metadata            (ne refait que ce qui manque)
 *         npm run videos:metadata -- --all   (tout re-relève)
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const BLOG_DIR = 'src/content/blog';
const TOOL_VIDEOS = 'src/data/chord-videos.json';
const OUT_JSON = 'src/data/video-metadata.json';
const THUMB_DIR = 'public/images/video-thumbs';
const DELAY_MS = 350;
const refetchAll = process.argv.includes('--all');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Tous les identifiants YouTube cités dans le frontmatter des articles. */
function collectIds() {
  const ids = new Map(); // id → titre déclaré dans le frontmatter
  for (const name of readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))) {
    const source = readFileSync(join(BLOG_DIR, name), 'utf8');
    const front = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!front) continue;
    const block = front[1];
    const re =
      /url:\s*["']?https?:\/\/(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/g;
    let m;
    while ((m = re.exec(block)) !== null) {
      const before = block.slice(0, m.index);
      const title = before.match(/title:\s*"((?:[^"\\]|\\.)*)"\s*$/m)?.[1] ?? null;
      if (!ids.has(m[1])) ids.set(m[1], title);
    }
  }

  // Les vidéos de l'outil « Quel accord apprendre ensuite ? » ne sont citées
  // dans aucun article : sans ça, sa façade n'aurait ni miniature ni durée.
  // Les Shorts encore programmés sont ignorés — les relever renverrait
  // « indisponible » et figerait cet état dans le fichier.
  if (existsSync(TOOL_VIDEOS)) {
    const tool = JSON.parse(readFileSync(TOOL_VIDEOS, 'utf8'));
    const today = new Date().toISOString().slice(0, 10);
    for (const v of tool.videos ?? []) {
      if (v.datePublication > today) continue;
      if (!ids.has(v.youtubeId)) ids.set(v.youtubeId, `Accord ${v.accord} à la guitare`);
    }
    for (const g of tool.guides ?? []) {
      if (!ids.has(g.youtubeId)) ids.set(g.youtubeId, g.titre ?? null);
    }
  }

  return ids;
}

/** Secondes → durée ISO 8601 (PT#H#M#S), format attendu par schema.org. */
function toISODuration(seconds) {
  const s = Number(seconds);
  if (!Number.isFinite(s) || s <= 0) return null;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${sec ? `${sec}S` : ''}` || 'PT0S';
}

async function fetchMeta(id) {
  const res = await fetch(`https://www.youtube.com/watch?v=${id}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; musique-facile-build/1.0)' },
  });
  if (!res.ok) return { status: 'indisponible', reason: `HTTP ${res.status}` };
  const html = await res.text();
  if (/"status":"(ERROR|UNPLAYABLE|LOGIN_REQUIRED)"/.test(html)) {
    return { status: 'indisponible', reason: 'vidéo supprimée, privée ou restreinte' };
  }
  const uploadDate = html.match(/"uploadDate":"([^"]+)"/)?.[1] ?? null;
  const lengthSeconds = html.match(/"lengthSeconds":"(\d+)"/)?.[1] ?? null;
  const title = html.match(/"title":"((?:[^"\\]|\\.)*)","lengthSeconds"/)?.[1] ?? null;
  if (!uploadDate) return { status: 'indisponible', reason: 'date de mise en ligne introuvable' };
  return {
    status: 'ok',
    uploadDate,
    duration: toISODuration(lengthSeconds),
    youtubeTitle: title ? JSON.parse(`"${title}"`) : null,
  };
}

/** Miniature en WebP local : la façade ne doit rien demander à YouTube avant le clic. */
async function fetchThumb(id) {
  const dest = join(THUMB_DIR, `${id}.webp`);
  if (existsSync(dest) && !refetchAll) return true;
  for (const quality of ['maxresdefault', 'hqdefault']) {
    const res = await fetch(`https://img.youtube.com/vi/${id}/${quality}.jpg`);
    if (!res.ok) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    // hqdefault fait 480×360 ; maxresdefault 1280×720. On normalise à 480 de
    // large et qualité 72 : une façade n'a pas besoin de plus, et ça tient la
    // contrainte de +30 Ko par page avant le clic, même sur un article qui
    // affiche plusieurs vidéos.
    await sharp(buf).resize(480, null, { withoutEnlargement: true }).webp({ quality: 72 }).toFile(dest);
    return true;
  }
  return false;
}

const ids = collectIds();
console.log(`${ids.size} vidéos citées dans ${readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md')).length} articles.`);

mkdirSync(THUMB_DIR, { recursive: true });
const existing =
  existsSync(OUT_JSON) && !refetchAll ? JSON.parse(readFileSync(OUT_JSON, 'utf8')).videos ?? {} : {};

const videos = { ...existing };
let done = 0;
let unavailable = 0;
let skipped = 0;

for (const [id, declaredTitle] of ids) {
  if (videos[id] && !refetchAll) {
    skipped += 1;
    continue;
  }
  try {
    const meta = await fetchMeta(id);
    if (meta.status === 'ok') {
      const hasThumb = await fetchThumb(id);
      videos[id] = { ...meta, thumbnail: hasThumb ? `/images/video-thumbs/${id}.webp` : null, declaredTitle };
      done += 1;
    } else {
      videos[id] = { ...meta, declaredTitle };
      unavailable += 1;
      console.warn(`  ⚠ ${id} — ${meta.reason} (« ${declaredTitle ?? '?'} »)`);
    }
  } catch (error) {
    videos[id] = { status: 'indisponible', reason: String(error), declaredTitle };
    unavailable += 1;
    console.warn(`  ⚠ ${id} — ${error}`);
  }
  await sleep(DELAY_MS);
}

writeFileSync(
  OUT_JSON,
  `${JSON.stringify(
    {
      _comment:
        "Relevé par scripts/fetch-video-metadata.mjs sur les pages de visionnage YouTube — ne pas éditer à la main. Les dates et durées viennent de la source, elles ne sont pas estimées.",
      _generatedBy: 'npm run videos:metadata',
      videos,
    },
    null,
    2,
  )}\n`,
  'utf8',
);

console.log(
  `✓ ${OUT_JSON} — ${done} relevée(s), ${skipped} déjà connue(s), ${unavailable} indisponible(s).`,
);
