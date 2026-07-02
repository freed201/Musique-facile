---
name: nouvel-article
description: Rédige et prépare un nouvel article de blog Musique Facile (frontmatter conforme, silo SEO, capture email). À lancer quand l'utilisateur dit « nouvel article », « rédige un article de blog », « crée un article sur … », « écris un tuto … », « ajoute un article au blog », ou via /nouvel-article. Encode les invariants de frontmatter et le silo, puis délègue le contrôle final à /preflight-publication.
---

# Nouvel article de blog — Musique Facile

Flux d'authoring d'un article (`src/content/blog/*.md`). Le schéma Zod fait foi : `src/content/config.ts` (collection `blog`) — le lire, ne pas le recopier. Règles de fond : `.claude/rules/contenu-credibilite.md`. Le blog est organisé en **silos** et **déjà saturé en capture email** (CLAUDE.md).

## Workflow

1. **Cadrer.** Instrument (`guitare|piano|ukulele|solfege`), intention de recherche, et silo : l'article est-il un pilier (`pillar: true`) ou rattaché à un pilier (`siloSlug: <slug-pilier>`) ? Repérer le pilier via `grep -l "pillar: true" src/content/blog/`.
2. **Créer** `src/content/blog/<slug>.md` (le `<slug>` = URL finale). Frontmatter conforme à `config.ts` :
   - obligatoire : `title`, `description` (meta SEO), `datePublished` (YYYY-MM-DD), `prod`.
   - publication : garder **`prod: "N"`** tant que c'est un brouillon. Un article n'est public que si `prod: "Y"` **ET** `datePublished ≤ aujourd'hui`.
   - silo : `pillar` / `siloSlug` cohérents avec l'étape 1.
   - capture : `leadMagnet` selon l'instrument (mapping listes Brevo, cf. `/api/subscribe`). Ne poser `hideInlineOptIn` / `hideBuyingGuide` que si justifié.
   - GEO optionnel : `faqs[]`, `products[]` (guides d'achat → ProductListSchema), `videos[]`.
3. **Rédiger** en *answer-first* (réponse directe en tête de section), chunks auto-suffisants, chiffres sourçables uniquement (4,7/5 sur 929 avis ; Fred = 15 ans d'enseignement, 80 000+ élèves). **Aucune** mention « essai gratuit », fausse rareté, ni fausse étude (le hook `check-content-laws.sh` bloque/avertit).
4. **Médias.**
   - Images : les placer dans `public/images/blog/`, puis `npm run optimize-images` (JPG/PNG → WebP, idempotent) et référencer les `.webp` avec un `alt` descriptif.
   - Article-morceau ou tuto d'accords : utiliser les diagrammes SVG de `public/images/blog/accords-<instrument>/` (indexables Google Images + lisibles LLM). Si un accord manque, l'ajouter aux `JOBS` de `scripts/generate-chord-svgs.mjs` (catalogue partagé avec les PDF, positions déjà validées par Fred) puis `npm run chords:generate`.
5. **NE PAS ajouter de capture email en fin d'article** : `InlineOptIn` est injecté automatiquement (~65 % du contenu) par `blog/[slug].astro`, et `BuyingGuideCard` après le 1er H2. En rajouter = doublon.
6. **Ne pas toucher** au sitemap ni aux index instrument : `sitemap.xml.ts` et `blog/{instrument}.astro` se régénèrent via `getCollection` au build.
7. **Contrôle pré-vol.** Lancer **/preflight-publication** (build Zod + crédibilité DGCCRF + invariants frontmatter + secrets) avant tout commit.
8. **Commit & PR.** Travailler sur une branche dédiée, jamais sur `master` (le hook `check-protect-master.sh` bloque). Ouvrir une PR pour validation.

## Output

- Chemin du fichier créé + récap du frontmatter clé (`prod`, `datePublished`, `pillar`/`siloSlug`, `leadMagnet`).
- Position dans le silo (pilier ↔ articles liés).
- Verdict /preflight-publication (GO / NO-GO).
- Rappel : **tout nouvel article reste un BROUILLON à valider par Fred** avant passage en `prod: "Y"`.
