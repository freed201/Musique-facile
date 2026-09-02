#!/usr/bin/env node
/**
 * Relève les morceaux de ukulélé et leurs accords dans les articles du blog,
 * pour alimenter l'outil « Quel accord de ukulélé apprendre ensuite ? ».
 *
 * POURQUOI DEPUIS LES ARTICLES
 * Le livre de Fred (sources-privees/Interno.pdf) est un recueil guitare : il
 * n'existe pas d'équivalent ukulélé. Mais Fred a déjà publié ses relevés dans
 * deux articles, sous une forme régulière (« **Accords :** C — G — Am — F »).
 * On les lit là où ils sont plutôt que d'en inventer : chaque morceau garde le
 * lien vers le passage exact de l'article dont il vient, ancre comprise.
 *
 * LES CONFLITS NE SONT PAS ARBITRÉS
 * Les deux articles se contredisent sur quelques titres. Le script ne choisit
 * pas : il marque `statut: 'conflit'` et conserve les deux versions. L'outil
 * écarte ces morceaux, exactement comme il écarte les relevés douteux du livre.
 * C'est à Fred de trancher, article en main.
 *
 * Sortie : src/data/ukulele-songs.json
 * Usage  : npm run ukulele:extract
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import Slugger from 'github-slugger';

const BLOG = 'src/content/blog';
const OUT = 'src/data/ukulele-songs.json';

/** Articles lus, avec la façon dont chacun titre ses morceaux. */
const ARTICLES = [
  {
    slug: '15-chansons-faciles-ukulele',
    // « 1. Titre — Artiste » (le « ### » est déjà retiré à ce stade)
    entete: /^\d+\.\s*(.+?)\s*$/,
    separateur: '—',
  },
  {
    slug: 'debuter-ukulele-methode-simple-apprendre',
    // « 1. "Titre" - Artiste » (le « ### » est déjà retiré à ce stade)
    entete: /^\d+\.\s*(.+?)\s*$/,
    separateur: '-',
  },
];

/** « C — G — Am — F (ou Dm) » → ['C', 'G', 'Am', 'F'] */
function lireAccords(ligne) {
  const sans = ligne.replace(/\(.*?\)/g, '').replace(/[—–]/g, '-');
  const accords = [];
  for (let p of sans.split(/[-,|/]/)) {
    p = p.trim().replace(/[.!*"“”]/g, '');
    if (/^[A-G][#b]?(m|maj|min|sus|add|dim|aug)?\d?(sus[24])?\d?$/.test(p) && !accords.includes(p)) {
      accords.push(p);
    }
  }
  return accords;
}

/** Enlève les liens markdown et les guillemets d'un titre de section. */
const nettoieEntete = (s) =>
  s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[""“”]/g, '').trim();

const parTitre = new Map();

for (const { slug, entete, separateur } of ARTICLES) {
  const texte = readFileSync(join(BLOG, `${slug}.md`), 'utf8');
  const slugger = new Slugger(); // un par article : Astro fait pareil
  // On numérote toutes les sections pour que les ancres correspondent à celles
  // qu'Astro génère, y compris pour les H2/H3 qui ne sont pas des morceaux.
  // Attention : \Z n'existe pas en JavaScript — c'est la lettre « Z ». Utiliser
  // (?![\s\S]) pour « fin de la chaîne », sinon le corps d'une section s'arrête
  // au premier Z du texte et on perd les accords qui suivent.
  const sections = [...texte.matchAll(/^(#{2,3})\s*(.+?)\s*$([\s\S]*?)(?=^#{2,3}\s|(?![\s\S]))/gm)];

  for (const [, , brut, corps] of sections) {
    const ancre = slugger.slug(nettoieEntete(brut));
    const m = brut.match(entete);
    if (!m) continue;
    const ligne = corps.match(/\*\*Accords?\s*:\*\*\s*(.+)/);
    if (!ligne) continue;
    const accords = lireAccords(ligne[1]);
    if (accords.length < 2) continue;

    const [titreBrut, ...reste] = nettoieEntete(m[1]).split(separateur);
    const titre = titreBrut.replace(/^\d+\.\s*/, '').trim();
    const artiste = reste.join(separateur).trim() || null;
    const cle = titre.toLowerCase().replace(/[’']/g, "'");

    if (!parTitre.has(cle)) parTitre.set(cle, []);
    parTitre.get(cle).push({ titre, artiste, accords, article: slug, ancre });
  }
}

const songs = [];
let conflits = 0;
for (const versions of parTitre.values()) {
  const distinctes = new Set(versions.map((v) => v.accords.join(' ')));
  const { titre, artiste } = versions[0];
  if (distinctes.size > 1) {
    conflits += 1;
    songs.push({
      titre,
      artiste,
      statut: 'conflit',
      raison: 'les deux articles ne donnent pas les mêmes accords',
      versions: versions.map((v) => ({ accords: v.accords, article: v.article, ancre: v.ancre })),
    });
  } else {
    const v = versions[0];
    songs.push({
      titre,
      artiste,
      accords: v.accords,
      statut: 'ok',
      article: v.article,
      ancre: v.ancre,
      // Un morceau cité par les deux articles est mieux étayé qu'un autre.
      sources: versions.length,
    });
  }
}

songs.sort((a, b) => (a.accords?.length ?? 99) - (b.accords?.length ?? 99) || a.titre.localeCompare(b.titre, 'fr'));

writeFileSync(
  OUT,
  `${JSON.stringify(
    {
      _comment:
        "Morceaux de ukulélé relevés dans les articles du blog par scripts/extract-ukulele-songs.mjs — ne pas éditer à la main. Les accords sont ceux publiés par Fred ; un morceau dont les deux articles donnent des accords différents porte statut « conflit » et reste hors de l'outil tant que Fred n'a pas tranché.",
      _generatedBy: 'npm run ukulele:extract',
      songs,
    },
    null,
    2,
  )}\n`,
  'utf8',
);

console.log(`✓ ${OUT} — ${songs.length} morceaux, dont ${conflits} en conflit.`);
