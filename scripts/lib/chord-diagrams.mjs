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
};

// ---------- CATALOGUE UKULÉLÉ (4 cordes G-C-E-A) ----------
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
