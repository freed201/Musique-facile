#!/usr/bin/env node
/**
 * Écrit le bloc <figure> des diagrammes d'accords à coller dans un article.
 *
 * POURQUOI UN SCRIPT
 * Le texte alternatif de ces images décrit le doigté corde par corde. Écrit à
 * la main, c'est exactement l'endroit où une erreur passe inaperçue : personne
 * ne relit un attribut alt, et un lecteur d'écran est le seul à en pâtir.
 * Ici il est déduit du catalogue (scripts/lib/chord-diagrams.mjs), donc
 * toujours d'accord avec le schéma affiché.
 *
 * Usage : node scripts/chord-figure.mjs guitare "Les 5 accords de Wonderwall" Em7 G Dsus4 Cadd9 A7sus4
 */
import { readFileSync } from 'node:fs';

const [instrument, legende, ...accords] = process.argv.slice(2);
if (!instrument || !accords.length) {
  console.error('Usage : node scripts/chord-figure.mjs <instrument> "<légende>" <Accord> [<Accord>…]');
  process.exit(1);
}

const src = readFileSync('scripts/lib/chord-diagrams.mjs', 'utf8');
const bornes = instrument === 'ukulele'
  ? ['const UKULELE_CHORDS', 'const CATALOGUE']
  : ['const GUITARE_CHORDS', 'const UKULELE_CHORDS'];
const bloc = src.slice(src.indexOf(bornes[0]), src.indexOf(bornes[1]));

const CORDES = instrument === 'ukulele'
  ? ['Sol', 'Do', 'Mi', 'La']
  : ['Mi grave', 'La', 'Ré', 'Sol', 'Si', 'Mi aiguë'];
const DOIGTS = { 1: 'index', 2: 'majeur', 3: 'annulaire', 4: 'auriculaire' };
const RANG = (n) => (n === 1 ? '1re' : `${n}e`);

const cle = (a) => a.toLowerCase().replace(/#/g, 'diese').replace(/\//g, '-');

function lire(accord) {
  const k = cle(accord);
  const m = bloc.match(new RegExp(`^  '?${k.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}'?:\\s*\\{([\\s\\S]*?)\\},?\\s*$`, 'm'));
  if (!m) return null;
  const corps = m[1];
  return {
    nom: corps.match(/name:\s*'([^']+)'/)?.[1] ?? accord,
    long: corps.match(/longName:\s*'([^']+)'/)?.[1] ?? '',
    frets: corps.match(/frets:\s*\[([^\]]+)\]/)[1].split(',').map((x) => Number(x.trim())),
    doigts: corps.match(/fingers:\s*\[([^\]]+)\]/)[1].split(',').map((x) => Number(x.trim())),
    barre: corps.match(/barre:\s*\{([^}]*)/)?.[1] ?? null,
    k,
  };
}

/** Décrit le doigté en français, dans l'ordre où on pose les doigts. */
function decrire(a) {
  const parts = [];
  if (a.barre) {
    const fret = Number(a.barre.match(/fret:\s*(\d+)/)[1]);
    const doigt = Number(a.barre.match(/finger:\s*(\d+)/)?.[1] ?? 1);
    parts.push(`${DOIGTS[doigt]} en barré sur la ${RANG(fret)} case`);
  }
  const poses = a.frets
    .map((fret, i) => ({ fret, i, doigt: a.doigts[i] }))
    .filter((x) => x.fret > 0 && x.doigt && !(a.barre && x.doigt === Number(a.barre.match(/finger:\s*(\d+)/)?.[1] ?? 1)))
    .sort((x, y) => x.doigt - y.doigt);
  for (const p of poses) parts.push(`${DOIGTS[p.doigt]} sur la ${RANG(p.fret)} case de la corde ${CORDES[p.i]}`);

  /** « Sol, Si et Mi aiguë » — pas « Sol et Si et Mi aiguë ». */
  const enumere = (l) => (l.length < 2 ? l[0] : `${l.slice(0, -1).join(', ')} et ${l[l.length - 1]}`);

  const vides = a.frets.map((f, i) => (f === 0 ? CORDES[i] : null)).filter(Boolean);
  const etouffees = a.frets.map((f, i) => (f < 0 ? CORDES[i] : null)).filter(Boolean);
  if (vides.length === a.frets.length - 1) parts.push('toutes les autres cordes à vide');
  else if (vides.length) parts.push(`corde${vides.length > 1 ? 's' : ''} ${enumere(vides)} à vide`);
  if (etouffees.length) parts.push(`corde${etouffees.length > 1 ? 's' : ''} ${enumere(etouffees)} étouffée${etouffees.length > 1 ? 's' : ''}`);
  return parts.join(', ');
}

const images = [];
for (const accord of accords) {
  const a = lire(accord);
  if (!a) { console.error(`✗ ${accord} : absent du catalogue ${instrument}`); process.exit(1); }
  const alt = `Diagramme de l'accord ${a.long} (${a.nom}) à ${instrument === 'ukulele' ? "l'ukulélé" : 'la guitare'} : ${decrire(a)}`;
  images.push(
    `    <img src="/images/blog/accords-${instrument}/accord-${instrument}-${a.k}.svg" width="150" height="164" loading="lazy" decoding="async" alt="${alt}" />`,
  );
}

console.log(`<figure class="chord-chart" style="margin:1.75rem 0;">
  <div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;">
${images.join('\n')}
  </div>
  <figcaption style="text-align:center;font-size:0.9rem;color:#777;margin-top:0.6rem;">${legende} Les chiffres indiquent le doigt à utiliser : 1 = index, 2 = majeur, 3 = annulaire, 4 = auriculaire.</figcaption>
</figure>`);
