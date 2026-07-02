# Captures & artefacts d'audit — Musique Facile

Les artefacts produits pendant les audits et vérifications (captures d'écran Playwright, rapports GEO/SEO, exports) ne sont **jamais déposés à la racine du repo** (51 PNG y ont traîné avant d'être archivés en juillet 2026).

## Emplacements

- **Captures d'écran** : `seo-audit/captures/` — nommage daté et descriptif : `AAAA-MM-JJ-<sujet>-<source>.png` (ex. `2026-07-02-ukulele-debutant-perplexity.png`).
- **Rapports d'audit** (GEO, SEO, campagnes) : `seo-audit/rapports/AAAA-MM-JJ-<slug>.md`.
- **Fichiers temporaires de travail** (scripts jetables, données intermédiaires) : le scratchpad de session, pas le repo.

Le dossier `seo-audit/` est **gitignoré** : archives locales de Fred, hors versionnage — ne jamais les `git add -f`.

## Ce qui reste dans le repo

Seuls les artefacts durables et versionnables : contenu (`src/content/`), images du site (`public/images/`), docs (`docs/`). Une capture qui illustre un article de blog n'est pas un artefact d'audit : elle va dans `public/images/blog/` en WebP.
