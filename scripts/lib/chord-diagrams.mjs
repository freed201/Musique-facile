/**
 * chord-diagrams.mjs — Génère des diagrammes d'accords en SVG inline pour PDF.
 *
 * Usage :
 *   import { renderChord } from './lib/chord-diagrams.mjs';
 *   const svg = renderChord('em', 'guitare');
 *
 * Catalogue géré (instruments) :
 *   - guitare (6 cordes EADGBE)
 *   - ukulele (4 cordes GCEA)
 *
 * Pour ajouter un accord : étendre `CHORDS` ci-dessous.
 * Format de chaque entrée :
 *   {
 *     frets: tableau de cordes, de la plus grave (E) à la plus aiguë.
 *            Valeurs : nombre = case, 0 = corde à vide, -1 = corde non jouée
 *     fingers: tableau de doigts pour chaque corde
 *              Valeurs : 1=index, 2=majeur, 3=annulaire, 4=auriculaire, 0/null = non utilisé
 *     barre: { fret: number, fromString: number, toString: number, finger: number } | null
 *   }
 */

const PALETTE = {
  bg: '#fefcf7',           // papier crème
  manche: '#7a5230',       // bois foncé
  fret: '#d4af8b',         // ambre clair
  cordes: '#5a3e25',       // bois moyen
  cordesAVide: '#6b4423',  // bois (cercle vide)
  mute: '#9a9a9a',         // gris pour cordes mutes (×)
  doigt: {
    1: '#c0392b', // index — rouge
    2: '#27ae60', // majeur — vert
    3: '#2980b9', // annulaire — bleu
    4: '#8e44ad', // auriculaire — violet
  },
  texte: '#3a2818',
};

// ---------- CATALOGUE GUITARE ----------
const GUITARE_CHORDS = {
  em: {
    name: 'Em',
    longName: 'Mi mineur',
    frets:   [0, 2, 2, 0, 0, 0], // E A D G B E
    fingers: [0, 2, 3, 0, 0, 0],
  },
  g: {
    name: 'G',
    longName: 'Sol majeur',
    frets:   [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
  },
  d: {
    name: 'D',
    longName: 'Ré majeur',
    frets:   [-1, -1, 0, 2, 3, 2],
    fingers: [0, 0, 0, 1, 3, 2],
  },
  c: {
    name: 'C',
    longName: 'Do majeur',
    frets:   [-1, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
  },
  am: {
    name: 'Am',
    longName: 'La mineur',
    frets:   [-1, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0],
  },
  f: {
    name: 'F',
    longName: 'Fa majeur',
    frets:   [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    barre: { fret: 1, fromString: 0, toString: 5, finger: 1 },
  },
  b7: {
    name: 'B7',
    longName: 'Si septième',
    frets:   [-1, 2, 1, 2, 0, 2],
    fingers: [0, 2, 1, 3, 0, 4],
  },
  // Accords de septième ouverts — positions standard, ajoutées pour les tutos de morceaux
  // (Hallelujah, Foule sentimentale, La Seine). À VALIDER PAR FRED avant publication.
  e7: {
    name: 'E7',
    longName: 'Mi septième',
    frets:   [0, 2, 0, 1, 0, 0],
    fingers: [0, 2, 0, 1, 0, 0],
  },
  d7: {
    name: 'D7',
    longName: 'Ré septième',
    frets:   [-1, -1, 0, 2, 1, 2],
    fingers: [0, 0, 0, 2, 1, 3],
  },
  a7: {
    name: 'A7',
    longName: 'La septième',
    frets:   [-1, 0, 2, 0, 2, 0],
    fingers: [0, 0, 2, 0, 3, 0],
  },

  // --- Positions relevées dans « 40 chansons françaises et hits pop-rock » (Fred Fieffé)
  // et validées par Fred. Certaines sont propres à un morceau : voir le commentaire.
  bm: {
    name: 'Bm',
    longName: 'Si mineur',
    frets:   [-1, 2, 4, 4, 3, 2],
    fingers: [0, 1, 3, 4, 2, 1],
    barre: { fret: 2, fromString: 1, toString: 5, finger: 1 },
  },
  fmaj7: {
    name: 'FMaj7',
    longName: 'Fa majeur septième',
    frets:   [-1, -1, 3, 2, 1, 0],
    fingers: [0, 0, 3, 2, 1, 0],
  },
  'fmaj7-c': {
    name: 'FMaj7/C',
    longName: 'Fa majeur septième, basse do',
    frets:   [0, 3, 3, 2, 1, 0],
    fingers: [0, 3, 4, 2, 1, 0],
  },
  'e7-b': {
    name: 'E7/B',
    longName: 'Mi septième, basse si',
    frets:   [-1, 2, 0, 1, 0, 0],
    fingers: [0, 2, 0, 1, 0, 0],
  },
  'fdiese-m': {
    name: 'F#m',
    longName: 'Fa dièse mineur',
    frets:   [2, 4, 4, 2, 2, 2],
    fingers: [1, 3, 4, 1, 1, 1],
    barre: { fret: 2, fromString: 0, toString: 5, finger: 1 },
  },
  'fdiese-sus4': {
    name: 'F#sus4',
    longName: 'Fa dièse suspendu 4',
    frets:   [2, 4, 4, 4, 2, 2],
    fingers: [1, 2, 3, 4, 1, 1],
    barre: { fret: 2, fromString: 0, toString: 5, finger: 1 },
  },
  gm: {
    name: 'Gm',
    longName: 'Sol mineur',
    frets:   [3, 5, 5, 3, 3, 3],
    fingers: [1, 3, 4, 1, 1, 1],
    barre: { fret: 3, fromString: 0, toString: 5, finger: 1 },
  },
  bb: {
    name: 'Bb',
    longName: 'Si bémol majeur',
    frets:   [6, 8, 8, 7, 6, 6],
    fingers: [1, 3, 4, 2, 1, 1],
    barre: { fret: 6, fromString: 0, toString: 5, finger: 1 },
  },
  bbmaj7: {
    name: 'BbMaj7',
    longName: 'Si bémol majeur septième',
    frets:   [-1, 1, 3, 2, 3, 1],
    fingers: [0, 1, 3, 2, 4, 1],
    barre: { fret: 1, fromString: 1, toString: 5, finger: 1 },
  },
  // Position barrée en 3e case, utilisée sur Hallelujah (notée G* dans le livre)
  'g-barre3': {
    name: 'G',
    longName: 'Sol majeur (barré 3e case)',
    frets:   [3, 5, 5, 4, 3, 3],
    fingers: [1, 3, 4, 2, 1, 1],
    barre: { fret: 3, fromString: 0, toString: 5, finger: 1 },
  },
  // Positions hautes propres à Back to Black
  'dm-barre5': {
    name: 'Dm',
    longName: 'Ré mineur (barré 5e case)',
    frets:   [-1, 5, 7, 7, 6, 5],
    fingers: [0, 1, 3, 4, 2, 1],
    barre: { fret: 5, fromString: 1, toString: 5, finger: 1 },
  },
  'a-barre5': {
    name: 'A',
    longName: 'La majeur (barré 5e case)',
    frets:   [5, 7, 7, 6, 5, 5],
    fingers: [1, 3, 4, 2, 1, 1],
    barre: { fret: 5, fromString: 0, toString: 5, finger: 1 },
  },
  'a7-barre5': {
    name: 'A7',
    longName: 'La septième (barré 5e case)',
    frets:   [5, 7, 5, 6, 5, 5],
    fingers: [1, 3, 1, 2, 1, 1],
    barre: { fret: 5, fromString: 0, toString: 5, finger: 1 },
  },
  e: {
    name: 'E',
    longName: 'Mi majeur',
    frets:   [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0],
  },
  a: {
    name: 'A',
    longName: 'La majeur',
    frets:   [-1, 0, 2, 2, 2, 0],
    fingers: [0, 0, 1, 2, 3, 0],
  },
  dm: {
    name: 'Dm',
    longName: 'Ré mineur',
    frets:   [-1, -1, 0, 2, 3, 1],
    fingers: [0, 0, 0, 2, 3, 1],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // AJOUTS DU 2026-09-02 — positions standard, EN ATTENTE DE VALIDATION.
  //
  // Les entrées ci-dessus viennent du livre de Fred et sont relues par lui.
  // Celles-ci comblent les accords du répertoire de l'outil « Quel accord
  // apprendre ensuite ? » qui n'avaient aucun diagramme : ce sont les positions
  // standard, celles que donne n'importe quelle méthode, mais Fred ne les a pas
  // encore vérifiées une par une. D'où le champ `source: 'standard'` — il
  // permet de les retrouver, et de les repasser à 'livre' après relecture.
  //
  // Deux accords sont volontairement absents : Bb7sus4 et B/G. Leur doigté
  // varie trop d'un arrangement à l'autre pour qu'on en affirme un.
  // ─────────────────────────────────────────────────────────────────────────

  g7:      { name: 'G7',      longName: 'Sol 7',                source: 'standard', frets: [3, 2, 0, 0, 0, 1],  fingers: [3, 2, 0, 0, 0, 1] },
  em7:     { name: 'Em7',     longName: 'Mi mineur 7',          source: 'standard', frets: [0, 2, 0, 0, 0, 0],  fingers: [0, 2, 0, 0, 0, 0] },
  c7:      { name: 'C7',      longName: 'Do 7',                 source: 'standard', frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0] },
  am7:     { name: 'Am7',     longName: 'La mineur 7',          source: 'standard', frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0] },
  dm7:     { name: 'Dm7',     longName: 'Ré mineur 7',          source: 'standard', frets: [-1, -1, 0, 2, 1, 1], fingers: [0, 0, 0, 2, 1, 1] },
  bm7:     { name: 'Bm7',     longName: 'Si mineur 7',          source: 'standard', frets: [-1, 2, 0, 2, 0, 2], fingers: [0, 2, 0, 3, 0, 4] },
  f7:      { name: 'F7',      longName: 'Fa 7',                 source: 'standard', frets: [1, 3, 1, 2, 1, 1],  fingers: [1, 3, 1, 2, 1, 1], barre: { fret: 1, fromString: 0, toString: 5, finger: 1 } },
  cm:      { name: 'Cm',      longName: 'Do mineur (barré 3e case)', source: 'standard', frets: [-1, 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1], barre: { fret: 3, fromString: 1, toString: 5, finger: 1 } },
  b:       { name: 'B',       longName: 'Si majeur (barré 2e case)', source: 'standard', frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], barre: { fret: 2, fromString: 1, toString: 5, finger: 1 } },
  fdiese:  { name: 'F#',      longName: 'Fa dièse majeur (barré 2e case)', source: 'standard', frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], barre: { fret: 2, fromString: 0, toString: 5, finger: 1 } },
  fdiese7: { name: 'F#7',     longName: 'Fa dièse 7 (barré 2e case)', source: 'standard', frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1], barre: { fret: 2, fromString: 0, toString: 5, finger: 1 } },

  dsus2:   { name: 'Dsus2',   longName: 'Ré suspendu 2',        source: 'standard', frets: [-1, -1, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 3, 0] },
  dsus4:   { name: 'Dsus4',   longName: 'Ré suspendu 4',        source: 'standard', frets: [-1, -1, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 2, 3] },
  asus2:   { name: 'Asus2',   longName: 'La suspendu 2',        source: 'standard', frets: [-1, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0] },
  asus4:   { name: 'Asus4',   longName: 'La suspendu 4',        source: 'standard', frets: [-1, 0, 2, 2, 3, 0], fingers: [0, 0, 1, 2, 3, 0] },
  esus4:   { name: 'Esus4',   longName: 'Mi suspendu 4',        source: 'standard', frets: [0, 2, 2, 2, 0, 0], fingers: [0, 2, 3, 4, 0, 0] },
  a7sus4:  { name: 'A7sus4',  longName: 'La 7 suspendu 4',      source: 'standard', frets: [-1, 0, 2, 0, 3, 3], fingers: [0, 0, 2, 0, 3, 4] },
  d7sus4:  { name: 'D7sus4',  longName: 'Ré 7 suspendu 4',      source: 'standard', frets: [-1, -1, 0, 2, 1, 3], fingers: [0, 0, 0, 2, 1, 3] },
  cadd9:   { name: 'Cadd9',   longName: 'Do ajouté 9',          source: 'standard', frets: [-1, 3, 2, 0, 3, 0], fingers: [0, 3, 2, 0, 4, 0] },
  g6:      { name: 'G6',      longName: 'Sol 6',                source: 'standard', frets: [3, 2, 0, 0, 0, 0], fingers: [3, 2, 0, 0, 0, 0] },
  emadd9:  { name: 'Emadd9',  longName: 'Mi mineur ajouté 9',   source: 'standard', frets: [0, 2, 2, 0, 0, 2], fingers: [0, 1, 2, 0, 0, 3] },

  'd-fdiese': { name: 'D/F#', longName: 'Ré basse fa dièse',    source: 'standard', frets: [2, 0, 0, 2, 3, 2], fingers: [1, 0, 0, 2, 4, 3] },
  'g-b':      { name: 'G/B',  longName: 'Sol basse si',         source: 'standard', frets: [-1, 2, 0, 0, 0, 3], fingers: [0, 1, 0, 0, 0, 3] },
  'c-b':      { name: 'C/B',  longName: 'Do basse si',          source: 'standard', frets: [-1, 2, 2, 0, 1, 0], fingers: [0, 2, 3, 0, 1, 0] },
  'e-b':      { name: 'E/B',  longName: 'Mi basse si',          source: 'standard', frets: [-1, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  'am-g':     { name: 'Am/G', longName: 'La mineur basse sol',  source: 'standard', frets: [3, 0, 2, 2, 1, 0], fingers: [3, 0, 2, 4, 1, 0] },
  'dm-c':     { name: 'Dm/C', longName: 'Ré mineur basse do',   source: 'standard', frets: [-1, 3, 0, 2, 3, 1], fingers: [0, 3, 0, 2, 4, 1] },
  'bm-d':     { name: 'Bm/D', longName: 'Si mineur basse ré',   source: 'standard', frets: [-1, -1, 0, 4, 3, 2], fingers: [0, 0, 0, 3, 2, 1] },

  e5:  { name: 'E5',  longName: 'Mi puissance',        source: 'standard', frets: [0, 2, 2, -1, -1, -1],  fingers: [0, 1, 2, 0, 0, 0] },
  a5:  { name: 'A5',  longName: 'La puissance',        source: 'standard', frets: [-1, 0, 2, 2, -1, -1],  fingers: [0, 0, 1, 2, 0, 0] },
  d5:  { name: 'D5',  longName: 'Ré puissance',        source: 'standard', frets: [-1, -1, 0, 2, 3, -1],  fingers: [0, 0, 0, 1, 3, 0] },
  g5:  { name: 'G5',  longName: 'Sol puissance',       source: 'standard', frets: [3, 5, 5, -1, -1, -1],  fingers: [1, 3, 4, 0, 0, 0] },
  c5:  { name: 'C5',  longName: 'Do puissance',        source: 'standard', frets: [-1, 3, 5, 5, -1, -1],  fingers: [0, 1, 3, 4, 0, 0] },
  f5:  { name: 'F5',  longName: 'Fa puissance',        source: 'standard', frets: [1, 3, 3, -1, -1, -1],  fingers: [1, 3, 4, 0, 0, 0] },
  b5:  { name: 'B5',  longName: 'Si puissance',        source: 'standard', frets: [-1, 2, 4, 4, -1, -1],  fingers: [0, 1, 3, 4, 0, 0] },
  bb5: { name: 'Bb5', longName: 'Si bémol puissance',  source: 'standard', frets: [-1, 1, 3, 3, -1, -1],  fingers: [0, 1, 3, 4, 0, 0] },
};

const UKULELE_CHORDS = {
  c: {
    name: 'C',
    longName: 'Do majeur',
    frets:   [0, 0, 0, 3],
    fingers: [0, 0, 0, 3],
  },
  g: {
    name: 'G',
    longName: 'Sol majeur',
    frets:   [0, 2, 3, 2],
    fingers: [0, 1, 3, 2],
  },
  am: {
    name: 'Am',
    longName: 'La mineur',
    frets:   [2, 0, 0, 0],
    fingers: [2, 0, 0, 0],
  },
  f: {
    name: 'F',
    longName: 'Fa majeur',
    frets:   [2, 0, 1, 0],
    fingers: [2, 0, 1, 0],
  },
  d: {
    name: 'D',
    longName: 'Ré majeur',
    frets:   [2, 2, 2, 0],
    fingers: [1, 2, 3, 0],
  },
  dm: {
    name: 'Dm',
    longName: 'Ré mineur',
    frets:   [2, 2, 1, 0],
    fingers: [2, 3, 1, 0],
  },
  em: {
    name: 'Em',
    longName: 'Mi mineur',
    frets:   [0, 4, 3, 2],
    fingers: [0, 4, 3, 2],
  },
  a7: {
    name: 'A7',
    longName: 'La septième',
    frets:   [0, 1, 0, 0],
    fingers: [0, 1, 0, 0],
  },
  g7: {
    name: 'G7',
    longName: 'Sol septième',
    frets:   [0, 2, 1, 2],
    fingers: [0, 2, 1, 3],
  },
  c7: {
    name: 'C7',
    longName: 'Do septième',
    frets:   [0, 0, 0, 1],
    fingers: [0, 0, 0, 1],
  },

  am7: {
    name: 'Am7',
    longName: 'La mineur septième',
    frets:   [0, 0, 0, 0],
    fingers: [0, 0, 0, 0],
  },

  e7: {
    name: 'E7',
    longName: 'Mi septième',
    frets:   [1, 2, 0, 2],
    fingers: [1, 2, 0, 3],
  },

  a: {
    name: 'A',
    longName: 'La majeur',
    frets:   [2, 1, 0, 0],
    fingers: [2, 1, 0, 0],
  },

  bb: {
    name: 'Bb',
    longName: 'Si bémol majeur',
    frets:   [3, 2, 1, 1],
    fingers: [4, 3, 1, 1],
  },

  // Ajouts du 2026-09-02 pour l'outil « Quel accord de ukulélé apprendre
  // ensuite ? » — positions standard, en attente de validation par Fred.
  bm:    { name: 'Bm',    longName: 'Si mineur',       source: 'standard', frets: [4, 2, 2, 2], fingers: [3, 1, 1, 1], barre: { fret: 2, fromString: 1, toString: 3, finger: 1 } },
  fsus2: { name: 'Fsus2', longName: 'Fa suspendu 2',   source: 'standard', frets: [0, 0, 1, 3], fingers: [0, 0, 1, 3] },
};

const CATALOGUE = {
  guitare: GUITARE_CHORDS,
  ukulele: UKULELE_CHORDS,
};

// ---------- RENDU SVG ----------
/**
 * Rend un diagramme d'accord en SVG inline.
 * @param {string} chordKey - clé de l'accord (ex: 'em', 'g')
 * @param {'guitare'|'ukulele'} instrument
 * @param {object} [options]
 * @param {number} [options.width=220] - largeur du SVG en pixels
 * @returns {string} HTML/SVG inline
 */
export function renderChord(chordKey, instrument = 'guitare', options = {}) {
  const catalog = CATALOGUE[instrument];
  if (!catalog) {
    return `<div class="chord-error">Instrument inconnu : ${instrument}</div>`;
  }
  const chord = catalog[chordKey.toLowerCase()];
  if (!chord) {
    return `<div class="chord-error">Accord inconnu : ${chordKey} (${instrument})</div>`;
  }

  const stringCount = chord.frets.length;
  const usedFrets = chord.frets.filter(f => f > 0);
  const maxFret = usedFrets.length ? Math.max(...usedFrets) : 0;
  const minFret = usedFrets.length ? Math.min(...usedFrets) : 0;
  // Si tous les frets utilisés sont ≤ 5, on affiche depuis la case 1 (accord ouvert)
  // Sinon, on affiche à partir de minFret (accord barré déplacé).
  const startFret = (minFret === 0 || maxFret <= 5) ? 1 : minFret;
  const fretCount = Math.max(4, maxFret - startFret + 2);
  const width = options.width || 220;
  const padTop = 60;
  const padBottom = 30;
  const padX = 30;
  const fretboardWidth = width - 2 * padX;
  const stringSpacing = fretboardWidth / (stringCount - 1);
  const fretSpacing = 32;
  const fretboardHeight = fretSpacing * fretCount;
  const height = padTop + fretboardHeight + padBottom;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="chord-diagram" role="img" aria-label="Diagramme d'accord ${chord.name}">`;

  // Fond papier
  svg += `<rect width="${width}" height="${height}" fill="${PALETTE.bg}" rx="8" ry="8"/>`;

  // Nom de l'accord (centré, sans chevauchement avec les indicateurs cordes ouvertes)
  svg += `<text x="${width / 2}" y="24" text-anchor="middle" font-family="Poppins, sans-serif" font-size="22" font-weight="700" fill="${PALETTE.texte}">${chord.name}</text>`;
  // Le longName apparaît en sous-titre du nom dans le markdown du PDF ; on l'omet ici
  // pour éviter le chevauchement avec les cercles de cordes ouvertes.

  // Sillet ou indication de fret
  if (startFret === 1) {
    svg += `<rect x="${padX - 2}" y="${padTop - 4}" width="${fretboardWidth + 4}" height="5" fill="${PALETTE.manche}" rx="2"/>`;
  } else {
    svg += `<text x="${padX - 8}" y="${padTop + fretSpacing / 2 + 4}" text-anchor="end" font-family="Poppins, sans-serif" font-size="11" font-weight="600" fill="${PALETTE.texte}">${startFret}fr</text>`;
  }

  // Cases (frets)
  for (let i = 1; i <= fretCount; i++) {
    const y = padTop + i * fretSpacing;
    svg += `<line x1="${padX}" y1="${y}" x2="${padX + fretboardWidth}" y2="${y}" stroke="${PALETTE.fret}" stroke-width="1.5"/>`;
  }

  // Cordes (verticales)
  for (let s = 0; s < stringCount; s++) {
    const x = padX + s * stringSpacing;
    svg += `<line x1="${x}" y1="${padTop}" x2="${x}" y2="${padTop + fretboardHeight}" stroke="${PALETTE.cordes}" stroke-width="${1 + (stringCount - s) * 0.15}" opacity="0.8"/>`;
  }

  // Indicateurs au-dessus du manche (× pour mute, ○ pour corde à vide)
  // Positionnés à mi-chemin entre le titre et le sillet
  const indicatorY = padTop - 12;
  for (let s = 0; s < stringCount; s++) {
    const x = padX + s * stringSpacing;
    const fret = chord.frets[s];
    if (fret === -1) {
      svg += `<text x="${x}" y="${indicatorY + 4}" text-anchor="middle" font-family="Poppins, sans-serif" font-size="16" font-weight="700" fill="${PALETTE.mute}">×</text>`;
    } else if (fret === 0) {
      svg += `<circle cx="${x}" cy="${indicatorY}" r="5" fill="none" stroke="${PALETTE.cordesAVide}" stroke-width="1.8"/>`;
    }
  }

  // Barré
  if (chord.barre) {
    const xStart = padX + chord.barre.fromString * stringSpacing;
    const xEnd = padX + chord.barre.toString * stringSpacing;
    const yMid = padTop + (chord.barre.fret - startFret + 0.5) * fretSpacing;
    const barreColor = PALETTE.doigt[chord.barre.finger] || PALETTE.doigt[1];
    svg += `<rect x="${xStart - 8}" y="${yMid - 9}" width="${xEnd - xStart + 16}" height="18" rx="9" ry="9" fill="${barreColor}" opacity="0.92"/>`;
    svg += `<text x="${(xStart + xEnd) / 2}" y="${yMid + 4}" text-anchor="middle" font-family="Poppins, sans-serif" font-size="11" font-weight="700" fill="white">${chord.barre.finger}</text>`;
  }

  // Doigts sur les cases
  for (let s = 0; s < stringCount; s++) {
    const fret = chord.frets[s];
    if (fret > 0) {
      // Skip si la corde fait partie d'un barré sur la même case
      if (chord.barre && fret === chord.barre.fret && s >= chord.barre.fromString && s <= chord.barre.toString) {
        // Le barré couvre déjà cette corde
        if (s !== chord.barre.fromString && s !== chord.barre.toString) {
          continue;
        }
      }
      const x = padX + s * stringSpacing;
      const y = padTop + (fret - startFret + 0.5) * fretSpacing;
      const fingerNum = chord.fingers[s];
      const color = PALETTE.doigt[fingerNum] || PALETTE.doigt[1];
      svg += `<circle cx="${x}" cy="${y}" r="11" fill="${color}" opacity="0.95"/>`;
      if (fingerNum > 0) {
        svg += `<text x="${x}" y="${y + 4}" text-anchor="middle" font-family="Poppins, sans-serif" font-size="11" font-weight="700" fill="white">${fingerNum}</text>`;
      }
    }
  }

  // Noms des cordes en bas
  const stringNames = instrument === 'guitare'
    ? ['E', 'A', 'D', 'G', 'B', 'E']
    : ['G', 'C', 'E', 'A'];
  for (let s = 0; s < stringCount; s++) {
    const x = padX + s * stringSpacing;
    const y = padTop + fretboardHeight + 18;
    svg += `<text x="${x}" y="${y}" text-anchor="middle" font-family="Raleway, sans-serif" font-size="10" font-weight="600" fill="${PALETTE.cordes}" opacity="0.7">${stringNames[s]}</text>`;
  }

  svg += `</svg>`;
  return svg;
}

/**
 * Diagramme de clavier piano avec touches numérotées (pour mélodies 5 doigts).
 * @param {string} notesStr - séquence type "1-2-3-4-5" ou "do-re-mi-fa-sol"
 * @param {object} [options]
 */
export function renderPianoSequence(notesStr, options = {}) {
  // À implémenter quand on attaquera le PDF piano
  const width = 320;
  const height = 100;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" class="piano-diagram"><rect width="${width}" height="${height}" fill="${PALETTE.bg}" rx="6"/><text x="${width / 2}" y="${height / 2}" text-anchor="middle" font-family="Poppins, sans-serif" font-size="14" fill="${PALETTE.texte}">Diagramme piano à venir (séquence : ${notesStr})</text></svg>`;
}
