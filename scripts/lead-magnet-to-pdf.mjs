#!/usr/bin/env node
/**
 * lead-magnet-to-pdf.mjs — Convertit un markdown lead magnet en PDF pro.
 *
 * Architecture inspirée du script kid&zic md-to-pdf, adaptée à Musique Facile :
 * - Palette image-style-guide (bois clair, ambre, miel, papier crème)
 * - Thèmes dynamiques par instrument (--theme-guitar / piano / ukulele)
 * - Syntaxe markdown custom :::chord <key> pour les diagrammes
 * - Page de couverture stylée, header/footer pagination
 * - Output dans /public/lead-magnets/
 *
 * Usage :
 *   node scripts/lead-magnet-to-pdf.mjs content/lead-magnets/guitare-5-accords-magiques.md
 *   node scripts/lead-magnet-to-pdf.mjs <fichier> [--instrument guitare|piano|ukulele]
 *                                                  [--title "Titre custom"]
 *                                                  [--out chemin/sortie.pdf]
 *
 * Si --instrument n'est pas fourni, on le détecte depuis le nom de fichier
 * (préfixe `guitare-`, `piano-`, `ukulele-`).
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, basename, extname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';
import puppeteer from 'puppeteer';
import { renderChord } from './lib/chord-diagrams.mjs';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(SCRIPT_DIR, '..');

// ---------- CLI ARG PARSING ----------
const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help')) {
  console.log(`
Usage : node scripts/lead-magnet-to-pdf.mjs <fichier.md> [options]

Options :
  --instrument <guitare|piano|ukulele>  Force l'instrument (sinon détecté)
  --title <texte>                       Titre custom (sinon premier H1 du MD)
  --out <chemin>                        Chemin de sortie PDF (sinon /public/lead-magnets/)
  --help                                Affiche cette aide

Exemples :
  node scripts/lead-magnet-to-pdf.mjs content/lead-magnets/guitare-5-accords-magiques.md
  npm run lead-magnet:build -- content/lead-magnets/piano-5-melodies.md
`);
  process.exit(0);
}

const mdPath = resolve(args[0]);
let forcedInstrument = '';
let forcedTitle = '';
let forcedOut = '';

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--instrument' && args[i + 1]) forcedInstrument = args[++i];
  else if (args[i] === '--title' && args[i + 1]) forcedTitle = args[++i];
  else if (args[i] === '--out' && args[i + 1]) forcedOut = resolve(args[++i]);
}

if (!existsSync(mdPath)) {
  console.error(`❌ Fichier introuvable : ${mdPath}`);
  process.exit(1);
}

// ---------- DÉTECTION INSTRUMENT ----------
const fileBaseName = basename(mdPath, extname(mdPath)).toLowerCase();
const detectInstrument = () => {
  if (forcedInstrument) return forcedInstrument.toLowerCase();
  if (fileBaseName.startsWith('guitare-') || fileBaseName.includes('guitare')) return 'guitare';
  if (fileBaseName.startsWith('piano-') || fileBaseName.includes('piano')) return 'piano';
  if (fileBaseName.startsWith('ukulele-') || fileBaseName.includes('ukulele') || fileBaseName.includes('ukulélé')) return 'ukulele';
  return 'general';
};
const instrument = detectInstrument();

// ---------- THÈME COULEUR PAR INSTRUMENT ----------
// On reprend les vraies vars du site (--theme-guitar, --theme-piano, --theme-ukulele)
// plus la palette image-style-guide (bois clair, ambre, miel).
const THEMES = {
  guitare: {
    primary: '#c0392b',
    primaryDark: '#922b21',
    primaryLight: '#f1948a',
    emoji: '🎸',
    instrumentLabel: 'Guitare',
  },
  piano: {
    primary: '#2980b9',
    primaryDark: '#1c5a85',
    primaryLight: '#85c1e2',
    emoji: '🎹',
    instrumentLabel: 'Piano',
  },
  ukulele: {
    primary: '#16a085',
    primaryDark: '#0e6e5b',
    primaryLight: '#7dcfbb',
    emoji: '🌺',
    instrumentLabel: 'Ukulélé',
  },
  general: {
    primary: '#7a5230',
    primaryDark: '#5a3e25',
    primaryLight: '#c6a17e',
    emoji: '🎵',
    instrumentLabel: 'Musique',
  },
};
const theme = THEMES[instrument] || THEMES.general;

// ---------- LECTURE ET PRÉ-PROCESSING DU MARKDOWN ----------
let mdContent = readFileSync(mdPath, 'utf-8');

// 1) Strip frontmatter YAML (si présent en tête du fichier)
mdContent = mdContent.replace(/^---\n[\s\S]*?\n---\n/, '');

// 2) Capture du titre H1 + sous-titre H2 AVANT le strip pour les utiliser dans la cover
const h1Match = mdContent.match(/^#\s+(.+)$/m);
const detectedTitle = h1Match ? h1Match[1].trim() : '';
const h2SubtitleMatch = mdContent.match(/^##\s+(.+)$/m); // 1er H2 après le H1
const detectedSubtitle = h2SubtitleMatch ? h2SubtitleMatch[1].trim() : '';

// 3) Le H1 et le 1er H2 sous-titre sont gérés par la cover : on les retire du contenu
mdContent = mdContent.replace(/^#\s+.+\n+/m, ''); // 1er H1
mdContent = mdContent.replace(/^##\s+.+\n+/m, ''); // 1er H2 (le sous-titre)

// 4) Conversion des blocs `:::chord <key>` en SVG inline
//    Syntaxe : :::chord em\n:::
mdContent = mdContent.replace(/^:::chord\s+([a-zA-Z0-9]+)\s*\n:::\s*$/gm, (_, key) => {
  const svg = renderChord(key, instrument === 'general' ? 'guitare' : instrument);
  return `\n<div class="chord-block">${svg}</div>\n`;
});

// 5) Variante multi-accords sur une ligne : :::chords em, g, d, c, am\n:::
mdContent = mdContent.replace(/^:::chords\s+([^\n]+)\s*\n:::\s*$/gm, (_, list) => {
  const keys = list.split(',').map(k => k.trim()).filter(Boolean);
  const svgs = keys.map(k => `<div class="chord-block chord-block--row">${renderChord(k, instrument === 'general' ? 'guitare' : instrument)}</div>`).join('');
  return `\n<div class="chord-row">${svgs}</div>\n`;
});

// 6) Titre/sous-titre finaux : CLI > détection > fallback
const title = forcedTitle || detectedTitle || fileBaseName;
const subtitle = detectedSubtitle || 'Une méthode terrain, validée sur 80 000+ élèves.';

// ---------- MARKED CONFIG ----------
marked.setOptions({
  gfm: true,
  breaks: false, // breaks dans les paragraphes = trop de retour ligne, on garde le markdown standard
});

// On laisse les balises HTML brutes pour les SVG d'accords
const htmlBody = marked.parse(mdContent);

// ---------- CSS STYLES ----------
const styles = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  font-size: 11pt;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

body {
  font-family: 'Raleway', 'Helvetica', sans-serif;
  color: #2c1810;
  background: #fefcf7;
  line-height: 1.6;
}

/* ---------- PAGE DE COUVERTURE ---------- */
.cover {
  text-align: center;
  padding: 40mm 18mm 30mm;
  page-break-after: always;
  background: linear-gradient(180deg, #fefcf7 0%, #faf4e8 100%);
  min-height: 250mm;
  position: relative;
}

.cover::before {
  content: '';
  position: absolute;
  top: 18mm;
  left: 50%;
  transform: translateX(-50%);
  width: 60mm;
  height: 4px;
  background: linear-gradient(90deg, transparent, ${theme.primary}, transparent);
  border-radius: 2px;
}

.cover-tag {
  display: inline-block;
  font-family: 'Poppins', sans-serif;
  font-size: 10pt;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${theme.primary};
  padding: 2mm 6mm;
  border: 1.5px solid ${theme.primaryLight};
  border-radius: 999px;
  margin-bottom: 18mm;
}

.cover h1 {
  font-family: 'Poppins', 'Georgia', serif;
  font-size: 38pt;
  font-weight: 800;
  line-height: 1.05;
  color: #2c1810;
  margin: 0 0 10mm;
  letter-spacing: -1px;
}

.cover h1 .accent {
  display: block;
  color: ${theme.primary};
  font-style: italic;
  font-weight: 700;
  font-size: 32pt;
  margin-top: 4mm;
}

.cover .subtitle {
  font-family: 'Raleway', sans-serif;
  font-size: 14pt;
  font-weight: 400;
  color: #5a3e25;
  max-width: 130mm;
  margin: 0 auto 6mm;
  line-height: 1.45;
  font-style: italic;
}

.cover .cover-promise {
  font-family: 'Poppins', sans-serif;
  font-size: 11pt;
  font-weight: 600;
  color: ${theme.primary};
  margin: 0 auto 18mm;
  letter-spacing: 0.02em;
}

.cover .author {
  margin-top: 35mm;
  padding-top: 8mm;
  border-top: 1px solid #d4af8b;
  display: inline-block;
}

.cover .author-name {
  font-family: 'Poppins', sans-serif;
  font-size: 14pt;
  font-weight: 700;
  color: #2c1810;
  margin-bottom: 2mm;
}

.cover .author-credits {
  font-family: 'Raleway', sans-serif;
  font-size: 9.5pt;
  color: #7a5230;
  line-height: 1.5;
  max-width: 110mm;
}

/* ---------- CONTENU GÉNÉRAL ---------- */
.content {
  padding: 0;
}

/* Marqueur explicite de page-break (injecté au preprocessing) */
.page-break {
  page-break-before: always;
  height: 0;
}

h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 22pt;
  font-weight: 800;
  color: ${theme.primary};
  margin: 0 0 6mm;
  padding-bottom: 3mm;
  border-bottom: 3px solid ${theme.primaryLight};
  page-break-after: avoid;
  line-height: 1.2;
}

h2 {
  font-family: 'Poppins', sans-serif;
  font-size: 18pt;
  font-weight: 700;
  color: ${theme.primary};
  margin: 0 0 5mm;
  padding: 0 0 3mm 0;
  border-bottom: 2px solid ${theme.primaryLight};
  page-break-after: avoid;
  line-height: 1.25;
}

/* H2 qui suivent immédiatement un .page-break : style "titre de page" */
.page-break + h2 {
  margin-top: 0;
}

h3 {
  font-family: 'Poppins', sans-serif;
  font-size: 13pt;
  font-weight: 700;
  color: ${theme.primaryDark};
  margin: 6mm 0 2.5mm;
  page-break-after: avoid;
}

h4 {
  font-family: 'Poppins', sans-serif;
  font-size: 11pt;
  font-weight: 700;
  color: #2c1810;
  margin: 4mm 0 1.5mm;
  page-break-after: avoid;
}

p {
  margin: 0 0 2.5mm;
  text-align: justify;
  hyphens: auto;
  orphans: 3;
  widows: 3;
}

p em {
  color: #7a5230;
}

strong {
  color: #2c1810;
  font-weight: 700;
}

/* ---------- LIENS ---------- */
a {
  color: ${theme.primary};
  text-decoration: none;
  border-bottom: 1px dotted ${theme.primaryLight};
}

/* ---------- LISTES ---------- */
ul, ol {
  margin: 2mm 0 3mm 6mm;
  padding-left: 4mm;
}

li {
  margin: 1mm 0;
}

li::marker {
  color: ${theme.primary};
  font-weight: 700;
}

/* ---------- ENCARTS (blockquote) ---------- */
blockquote {
  margin: 4mm 0;
  padding: 4mm 6mm 4mm 8mm;
  background: linear-gradient(135deg, ${theme.primaryLight}1a 0%, #fefcf7 100%);
  border-left: 5px solid ${theme.primary};
  border-radius: 0 8px 8px 0;
  font-style: normal;
  page-break-inside: avoid;
  position: relative;
}

blockquote::before {
  content: '';
  position: absolute;
  top: 0;
  left: -5px;
  width: 5px;
  height: 100%;
  background: ${theme.primary};
  border-radius: 5px 0 0 5px;
}

blockquote p {
  margin: 1mm 0;
  text-align: left;
}

blockquote strong {
  color: ${theme.primary};
}

/* Citation centrée (citation italic isolée) */
blockquote p:only-child {
  font-style: italic;
  font-size: 11.5pt;
  color: #5a3e25;
}

/* ---------- DIAGRAMMES D'ACCORDS ---------- */
.chord-block {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4mm auto;
  page-break-inside: avoid;
}

.chord-block svg {
  max-width: 65mm;
  height: auto;
}

.chord-row {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 4mm;
  margin: 5mm 0;
  page-break-inside: avoid;
}

.chord-row .chord-block {
  flex: 0 0 auto;
  margin: 0;
}

.chord-row .chord-block svg {
  max-width: 50mm;
}

.chord-error {
  background: #fff3cd;
  border: 1px dashed #ffc107;
  padding: 4mm;
  border-radius: 6px;
  color: #856404;
  font-style: italic;
  font-size: 9pt;
  text-align: center;
}

/* ---------- TABLEAUX ---------- */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 3mm 0 4mm;
  font-size: 10pt;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #d4af8b;
  page-break-inside: auto;
}

thead {
  background: ${theme.primary};
}

thead th {
  color: white;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  text-align: left;
  padding: 2.5mm 3mm;
  font-size: 10pt;
  border: none;
}

tbody tr {
  page-break-inside: avoid;
}

tbody tr:nth-child(odd) { background: #fefcf7; }
tbody tr:nth-child(even) { background: #faf4e8; }

tbody td {
  padding: 2mm 3mm;
  border-top: 1px solid #e8dcc8;
  vertical-align: top;
}

/* ---------- HR ---------- */
hr {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, ${theme.primaryLight}, transparent);
  margin: 8mm 0;
  border-radius: 2px;
}

/* ---------- CODE INLINE ---------- */
code {
  font-family: 'Menlo', 'Consolas', monospace;
  background: ${theme.primaryLight}30;
  padding: 0.5mm 2mm;
  border-radius: 3px;
  font-size: 9.5pt;
  color: ${theme.primaryDark};
}

pre {
  background: #faf4e8;
  border: 1px solid #d4af8b;
  border-radius: 8px;
  padding: 4mm 5mm;
  font-family: 'Menlo', 'Consolas', monospace;
  font-size: 9pt;
  margin: 3mm 0;
  page-break-inside: avoid;
  overflow-x: hidden;
}

pre code {
  background: transparent;
  padding: 0;
  color: inherit;
}

/* ---------- IMAGES ---------- */
img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 3mm auto;
  display: block;
}

/* ---------- PAGE LAYOUT ---------- */
@page {
  size: A4;
  margin: 22mm 18mm 25mm 18mm;
}

@media print {
  body { background: #fefcf7; }
  .cover { background: linear-gradient(180deg, #fefcf7 0%, #faf4e8 100%); }
}
`;

// ---------- LOGO ----------
let logoSrc = '';
const logoCandidates = [
  join(PROJECT_ROOT, 'public/logo.webp'),
  join(PROJECT_ROOT, 'public/logo.png'),
];
for (const candidate of logoCandidates) {
  if (existsSync(candidate)) {
    const ext = extname(candidate).slice(1);
    const mime = ext === 'webp' ? 'image/webp' : 'image/png';
    const buf = readFileSync(candidate);
    logoSrc = `data:${mime};base64,${buf.toString('base64')}`;
    break;
  }
}

// ---------- FULL HTML ----------
const fullHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&family=Raleway:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
<style>${styles}</style>
</head>
<body>

<div class="cover">
  <div class="cover-tag">${theme.emoji} Guide gratuit · ${theme.instrumentLabel}</div>
  <h1>${escapeHtml(title)}</h1>
  <div class="subtitle">${escapeHtml(subtitle)}</div>
  <div class="cover-promise">Pas de solfège. Pas de théorie. Tu joues, c'est tout.</div>

  <div class="author">
    <div class="author-name">Fred Fieffé · Musique Facile</div>
    <div class="author-credits">
      12 ans d'enseignement · Auteur publié chez Hal Leonard<br/>
      Lauréat du Prix Samuel Paty 2024 pour la pédagogie musicale
    </div>
  </div>
</div>

<div class="content">
${htmlBody}
</div>

</body>
</html>`;

// ---------- GÉNÉRATION PDF ----------
const outputDir = forcedOut ? dirname(forcedOut) : join(PROJECT_ROOT, 'public', 'lead-magnets');
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
const outputPath = forcedOut || join(outputDir, `${fileBaseName}.pdf`);

console.log(`📝 Lecture     : ${mdPath}`);
console.log(`🎨 Instrument  : ${instrument} (${theme.emoji})`);
console.log(`📄 Titre       : ${title}`);
console.log(`📤 Sortie      : ${outputPath}`);

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
});

const page = await browser.newPage();
const tmpHtmlPath = join(tmpdir(), `lead-magnet-${process.pid}-${Date.now()}.html`);
writeFileSync(tmpHtmlPath, fullHtml, 'utf-8');

await page.goto(`file://${tmpHtmlPath}`, { waitUntil: 'networkidle2', timeout: 60000 });
try { await page.evaluateHandle('document.fonts.ready'); } catch { /* fonts may not load offline */ }

try { unlinkSync(tmpHtmlPath); } catch { /* ignore */ }

const headerHtml = `
<div style="width:100%; font-family:Poppins,sans-serif; font-size:8pt; color:${theme.primaryDark}; display:flex; justify-content:space-between; align-items:center; padding:0 18mm; box-sizing:border-box;">
  <span style="font-weight:700; color:${theme.primary};">${theme.emoji} ${escapeHtml(title)}</span>
  <span style="opacity:0.6;">Musique Facile</span>
</div>`;

const footerHtml = `
<div style="width:100%; font-family:Raleway,sans-serif; font-size:7.5pt; color:#7a5230; display:flex; justify-content:space-between; align-items:center; padding:0 18mm; box-sizing:border-box;">
  <span>© Musique Facile · musique-facile.fr</span>
  <span style="color:${theme.primary}; font-weight:600;"><span class="pageNumber"></span> / <span class="totalPages"></span></span>
  <span style="opacity:0.7;">Fred Fieffé</span>
</div>`;

await page.pdf({
  path: outputPath,
  format: 'A4',
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: headerHtml,
  footerTemplate: footerHtml,
  margin: {
    top: '22mm',
    bottom: '22mm',
    left: '18mm',
    right: '18mm',
  },
  preferCSSPageSize: false,
  timeout: 60000,
});

await browser.close();

console.log(`\n✅ PDF généré avec succès : ${outputPath}`);

// ---------- HELPERS ----------
function escapeHtml(text) {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
