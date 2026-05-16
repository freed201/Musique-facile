# Etat des lieux technique — pipeline editorial

Rapport en lecture seule, prepare pour brancher un pipeline de publication
externe sur le site musique-facile.fr.

Genere le : 2026-04-27
Branche analysee : `master`
Repertoire : `/Users/musiqfreed/Documents/project Musique Facile`

---

## 1. Stack technique

| Element | Valeur |
|---|---|
| Framework | **Astro** |
| Version | **4.15.3** (declaree dans `package.json`, dependency `astro: ^4.15.3`) |
| Renderer | **SSG (statique pur)** — `output: 'static'` dans `astro.config.mjs` |
| Package manager | **npm** (presence de `package-lock.json`, pas de `pnpm-lock.yaml` ni `yarn.lock`, `engines.node >= 22.0.0` dans `package.json`) |
| Bundler | Vite (via Astro), minification Terser |
| Langage | TypeScript partiel (schemas Zod sur les content collections, tsconfig minimal qui etend `astro/tsconfigs/base`) |
| CSS | CSS pur (pas de Tailwind, pas de PostCSS) |
| Plugins markdown | 3 plugins remark custom : `remark-custom-blocks.mjs`, `remark-optimize-images.mjs`, `remark-lazy-images.mjs` |

### Methode de deploiement

- **Aucun workflow GitHub Actions** : pas de dossier `.github/` dans le repo (verifie).
- **Vercel** : config presente dans `vercel.json` a la racine
  (`framework: astro`, `buildCommand: npm run build`, `outputDirectory: dist`).
  Cache headers immutables sur `/assets/`, `/fonts/`, `/images/`.
- **Netlify** : `netlify.toml` present mais quasi vide
  (`# Redirects et headers sont geres via public/_redirects et public/_headers.`).
  Probable reliquat d'un ancien hebergement, **pas le deploiement actuel**.
- README mentionne `o2switch` comme hebergement reel ?? — incoherence avec le
  `vercel.json`. Le README precise : *"Migration vers Vercel en cours"*. La
  memoire projet (notes locales) indique `o2switch` comme hebergeur historique.
  ?? **Etat reel du deploiement a confirmer avec l'operateur**.
- Pas de script SFTP/rsync dans `scripts/` (les fichiers presents sont
  `analyze-blog-articles.js`, `convert-to-webp.js`, `normalize-prod-field.sh` —
  utilitaires editoriaux, pas du deploy).
- Le commit le plus recent (`b5b7cfa`) est `docs: add Vercel deployment
  checklist and tech debt notes`, qui confirme la migration Vercel en cours.

---

## 2. Structure des articles

| Element | Valeur |
|---|---|
| Dossier (absolu) | `/Users/musiqfreed/Documents/project Musique Facile/src/content/blog/` |
| Dossier (relatif) | `src/content/blog/` |
| Format | `.md` Markdown standard avec frontmatter YAML (pas de MDX) |
| Convention nommage | `slug-en-kebab-case.md` (le nom de fichier EST le slug, voir section 4) |
| Sous-dossiers | **Aucun** — tous les articles a plat dans `src/content/blog/` |

### Comptage des articles

- Fichiers `.md` totaux dans `src/content/blog/` : **99**
- Articles avec `prod: N` (brouillons exclus du build) : **9**
- Articles sans champ `prod` : **0** (tous les .md ont un champ `prod`)
- Articles publiables (prod: Y et date <= aujourd'hui) : **~88**
  (le slug `[slug].astro` filtre aussi sur `datePublished <= now`)
- Article le plus recent (par `datePublished` dans le frontmatter) :
  `rythmiques-ukulele-debutant-3-patterns-faciles.md` — datePublished
  **2026-05-04** (date future a la date du rapport, donc article programme,
  exclu temporairement du build)

### Articles brouillons (`prod: N`)

```
accords-guitare-debutant-guide-ultime.md
astuces-progresser-guitare-debutant.md
choisir-ukulele-2025.md
conseils-pour-debuter-la-guitare.md
erreurs-debutant-guitare-solutions.md
exemple-mise-en-forme.md
exercices-accords-guitare-debutant.md
pourquoi-le-ukulele-est-ideal-pour-apprendre-la-musique.md
techniques-jouer-accords-guitare.md
```

`exemple-mise-en-forme.md` est explicitement un fichier de demonstration de
formatage. Les autres sont probablement des anciennes versions desactivees
(la plupart ont des doublons avec slugs proches, ex.
`erreurs-debutant-guitare-solutions.md` vs `erreurs-debutants-guitare.md`).

### Article non commite (etat git)

Le fichier `src/content/blog/10-minutes-par-jour-valent-mieux-que-2-heures-dimanche.md`
est present dans le repertoire mais **non commite** (untracked dans
`git status`). Il a `datePublished: 2026-04-20` et `prod: "Y"`. Idem pour
`public/images/blog/10-minutes-par-jour-pratique-musique.webp`. **A
considerer pour le pipeline** : un article peut exister sur disque sans etre
commite — il sera quand meme inclus dans le build local mais pas dans le
deploiement tant qu'il n'est pas pousse.

---

## 3. Format du frontmatter — analyse des 3 articles les plus recents

Les 3 articles selectionnes (par `datePublished` decroissant) :

1. `rythmiques-ukulele-debutant-3-patterns-faciles.md` — 2026-05-04
2. `quel-piano-numerique-acheter-guide-comparatif-debutant.md` — 2026-04-27
3. `pourquoi-tiktok-ne-peut-pas-vous-apprendre-la-musique.md` — 2026-04-27

### Tableau croise des champs

| Champ | Type | Article 1 | Article 2 | Article 3 | Schema Zod | Statut effectif |
|---|---|---|---|---|---|---|
| `title` | string | OUI | OUI | OUI | requis | **OBLIGATOIRE** |
| `description` | string | OUI | OUI | OUI | requis | **OBLIGATOIRE** |
| `author` | string | OUI | OUI | OUI | requis | **OBLIGATOIRE** |
| `ogImage` | string (path) | OUI | OUI | OUI | requis | **OBLIGATOIRE** |
| `datePublished` | string (YYYY-MM-DD) | OUI | OUI | OUI | requis | **OBLIGATOIRE** |
| `dateModified` | string (YYYY-MM-DD) | OUI | OUI | OUI | requis | **OBLIGATOIRE** |
| `meta` | string | OUI | OUI | OUI | optionnel | **DE FACTO TOUJOURS PRESENT** |
| `keywords` | string (CSV) | OUI | OUI | OUI | optionnel | **DE FACTO TOUJOURS PRESENT** |
| `publisher` | string | OUI | OUI | OUI | optionnel | **DE FACTO TOUJOURS PRESENT** |
| `publisherLogo` | string (URL) | OUI | OUI | OUI | optionnel | **DE FACTO TOUJOURS PRESENT** |
| `prod` | enum "Y"/"N" | OUI | OUI | OUI | optionnel | **OBLIGATOIRE** pour publication (filtre dans `[slug].astro`) |
| `schemaType` | string | OUI | OUI | OUI | optionnel | **DE FACTO TOUJOURS PRESENT** (valeur "BlogPosting") |
| `instrument` | enum | OUI ("ukulele") | OUI ("piano") | OUI ("général") | optionnel | **DE FACTO TOUJOURS PRESENT** |
| `level` | enum | OUI ("débutant") | OUI ("débutant") | OUI ("intermédiaire") | optionnel (default "tous-niveaux") | **DE FACTO TOUJOURS PRESENT** |
| `category` | enum | OUI ("pratique") | OUI ("pratique") | OUI ("pratique") | optionnel | **DE FACTO TOUJOURS PRESENT** |
| `siloSlug` | string | OUI | OUI | OUI | optionnel | **PRESENT SUR LES 3** |
| `introduction` | string | OUI | OUI | OUI | optionnel | **DE FACTO TOUJOURS PRESENT** |
| `conclusion` | string | OUI | OUI | OUI | optionnel | **DE FACTO TOUJOURS PRESENT** |
| `tags` | array of string | non | OUI | non | optionnel (default []) | **OPTIONNEL** |
| `videos` | array `{title, url}` | OUI | non | non | optionnel | **OPTIONNEL** |
| `faqs` | array `{question, answer}` | non | OUI | non | optionnel | **OPTIONNEL** |
| `pillar` | boolean | non | non | non | optionnel (default false) | **OPTIONNEL** (peu utilise) |
| `multi` / `prev` / `next` / `number` | series | non | non | non | optionnel | **OPTIONNEL** (series multi-pages) |
| `theme` | enum | non | non | non | optionnel | **OPTIONNEL** (rarement utilise dans les articles recents) |
| `songInfo` | object | non | non | non | optionnel | **OPTIONNEL** (chansons en lien avec le livre) |
| `podcast` | object `{url}` | non | non | non | optionnel | **OPTIONNEL** |
| `relatedLinks` | array `{title, url}` | non | non | non | optionnel | **OPTIONNEL** |

### Exemples reels (extraits)

```yaml
title: "Rythmiques Ukulélé : 3 Patterns Incontournables"
description: "Trois rythmiques simples pour ukulélé débutant, avec des repères clairs..."
meta: "Découvrez comment maîtriser des rythmiques simples pour débutants..."
keywords: "rythmique ukulélé débutant, strumming ukulélé facile, apprendre ukulélé en rythme, cours ukulélé adulte"
author: "Musique Facile"
publisher: "Musique Facile"
publisherLogo: "https://musique-facile.fr/logo.webp"
ogImage: "/images/blog/rythmiques-ukulele-debutant-3-patterns-faciles.webp"
datePublished: "2026-05-04"
dateModified: "2026-05-04"
introduction: "Envie de donner du relief..."
conclusion: "En somme, maîtriser ces trois patterns..."
videos:
  - title: "Une belle histoire – Play Along Guitare #Shorts"
    url: "https://youtu.be/fNKFL5HsImY"
prod: Y
schemaType: "BlogPosting"
instrument: "ukulele"
level: "débutant"
category: "pratique"
siloSlug: "debuter-ukulele-methode-simple-apprendre"
tags: ["piano numérique", "débutant", "comparatif", "achat instrument", "guide"]  # exemple article 2
faqs:
  - question: "Quel est le meilleur piano numerique pour un debutant ?"
    answer: "Pour un budget serre, le Casio CDP-S110..."
```

### Source de verite : `src/content/config.ts`

Le schema Zod (collection `blog`, lignes 223-280) liste tous les champs
acceptes. Tout champ non declare dans le schema sera **rejete au build**.
Pour ajouter un nouveau champ, il faudra modifier ce fichier.

### Synthese pour le pipeline editorial

**Champs minimums imposes par le schema Zod** : `title`, `description`,
`author`, `ogImage`, `datePublished`, `dateModified`.

**Champs minimums effectifs pour un article publie correctement** (au-dela
du schema, ce qui est attendu en pratique) :
- les 6 obligatoires ci-dessus
- `prod: Y` (sinon non genere par `[slug].astro`)
- `instrument` (sinon le breadcrumb d'instrument et le filtrage par
  instrument du listing ne fonctionnent pas correctement)
- `category` (utilise par `FilterBar.astro` du listing)
- `introduction` (rendue avant le contenu par le template)
- `conclusion` (rendue apres le contenu par le template)
- `ogImage` doit pointer vers un fichier qui existe dans `public/images/blog/`

**Champs recommandes pour SEO/qualite** : `meta`, `keywords`, `tags`,
`level`, `siloSlug`, `schemaType`, `publisher`, `publisherLogo`.

---

## 4. Convention de slug

- **Le slug est derive du nom de fichier**, sans champ frontmatter dedie.
  Source : `src/pages/blog/[slug].astro` ligne 29 — `params: { slug: entry.slug }`.
  Astro derive `entry.slug` automatiquement du nom de fichier (le
  basename sans `.md`, lowercase, slugifie).
- Pas de fonction de transformation custom : Astro applique sa logique
  par defaut (lowercase + tirets, suppression des extensions).
- **Pas de regle de longueur** declaree dans le code.
- **Convention observee dans les fichiers** :
  - Tout en minuscules
  - Mots separes par des tirets `-`
  - Pas d'accents (les caracteres dans les noms de fichiers sont strictement
    ASCII : `apprendre-coldplay-piano-guitare-ukulele.md`,
    `pourquoi-le-ukulele-est-ideal-pour-apprendre-la-musique.md`)
  - Pas d'underscore, pas de point sauf `.md`
  - Une exception sur la casse : `Nous-on-sait-guitare-tuto.md` commence
    par une majuscule. Astro slugifie en minuscules malgre tout (l'URL
    finale sera `nous-on-sait-guitare-tuto`). ?? **Comportement a
    eviter** dans le pipeline : forcer le nom de fichier en minuscules.

**Pour le pipeline** : generer un nom de fichier `<slug>.md` en
minuscules-tirets, ASCII pur (pas d'accents francais, pas d'apostrophes,
pas d'espaces). L'URL finale sera `https://musique-facile.fr/blog/<slug>/`.

---

## 5. Gestion des images

| Element | Valeur |
|---|---|
| Dossier (absolu) | `/Users/musiqfreed/Documents/project Musique Facile/public/images/blog/` |
| Dossier (relatif) | `public/images/blog/` |
| Nombre d'images presentes | **103 fichiers** dans `public/images/blog/` |
| Format attendu | **`.webp`** (utilise par 100% des articles recents) |
| Exception observee | `exemple-mise-en-forme.jpg` (1 seul article, et c'est un brouillon `prod: N`) |
| Tailles | Pas de contrainte declaree dans le schema Zod ni dans le template. Les fichiers existants vont de ~50 Ko a ~111 Ko. ?? Aucune dimension imposee dans le code, mais le hero (`article-hero-bg`) utilise l'image en `background-image` plein cadre — privilegier un format paysage (16:9 ou 3:2) en ~1200x800 ou plus pour ne pas pixeliser sur grand ecran |

### Reference dans le frontmatter

L'image hero/OG est referencee par le champ **`ogImage`** :

```yaml
ogImage: "/images/blog/<slug>.webp"
```

Convention observee : le nom du fichier image suit **le slug de l'article**
(meme nom de base). Ex: article `rythmiques-ukulele-debutant-3-patterns-faciles.md`
=> image `rythmiques-ukulele-debutant-3-patterns-faciles.webp`.

Cette convention n'est pas imposee par le code (le chemin peut etre
arbitraire), mais elle est respectee partout — **a maintenir dans le pipeline**
pour la coherence editoriale et SEO.

### Images dans le corps de l'article

Inserees en Markdown standard : `![alt](/images/blog/<slug>.webp)`. Les
plugins remark custom (`remark-optimize-images`, `remark-lazy-images`)
ajoutent automatiquement des attributs `loading="lazy"`, `decoding="async"`
et l'optimisation sharp build-time.

### Astro Image / Sharp

`astro.config.mjs` configure Sharp comme moteur d'images (`webp`, `avif`,
qualite 80/70). Le service Astro Image n'est pas utilise dans `[slug].astro`
pour les ogImage : c'est un chemin static `public/images/blog/...`. Donc
**pas de transformation automatique a la volee** — l'image deposee est servie
telle quelle.

---

## 6. Categories et tags

### Categories — enum ferme

Defini par le schema Zod (`src/content/config.ts:240`) :

```ts
category: z.enum(['débutant', 'intermédiaire', 'avancé', 'théorie',
                  'pratique', 'tutoriel', 'général']).optional()
```

**Toute autre valeur sera rejetee au build.** Distribution observee sur
les 99 articles :

| Categorie | Nombre d'articles |
|---|---|
| (vide / non renseigne) | 56 |
| `pratique` | 23 |
| `tutoriel` | 13 |
| `général` | 4 |
| `théorie` | 2 |
| `débutant` | 1 |

`intermédiaire`, `avancé` : non utilises actuellement.

### Instruments — enum ferme

Defini par le schema (`src/content/config.ts:242`) :

```ts
instrument: z.enum(['guitare', 'piano', 'ukulele', 'solfege', 'général']).optional()
```

| Instrument | Nombre d'articles |
|---|---|
| (vide) | 56 |
| `guitare` | 21 |
| `ukulele` | 10 |
| `général` | 6 |
| `piano` | 5 |
| `solfege` | 1 |

?? Plus de la moitie des articles n'ont pas de champ `instrument` rempli —
ils ne beneficient pas du breadcrumb dynamique ni du filtre du listing.

### Niveaux — enum ferme (`level`)

`débutant`, `intermédiaire`, `avancé`, `tous-niveaux` (defaut). Defini dans
`config.ts:241`.

### Theme — enum ferme (`theme`, optionnel, peu utilise)

`guitar`, `piano`, `ukulele`, `solfege`, `general`. Different de `instrument`
sur l'orthographe (`guitar` au lieu de `guitare`). Champ historique, peu
utilise sur les articles recents.

### Tags — champ libre

Tableau de strings, **pas de vocabulaire ferme**. Utilise sur 7 articles
seulement (sur 99). Top des tags par frequence (toutes occurrences) :

| Tag | Frequence |
|---|---|
| `débutant` | 5 |
| `progression` | 2 |
| `guide` | 2 |
| `comparatif` | 2 |
| `achat instrument` | 2 |
| `accords` | 2 |
| `youtube`, `tutoriel`, `théorie`, `technique`, `sommeil`, `rythme`, `ressources`, `régularité`, `pratique quotidienne`, `pratique`, `piano numérique`, `guitare folk`, `fingerpicking`, `exercices`, `communauté`, `chansons`, `chaînes`, `apprentissage musique`, `adulte` | 1 chacun |

Le champ `tags` est present dans le schema mais **rarement renseigne**.
Pour le pipeline, c'est un signal d'opportunite editoriale : un nouveau
contenu pourrait introduire ses propres tags sans casser le build.

---

## 7. URL et structure de liens

### Pattern d'URL

```
https://musique-facile.fr/blog/<slug>/
```

- Source : `src/pages/blog/[slug].astro` (Astro file-based routing).
- Trailing slash present dans tous les liens du sitemap et des liens internes.
- Pas de prefixe par categorie ou par instrument dans l'URL.

Pages d'index par instrument :

```
/blog/                  # listing global
/blog/guitare           # liste filtree (page statique src/pages/blog/guitare.astro)
/blog/piano
/blog/ukulele
/blog/solfege
```

### Liens internes entre articles

Format Markdown standard, observe dans le contenu :

```markdown
[texte du lien](/blog/<slug>/)
```

ou en URL absolue :

```markdown
[texte du lien](https://musique-facile.fr/blog/<slug>/)
```

Les deux conventions coexistent dans le corpus actuel. **Recommandation
pour le pipeline** : privilegier les chemins relatifs `/blog/<slug>/` (avec
trailing slash) — plus robustes en cas de changement de domaine, plus courts.

### Liens vers les cours / pages produit

Les CTA editoriaux pointent vers :
- `/cours/cours-de-guitare`
- `/cours/cours-de-piano`
- `/cours/cours-de-ukulele`
- `/cours/cours-de-solfege`

Ces liens sont generes automatiquement par `[slug].astro` (section
"course-buttons" en bas de chaque article) — **pas besoin d'inclure ces
liens manuellement dans le markdown**.

### Composant CTA editorial

`ArticleCTA.astro` (importe par le template) injecte un CTA de formation
contextualise selon le champ `instrument` du frontmatter. Egalement, un
composant `RelatedArticles.astro` injecte 3 articles similaires
(intelligent, base sur tags + instrument + level + siloSlug).

---

## 8. Build et deploy

### Build

| Element | Valeur |
|---|---|
| Commande de build | `npm run build` (alias de `astro build`) |
| Output | dossier **`dist/`** a la racine |
| Etapes post-build | `astro-compress` (HTML/CSS/JS/SVG/images) integree dans le pipeline Astro |
| Duree typique | ~90 s (note dans la memoire projet locale) |
| Variante | `npm run build:prod` execute le build puis `analyze:bundle` (rapport de taille) |
| Sitemap | regenere a chaque build via `src/pages/sitemap.xml.ts` (pas le script `generate-sitemap` du `package.json` qui est un utilitaire separe) |

### Deploiement reel

- **Vercel** est la cible declaree :
  - `vercel.json` a la racine (framework astro, build cmd, output dir)
  - README *"Migration vers Vercel en cours"*
  - commit recent `feat: add vercel.json for Vercel deployment`
  - commit recent `docs: add Vercel deployment checklist and tech debt notes`
- **Pas de GitHub Actions** : pas de dossier `.github/`.
- **Pas de script de deploy SFTP/rsync** dans `scripts/` ni `scripts-nettoyage/`.
- Le site est branche a Vercel via integration Git automatique
  (vraisemblable : push sur master => deploiement Vercel). ?? **A confirmer
  avec le proprietaire** — l'integration Vercel n'est pas visible dans le
  code, c'est une config cote dashboard Vercel.
- ?? La memoire projet locale mentionne `o2switch` comme hebergement
  historique. Si la migration Vercel n'est pas encore live, le deploy reel
  pourrait passer par un upload manuel/FTP vers o2switch. **A clarifier
  avant de brancher un pipeline editorial automatique.**

---

## 9. Fichiers a connaitre

### Configuration projet

- `package.json` — dependencies, scripts npm, engines.node (>=22)
- `package-lock.json` — lockfile npm
- `astro.config.mjs` — config Astro (output static, image service sharp, plugins remark, optimisations Vite/Terser)
- `tsconfig.json` — extends `astro/tsconfigs/base` (minimal)
- `tsconfig.sitemap.json` — config separee pour la compilation du script `generate-sitemap`
- `.env.example` — `PUBLIC_GTM_ID`, `PUBLIC_SITE_URL`, ActiveCampaign/SendGrid (commentes)

### Configuration deploiement

- `vercel.json` — config Vercel (cible actuelle)
- `netlify.toml` — quasi vide, probablement obsolete ??
- `public/_redirects` — redirections Netlify-style (existe)
- `public/_headers` — headers Netlify-style (existe)
- `.htaccess` et `htaccess` (deux fichiers) — config Apache, **legacy
  o2switch** (12 ko et 10 ko respectivement). ?? Pas utilises sur Vercel,
  candidats au nettoyage.
- `public/robots.txt` — directives crawl, dont blocages IA bots et anciennes URLs WP

### Configuration contenu

- `src/content/config.ts` — **fichier critique** : schemas Zod pour
  collections `blog`, `courses`, `livres` (+ programmes/ressources).
  Toute modif de structure de frontmatter passe par la.
- `src/pages/blog/[slug].astro` — template article unique
- `src/pages/blog/index.astro` — listing
- `src/pages/sitemap.xml.ts` — generation sitemap dynamique

### Plugins Markdown custom

- `src/remark-custom-blocks.mjs` — gestion des blocs `<div class="info">`, `<div class="tip">`, etc.
- `src/remark-optimize-images.mjs` — ajout d'attributs sur les images Markdown
- `src/remark-lazy-images.mjs` — lazy loading

### Pas de fichier `categories.yml` ni `tags.yml`

Categories et level sont **hardcodes dans le schema Zod** (`config.ts`).
Les tags sont libres. Pour ajouter une nouvelle valeur de `category`,
il faut editer `config.ts` et faire un commit.

### Documents auxiliaires (audits, plans)

La racine contient ~30 fichiers `.md` de documentation/audit
(`AUDIT-*.md`, `OPTIMISATIONS-*.md`, `PLAN-*.md`, `RECAP-*.md`, etc.).
**Aucun n'a d'effet sur le build** — purement documentaires. A ignorer
pour le pipeline editorial.

---

## 10. Anomalies ou points d'attention

### Bloquants potentiels pour le pipeline

1. **Doublons d'articles** : plusieurs paires d'articles avec slugs proches
   et l'un en `prod: N`, ex.
   `erreurs-debutant-guitare-solutions.md` (N) vs `erreurs-debutants-guitare.md` (Y),
   `accords-guitare-debutant-guide-ultime.md` (N), etc. Le pipeline doit
   verifier avant publication qu'il n'existe pas deja un article avec un slug
   tres proche pour eviter la cannibalisation SEO.
2. **Article non commite** : `10-minutes-par-jour-valent-mieux-que-2-heures-dimanche.md`
   et son image associee sont present sur disque mais hors git. Le pipeline
   doit imposer `git add` + commit + push pour qu'un article soit reellement
   deploye sur Vercel.
3. **Schema Zod strict** : tout champ frontmatter non declare dans
   `src/content/config.ts` casse le build avec une erreur explicite. Le
   pipeline doit valider le frontmatter cote source ou se limiter aux
   champs listes section 3.
4. **Enum strict sur `category`, `level`, `instrument`, `theme`** : valeur
   hors enum => build casse. Liste exhaustive en section 6.
5. **`prod: Y` requis** : sans ce champ, l'article ne sera pas genere.
   Default schema Zod = pas de defaut (`prod: z.enum(['Y', 'N']).optional()`).
   Le filtre dans `[slug].astro` est `if (entry.data.prod !== 'Y') return false`,
   donc absence du champ = exclu du build. **A enforcer dans le template du pipeline.**
6. **`datePublished` dans le futur** : article exclu temporairement du build
   (filtre dans `[slug].astro` ligne 22-23). Comportement utile pour
   programmer des publications, mais peut surprendre si le pipeline poste
   un article future-dated par erreur.
7. **`ogImage` doit exister** : le chemin n'est pas valide au build (Astro
   ne checke pas le fichier statique), mais l'article s'affichera casse en
   prod. Le pipeline doit deposer l'image avant de pousser le markdown.

### Anomalies de contenu / hygiene

- **Image orphan en `.jpg`** : `exemple-mise-en-forme.jpg` (article brouillon).
- **Casse de fichier incoherente** : `Nous-on-sait-guitare-tuto.md` commence
  par une majuscule (URL finale en minuscules malgre tout, mais le commit
  est sale).
- **9 articles `prod: N`** : tous sont des brouillons ou anciennes versions.
  Pas de menage prevu, ils sont simplement exclus du build.
- **Champ `tags` largement non rempli** : 92 articles sur 99 ont `tags: []`
  ou `tags:` vide. Le composant `RelatedArticles` repose en partie sur les
  tags pour suggerer des articles similaires — sa pertinence est degradee.
- **Champ `category` largement non rempli** : 56 articles sur 99 sans
  category. Idem.
- **Champ `instrument` largement non rempli** : 56 articles sans instrument.
  Le breadcrumb dynamique et le filtre par instrument du listing perdent
  ces articles.
- **Coexistence de deux conventions de date** : la majorite utilise
  `"2026-04-27"` (YYYY-MM-DD entre quotes), parfois sans quotes, parfois
  avec des dates au format different. Le schema accepte n'importe quelle
  string (`z.string()`), mais le code cote pages fait un `new Date(...)` —
  si le format est invalide, l'article peut etre involontairement filtre.
  **Le pipeline doit imposer `YYYY-MM-DD`**.

### Dette technique declaree dans le repo

- README precise :
  - `astro-compress` redondant avec gzip/brotli auto de Vercel — candidat
    au retrait apres stabilisation.
  - `PUBLIC_SITE_URL` documentee dans `.env.example` mais **non utilisee
    dans le code** (le domaine est en dur dans le sitemap et les layouts).
  - Redirections WordPress non encore configurees dans `vercel.json`
    (a faire apres audit Search Console).
- Memoire projet locale mentionne :
  - Videos Vimeo cassees sur les pages cours (cote Vimeo, hors scope
    blog).
  - `Footer.astro` vs `FooterModern.astro` : deux footers coexistent dans
    le repo.

### TODO/FIXME dans le code

`grep` sur `src/content/blog/` n'a rien remonte — aucun TODO/FIXME inline
dans les articles. Pas de scan exhaustif du code TS/Astro effectue (hors
scope du rapport).

### Fichiers de tests / drafts non publies

Voir liste des `prod: N` plus haut. `exemple-mise-en-forme.md` est
explicitement un fichier de demo, a conserver pour reference de mise en
forme mais ne pas publier.

### Coherence Vercel / o2switch

?? Le repo contient simultanement :
- `vercel.json` (cible declaree, commits recents)
- `netlify.toml` (vide, probablement obsolete)
- `.htaccess` (config Apache, lie a o2switch)
- `public/_redirects` et `public/_headers` (style Netlify)

Cette superposition est typique d'une migration **non finalisee**. **Avant
de brancher un pipeline editorial automatique** : confirmer ou est servi
le site en production reelle, pour s'assurer que `git push origin master`
declenche bien un deploy.

---

## Annexe — Quick reference pour le pipeline

### Template minimal d'un article publiable

Fichier `src/content/blog/<slug-en-kebab-case>.md` :

```markdown
---
title: "Titre de l'article"
description: "Description courte SEO (~150 caracteres)"
author: "Fred Fieffé"
ogImage: "/images/blog/<slug-en-kebab-case>.webp"
datePublished: "2026-05-01"
dateModified: "2026-05-01"
prod: "Y"
schemaType: "BlogPosting"
instrument: "guitare"           # enum: guitare|piano|ukulele|solfege|général
level: "débutant"               # enum: débutant|intermédiaire|avancé|tous-niveaux
category: "pratique"            # enum: débutant|intermédiaire|avancé|théorie|pratique|tutoriel|général
tags: ["tag1", "tag2"]          # libre
keywords: "mot1, mot2, mot3"    # CSV pour SEO
meta: "Meta description SEO"
publisher: "Musique Facile"
publisherLogo: "https://musique-facile.fr/logo.webp"
introduction: "Texte d'introduction qui sera rendu avant le contenu."
conclusion: "Texte de conclusion qui sera rendu apres le contenu."
---

## Premier H2

Contenu Markdown standard...
```

### Image associee

A deposer dans `public/images/blog/<slug-en-kebab-case>.webp` (meme slug
que le fichier `.md`).

### URL finale

`https://musique-facile.fr/blog/<slug-en-kebab-case>/`

### Verification avant deploy

```bash
npm run build       # ~90 s, casse si schema Zod viole
npm run preview     # check local sur localhost:4321
```

Le build remonte les erreurs de schema Zod avec le nom du fichier fautif
et le champ en cause — c'est la principale ligne de defense pour valider
un article avant publication.
