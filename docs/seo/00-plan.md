# Plan SEO / visibilité IA — reconnaissance (phase 0)

> **Statut : BROUILLON, aucun code modifié.** Établi le 1er septembre 2026 à partir de
> l'audit externe du même jour, vérifié ligne à ligne dans le repo. Aucun lot n'est lancé
> avant GO explicite de Fred.
>
> Référence de build pour tous les constats : `npm ci` puis `npm run build` sur le commit
> `0a5ea99` (master). Build **OK**, 181 pages HTML, 170 URLs au sitemap.

---

## 0. Deux points d'environnement à connaître avant tout

**a) Il n'y a pas de dossier `dist/`.** L'adapter `@astrojs/vercel` écrit les pages statiques
dans **`.vercel/output/static/`**. Toutes les commandes de vérification de la mission qui
visent `dist/index.html` doivent viser `.vercel/output/static/index.html`. Je les adapterai
et le signalerai dans chaque compte rendu.

**b) L'environnement post-formatage est fonctionnel.** `node_modules` était absent, je l'ai
réinstallé (`npm ci`, exit 0). `gh auth status` → connecté (`freed201`, scope `repo`),
`git ls-remote origin` → OK. Le build passe. Seul avertissement : Node local en v26 alors que
l'adapter attend ≤ 20 — sans conséquence, le postbuild `patch-vercel-runtime.mjs` force
`nodejs20.x` comme prévu.

---

## 1. Arborescence utile

### Layouts
| Fichier | Rôle |
|---|---|
| `src/layouts/Layout.astro` | Layout générique. **C'est ici que vivent `<title>`, `<meta name="description">`, `<link rel="canonical">`, OG/Twitter et le schema `WebPage`.** Canonical par défaut = `Astro.url.href`. |
| `src/layouts/ArticleLayout.astro` | Articles de blog. Enrichit le title via `songInfo` (l. 45-56), génère `BlogPosting`, `Person`, `VideoObject` (l. 215, 288), gère `AutoFAQ`. |
| `src/layouts/CourseLayout.astro` | Pages cours. Enrichit titre/description, `aggregateRating` l. 130. |
| `src/layouts/ProgrammeLayout.astro` | Pages programme. |

### Composants de la home (`src/pages/index.astro`, 410 lignes)
Ordre réel de la page : `HeroModern` → `AuthorityBar` → `PainPoints` → `CoursGrid` →
`MethodRoadmap` → `InstructorHighlight` → `TrustSignals` → `QuizTeaser` → `TemoignagesModern`
→ `LeadCaptureForm` → `PricingPreview` → CTA final → `FooterModern` → `StickyCTAMobile`.

| Composant | Ce qu'il contient d'important |
|---|---|
| `src/components/HeroModern.astro` | Badge « 4.7/5 sur 929 avis » (l. 39, **en dur dans le HTML, OK**) + **3 compteurs animés à `0`** (l. 127-136). |
| `src/components/AuthorityBar.astro` | 4 indicateurs **écrits en dur dans le HTML** : « 80 000+ élèves formés », « 4.7/5 », Hal Leonard, LinkedIn Learning. **Rien à corriger ici.** |
| `src/components/InstructorHighlight.astro` | **4 compteurs animés à `0`** (l. 94-106) : 80000+, 4.7/5, 1400+, 15 ans. |
| `src/components/TemoignagesModern.astro` | Section « Ce que nos élèves en disent ». Témoignages **en dur dans le composant** (l. 22-49), note « 4.7/5 sur 929 avis » l. 70, **3 compteurs animés à `0`** (l. 147-155). |
| `src/components/TrustSignals.astro` | « Reconnu et référencé par » — statique, OK. |
| `src/components/Temoignages.astro` | **Composant mort** (aucun `import` dans `src/pages` ni `src/layouts`). Contient en plus un `Review` daté avec `new Date()` au build (l. 57) — date fabriquée. À supprimer. |

### Moteur d'animation
`src/scripts/animations.js`, chargé par `Layout.astro` en `<script type="module">`.
`setupCounterAnimations()` (l. 151-210) lit `[data-counter]` et anime depuis `0`.
Un fallback existe déjà (l. 557-568) : si `prefers-reduced-motion` **ou** connexion lente,
les valeurs finales sont écrites sans animation — mais **côté client uniquement**, donc
invisible pour un robot qui n'exécute pas JS.

### JSON-LD
Pas de composant unique. Le JSON-LD est produit à trois endroits :
`Layout.astro` (`WebPage`, l. 40-61), la page elle-même via `<Fragment slot="head">`
(home : `EducationalOrganization` + `WebSite` + `FAQPage`, `index.astro` l. 195-199), et les
layouts spécialisés. Composants dédiés : `JsonLD.astro`, `FAQSchema.astro`,
`BreadcrumbsSchema.astro`, `ProductListSchema.astro`. Utilitaires : `src/utils/videoSchema.ts`,
`src/utils/podcastSchema.ts`.

### Contenu
`src/content/config.ts` — schémas Zod pour `courses` (18), `blog` (103 fichiers, 98 en
`prod: Y`), `livres` (5). `programmes` (18) et `ressources` (7) sont chargées **sans schéma**.
La collection `blog` a **déjà** un champ `videos: [{title, url}]` optionnel (l. ~57 du config).

### Sitemap
`src/pages/sitemap.xml.ts` — endpoint prérendu (pas de `prerender = false`), sort dans
`.vercel/output/static/sitemap.xml`. Les articles utilisent `dateModified || datePublished` ;
les pages statiques lisent une table `REVISIONS` codée en dur (l. 51-72).

### Images
`public/images/` (blog dans `public/images/blog/`). Pipeline : `npm run optimize-images`
(sharp → WebP) + les plugins remark `remark-optimize-images.mjs` (dimensions réelles, alt
enrichis) et `remark-lazy-images.mjs` (1re image `eager`).

### Scripts de contrôle existants (base pour `check:seo`)
`scripts/check-trailing-slash.mjs`, `scripts/check-article-quality.mjs`,
`scripts/analyze-blog-articles.js`.

---

## 2. Chaque défaut de l'audit : reproduit ou non

| # | Défaut annoncé | Verdict | Emplacement / preuve |
|---|---|---|---|
| 1 | Compteurs home à `0` dans le HTML | **REPRODUIT — et pire que décrit** | `HeroModern.astro:127,131,135` · `InstructorHighlight.astro:94,98,102,106` · `TemoignagesModern.astro:147,151,155`. Soit **10 compteurs**, pas 6. Vérifié dans le HTML généré : `grep -o 'data-counter=...>0<' .vercel/output/static/index.html` → 10 résultats. |
| 2 | « 80 000 » absent du HTML | **PARTIELLEMENT** | `grep -c "80 000" index.html` → **1** (l'`AuthorityBar`, qui est statique). Le hero et la section témoignages, eux, affichent `0`. |
| 3 | Témoignages sans date ni source | **REPRODUIT** | `TemoignagesModern.astro:22-49` — Marie Dubois / Thomas Martin / Sophie Laurent, en dur, sans date, sans lien. Présents depuis le commit initial `aa0c5bf`. |
| 4 | « 4,7/5 sur 929 avis » sans provenance | **REPRODUIT** | `HeroModern.astro:39`, `TemoignagesModern.astro:70`, `index.astro:74-79` (`aggregateRating` sans `itemReviewed` ni `url`). **Aucune source trouvée dans le repo** (voir § 4). |
| 5 | H2 avec `## ` littéral | **REPRODUIT — cause identifiée** | `src/content/blog/accords-guitare-debutant-guide-ultime.md:38` : la ligne source est `## ## Pourquoi apprendre les accords de guitare ?`. Ce n'est **pas** un bug de plugin : c'est une faute de frappe dans le Markdown. Rendu : `<h2 id=-pourquoi-...>## Pourquoi apprendre les accords de guitare ?`. **Occurrence unique** dans tout `src/content/` (`grep -rn '^#\{1,6\} #'`). |
| 6 | Article accords : 1 image, 0 vidéo, 0 lien externe, 22 liens `/cours/` | **REPRODUIT, avec nuance** | Le fichier `.md` contient **0** image, **0** lien externe et **0** lien `/cours/` en Markdown. Les **22 liens `/cours/`** viennent tous des composants injectés par le layout (header, footer, `ArticleCTA`, `RelatedCourses`) : 5× solfège, 5× piano, 5× guitare, 4× ukulélé, 2× `/cours/`, 1× `apprendre-guitare-debutant`. **Corriger cela touche donc le gabarit, pas l'article** — c'est un point à trancher (§ 5, lot 5). |
| 7 | Title article accords 39 car., description 114 | **REPRODUIT** | `accords-guitare-debutant-guide-ultime.md:2-3`. |
| 8 | Titles trop longs (home 68, a-propos 74, auteur 74, blog 69) | **REPRODUIT — mais le problème est bien plus large** | Voir § 3 : **~50 articles de blog dépassent 75 caractères**, jusqu'à **90**. Cause : enrichissement volontaire par `songInfo` dans `ArticleLayout.astro:45-56`. |
| 9 | Canonical `/offre/` sans barre oblique | **REPRODUIT — et 2 autres pages sont touchées** | Contrôle automatisé des **177** pages générées (canonical comparé au chemin réel du fichier) : **3 incohérences**, toutes du même motif `new URL('/page', ...)` sans barre finale → `src/pages/offre.astro:9`, `src/pages/faq.astro:14`, `src/pages/quel-instrument-choisir.astro:9`. Les 174 autres pages sont correctes. |
| 10 | Sitemap : 106 lastmod « 2026-07 » identiques | **REPRODUIT** | 170 `<loc>`, répartition : **106 en 2026-07**, 36 en 2025-01, 9 en 2025-02, 7 en 2026-08, 7 en 2026-06, 2 en 2026-04, 1 en 2024-01, 1 en 2021-01, 1 en 2019-01. Côté frontmatter blog : 85 articles ont `dateModified` en 2026-07. |
| 11 | `/rss.xml` et `/feed.xml` → 404 | **REPRODUIT** | Aucune route correspondante dans `src/pages/`, aucun `<link rel="alternate">` dans `Layout.astro` ni `ExternalResources.astro`. `@astrojs/rss` n'est pas installé. |
| 12 | Home : 10 liens sans texte accessible, 2 images sans `alt` | **NON REPRODUIT** | Analyse du HTML généré : **10 `<img>`, 0 sans attribut `alt`** (1 seul `alt=""`, le fond décoratif `hero.webp` — correct). **66 `<a>`, 0 sans texte accessible** ; les 4 liens-icônes réseaux sociaux portent tous un `aria-label`. Hypothèse : l'audit a mesuré le **déploiement en ligne**, plus ancien que `master`, ou a compté `alt=""` comme manquant. **À trancher avec Fred** (§ 6, Q6). |

### Défauts trouvés en plus, non signalés par l'audit

| Constat | Où | Pourquoi ça compte |
|---|---|---|
| **« 95 % de satisfaction »** affiché comme compteur | `HeroModern.astro:135`, `TemoignagesModern.astro:151` | Ce chiffre **ne figure pas** dans `.claude/rules/contenu-credibilite.md`. Il contredit même « 4,7/5 » (= 94 %, mais ce n'est pas la même mesure). Non sourçable en l'état. |
| **« 1 400 vidéos »** | 3 compteurs | Idem : absent des chiffres officiels validés. |
| **« 9 210 débutants »** sur `/cours/apprendre-guitare-debutant/` | frontmatter du cours | Chiffre précis, non sourcé, non listé dans les règles. |
| `Temoignages.astro` : `"datePublished": new Date()` | `Temoignages.astro:57` | Un `Review` dont la date est celle du build = date fabriquée. Composant mort, mais à supprimer plutôt qu'à laisser. |
| 36 URLs du sitemap avec `lastmod` **2025-01**, et 3 en 2019/2021/2024 | `courses`, `programmes`, `ressources` | Dates issues de frontmatters jamais mis à jour. Le lot 3 doit les traiter aussi, pas seulement le bloc 2026-07. |
| 81 articles sur 103 ont **zéro lien externe** ; 46 ont **zéro image** | inventaire § 3 | Signal « page fermée » généralisé, pas limité au guide accords. |

---

## 3. Inventaire des 103 articles de blog

Colonnes : `prod` = publié ou non · `Git` = date du dernier commit touchant le fichier ·
`Silo` = `P` pilier / `S` satellite / `-` isolé · `Liens ext.` et `Liens int.` = comptés
**dans le Markdown seul** (hors composants injectés par le layout) · `Vidéo YT` = présence
d'un lien YouTube dans le frontmatter `videos` ou dans le corps.

### Synthèse

- 103 fichiers, **98 publiés** (`prod: Y`), 5 en `prod: N`.
- `dateModified` : **85 en 2026-07**, 8 en 2026-06, 7 en 2026-08, 2 en 2026-02, 1 en 2025-03.
- **54 articles** référencent une vidéo YouTube, **49 n'en ont aucune**.
- **81 articles** n'ont aucun lien externe. **46** n'ont aucune image.
- 7 piliers : `10-minutes-par-jour-valent-mieux-que-2-heures-dimanche`,
  `apprendre-la-guitare-facilement-guide-complet-pour-debutants`,
  `debuter-ukulele-methode-simple-apprendre`, `guide-complet-apprentissage-piano`,
  `pourquoi-tu-stagnes-en-musique`, `quel-instrument-de-musique-choisir-debutant`,
  `solfege-noms-des-notes`.

### Tableau complet

| Slug | prod | Publié | Modifié | Git | Inst. | Silo | Mots | Img | Liens ext. | Liens int. | → /cours/ | Vidéo YT | FAQ | H2/H3 |
|---|---|---|---|---|---|---|---:|---:|---:|---:|---:|---|---:|---|
| `10-minutes-par-jour-valent-mieux-que-2-heures-dimanche` | Y | 2026-04-20 | 2026-07-07 | 2026-07-07 | général | P | 3006 | 0 | 0 | 3 | 1 | — | 3 | 10/0 |
| `15-chansons-faciles-ukulele` | Y | 2026-02-17 | 2026-08-17 | 2026-08-17 | ukulele | S | 2604 | 10 | 0 | 9 | 2 | — | 5 | 9/15 |
| `3-exercices-simples-progresser-piano-adulte-cours-de-piano` | Y | 2026-01-19 | 2026-07-07 | 2026-07-17 | piano | S | 622 | 0 | 0 | 4 | 2 | — | 3 | 5/0 |
| `5-accords-indispensables-jouer-100-chansons-ukulele` | Y | 2026-01-26 | 2026-07-07 | 2026-07-16 | ukulele | S | 1517 | 5 | 0 | 3 | 1 | — | 6 | 5/4 |
| `Nous-on-sait-guitare-tuto` | Y | 2024-05-21 | 2026-07-07 | 2026-07-16 | guitare | S | 509 | 0 | 0 | 2 | 0 | frontmatter | 3 | 3/4 |
| `accords-guitare-debutant-guide-ultime` | Y | 2025-04-04 | 2026-08-17 | 2026-08-17 | guitare | S | 915 | 0 | 0 | 3 | 0 | — | 3 | 10/2 |
| `applis-guitare-debutant-progression-rapide` | Y | 2026-02-02 | 2026-07-07 | 2026-07-16 | guitare | S | 525 | 0 | 0 | 3 | 1 | — | 3 | 5/0 |
| `apprendre-back-to-black-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 920 | 7 | 0 | 2 | 0 | frontmatter | 4 | 6/0 |
| `apprendre-chasing-cars-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 549 | 0 | 0 | 2 | 0 | frontmatter | 4 | 6/0 |
| `apprendre-coldplay-piano-guitare-ukulele` | Y | 2025-02-27 | 2026-07-07 | 2026-07-08 | guitare | S | 666 | 0 | 4 | 2 | 0 | frontmatter | 3 | 6/0 |
| `apprendre-hey-jude-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 985 | 6 | 0 | 2 | 0 | frontmatter | 4 | 7/0 |
| `apprendre-ironic-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 801 | 4 | 0 | 2 | 0 | frontmatter | 4 | 7/0 |
| `apprendre-jouer-chanson-trois-accords-guitare-debutants` | Y | 2026-02-09 | 2026-07-07 | 2026-07-16 | guitare | S | 1319 | 0 | 0 | 4 | 1 | frontmatter | 3 | 5/0 |
| `apprendre-kpop-demon-hunters-ukulele-guitare-piano` | Y | 2025-10-12 | 2026-07-07 | 2026-07-08 | ukulele | S | 1706 | 0 | 3 | 2 | 0 | frontmatter | 3 | 10/9 |
| `apprendre-la-guitare-facilement-guide-complet-pour-debutants` | Y | 2026-02-05 | 2026-07-07 | 2026-07-17 | guitare | P | 3603 | 5 | 0 | 60 | 4 | frontmatter | 5 | 9/28 |
| `apprendre-lucky-man-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1049 | 3 | 1 | 2 | 0 | frontmatter | 3 | 8/0 |
| `apprendre-machistador-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 916 | 2 | 0 | 2 | 0 | frontmatter | 3 | 6/0 |
| `apprendre-mr-jones-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1155 | 5 | 1 | 2 | 0 | frontmatter | 3 | 9/1 |
| `apprendre-one-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1333 | 4 | 0 | 2 | 0 | frontmatter | 3 | 8/1 |
| `apprendre-partons-vite-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1111 | 6 | 0 | 2 | 0 | frontmatter | 3 | 6/0 |
| `apprendre-perfect-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1101 | 4 | 3 | 2 | 0 | frontmatter | 3 | 7/1 |
| `apprendre-redemption-song-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 760 | 4 | 0 | 2 | 0 | frontmatter | 5 | 6/0 |
| `apprendre-respire-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1353 | 6 | 3 | 2 | 0 | frontmatter | 3 | 7/2 |
| `apprendre-riche-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1256 | 6 | 0 | 2 | 0 | frontmatter | 3 | 8/0 |
| `apprendre-smells-like-teen-spirit-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 550 | 0 | 0 | 2 | 0 | frontmatter | 4 | 7/0 |
| `apprendre-so-lonely-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1367 | 4 | 3 | 2 | 0 | frontmatter | 3 | 8/1 |
| `apprendre-stand-by-me-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 717 | 4 | 0 | 2 | 0 | frontmatter | 4 | 6/0 |
| `apprendre-sweet-dreams-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1076 | 5 | 1 | 2 | 0 | frontmatter | 3 | 6/7 |
| `apprendre-un-autre-monde-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1096 | 6 | 3 | 2 | 0 | frontmatter | 3 | 5/3 |
| `apprendre-une-belle-histoire-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1227 | 4 | 4 | 2 | 0 | frontmatter | 3 | 6/2 |
| `apprendre-viva-la-vida-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 727 | 4 | 0 | 2 | 0 | frontmatter | 4 | 7/0 |
| `apprendre-whats-up-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 678 | 3 | 0 | 2 | 0 | frontmatter | 5 | 7/0 |
| `apprendre-where-is-my-mind-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1199 | 3 | 0 | 2 | 0 | frontmatter | 3 | 8/1 |
| `apprendre-wild-world-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1363 | 6 | 0 | 3 | 0 | frontmatter | 3 | 7/0 |
| `apprendre-wonderwall-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 537 | 0 | 0 | 2 | 0 | frontmatter | 4 | 6/0 |
| `astuces-progresser-guitare-debutant` | Y | 2025-04-04 | 2026-08-17 | 2026-08-17 | guitare | S | 693 | 0 | 0 | 3 | 0 | — | 3 | 11/1 |
| `au-boulot-maestro-1` | Y | 2025-02-03 | 2026-07-07 | 2026-07-08 | général | S | 452 | 0 | 0 | 2 | 0 | — | 3 | 4/2 |
| `au-boulot-maestro-2` | Y | 2025-02-10 | 2026-07-07 | 2026-07-08 | général | S | 414 | 0 | 0 | 2 | 0 | — | 3 | 3/10 |
| `au-boulot-maestro-3` | Y | 2025-02-24 | 2026-07-07 | 2026-07-08 | général | S | 549 | 0 | 0 | 2 | 0 | — | 3 | 7/0 |
| `booster-progression-musicale` | Y | 2025-03-17 | 2026-07-06 | 2026-07-07 | général | S | 641 | 0 | 0 | 3 | 1 | — | 3 | 5/3 |
| `choisir-ukulele-2025` | N | 2025-03-03 | 2026-02-04 | 2026-05-16 | ukulele | - | 873 | 0 | 0 | 0 | 0 | — | 0 | 8/6 |
| `comment-jouer-imagine-john-lennon-piano` | Y | 2026-02-23 | 2026-07-07 | 2026-07-16 | piano | S | 1358 | 0 | 0 | 4 | 1 | frontmatter | 3 | 5/3 |
| `comment-lire-diagramme-accord-ukulele` | Y | 2026-03-02 | 2026-07-07 | 2026-07-16 | ukulele | S | 503 | 0 | 0 | 2 | 1 | — | 3 | 5/0 |
| `conclusion-apprentissage-piano` | Y | 2025-03-14 | 2026-06-06 | 2026-07-16 | piano | S | 1018 | 1 | 0 | 1 | 0 | — | 3 | 8/0 |
| `conseils-pour-debuter-la-guitare` | N | 2025-03-14 | 2026-02-04 | 2026-05-16 | guitare | - | 576 | 0 | 0 | 0 | 0 | — | 0 | 11/0 |
| `cours-ukulele-gratuit-debutant` | Y | 2026-07-29 | 2026-07-29 | 2026-07-29 | ukulele | S | 1684 | 4 | 16 | 8 | 2 | frontmatter | 5 | 8/4 |
| `debuter-le-piano-bases-essentielles` | Y | 2025-03-14 | 2026-06-06 | 2026-07-16 | piano | S | 1155 | 5 | 0 | 5 | 0 | — | 3 | 8/6 |
| `debuter-ukulele-methode-simple-apprendre` | Y | 2026-02-05 | 2026-06-06 | 2026-07-16 | ukulele | P | 4114 | 4 | 0 | 14 | 2 | — | 6 | 9/40 |
| `effet-antidepresseur-du-ukulele` | Y | 2025-07-27 | 2026-07-07 | 2026-07-16 | ukulele | S | 1581 | 0 | 6 | 2 | 0 | frontmatter | 6 | 8/7 |
| `enfants-apprennent-musique-plus-vite` | Y | 2026-03-16 | 2026-07-06 | 2026-07-07 | général | S | 1896 | 0 | 0 | 3 | 0 | — | 3 | 10/12 |
| `enseigner-musique-efficacement` | Y | 2025-03-24 | 2026-07-06 | 2026-07-07 | général | S | 912 | 0 | 0 | 2 | 1 | — | 3 | 8/0 |
| `entrainement-guitare-10-minutes-debutants` | Y | 2026-03-23 | 2026-07-07 | 2026-07-16 | guitare | S | 589 | 0 | 0 | 4 | 1 | — | 3 | 5/0 |
| `erreurs-debutant-guitare-solutions` | Y | 2025-04-04 | 2026-08-17 | 2026-08-17 | guitare | S | 861 | 0 | 0 | 3 | 0 | — | 3 | 10/1 |
| `erreurs-debutants-guitare` | Y | 2025-08-01 | 2026-07-08 | 2026-07-16 | guitare | S | 2410 | 0 | 0 | 2 | 0 | frontmatter | 6 | 13/22 |
| `erreurs-frequentes-piano-debutant` | Y | 2025-03-14 | 2026-07-06 | 2026-07-07 | piano | S | 1121 | 2 | 0 | 6 | 1 | — | 3 | 10/7 |
| `ete-meilleure-saison-progresser-musique` | Y | 2026-07-08 | 2026-07-08 | 2026-07-08 | général | S | 1329 | 0 | 0 | 4 | 0 | — | 4 | 5/0 |
| `exemple-mise-en-forme` | N | 2025-03-15 | 2025-03-15 | 2026-07-16 | — | - | 695 | 2 | 0 | 2 | 0 | — | 0 | 11/1 |
| `exercices-accords-guitare-debutant` | Y | 2025-04-04 | 2026-08-17 | 2026-08-17 | guitare | S | 742 | 0 | 0 | 3 | 0 | — | 3 | 9/1 |
| `faq-apprendre-guitare-debutant` | Y | 2025-04-04 | 2026-07-06 | 2026-07-07 | guitare | S | 1041 | 0 | 0 | 3 | 2 | — | 5 | 14/0 |
| `faq-piano-debutant` | Y | 2025-03-14 | 2026-07-06 | 2026-07-07 | piano | S | 357 | 1 | 0 | 5 | 1 | — | 7 | 4/0 |
| `faut-il-savoir-lire-une-partition-pour-jouer-du-piano` | Y | 2026-03-30 | 2026-07-06 | 2026-07-17 | piano | S | 1079 | 1 | 0 | 4 | 2 | — | 6 | 6/4 |
| `guide-complet-apprentissage-piano` | Y | 2026-02-05 | 2026-07-02 | 2026-07-16 | piano | P | 3640 | 0 | 0 | 20 | 5 | — | 5 | 9/29 |
| `jouer-clandestino-guitare-tutoriel` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1042 | 3 | 0 | 2 | 0 | frontmatter | 4 | 7/2 |
| `jouer-fields-of-gold-sting` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1187 | 5 | 0 | 2 | 0 | frontmatter | 3 | 6/2 |
| `jouer-hallelujah-jeff-buckley-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1200 | 6 | 0 | 2 | 0 | frontmatter | 3 | 6/0 |
| `jouer-hey-ya-outkast-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1023 | 4 | 0 | 2 | 0 | frontmatter | 4 | 7/2 |
| `jouer-la-seine-vanessa-m` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1164 | 8 | 3 | 2 | 0 | frontmatter | 3 | 5/3 |
| `jouer-lopportuniste-dutronc-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1007 | 5 | 0 | 2 | 0 | frontmatter | 3 | 7/0 |
| `les-meilleures-videos-youtube-apprendre-ukulele` | Y | 2026-04-02 | 2026-07-07 | 2026-07-08 | ukulele | S | 1536 | 0 | 14 | 2 | 0 | frontmatter | 5 | 10/0 |
| `meilleurs-cours-guitare-en-ligne-compares-2026` | Y | 2026-02-17 | 2026-07-16 | 2026-07-17 | guitare | S | 1810 | 0 | 0 | 6 | 4 | — | 5 | 8/12 |
| `methodes-apprentissage-piano-debutant` | Y | 2025-03-14 | 2026-06-06 | 2026-07-16 | piano | S | 1176 | 2 | 0 | 2 | 0 | — | 3 | 7/6 |
| `morceaux-faciles-guitare-debutant` | Y | 2025-04-04 | 2026-08-17 | 2026-08-17 | guitare | S | 1853 | 0 | 0 | 21 | 1 | — | 6 | 9/15 |
| `nirvana-where-did-you-sleep-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1189 | 3 | 3 | 4 | 1 | frontmatter | 3 | 10/1 |
| `origine-histoire-anecdotes-ukulele` | Y | 2026-04-13 | 2026-07-06 | 2026-07-16 | ukulele | S | 1272 | 0 | 0 | 3 | 1 | frontmatter | 3 | 5/0 |
| `origine-noms-notes-musique-histoire-solfege` | Y | 2025-04-07 | 2026-07-07 | 2026-07-17 | solfege | S | 1355 | 0 | 0 | 4 | 1 | — | 3 | 6/0 |
| `passer-ukulele-debutant-initie` | Y | 2026-01-19 | 2026-07-07 | 2026-07-08 | ukulele | S | 622 | 0 | 0 | 3 | 0 | — | 4 | 7/0 |
| `plan-travail-progresser-piano` | Y | 2025-03-14 | 2026-06-06 | 2026-07-17 | piano | S | 1251 | 2 | 0 | 3 | 1 | — | 3 | 7/1 |
| `pourquoi-apprendre-le-piano` | Y | 2025-03-14 | 2026-07-07 | 2026-07-08 | piano | S | 1555 | 2 | 0 | 7 | 1 | — | 6 | 10/5 |
| `pourquoi-le-ukulele-est-ideal-pour-apprendre-la-musique` | N | 2026-04-20 | 2026-06-06 | 2026-07-16 | ukulele | S | 703 | 1 | 0 | 1 | 0 | — | 6 | 5/5 |
| `pourquoi-tiktok-ne-peut-pas-vous-apprendre-la-musique` | Y | 2026-04-27 | 2026-07-06 | 2026-07-07 | général | S | 1056 | 0 | 0 | 3 | 0 | — | 3 | 6/1 |
| `pourquoi-tu-narrives-pas-tenir-rythme-metronome` | Y | 2026-04-27 | 2026-07-07 | 2026-07-08 | général | S | 837 | 0 | 0 | 2 | 0 | — | 3 | 4/0 |
| `pourquoi-tu-stagnes-en-musique` | Y | 2026-02-05 | 2026-07-07 | 2026-07-17 | général | P | 3598 | 0 | 0 | 22 | 3 | — | 6 | 8/26 |
| `quel-instrument-de-musique-choisir-debutant` | N | 2026-07-11 | 2026-07-11 | 2026-07-17 | général | P | 951 | 0 | 0 | 16 | 8 | — | 5 | 8/0 |
| `quel-piano-numerique-acheter-guide-comparatif-debutant` | Y | 2026-04-27 | 2026-07-07 | 2026-07-16 | piano | S | 4619 | 2 | 39 | 5 | 1 | — | 7 | 13/20 |
| `quel-ukulele-acheter-guide-comparatif-debutant` | Y | 2026-04-05 | 2026-07-16 | 2026-07-17 | ukulele | S | 3421 | 3 | 30 | 8 | 1 | — | 7 | 13/22 |
| `quelle-guitare-folk-acheter-guide-comparatif-debutant` | Y | 2026-04-08 | 2026-07-07 | 2026-07-16 | guitare | S | 4152 | 3 | 19 | 7 | 1 | — | 7 | 12/21 |
| `ressources-apprendre-le-piano` | Y | 2025-03-14 | 2026-06-06 | 2026-07-16 | piano | S | 1104 | 2 | 1 | 2 | 0 | corps | 3 | 8/0 |
| `rythmiques-ukulele-debutant-3-patterns-faciles` | Y | 2026-05-04 | 2026-07-07 | 2026-07-16 | ukulele | S | 577 | 0 | 0 | 4 | 1 | — | 3 | 7/0 |
| `seance-pratique-efficace-30-minutes` | Y | 2026-02-05 | 2026-07-07 | 2026-07-17 | général | S | 3260 | 0 | 0 | 13 | 3 | — | 6 | 10/25 |
| `solfege-noms-des-notes` | Y | 2025-04-07 | 2026-07-07 | 2026-07-17 | solfege | P | 934 | 0 | 0 | 3 | 2 | — | 3 | 9/1 |
| `techniques-essentielles-piano` | Y | 2025-03-14 | 2026-06-06 | 2026-07-17 | piano | S | 1324 | 2 | 0 | 3 | 1 | — | 3 | 8/6 |
| `techniques-jouer-accords-guitare` | Y | 2025-04-04 | 2026-08-17 | 2026-08-17 | guitare | S | 677 | 0 | 0 | 3 | 0 | — | 3 | 8/0 |
| `top-5-accords-guitare-debutants-enchainement-facile` | Y | 2026-03-31 | 2026-07-07 | 2026-07-08 | guitare | S | 707 | 0 | 0 | 2 | 0 | frontmatter | 3 | 6/0 |
| `tuto-cant-help-falling-in-love-presley-guitare` | Y | 2025-02-21 | 2026-07-29 | 2026-07-29 | guitare | S | 1175 | 8 | 0 | 2 | 0 | frontmatter | 3 | 7/1 |
| `tutoriel-across-the-universe-pour-debutants` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1031 | 4 | 0 | 2 | 0 | frontmatter | 3 | 6/2 |
| `tutoriel-dont-stop-me-now-queen` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1335 | 6 | 0 | 2 | 0 | frontmatter | 3 | 8/0 |
| `tutoriel-everybody-hurts-facile` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1261 | 7 | 3 | 2 | 0 | frontmatter | 3 | 7/3 |
| `tutoriel-foule-sentimentale-chanson` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1088 | 5 | 0 | 2 | 0 | frontmatter | 3 | 5/6 |
| `tutoriel-guitare-house-of-the-rising-sun` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1317 | 5 | 0 | 3 | 1 | frontmatter | 3 | 7/3 |
| `tutoriel-jveux-du-soleil-chanson-francaise` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 958 | 3 | 0 | 2 | 0 | frontmatter | 3 | 6/0 |
| `tutoriel-les-copains-dabord-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1301 | 5 | 4 | 2 | 0 | frontmatter | 3 | 7/7 |
| `tutoriel-more-than-words-guitare` | Y | 2024-03-05 | 2026-07-29 | 2026-07-29 | guitare | S | 1301 | 5 | 0 | 2 | 0 | frontmatter | 3 | 6/1 |
| `tutoriels-guitare-jean-jacques-goldman` | Y | 2025-03-07 | 2026-07-07 | 2026-07-08 | guitare | S | 588 | 0 | 3 | 2 | 0 | frontmatter | 3 | 7/0 |

---

## 4. Recherche de la source des « 929 avis » et des témoignages

Recherches menées : `grep` sur `src/`, `docs/`, `content/`, `public/`, `seo-audit/`,
`sources-privees/` ; `git log -S"929" --all` ; `git log -S"Marie Dubois" --all` ; inspection
de `sources-privees/` (fichiers d'accords et de structures, rien sur les avis).

**Résultat : aucune source. Rien à afficher en l'état.**

- Le chiffre `929` apparaît uniquement comme valeur affichée (`HeroModern`, `TemoignagesModern`,
  `index.astro`, `offre.astro`, `CourseLayout`) et comme règle figée dans
  `.claude/rules/contenu-credibilite.md`. Aucun export, CSV, capture ou note d'origine.
- Un audit interne antérieur avait déjà relevé le problème :
  `seo-audit/rapports/2026-07-10-audit-pages-principales.md:76` — *« sa source n'est pas
  documentée sur la page (Trustpilot n'en montre que 22). Optionnel : préciser "avis agrégés
  (Skilleos, LinkedIn Learning, internes)" ou lien source »*. La piste « avis agrégés
  multi-plateformes » est donc plausible, **mais elle n'est pas confirmée** : je ne l'écrirai pas.
- Les trois témoignages (Marie Dubois, Thomas Martin, Sophie Laurent) remontent au **commit
  initial `aa0c5bf`**, avec des photos (`marie.webp`, `thomas.webp`, `sophie.webp`) datées de
  mars 2025 et avril. Rien n'indique qu'il s'agit de vraies élèves. Le même audit de juillet
  notait déjà *« photos à l'esthétique stock, non datées/sourcées »*.

**Conséquence directe sur le lot 1 :** je ne peux pas « centraliser les trois chiffres » sans
que Fred valide lesquels sont publiables. « 80 000+ élèves » et « 4,7/5 » sont couverts par
`contenu-credibilite.md`. **« 95 % de satisfaction » et « 1 400 vidéos » ne le sont pas.**
Voir question Q1.

---

## 5. Les lots proposés

Une branche et une PR par lot, jamais de merge, `npm run build` à la fin de chaque lot.

### Lot 1 — Les chiffres dans le HTML · ~60 min · risque faible

1. Créer `src/data/proof.ts` : source unique des chiffres de preuve, avec pour chacun sa
   valeur, son libellé et **son statut de sourçage** (validé par `contenu-credibilite.md` ou non).
2. Modifier le rendu des 10 compteurs (`HeroModern`, `InstructorHighlight`, `TemoignagesModern`) :
   la valeur finale formatée est **écrite dans le HTML**, l'attribut `data-counter` reste pour
   l'animation. Un robot lit « 80 000+ », un humain voit le compteur monter.
3. `animations.js` : au lieu de partir de `0` en dur, l'animation mémorise la valeur déjà
   présente, l'anime, puis la restitue. Si `prefers-reduced-motion` est actif ou
   `IntersectionObserver` indisponible → **on ne touche à rien** (le HTML est déjà bon).
4. Faire lire `proof.ts` par la home, `a-propos`, le JSON-LD et `llms.txt` — dans la limite de
   ce que Fred valide en Q1.
5. Vérifier qu'aucun autre texte de la home ne dépend du scroll : les 8 sections en
   `data-animate="reveal"` / `data-stagger-group` ne masquent que par opacité CSS, le texte est
   dans le DOM. À reconfirmer sur le HTML généré.

**Vérification :** `npm run build` puis, sur `.vercel/output/static/index.html`,
`grep -o "0[^0-9][^<]*Élèves formés"` → vide, et `grep -c "80 000"` → ≥ 1.
**Risque :** aucun changement visuel attendu ; le seul piège est un compteur qui « saute » au
premier rendu, évité en gardant la valeur d'origine comme point de chute.

**Bloqué par Q1** (quels chiffres ont le droit d'être affichés).

---

### Lot 2 — Preuve sociale sourcée ou retirée · ~45 min + décision · risque moyen (contenu public)

Rien à trouver : la recherche est faite (§ 4), il n'y a pas de source. Je livrerai donc les
**deux variantes demandées**, derrière un unique interrupteur dans `src/data/testimonials.ts` :

- **(a)** Témoignages masqués, note « 4,7/5 » conservée avec une mention de provenance
  **à écrire par Fred** (je ne rédige pas « enquête élèves Musique Facile 2026 » sans son accord),
  `aggregateRating` complété d'un `itemReviewed`.
- **(b)** Section témoignages **et** mention chiffrée retirées de la home ; le JSON-LD
  `aggregateRating` disparaît avec.

Dans les deux cas je livre `src/data/testimonials.ts` **typé et vide**, au format cible :
prénom + initiale, instrument, mois/année, lien vers l'avis d'origine. Fred le remplit quand il
a de vrais avis. Je supprime aussi le composant mort `Temoignages.astro` (date de `Review`
fabriquée au build).

**Vérification :** build OK + `grep` prouvant qu'aucun témoignage sans date ni source ne subsiste.
**Risque :** c'est la home. Rien ne part sans le choix de Fred (Q2).

---

### Lot 3 — Nettoyage on-page · ~2 h 30 · risque faible à moyen

| Tâche | Détail | Risque |
|---|---|---|
| H2 `## ##` | Correction de `accords-guitare-debutant-guide-ultime.md:38`. La cause est une faute de frappe, pas un plugin : je vérifie en plus qu'aucun autre fichier n'a le motif (déjà vérifié : aucun) et j'ajoute la règle au futur `check:seo`. | nul |
| Titles | Nouveaux titles proposés **dans la PR avant application** pour home, `/a-propos/`, `/auteur/fred-fieffe/`, `/blog/` et le guide accords. | nul |
| **Titles des ~50 articles morceau** | **Hors périmètre tant que Q3 n'est pas tranchée.** Les raccourcir revient à supprimer l'enrichissement `songInfo` (`ArticleLayout.astro:45-56`), qui est un choix éditorial assumé. | élevé si fait à l'aveugle |
| Canonical | 3 pages à corriger, pas une : `offre.astro:9`, `faq.astro:14`, `quel-instrument-choisir.astro:9`. Les 174 autres sont conformes (contrôle automatisé). La règle sera figée par `check:seo`. | nul |
| Sitemap `lastmod` | Vraie date : `dateModified` du frontmatter quand il est sincère, sinon `git log -1 --format=%cI` du fichier. Supprime aussi le bloc `REVISIONS` codé en dur au profit de la date git des `.astro`. Traite les 36 URLs bloquées en 2025-01 en plus des 106 de 2026-07. | faible — le sitemap est prérendu, il faut que `git` soit disponible au build **Vercel** (à vérifier, sinon je précalcule les dates dans un fichier généré) |
| RSS | `@astrojs/rss` (dépendance officielle Astro, légère), `/rss.xml`, 20 derniers articles, `<link rel="alternate">` dans `Layout.astro`, ligne `Sitemap`/RSS dans `robots.txt`. | faible |
| Accessibilité | **Non reproduit** sur `master` (§ 2, ligne 12). Je proposerai plutôt de vérifier le site en ligne avant de « corriger » ce qui est déjà correct. | — |
| `scripts/check-seo.mjs` + `npm run check:seo` | Parcourt `.vercel/output/static/`, échoue sur : title > 60, description hors 120-160, canonical ≠ chemin du fichier, `<h2>` commençant par `#`, `<img>` sans `alt`, `<a>` sans texte ni `aria-label`. | **Le script échouera d'emblée sur ~50 titles et de nombreuses descriptions** tant que Q3/Q4 ne sont pas tranchées. Je livrerai le script avec ces deux règles paramétrables (seuil + liste d'exemptions explicites), pas désactivées en silence. |

---

### Lot 4 — Vidéos sur les guides · ~3 h · risque moyen

Le champ `videos: [{title, url}]` **existe déjà** dans le schéma blog et 54 articles s'en
servent. Je propose donc **d'étendre l'existant** plutôt que d'ajouter un champ concurrent :
`videos[]` gagne les clés optionnelles `durationISO`, `uploadDate`, `transcript`. Ça évite
d'avoir deux façons de déclarer une vidéo dans le même frontmatter.

Composant `<VideoEmbed>` en façade (miniature WebP + bouton → iframe `youtube-nocookie.com`
au clic seulement), `VideoObject` complet généré depuis le frontmatter, bloc
« Transcription » en `<details>` **présent dans le HTML**. Consentement : je vérifie la config
tarteaucitron avant d'écrire une ligne ; si YouTube y est déclaré, je passe par lui.

**Liste des 20 articles proposée pour Q5** (7 piliers + 3 guides d'achat + 10 guides à fort
volume). `vidéo` indique ce qui est déjà déclaré dans le frontmatter :

| # | Slug | Instrument | Mots | Vidéo déjà déclarée | Liens ext. |
|---|---|---|---:|---|---:|
| 1 | `apprendre-la-guitare-facilement-guide-complet-pour-debutants` | guitare | 3603 | oui | 0 |
| 2 | `guide-complet-apprentissage-piano` | piano | 3640 | — | 0 |
| 3 | `debuter-ukulele-methode-simple-apprendre` | ukulélé | 4114 | — | 0 |
| 4 | `quel-instrument-de-musique-choisir-debutant` | général | 951 | — | 0 |
| 5 | `pourquoi-tu-stagnes-en-musique` | général | 3598 | — | 0 |
| 6 | `10-minutes-par-jour-valent-mieux-que-2-heures-dimanche` | général | 3006 | — | 0 |
| 7 | `solfege-noms-des-notes` | solfège | 934 | — | 0 |
| 8 | `quelle-guitare-folk-acheter-guide-comparatif-debutant` | guitare | 4152 | — | 19 |
| 9 | `quel-piano-numerique-acheter-guide-comparatif-debutant` | piano | 4619 | — | 39 |
| 10 | `quel-ukulele-acheter-guide-comparatif-debutant` | ukulélé | 3421 | — | 30 |
| 11 | `accords-guitare-debutant-guide-ultime` | guitare | 915 | — | 0 |
| 12 | `seance-pratique-efficace-30-minutes` | général | 3260 | — | 0 |
| 13 | `15-chansons-faciles-ukulele` | ukulélé | 2604 | — | 0 |
| 14 | `erreurs-debutants-guitare` | guitare | 2410 | oui | 0 |
| 15 | `morceaux-faciles-guitare-debutant` | guitare | 1853 | — | 0 |
| 16 | `meilleurs-cours-guitare-en-ligne-compares-2026` | guitare | 1810 | — | 0 |
| 17 | `pourquoi-apprendre-le-piano` | piano | 1555 | — | 0 |
| 18 | `5-accords-indispensables-jouer-100-chansons-ukulele` | ukulélé | 1517 | — | 0 |
| 19 | `cours-ukulele-gratuit-debutant` | ukulélé | 1684 | oui | 16 |
| 20 | `enfants-apprennent-musique-plus-vite` | général | 1896 | — | 0 |

Je ne devinerai aucun ID YouTube. Pour les articles marqués « oui », l'ID est déjà dans le repo
et je peux l'utiliser tel quel ; pour les autres, il me faut la liste de Fred.

**Risque :** le poids par page doit rester sous +30 Ko avant clic — tenable avec une miniature
WebP locale, pas avec `img.youtube.com` (requête tierce + pas de consentement).

---

### Lot 5 — Maillage et réponses directes · ~2 h · risque moyen

- **Réponse directe après le H1 :** relevé page par page, puis **propositions de texte dans la
  PR** pour validation. Constat de départ : les guides piliers en ont déjà une (l'`introduction`
  du frontmatter est rendue juste après le H1), les pages `/cours/` ont un sous-titre marketing
  qui n'est pas une réponse.
- **Réduction des liens `/cours/` :** les 22 du guide accords viennent du **gabarit**
  (`ArticleCTA`, `RelatedCourses`, header, footer), pas de l'article. Les réduire modifie
  l'affichage de **tous** les articles et touche au funnel CRO. Je chiffrerai l'avant/après et
  proposerai, sans appliquer, tant que Q6 n'est pas tranchée.
- **Bloc « Guides liés » :** sélection par instrument + niveau depuis les collections. Attention
  au doublon avec `RelatedArticles` déjà injecté par `blog/[slug].astro` — je propose d'améliorer
  le scoring de l'existant plutôt que d'ajouter un troisième bloc de liens.
- **`public/llms.txt` :** 10 guides principaux avec une ligne de description chacun + lien vers
  `/rss.xml` (dépend du lot 3).

---

## 6. Décisions qui te reviennent

**Q1 — Chiffres affichables (bloque le lot 1).**
`contenu-credibilite.md` valide « 80 000+ élèves » et « 4,7/5 sur 929 avis ». Les compteurs
affichent en plus **« 95 % de satisfaction »** et **« 1 400 vidéos »**, qui n'y figurent pas.
→ *Réponse par défaut si tu ne réponds pas : je garde « 80 000+ » et « 4,7/5 », et je remplace
« 95 % » par « 4,7/5 ». Pour « 1 400 vidéos », je ne l'affiche que si tu me confirmes le nombre.*
Question annexe : le cours `apprendre-guitare-debutant` annonce **« 9 210 débutants »** — d'où
vient ce chiffre ?

**Q2 — Preuve sociale (bloque le lot 2).** Variante (a) note conservée + témoignages masqués,
ou (b) tout retiré ?
→ *Défaut : (a), avec la mention de provenance laissée en `TODO` jusqu'à ce que tu l'écrives —
donc note affichée sans phrase de source inventée.*

**Q3 — Titles des articles morceau (bloque une partie du lot 3).** ~50 articles font 78 à 90
caractères à cause de l'enrichissement `songInfo` (« … | 7 Accords | Difficulté 3/5 »). Est-ce
qu'on le raccourcit (perte d'information dans la SERP mais title complet) ou on le garde ?
→ *Défaut : on garde, et `check:seo` exempte explicitement les articles à `songInfo` avec un
seuil à 90.*

**Q4 — Descriptions hors 120-160.** Même logique : plusieurs dizaines d'articles sont hors
gabarit, alors que le schéma Zod impose déjà 80-165.
→ *Défaut : `check:seo` avertit sans bloquer sur les descriptions entre 80 et 120, et bloque
au-delà de 165.*

**Q5 — IDs YouTube (bloque le lot 4).** La liste des 20 articles ci-dessus te convient-elle, et
peux-tu fournir les IDs pour les 17 qui n'en ont pas ?
→ *Défaut : je n'équipe que les 3 articles dont l'ID est déjà dans le repo.*

**Q6 — Liens `/cours/` du gabarit (concerne le lot 5).** Réduire les 22 liens implique de
modifier `ArticleCTA` / `RelatedCourses`, donc le funnel de tous les articles. On y touche ?
→ *Défaut : non. Je livre le chiffrage avant/après et une proposition, tu décides ensuite.*

**Q7 — Accessibilité (lot 3).** Les 10 liens sans texte et 2 images sans `alt` ne sont **pas**
reproductibles sur `master`. L'audit portait-il sur le site en ligne ? Si oui, un déploiement
de `master` corrige peut-être déjà le point.
→ *Défaut : je considère le point réglé côté code, et `check:seo` empêchera toute régression.*

---

## 7. Ce que je ne ferai pas

Aucune page « ville » ni gabarit dupliqué. Aucun contenu client-only. Aucun contact avec les
endpoints Brevo, les liens Podia, les formulaires lead magnet ou tarteaucitron sans te prévenir
(le lot 4 frôle tarteaucitron pour le consentement YouTube : je m'arrêterai et je demanderai si
sa config doit changer). Aucune modification de `vercel.json`. Aucun merge. Aucun texte publié
sans ta validation.
