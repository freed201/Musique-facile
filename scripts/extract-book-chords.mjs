#!/usr/bin/env node
/**
 * Extrait les accords du livre (sources-privees/Interno.pdf) vers
 * src/data/song-chords.json, qui alimente l'outil « Quel accord apprendre ? ».
 *
 * POURQUOI DEPUIS LE PDF
 * Le fichier sources-privees/accords.json, qui servait de relevé, s'est révélé
 * faux sur les trois morceaux vérifiés page par page : il tronque (1 accord au
 * lieu de 5 sur Smells Like Teen Spirit), il oublie des sections entières
 * (l'intro des Copains d'abord, 5 accords) et il invente (un Am6 sur Redemption
 * Song, absent de la page 60). Le livre est la seule source qui fasse foi.
 *
 * CE QUE LE SCRIPT NE SAIT PAS FAIRE
 * L'extraction texte confond parfois un accord et un artefact : sur les
 * morceaux en power chords, « C5 » perd son « 5 » quand le texte est réordonné
 * et produit un « C » fantôme. Aucune règle automatique ne distingue ce cas
 * d'un vrai « C » voisin d'un « C7 » — seul l'œil sur la page tranche. Les
 * morceaux concernés sortent donc en `statut: "a-verifier"` et l'outil les
 * ignore, au lieu d'être publiés avec un doute.
 *
 * AJOUTER UN MORCEAU VÉRIFIÉ
 * Ouvrir src/data/song-chords.json, corriger la liste `accords` si besoin, puis
 * passer `statut` à "verifie". C'est tout : l'outil le prend en compte au build
 * suivant. Le champ `verifiePar` sert à tracer qui a contrôlé la page.
 *
 * Le JSON produit est VERSIONNÉ : le site doit se construire sans le PDF, qui
 * est privé. Les numéros de page du livre ne sont volontairement pas repris.
 *
 * Prérequis : `pdftotext` (poppler). Usage : npm run chords:index
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PDF = 'sources-privees/Interno.pdf';
const BLOG_DIR = 'src/content/blog';
const OUT = 'src/data/song-chords.json';

const CHORD = /^[A-G](?:#|b|-|♭|♯)?(?:maj|min|m|dim|aug|sus|add)?\d*(?:sus\d|add\d|maj\d)?(?:\/[A-G](?:#|b|-|♭|♯)?)?$/;
/** Pages d'anecdote ou de crédits : elles terminent un morceau. */
const STOP = /QUELQUES|NFOS|Copyright ©|Paroles et musique de/i;

if (!existsSync(PDF)) {
  console.error(`✖ ${PDF} absent (source privée). Le ${OUT} déjà commité reste valable.`);
  process.exit(1);
}

const normalise = (c) => c.replace(/-/g, 'b').replace(/♭/g, 'b').replace(/♯/g, '#');

/** Accords d'une page : uniquement les lignes dont TOUS les jetons sont des accords. */
function chordsOfPage(page) {
  const out = [];
  for (const raw of page.split('\n')) {
    const line = raw.trim();
    if (!line || line.length > 60) continue;
    const tokens = line
      .split(/\s+/)
      .map((t) => t.replace(/^[|(]+|[|)]+$/g, ''))
      .filter((t) => t && !/^[xX]\d+$/.test(t));
    if (!tokens.length || tokens.length > 12) continue;
    if (tokens.every((t) => CHORD.test(t))) out.push(...tokens.map(normalise));
  }
  return out;
}

/**
 * Un morceau en power chords où figure « C » ET « C5 » est suspect : le « C »
 * est probablement un « C5 » amputé par l'extraction. On ne tranche pas, on
 * signale — la règle produit aussi des faux positifs (un vrai « G » voisin d'un
 * « G7 » est parfaitement légitime), d'où le statut « à vérifier » plutôt
 * qu'une correction automatique.
 */
function suspects(chords) {
  const set = new Set(chords);
  return chords.filter((c) => /^[A-G][#b]?$/.test(c) && set.has(`${c}5`));
}

/** Tutoriels publiés, pour relier chaque morceau à sa page du site. */
function tutorials() {
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((name) => {
      const src = readFileSync(join(BLOG_DIR, name), 'utf8');
      if (!/^prod:\s*"?Y/m.test(src)) return null;
      return {
        slug: name.replace(/\.md$/, ''),
        title: src.match(/^title:\s*"(.*)"/m)?.[1] ?? '',
        difficulte: src.match(/^\s+difficulty:\s*"?([^"\n]*)/m)?.[1]?.trim() || null,
      };
    })
    .filter(Boolean);
}

const key = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/**
 * Mots significatifs d'un titre, pour un appariement tolérant. Le livre et le
 * site ne s'accordent pas toujours : « Smell Like Teen Spirit » contre
 * « Smells Like… », « The House Of The Rising Sun » contre un slug qui perd
 * l'article. Une comparaison stricte ratait ces morceaux alors que le tutoriel
 * existe.
 */
const MOTS_VIDES = new Set(['the', 'a', 'of', 'le', 'la', 'les', 'du', 'de', 'des', 'et',
  'guitare', 'tuto', 'tutoriel', 'apprendre', 'jouer', 'accords', 'tab', 'debutant', 'debutants']);

function motsCles(titre) {
  return new Set(
    key(titre)
      .split(' ')
      .map((m) => m.replace(/s$/, ''))          // « Smell » et « Smells » doivent coïncider
      .filter((m) => m.length > 2 && !MOTS_VIDES.has(m)),
  );
}

/**
 * Score d'appariement entre un morceau du livre et un tutoriel du site.
 *
 * Le titre seul ne suffit pas : « Hey Ya! » se réduit au mot « hey » et
 * s'appariait à « Hey Jude » ; « One » se retrouvait dans « Mr. J-one-s » par
 * simple inclusion de chaîne. On raisonne donc en MOTS ENTIERS, et on se sert
 * de l'artiste, que le livre donne et que les titres du site portent entre
 * parenthèses — c'est lui qui départage deux morceaux au titre proche.
 */
function proximite(titreLivre, artisteLivre, titreSite, slug) {
  const mots = motsCles(titreLivre);
  const cible = new Set([...motsCles(titreSite), ...motsCles(slug.replace(/-/g, ' '))]);
  if (!mots.size) return 0;

  let communs = 0;
  for (const m of mots) if (cible.has(m)) communs += 1;
  const titreScore = communs / mots.size;

  // L'artiste concorde-t-il ? « U2 » est court, on le cherche mot pour mot.
  const artiste = new Set(
    key(artisteLivre).split(' ').filter((m) => m.length > 1 && !MOTS_VIDES.has(m)),
  );
  const cibleMots = new Set(`${key(titreSite)} ${key(slug.replace(/-/g, ' '))}`.split(' '));
  let artisteOk = false;
  for (const m of artiste) if (cibleMots.has(m)) artisteOk = true;

  // Un titre d'un seul mot-clé COURT ne décide de rien sans l'artiste (« One »,
  // « Hey »). Un mot long et distinctif, lui, suffit : « Machistador » n'a pas
  // besoin de l'artiste, d'autant que le livre l'écrit « -M- », qui ne
  // ressemble à rien une fois normalisé.
  const distinctif = [...mots].some((m) => m.length >= 6);
  if (mots.size < 2 && !artisteOk && !distinctif) return 0;
  return titreScore + (artisteOk ? 0.5 : 0);
}

const pages = execFileSync('pdftotext', [PDF, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split('\f');

// Un morceau commence sur une page portant « Artiste : ».
const starts = [];
pages.forEach((page, i) => {
  const m = page.match(/Artiste\s*:\s*(.+)/);
  if (!m) return;
  const lines = page.split('\n').map((l) => l.trim()).filter(Boolean);
  // L'ordre de lecture place parfois « Artiste : … » avant le titre.
  const titre = lines.slice(0, 6).find((l) => !/^(Artiste\s*:|Paroles et musique)/.test(l));
  starts.push({ page: i + 1, titre, artiste: m[1].trim() });
});

const tuto = tutorials();
const songs = [];

starts.forEach((s, i) => {
  const limit = i + 1 < starts.length ? starts[i + 1].page - 1 : pages.length;
  const used = [s.page];
  for (let n = s.page + 1; n <= limit; n += 1) {
    const page = pages[n - 1];
    if (STOP.test(page) || chordsOfPage(page).length === 0) break;
    used.push(n);
  }

  const accords = [];
  let texte = '';
  for (const n of used) {
    texte += pages[n - 1];
    for (const c of chordsOfPage(pages[n - 1])) if (!accords.includes(c)) accords.push(c);
  }
  // Le tempo figure sur la page d'anecdote qui suit le morceau.
  const tail = texte + (pages[used.at(-1)] ?? '');
  const tempo = tail.match(/Tempo\s*\n(?:\s*Capo\s*\n)?\s*(\d{2,3})/)?.[1];

  // Meilleur tutoriel par proximité de titre, avec un seuil : en dessous de
  // deux tiers des mots-clés en commun, on préfère ne rien relier.
  let match = null;
  let meilleur = 0;
  for (const t of tuto) {
    const score = proximite(s.titre ?? '', s.artiste ?? '', t.title, t.slug);
    if (score > meilleur) {
      meilleur = score;
      match = t;
    }
  }
  if (meilleur < 0.67) match = null;
  const douteux = suspects(accords);

  songs.push({
    titre: s.titre,
    artiste: s.artiste,
    slug: match?.slug ?? null,
    accords,
    tempo: tempo ? Number(tempo) : null,
    difficulte: match?.difficulte ?? null,
    statut: douteux.length ? 'a-verifier' : 'ok',
    ...(douteux.length ? { doute: `accord(s) peut-être amputé(s) par l'extraction : ${douteux.join(', ')}` } : {}),
  });
});

// On conserve les statuts « verifie » déjà posés à la main lors des passages précédents.
if (existsSync(OUT)) {
  const previous = JSON.parse(readFileSync(OUT, 'utf8')).songs ?? [];
  for (const song of songs) {
    const before = previous.find((p) => p.titre === song.titre);
    if (before?.statut === 'verifie') {
      song.statut = 'verifie';
      song.accords = before.accords;
      if (before.verifiePar) song.verifiePar = before.verifiePar;
      delete song.doute;
    }
  }
}

songs.sort((a, b) => a.accords.length - b.accords.length || a.titre.localeCompare(b.titre, 'fr'));

writeFileSync(
  OUT,
  `${JSON.stringify(
    {
      _comment:
        "Extrait du livre par scripts/extract-book-chords.mjs. Seuls les morceaux en statut « ok » ou « verifie » alimentent l'outil ; « a-verifier » signale un doute d'extraction à lever en regardant la page du livre. Les numéros de page du livre ne sont pas repris ici.",
      _generatedBy: 'npm run chords:index',
      songs,
    },
    null,
    2,
  )}\n`,
  'utf8',
);

const utilisables = songs.filter((s) => s.statut !== 'a-verifier' && s.slug);
console.log(`✓ ${OUT} — ${songs.length} morceaux extraits.`);
console.log(`  ${utilisables.length} utilisables par l'outil (statut ok/verifie et tutoriel publié)`);
for (const s of songs.filter((x) => x.statut === 'a-verifier')) {
  console.log(`  ⚠ à vérifier — ${s.titre} : ${s.doute}`);
}
