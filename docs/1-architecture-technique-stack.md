# Architecture technique & stack

Meta
Version : v1.0
Last updated : 2026-01-19
Perimetre : stack, pipeline de build, dependances clés, hebergement, chaines Markdown/images.
Audience : dev / ops / SEO
Liens : ./2-structure-projet-conventions.md, ./3-workflow-publication-automatisation.md, ./5-optimisation-images-performances.md, ./7-maintenance-monitoring-runbook.md, ./8-seo-technique-structured-data.md

## Vue d'ensemble
Le site est un build statique Astro. Le contenu (Markdown + pages Astro) est compile via Vite, optimise (Terser, images, remark) et publie en statique. Le deploiement cible Netlify, avec headers et redirects definis via `netlify.toml`, `public/_headers` et `public/_redirects`.

```mermaid
flowchart LR
  A[Markdown + Astro pages] --> B[Astro build]
  B --> C[Vite + Terser]
  C --> D[Static output: /dist]
  D --> E[Netlify CDN]
  E --> F[Headers/redirects]

  A --> G[Remark plugins]
  G --> B
  A --> H[Astro assets (Sharp)]
  H --> B
```

## Existant dans ce repo (as-is)
- Framework : Astro avec output statique et config image (Sharp, formats webp/avif). `astro.config.mjs`
- Build : Vite configure dans `astro.config.mjs` (minify Terser, manualChunks, cache busting).
- Markdown : pipeline remark custom. `src/remark-custom-blocks.mjs`, `src/remark-optimize-images.mjs`, `src/remark-lazy-images.mjs`
- Images : composant `OptimizedImage` (Astro assets) + script de conversion WebP. `src/components/OptimizedImage.astro`, `scripts/convert-to-webp.js`
- SEO / Schema : JSON-LD dans layouts et pages. `src/layouts/*.astro`, `src/pages/**/*.astro`
- Deploy Netlify : headers + redirects. `netlify.toml`, `public/_headers`, `public/_redirects`, `_redirects`

### Dependances principales (package.json)
| Package | Role | Preuve |
| --- | --- | --- |
| astro | SSG / framework | `package.json`, `astro.config.mjs` |
| @fontsource/poppins / @fontsource/raleway | Fonts locales | `package.json`, `src/layouts/*.astro` |
| unified / remark-parse / remark-rehype / rehype-stringify | Markdown -> HTML | `package.json`, `src/remark-custom-blocks.mjs` |
| sharp | Image pipeline Astro + script WebP | `package.json`, `astro.config.mjs`, `scripts/convert-to-webp.js` |
| terser | Minification | `package.json`, `astro.config.mjs` |
| typescript / @types/node | TS pour scripts | `package.json`, `tsconfig.sitemap.json` |

### Scripts npm (package.json)
| Script | Commande | Effet |
| --- | --- | --- |
| dev | `astro dev` | Dev server |
| build | `astro build` | Build statique |
| preview | `astro preview` | Preview build |
| generate-sitemap | `tsc -p tsconfig.sitemap.json && node dist/scripts/generate-sitemap.js` | Genere `public/sitemap.xml` |
| optimize-images | `node scripts/convert-to-webp.js` | Convertit JPG/PNG en WebP |
| build:prod | `astro build && npm run analyze:bundle` | Build + analyse taille |
| analyze:bundle | `du -sh dist ...` | Liste tailles JS |

### Fichiers de reference
- `astro.config.mjs`
- `package.json`
- `tsconfig.json`
- `tsconfig.sitemap.json`
- `src/remark-custom-blocks.mjs`
- `src/remark-optimize-images.mjs`
- `src/remark-lazy-images.mjs`
- `src/components/OptimizedImage.astro`
- `scripts/convert-to-webp.js`
- `netlify.toml`
- `public/_headers`
- `public/_redirects`

## Comment ca marche
- Astro compile `src/pages` en routes statiques. Les collections de contenu sont lues via `astro:content` (`getCollection`).
- Vite build est configure pour minifier avec Terser, separer le vendor, et ajouter des hashes aux assets pour le cache.
- Le Markdown passe par des plugins remark :
  - `remark-custom-blocks` injecte des blocs HTML via `:::`.
  - `remark-optimize-images` ajoute width/height + alt text.
  - `remark-lazy-images` gère le lazy/eager et `fetchpriority`.
- Les images locales passent par Astro assets (Sharp). Les images du contenu peuvent aussi etre converties via `scripts/convert-to-webp.js`.
- Netlify applique les headers et redirects depuis `netlify.toml` et `public/_headers` / `public/_redirects`.

## Ou toucher dans le code
- Stack & build : `astro.config.mjs`, `package.json`
- Content collections : `src/content/config.ts` (schema), `src/content/*` (data)
- Pages / routes : `src/pages/**`
- Layouts HTML & SEO : `src/layouts/*.astro`
- Images : `src/components/OptimizedImage.astro`, `public/images/*`
- Netlify : `netlify.toml`, `public/_headers`, `public/_redirects`, `_redirects`

## Conventions & regles a respecter
- Output statique : pas de routes serveur requises (pas d'API dans `src/pages/api`).
- Garder les chemins d'images locales sous `public/` pour que `remark-optimize-images` puisse lire les dimensions.
- Maintenir les options Vite (hashing + manualChunks) pour ne pas casser le cache CDN.
- Ne pas dupliquer la source de verite des headers: `netlify.toml` vs `public/_headers` (documenter quel fichier est utilise en prod).

## Antipatterns / pieges
- Ajouter des collections `astro:content` sans schema (risque de build). Exemple: `getCollection('ressources')` est utilise mais pas declare dans `src/content/config.ts`.
- Garder a la fois `public/sitemap.xml` et `src/pages/sitemap.xml.ts` sans clarifier la priorite.
- Placer des images hors `public/` sans passer par `OptimizedImage`.

## Checklist de validation
- Build local : `npm run build` (ou `astro build`) sans erreur.
- Inspecter `dist/` pour assets hashes et CSS inline si possible.
- Verifier presence des headers (Netlify) et redirects.
- Verifier sitemap/robots en sortie de build.

## TODO / Recommandations
- Clarifier la source officielle de headers (Netlify vs `public/_headers`).
- Clarifier la source de sitemap (route Astro vs fichier statique).
- Aligner les collections declarees (`src/content/config.ts`) avec les collections utilisees (`ressources`, `programmes`).

## Voir aussi
- ./2-structure-projet-conventions.md
- ./3-workflow-publication-automatisation.md
- ./5-optimisation-images-performances.md
- ./8-seo-technique-structured-data.md
- ./9-workflows-checklists-operationnels.md
