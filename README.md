# musique-facile.fr

Site pedagogique de cours de musique en ligne (guitare, piano, ukulele, solfege). Blog d'articles, fiches de cours, programmes detailles, ressources gratuites et livres.

## Stack

- **Framework** : Astro 4.15 (SSG, output statique)
- **TypeScript** : partiel (schemas Zod pour les content collections, interfaces manuelles dans les composants)
- **CSS** : CSS pur (global.css + styles inline par composant). Pas de Tailwind
- **Fonts** : @fontsource/poppins, @fontsource/raleway (locales)
- **Images** : sharp via astro-compress, images dans public/images/
- **Markdown** : pipeline remark natif Astro + 3 plugins custom (custom-blocks, lazy-images, optimize-images)

## Prerequis

- Node.js 22.x
- npm

## Commandes

```bash
npm install          # Installer les dependances
npm run dev          # Serveur de dev local (localhost:4321)
npm run build        # Build de production (sortie dans dist/)
npm run preview      # Preview du build local
```

## Structure du repo

```
src/
  content/
    blog/           # 98 articles markdown
    courses/        # 18 fiches cours (frontmatter YAML riche)
    programmes/     # 18 programmes detailles
    ressources/     # 7 ressources gratuites
    livres/         # 5 fiches livres
    config.ts       # Schemas Zod pour toutes les collections
  components/       # Composants Astro (~40+)
  layouts/          # 4 layouts (Layout, ArticleLayout, CourseLayout, ProgrammeLayout)
  pages/            # Routing file-based Astro
    blog/[slug].astro     # Template articles
    cours/[slug].astro    # Template cours
  styles/           # CSS globaux
  remark-*.mjs      # Plugins remark custom
public/
  images/           # Images statiques (blog, cours, icons, etc.)
  robots.txt        # Directives crawl (inclut bots IA)
  fonts/            # Fonts woff2
```

## Format des articles

Les articles sont des fichiers `.md` dans `src/content/blog/`. Le schema complet est dans `src/content/config.ts` (collection `blog`).

Front-matter minimal pour un nouvel article :

```yaml
---
title: "Titre de l'article"
description: "Description courte pour le SEO"
author: "Fred Fieffe"
ogImage: "/images/blog/nom-image.webp"
datePublished: "2026-05-01"
dateModified: "2026-05-01"
prod: "Y"
instrument: "guitare"
level: "debutant"
tags: ["tag1", "tag2"]
---
```

Le slug est derive du nom de fichier (ex: `mon-article.md` produit `/blog/mon-article/`).

Champs optionnels recommandes : `meta`, `keywords`, `category`, `siloSlug`, `pillar`, `introduction`, `conclusion`, `faqs`, `videos`. Voir `config.ts` pour la liste exhaustive.

## Deploiement

Migration vers Vercel en cours. Configuration dans `vercel.json`. Checklist de deploiement dans `docs/vercel-checklist.md`.

## Dette technique connue

- **astro-compress** : compression post-build (HTML, CSS, JS, images) redondante avec le gzip/brotli automatique de Vercel. A envisager de retirer une fois le site stable sur Vercel, pour reduire le temps de build (~15s de compression en moins)
- **PUBLIC_SITE_URL** : documentee dans .env.example mais non utilisee dans le code. Le domaine est en dur dans le sitemap et les layouts. A cabler quand on refactorisera le sitemap
- **Redirections WordPress** : anciennes URLs non redirigees, a ajouter dans vercel.json apres audit GSC

## Variables d'environnement

Copier `.env.example` en `.env`. Variables principales :

- `PUBLIC_GTM_ID` : ID Google Tag Manager (defaut: GTM-NP758HSC)
- `PUBLIC_SITE_URL` : URL du site (defaut: https://musique-facile.fr)
