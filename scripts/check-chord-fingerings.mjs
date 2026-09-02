#!/usr/bin/env node
/**
 * Contrôle les doigtés du catalogue (scripts/lib/chord-diagrams.mjs).
 *
 * DEUX CONTRÔLES, DEUX NATURES
 *
 * 1. LES NOTES — on recalcule ce que le doigté fait réellement sonner sur
 *    l'accordage de l'instrument, et on le compare à la formule de l'accord
 *    (fondamentale, tierce, quinte, septième…). C'est ce contrôle qui a
 *    révélé que Fmaj7/C sonnait avec un mi à la basse.
 *    La quinte est tolérée absente : les voicings guitare à quatre sons
 *    l'omettent couramment (le C7 standard x32310 n'a pas de sol).
 *    La basse n'est vérifiée qu'à la guitare : le ukulélé standard est en
 *    sol réentrant, sa première corde n'est pas la plus grave.
 *
 * 2. LA MAIN — une corde frettée doit porter un doigt, une corde à vide ou
 *    étouffée ne doit pas en porter, et un même doigt ne peut tenir deux
 *    cases différentes que s'il barre. Ce contrôle-là est arrivé après coup :
 *    Fred a relu les 38 positions ajoutées le 2026-09-02 et en a corrigé
 *    cinq — Bm7, Dsus4, Cadd9, G6, Am/G — dont les cases étaient bonnes mais
 *    la répartition des doigts fausse. Aucun calcul de notes ne pouvait le
 *    voir ; celui-ci l'aurait vu en partie.
 *
 * Usage : npm run chords:check
 */
import { readFileSync } from 'node:fs';

const src = readFileSync('scripts/lib/chord-diagrams.mjs', 'utf8');

const N = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
const NOM = ['do', 'do#', 'ré', 'ré#', 'mi', 'fa', 'fa#', 'sol', 'sol#', 'la', 'la#', 'si'];

const INSTRUMENTS = {
  guitare: { cordes: [4, 9, 2, 7, 11, 4], basse: true,  bornes: ['const GUITARE_CHORDS', 'const UKULELE_CHORDS'] },
  ukulele: { cordes: [7, 0, 4, 9],        basse: false, bornes: ['const UKULELE_CHORDS', 'const CATALOGUE'] },
};

const FORMULES = [
  [/^5$/, [0, 7]], [/^m7$/, [0, 3, 7, 10]], [/^maj7$/i, [0, 4, 7, 11]],
  [/^7sus4$/, [0, 5, 7, 10]], [/^7$/, [0, 4, 7, 10]], [/^madd9$/, [0, 3, 7, 2]],
  [/^add9$/, [0, 4, 7, 2]], [/^sus2$/, [0, 2, 7]], [/^sus4$/, [0, 5, 7]],
  [/^m$/, [0, 3, 7]], [/^6$/, [0, 4, 7, 9]], [/^$/, [0, 4, 7]],
];

let controles = 0;
const soucis = [];

for (const [instrument, { cordes, basse: verifBasse, bornes }] of Object.entries(INSTRUMENTS)) {
  const bloc = src.slice(src.indexOf(bornes[0]), src.indexOf(bornes[1]));
  const re = /^\s{2}'?([a-z0-9#/-]+)'?:\s*\{([\s\S]*?)\},?\s*$/gm;
  let m;
  while ((m = re.exec(bloc)) !== null) {
    const [, cle, corps] = m;
    const nom = corps.match(/name:\s*'([^']+)'/)?.[1];
    const fr = corps.match(/frets:\s*\[([^\]]+)\]/)?.[1];
    const fg = corps.match(/fingers:\s*\[([^\]]+)\]/)?.[1];
    if (!nom || !fr) continue;
    const frets = fr.split(',').map((x) => Number(x.trim()));
    const doigts = fg ? fg.split(',').map((x) => Number(x.trim())) : [];
    // Le corps d'une entrée est découpé à la première accolade fermante en fin
    // de ligne, qui est celle du barré lui-même : on ne peut donc pas exiger
    // l'accolade de fermeture ici.
    const mBarre = corps.match(/barre:\s*\{([^}]*)/);
    const barreFinger = mBarre ? Number(mBarre[1].match(/finger:\s*(\d+)/)?.[1] ?? 1) : null;
    const id = `${instrument}/${nom}`;
    controles += 1;
    const dire = (quoi) => soucis.push(`${id.padEnd(20)} ${quoi}`);

    // ── 1. Les notes ──
    let base = nom, noteBasse = null;
    if (nom.includes('/')) [base, noteBasse] = nom.split('/');
    const mm = base.match(/^([A-G][#b]?)(.*)$/);
    if (!mm) { dire('nom illisible'); continue; }
    const [, racine, suffixe] = mm;
    const f = FORMULES.find(([r]) => r.test(suffixe));
    if (!f) { dire(`suffixe « ${suffixe} » non géré par le contrôle`); continue; }

    const attendus = new Set(f[1].map((i) => (N[racine] + i) % 12));
    if (noteBasse) attendus.add(N[noteBasse]);
    const quinte = (N[racine] + 7) % 12;

    const jouees = [];
    frets.forEach((fret, i) => { if (fret >= 0) jouees.push({ pc: (cordes[i] + fret) % 12, i }); });
    const set = new Set(jouees.map((x) => x.pc));

    for (const pc of set) if (!attendus.has(pc)) dire(`fait sonner un ${NOM[pc]} qui n'est pas dans l'accord`);
    for (const pc of attendus) if (!set.has(pc) && pc !== quinte) dire(`ne fait pas sonner le ${NOM[pc]} attendu`);
    if (verifBasse && jouees.length) {
      const attendue = N[noteBasse ?? racine];
      if (jouees[0].pc !== attendue) dire(`basse en ${NOM[jouees[0].pc]}, attendue en ${NOM[attendue]}`);
    }

    // ── 2. La main ──
    if (!doigts.length) { dire('aucun doigté déclaré'); continue; }
    if (doigts.length !== frets.length) dire(`${doigts.length} doigts pour ${frets.length} cordes`);
    frets.forEach((fret, i) => {
      if (fret > 0 && !doigts[i]) dire(`corde ${i + 1} à la case ${fret} sans doigt`);
      if (fret <= 0 && doigts[i]) dire(`corde ${i + 1} ${fret < 0 ? 'étouffée' : 'à vide'} avec un doigt`);
    });
    // Un même doigt sur deux cases différentes est impossible. Sur deux cordes
    // VOISINES à la même case, c'est un petit barré — parfaitement jouable, et
    // fréquent (le Dm7 xx0211 se tient index à plat sur les deux aiguës). On ne
    // signale donc que l'impossible, et le cas plus douteux d'un doigt qui
    // sauterait une corde pour en tenir deux non voisines.
    const parDoigt = new Map();
    doigts.forEach((d, i) => {
      if (!d) return;
      if (!parDoigt.has(d)) parDoigt.set(d, []);
      parDoigt.get(d).push({ corde: i, fret: frets[i] });
    });
    for (const [doigt, prises] of parDoigt) {
      const cases = new Set(prises.map((x) => x.fret));
      if (cases.size > 1) {
        dire(`le doigt ${doigt} tiendrait les cases ${[...cases].join(' et ')} en même temps`);
        continue;
      }
      // Le doigt qui barre couvre tout le manche à sa case : les autres doigts
      // s'intercalent, donc ses appuis ne sont pas voisins. C'est normal.
      if (doigt === barreFinger) continue;
      const cordes = prises.map((x) => x.corde).sort((a, b) => a - b);
      const voisines = cordes.every((c, k) => k === 0 || c === cordes[k - 1] + 1);
      if (!voisines) dire(`le doigt ${doigt} tiendrait les cordes ${cordes.map((c) => c + 1).join(', ')}, non voisines`);
    }
  }
}

if (soucis.length) {
  console.error(`✗ ${soucis.length} anomalie(s) sur ${controles} accords :\n`);
  for (const s of soucis) console.error(`   ${s}`);
  process.exit(1);
}
console.log(`✓ ${controles} accords contrôlés — notes et doigtés cohérents.`);
