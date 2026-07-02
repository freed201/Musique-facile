# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Langue

Le site, le contenu et la communication sont **en français**. Réponds en français. Conserve les accents et caractères spéciaux corrects partout (contenu, commits, commentaires).

## Présentation

`musique-facile.fr` — site pédagogique de cours de musique en ligne (guitare, piano, ukulélé, solfège) construit avec **Astro 4** en `output: 'hybrid'` (pages statiques + quelques endpoints SSR), déployé sur **Vercel**. Trois piliers de contenu : formations vidéo (`courses`), blog éducatif SEO (`blog`), e-books/guides (`livres`). Pas de framework UI (pas de React/Vue), pas de Tailwind : Astro + CSS pur piloté par tokens.

## Commandes

```bash
npm run dev                  # Serveur de dev → http://localhost:4321
npm run build                # Build prod (dist/) PUIS patch-vercel-runtime.mjs (voir Gotchas)
npm run preview              # Sert le build local
npm run optimize-images      # JPG/PNG → WebP récursif dans public/images (sharp, idempotent)
npm run lead-magnet:build-all # Régénère les 3 PDF lead magnets depuis content/lead-magnets/*.md
npm run analyze:bundle       # Taille du bundle + top 10 des plus gros JS
npm run blog:analyze         # Diagnostic visibilité des articles blog → seo-audit/BLOG-ARTICLES-ANALYSIS.json
npm run chords:generate      # Régénère les diagrammes d'accords SVG (public/images/blog/accords-*)
```

Node ≥ 20 requis (`package.json`). Il n'y a **ni linter, ni suite de tests** dans ce repo — la validation se fait via `npm run build` (le build échoue si un schéma Zod de content collection est violé) et via revue manuelle / audits (voir `seo-audit/`, agents).

## Garde-fous automatiques (à connaître AVANT d'éditer)

Cinq hooks `PreToolUse` enregistrés dans `.claude/settings.json`. Trois **bloquent** (exit 2) — ce ne sont pas des suggestions :

- **`.claude/hooks/check-content-laws.sh`** (matcher `Write|Edit`, scope `src/content/**` + `src/pages/**`, ignore `.claude/` et `CLAUDE.md`) : refuse toute écriture contenant **« essai gratuit »** ou **« 2847 »**. Ce sont des règles légales/factuelles, pas stylistiques — voir ci-dessous.
- **`.claude/hooks/check-no-secrets.sh`** (matcher `Bash`) : bloque `git commit`/`git add` qui exposeraient une clé Brevo (`xkeysib-…`), une affectation `BREVO_API_KEY=…`, ou un fichier `.env`.
- **`.claude/hooks/check-protect-master.sh`** (matcher `Bash`) : bloque `git commit`/`git push` directs sur `master` (= prod Vercel) — toujours passer par une branche + PR.

Deux **avertissent** sans bloquer (exit 0) : `check-csp-sync.sh` (édition de `vercel.json`/`src/utils/security.ts` — rappel de la source de vérité CSP) et `check-img-alt.sh` (`<img>` sans attribut `alt`).

### Lois de crédibilité du contenu (DGCCRF) — non négociables

Source : **`.claude/rules/contenu-credibilite.md`**. Le contenu public engage la responsabilité légale. Tout nouveau contenu reste un **BROUILLON à valider par Fred**.

- **Chiffres officiels figés** : avis = **4,7/5 sur 929 avis** (jamais 2847). Fred Fieffé = **musicien 40+ ans**, **15 ans d'enseignement** (pas 20, pas 35), **80 000+ élèves**. Aucune statistique « décorative » inventée — tout doit être sourçable.
- **Modèle commercial** : paiement unique, accès à vie, **garantie 15 jours remboursé**. Il n'y a **PAS d'essai gratuit** — ne jamais écrire cette mention.
- **Interdits DGCCRF** : fausse rareté / fausse urgence (compteurs, « plus que X places » — les composants `UrgencyBanner`/`FOMONotifications` ont été supprimés, ne pas les recréer) ; fausses études/citations non vérifiables (« étude MIT/Stanford… »).

## Architecture

### Content collections (`src/content/`)

`src/content/config.ts` définit le schéma Zod de **3 collections** seulement : `courses`, `livres`, `blog`. Ces schémas sont riches et **structurants** — modifier le frontmatter d'un `.md` sans respecter le schéma fait échouer le build.

- **`courses`** (18 fiches) : frontmatter très dense décrivant toute la page formation — `hero` (vidéo Vimeo, stats, CTA prix), `timeline[]` (étapes de progression → schema HowTo), `teachers`, `preuveSociale` (testimonials/stats → schema Review), `pricing`, `courseIncludes`, `faq` (→ schema FAQPage), `theme` (`guitar|piano|ukulele|solfege`), `affichage`/`classement`/`bestSeller`.
- **`blog`** (~100 articles) : SEO avancé en **silos** — `pillar` (booléen) + `siloSlug` (référence à l'article pilier). Champs CRO (`leadMagnet`, `hideInlineOptIn`, `hideBuyingGuide`), `products[]` (guides d'achat → schema Product/ItemList), `faqs[]`, `videos[]`, `podcast`, navigation multi-page (`multi`/`prev`/`next`/`number`). Publication filtrée : un article n'apparaît que si `prod: "Y"` **et** `datePublished ≤ aujourd'hui`.
- **`livres`** (5) : e-books (→ schema Book).

⚠️ **Collections « lâches »** : `src/content/programmes/` (18) et `src/content/ressources/` (7) sont chargées via `getCollection('programmes')` / `getCollection('ressources')` mais **n'ont aucun schéma Zod** dans `config.ts`. Astro les tolère sans validation — sois prudent avec leur frontmatter (aucun filet de sécurité au build).

### Pages & routing (`src/pages/`)

Routing file-based Astro. Routes dynamiques principales (toutes via `getStaticPaths` + `getCollection`) :
- `cours/[slug].astro` → `courses` (layout `CourseLayout`, génère 4 schemas : Review, HowTo, FAQPage, Offer)
- `blog/[slug].astro` → `blog` (layout `ArticleLayout` ; injecte `BuyingGuideCard`, `InlineOptIn`, `RelatedArticles`, schemas Breadcrumb/Product/FAQ)
- `livres/[slug].astro`, `ressources/[slug].astro`, `guides/[slug].astro`, `cours/programme/[slug].astro`

Index filtrés par instrument : `blog/{guitare,piano,solfege,ukulele}.astro`, `ressources-gratuites/{guitare,piano,ukulele}.astro`. `sitemap.xml.ts` génère le sitemap. Le reste est un ensemble de landing pages statiques.

**SSR vs statique** : le site est `output: 'hybrid'` → tout est statique **sauf** les endpoints `src/pages/api/*.ts`, qui portent `export const prerender = false` et deviennent des Vercel Functions.

### Layouts (`src/layouts/`)

Tous wrappent `Header` → `<slot/>` → `FooterModern` et incluent `ConsentManager`. Spécialisés : `Layout` (générique), `CourseLayout` (enrichit titre/description SEO avec stats + profs, schema Course), `ArticleLayout` (enrichit pour articles-morceau : accords/tempo/difficulté, gère `AutoFAQ`), `ProgrammeLayout`.

### Composants (`src/components/`, ~66)

Regroupés par fonction — les familles structurantes :
- **SEO / Schema.org** : `BreadcrumbsSchema`, `FAQSchema`, `ProductListSchema`, `AuthorBio` (E-E-A-T), `JsonLD`.
- **Capture email / CRO** : `blog/InlineOptIn` (opt-in contextuel ~65 % de l'article, POST `/api/subscribe`), `LeadCaptureForm` / `EmailCaptureForm` (hero lead magnet), `StickyCTAMobile` (CTA sticky mobile), `blog/BuyingGuideCard`, `blog/ArticleCTA`, `StageInscriptionForm` (POST `/api/stage-inscription`). **Le blog est déjà saturé en capture** — ne pas ajouter de formulaire en fin d'article (doublon avec `InlineOptIn`).
- **Consentement** : `ConsentManager` (tarteaucitron.js, charge GTM **uniquement après consentement**).

### Endpoints API (`src/pages/api/`)

Tous en SSR (`prerender = false`), intégration **Brevo** par `fetch` direct sur l'API v3 (pas de SDK), authent header `api-key`. Fichiers `_`-préfixés = modules partagés (pas des routes).
- `subscribe.ts` (POST) : opt-in + envoi email J0 du lead magnet PDF. Mapping instrument → liste Brevo (`BREVO_LIST_GUITARE/PIANO/UKULELE`, fallback `BREVO_LIST_GENERAL`). Templates J0 dans `_lead-magnet-emails.ts`.
- `contact.ts` (POST) : contact `/liens` → Brevo + notification à Fred (reply-to du visiteur).
- `stage-inscription.ts` (POST) : stage ukulélé 2026 → liste **isolée** `BREVO_LIST_STAGE_2026` (RGPD) + 2 emails (notif Fred + confirmation prospect).
- `_rate-limit.ts` : **rate-limiting en mémoire, fenêtre fixe par IP** (`getClientIp` via `x-forwarded-for`). Limites : subscribe 6/60 s, contact & stage 4/60 s. ⚠️ State **réinitialisé à chaque cold start Vercel** et non partagé entre instances → best-effort (à migrer vers un store type Upstash/KV pour du durable).

### Utils partagés (`src/utils/`)

`security.ts` (en-têtes CSP/HSTS/etc.) appliqués via `middleware/security.ts` (`onRequest`) ; `videoSchema.ts` / `podcastSchema.ts` (génération JSON-LD). Note : les en-têtes de sécurité sont définis **à deux endroits** — `vercel.json` (au déploiement) et le middleware Astro — garder les deux cohérents.

### Markdown : plugins remark custom (`src/remark-*.mjs`)

Branchés dans `astro.config.mjs > markdown.remarkPlugins` :
- `remark-custom-blocks.mjs` : blocs `::: info|tip|warning|section-colored {…}` → `<div class="…-box">`.
- `remark-optimize-images.mjs` : lit les dimensions réelles (anti-CLS), force `loading="lazy"`, enrichit les `alt` faibles (accessibilité + citabilité LLM).
- `remark-lazy-images.mjs` : 1re image en `eager`/`fetchpriority=high` (LCP), les suivantes en `lazy`.

### Styles & thèmes (`src/styles/`)

CSS **piloté par tokens**, mobile-first, aucune couleur/espacement en dur. `design-tokens.css` définit toute l'échelle (couleurs, typo Poppins/Inter, espacements 4/8 px, radius, ombres, z-index, dark mode via `prefers-color-scheme` + `[data-theme="dark"]`, `prefers-reduced-motion`). **Thématisation par instrument** : les classes `.theme-guitar` (vert), `.theme-piano` (bleu), `.theme-ukulele` (ambre), `.theme-solfege` (rouge) réaffectent `--theme-current` ; le défaut (root) est le violet de marque `#6C3FA0`.

## Déploiement (Vercel) & Gotchas

- **`scripts/patch-vercel-runtime.mjs` (postbuild, essentiel)** : l'adapter `@astrojs/vercel` v7 fige les functions sur `nodejs18.x` (EOL) ; ce patch réécrit les `.vc-config.json` en `nodejs20.x`. Il tourne automatiquement après `npm run build` — ne pas le retirer ni builder sans lui pour la prod.
- **Vercel ignore `public/_redirects` et `public/_headers`** (format Netlify). Les redirections vivent dans `astro.config.mjs > redirects` (chemins **internes**, traduits en 301 par l'adapter) et dans `vercel.json > redirects` (domaines satellites + destinations **externes**, qui ne marchent pas dans la config Astro). Les en-têtes (CSP, cache, sécurité) sont dans `vercel.json > headers`.
- **Pas de rollupOptions custom** dans `astro.config.mjs` : un chunking `manualChunks: 'vendor'` cassait le bundle SSR Vercel (`ERR_MODULE_NOT_FOUND` au runtime). Laisser Vite gérer le chunking.
- **Variables d'environnement** : copier `.env.example` → `.env`. Clés requises en prod : `BREVO_API_KEY`, `BREVO_LIST_GENERAL`, `BREVO_LIST_STAGE_2026`, `PUBLIC_GTM_ID`, `PUBLIC_SITE_URL` (cette dernière documentée mais le domaine reste en dur dans plusieurs endroits — dette connue).

## Documentation de référence

- `docs/` : référentiel numéroté `1-…` à `10 - …` (architecture, conventions, workflow publication, SEO/GEO, images, funnel CRO, runbook, structured data, checklists, best practices — ⚠️ partiellement obsolète, décrit Netlify/ActiveCampaign, voir bandeaux en tête) + `vercel-checklist.md`, `BREVO_SETUP.md`, `EMAIL_SEQUENCES.md` (à jour).
- `CHANGELOG_DEV.md` : historique des refontes (palette violet, emojis → SVG inline, animations, layouts cours « decision-first »).
- `content/lead-magnets/` (racine, ≠ `src/content/`) : sources markdown des PDF lead magnets (syntaxe custom `:::chord`/`:::chords` pour les diagrammes d'accords, rendues par `scripts/lead-magnet-to-pdf.mjs` via Puppeteer).

## Agents & skills du projet

Agents (`.claude/agents/`) :
- **`geo-auditor`** : audite une URL publiée pour sa citabilité LLM (ChatGPT/Claude/Perplexity/Gemini) et sa visibilité Google ; utilise Playwright si dispo. Captures dans `seo-audit/captures/`, jamais à la racine.
- **`web-dev-lead`** : pilote le dev Astro/CRO (planification, changelog, perf) ; mémoire persistante dans `.claude/agent-memory/web-dev-lead/`.

Skills (`.claude/skills/`) — workflows récurrents de gestion du site :
- **/nouvel-article** : authoring d'un article blog conforme (frontmatter, silo, médias) → délègue à /preflight-publication.
- **/preflight-publication** : contrôle pré-commit du contenu (build Zod, DGCCRF, frontmatter, secrets) → verdict GO/NO-GO.
- **/audit-blog** : diagnostic des ~100 articles (visibilité, silos, frontmatter, doublons).
- **/check-deploiement** : vérifs post-deploy Vercel (build, runtime, pages clés, GTM, en-têtes).
- **/campagne-geo** : campagne d'audits GEO multi-pages via `geo-auditor`, synthèse comparative dans `seo-audit/rapports/`.
- **/brevo-sequence** : templates/séquences email Brevo via MCP (test à Fred obligatoire, jamais d'envoi réel sans confirmation).
