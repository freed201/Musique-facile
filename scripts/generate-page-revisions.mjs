#!/usr/bin/env node
/**
 * Génère src/data/page-revisions.json : la date du dernier commit ayant touché
 * chaque page statique, pour alimenter le <lastmod> du sitemap.
 *
 * POURQUOI UN FICHIER GÉNÉRÉ ET COMMITÉ
 * Le sitemap est prérendu au build. Interroger git depuis Vercel n'est pas
 * fiable : la plateforme clone en profondeur limitée, et `git log` peut donc
 * renvoyer une date fausse ou rien du tout. On calcule ici, en local, où
 * l'historique est complet, et on versionne le résultat.
 *
 * Les pages qui n'ont PAS d'entrée dans ce fichier sortent du sitemap sans
 * <lastmod>. C'est volontaire : une date absente vaut mieux qu'une date fausse,
 * que Google apprend vite à ignorer.
 *
 * Usage : npm run seo:revisions   (à relancer après avoir modifié une page)
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

/** URL du sitemap → fichier source dont la date fait foi. */
const PAGES = {
  '/': 'src/pages/index.astro',
  '/a-propos/': 'src/pages/a-propos.astro',
  '/auteur/fred-fieffe/': 'src/pages/auteur/fred-fieffe.astro',
  '/blog/': 'src/pages/blog/index.astro',
  '/cours/': 'src/pages/cours/index.astro',
  '/cours/cours-de-guitare/': 'src/pages/cours/cours-de-guitare.astro',
  '/cours/cours-de-piano/': 'src/pages/cours/cours-de-piano.astro',
  '/cours/cours-de-ukulele/': 'src/pages/cours/cours-de-ukulele.astro',
  '/cours/cours-de-solfege/': 'src/pages/cours/cours-de-solfege.astro',
  '/ressources-gratuites/': 'src/pages/ressources-gratuites/index.astro',
  '/ressources-gratuites/guitare/': 'src/pages/ressources-gratuites/guitare.astro',
  '/ressources-gratuites/piano/': 'src/pages/ressources-gratuites/piano.astro',
  '/ressources-gratuites/ukulele/': 'src/pages/ressources-gratuites/ukulele.astro',
  '/livres/': 'src/pages/livres/index.astro',
  '/contact/': 'src/pages/contact.astro',
  '/offre/': 'src/pages/offre.astro',
  '/faq/': 'src/pages/faq.astro',
  '/plan-du-site/': 'src/pages/plan-du-site.astro',
  '/stage2026/': 'src/pages/stage2026.astro',
  '/5-accords-magiques/': 'src/pages/5-accords-magiques.astro',
  '/quel-instrument-choisir/': 'src/pages/quel-instrument-choisir.astro',
  '/outils/quel-accord-apprendre/': 'src/pages/outils/quel-accord-apprendre.astro',
  '/liens/': 'src/pages/liens.astro',
  '/mentions-legales-cgv/': 'src/pages/mentions-legales-cgv.astro',
  '/politique-confidentialite/': 'src/pages/politique-confidentialite.astro',
};
/**
 * Date du dernier commit ayant touché ce fichier.
 *
 * On s'en tient AU FICHIER DE LA PAGE, sans remonter à ses imports. Un premier
 * essai élargissait aux composants importés — mais Header, FooterModern et
 * Layout sont partagés par toutes les pages : la moindre retouche du menu datait
 * les 24 pages du même jour, soit exactement le défaut qu'on corrige ici.
 *
 * Conséquence assumée : modifier un composant sans toucher la page ne change pas
 * son <lastmod>. Un signal prudent vaut mieux qu'un signal généreux et faux.
 */
function lastCommitISO(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      encoding: 'utf8',
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

const revisions = {};
let missing = 0;
for (const [url, file] of Object.entries(PAGES)) {
  const date = lastCommitISO(file);
  if (!date) {
    missing += 1;
    console.warn(`  ⚠ aucune date git pour ${file} — la page sortira sans <lastmod>`);
    continue;
  }
  revisions[url] = date;
}

const payload = {
  _comment:
    'Généré par scripts/generate-page-revisions.mjs — ne pas éditer à la main. Relancer npm run seo:revisions après avoir modifié une page statique.',
  _generatedFrom: 'git log -1 --format=%cI sur le fichier de la page',
  revisions,
};

writeFileSync('src/data/page-revisions.json', `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(
  `✓ src/data/page-revisions.json — ${Object.keys(revisions).length} pages datées` +
    (missing ? `, ${missing} sans date` : ''),
);
