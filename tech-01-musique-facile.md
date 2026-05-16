# Etat des lieux technique : musique-facile.fr

Date de l'audit : 2026-04-19
Commit inspecte : 8286798ad83b3d3524da0eaf0057a2557345ddf4 (branche feature/evolution-2026)

## 1. Stack et versions

- **Framework principal** : Astro 4.15.3 (mode SSG, output: static)
- **Node.js en local** : v22.14.0 (le workflow GitHub Actions utilise Node 16, ce qui est obsolete et incompatible avec Astro 4.x)
- **Gestionnaire de paquets** : npm 11.8.0
- **TypeScript** : oui, config minimale (extends: astro/tsconfigs/base). Typage partiel : les schemas Zod dans config.ts sont types, mais les composants Astro utilisent des interfaces manuelles
- **Bundler** : Vite (via Astro), avec minification Terser, code splitting manual (vendor chunk)
- **CSS** : CSS pur (global.css + article.css + styles inline par composant). Pas de Tailwind, pas de PostCSS, pas de preprocesseur
- **Fonts** : @fontsource/poppins et @fontsource/raleway (chargees localement, pas de CDN)
- **Compression** : astro-compress (HTML, CSS, JS, SVG, images via sharp)
- **Images** : sharp pour l'optimisation build-time (WebP, AVIF, JPEG, PNG)

## 2. Architecture du repo

```
.
├── astro.config.mjs          # Config Astro + Vite + plugins remark
├── tsconfig.json              # Config TS minimale
├── package.json               # Deps et scripts
├── .env.example               # Variables d'environnement documentees
├── .github/workflows/deploy.yml  # Workflow GitHub Pages (obsolete, voir section 5)
├── public/
│   ├── robots.txt             # Robots avec directives IA bots
│   ├── fonts/                 # Fonts woff2 locales
│   ├── images/                # 509 fichiers, 39 Mo (299 WebP, 187 JPG/PNG, reste: SVG/autres)
│   │   ├── blog/              # Images articles
│   │   ├── cours/             # Images pages cours
│   │   ├── icons/             # Icones
│   │   ├── livres/            # Couvertures livres
│   │   ├── logo/              # Logos
│   │   ├── prof/              # Photos professeurs
│   │   └── ressource/         # Images ressources
│   └── .well-known/           # Verification domaine
├── src/
│   ├── content/               # Collections Astro (markdown + frontmatter YAML)
│   │   ├── blog/              # 98 articles markdown
│   │   ├── courses/           # 18 fiches cours
│   │   ├── legal/             # 2 pages legales
│   │   ├── livres/            # 5 fiches livres
│   │   ├── programmes/        # 18 programmes detailles
│   │   └── ressources/        # 7 ressources gratuites
│   ├── content/config.ts      # Schemas Zod pour toutes les collections
│   ├── components/            # ~40+ composants Astro
│   │   └── blog/              # Composants specifiques blog (PillarLink, ArticleCTA)
│   ├── config/                # Configuration site
│   ├── data/                  # Donnees statiques
│   ├── layouts/               # 4 layouts (Layout, ArticleLayout, CourseLayout, ProgrammeLayout)
│   ├── pages/                 # Routing file-based Astro
│   │   ├── blog/              # [slug].astro + pages listing par instrument
│   │   ├── cours/             # [slug].astro + pages statiques par instrument
│   │   ├── livres/            # Pages livres
│   │   ├── ressources/        # Pages ressources
│   │   └── ressources-gratuites/  # Pages ressources gratuites
│   ├── remark-custom-blocks.mjs   # Plugin remark custom
│   ├── remark-lazy-images.mjs     # Plugin remark lazy loading images
│   ├── remark-optimize-images.mjs # Plugin remark optimisation images
│   ├── scripts/               # JS client-side (animations)
│   ├── styles/                # CSS globaux
│   └── utils/                 # Utilitaires + middleware
├── scripts/                   # Scripts Node.js utilitaires
│   ├── analyze-blog-articles.js
│   ├── convert-to-webp.js
│   └── normalize-prod-field.sh
├── scripts-nettoyage/         # Scripts securite serveur (malwares, permissions)
├── Old/                       # Ancienne version du site (avec son propre node_modules)
├── seo-audit/                 # Audit SEO avec traductions prioritaires
├── docs/                      # Documentation interne
└── root/                      # Config n8n (workflow automation)
    └── .n8n/                  # Donnees n8n (git, ssh, binaryData)
```

## 3. Systeme d'articles

### Format et collections

Les articles sont des fichiers Markdown dans `src/content/blog/`. Le schema est defini dans `src/content/config.ts` via Zod. Astro compile le markdown au build avec ses propres pipelines remark/rehype.

### Champs front-matter blog (schema complet dans config.ts)

Champs obligatoires :
- `title` (string)
- `description` (string)
- `author` (string)
- `ogImage` (string, chemin relatif vers image)
- `datePublished` (string, format YYYY-MM-DD)
- `dateModified` (string, format YYYY-MM-DD)

Champs optionnels :
- `meta` (string) : meta description alternative pour SEO
- `keywords` (string) : mots-cles SEO
- `publisher` (string), `publisherLogo` (string)
- `theme` (enum: guitar, piano, ukulele, solfege, general)
- `tags` (array of strings, default [])
- `category` (enum: debutant, intermediaire, avance, theorie, pratique, tutoriel, general)
- `level` (enum: debutant, intermediaire, avance, tous-niveaux, default tous-niveaux)
- `instrument` (enum: guitare, piano, ukulele, solfege, general)
- `pillar` (boolean, default false) : indique un article pilier SEO
- `siloSlug` (string) : slug de l'article pilier parent (architecture en silos)
- `schemaType` (string) : type schema.org (defaut BlogPosting)
- `prod` (enum: Y/N) : flag de publication (filtre au build)
- `multi` (enum: Y/N) : article multi-pages
- `number`, `prev`, `next` (string) : navigation multi-pages
- `introduction` (string) : texte d'introduction affiche dans le hero
- `conclusion` (string) : texte de conclusion rendu en HTML
- `songInfo` (objet) : metadata chanson (inBook, bookPage, tempo, chordCount, key, difficulty)
- `videos` (array) : videos YouTube embeddees ({title, url})
- `podcast` (objet) : lien podcast ({url})
- `relatedLinks` (array) : liens associes ({title, url})
- `faqs` (array) : questions/reponses pour schema FAQPage ({question, answer})

### Slug et route

Le slug est derive du nom de fichier markdown (convention Astro content collections). Le fichier `src/content/blog/mon-article.md` produit la route `/blog/mon-article/`.

### Composant de rendu

`src/pages/blog/[slug].astro` : utilise `getStaticPaths()` avec `getCollection('blog')` pour generer toutes les pages au build. Filtre les articles dont `prod !== 'Y'` ou dont `datePublished` est dans le futur. Rend le contenu via `entry.render()` qui appelle le pipeline remark/rehype d'Astro.

### Libs markdown

- Pipeline natif Astro (remark-parse + remark-rehype + rehype-stringify via unified)
- 3 plugins remark custom : `remark-custom-blocks.mjs` (blocs custom type info/warning), `remark-optimize-images.mjs`, `remark-lazy-images.mjs`
- Pas de MDX

### Exemple de front-matter (article le plus recent)

Fichier : `src/content/blog/quel-piano-numerique-acheter-guide-comparatif-debutant.md`

```yaml
siloSlug: "guide-complet-apprentissage-piano"
title: "Quel piano numerique acheter ? Le guide comparatif 2026 pour debutants"
description: "Roland, Yamaha, Casio, Kawai... On a passe au crible les meilleurs pianos numeriques..."
meta: "Comparatif des meilleurs pianos numeriques pour debutants en 2026..."
author: "Fred Fieffe"
publisher: "Musique Facile"
publisherLogo: "https://musique-facile.fr/logo.webp"
ogImage: "/images/blog/guide-piano-numerique-debutant.webp"
datePublished: "2026-04-27"
dateModified: "2026-04-27"
introduction: "Vous avez decide de vous lancer dans le piano..."
conclusion: "Apres 20 ans a jouer, enseigner et tester des pianos..."
faqs:
  - question: "Quel est le meilleur piano numerique pour un debutant ?"
    answer: "Pour un budget serre, le Casio CDP-S110..."
prod: Y
schemaType: "BlogPosting"
instrument: "piano"
level: "debutant"
category: "pratique"
keywords: "quel piano numerique acheter, meilleur piano numerique debutant..."
tags: ["piano numerique", "debutant", "comparatif", "achat instrument", "guide"]
```

## 4. Routing et generation des pages

### Mode de generation

100% pre-rendu statique (SSG). Aucun SSR, aucun SPA. Output : fichiers HTML statiques dans `dist/`.

### Routes dynamiques

- `/blog/[slug]` : genere par `src/pages/blog/[slug].astro` a partir de la collection `blog`
- `/cours/[slug]` : genere par `src/pages/cours/[slug].astro` a partir de la collection `courses`
- Routes de listing blog par instrument : `src/pages/blog/guitare.astro`, `piano.astro`, `solfege.astro`, `ukulele.astro`

### Pages statiques

18 pages .astro a la racine de `src/pages/` : accueil, a-propos, contact, FAQ, offre, mentions legales, politique de confidentialite, 5-accords-magiques, quel-instrument-choisir, stages (2025 et 2026), etc.

### Pages cours "en dur"

En plus du [slug].astro dynamique, il existe des fichiers statiques pour les 4 cours principaux : `cours-de-guitare.astro`, `cours-de-piano.astro`, `cours-de-solfege.astro`, `cours-de-ukulele.astro`. Ceux-ci coexistent avec le routing dynamique. Hypothese : les pages statiques sont les landing pages principales et le [slug].astro gere les autres cours de la collection.

## 5. Build et deploiement actuels

### Scripts npm

- `dev` / `start` : `astro dev` (serveur de dev local)
- `build` : `astro build` (build de production)
- `build:prod` : `astro build && npm run analyze:bundle` (build + rapport taille)
- `preview` : `astro preview` (preview du build)
- `generate-sitemap` : compilation TS + generation manuelle (non utilisee en pratique, le sitemap est genere par `src/pages/sitemap.xml.ts`)
- `optimize-images` : `node scripts/convert-to-webp.js`
- `analyze:bundle` : affiche la taille du dist et les 10 plus gros JS

### Output

Le build produit un dossier `dist/` avec des fichiers HTML statiques, des assets hashes (JS, CSS, images), et un sitemap XML.

### Workflow GitHub Actions

Le fichier `.github/workflows/deploy.yml` est configure pour deployer sur GitHub Pages. Il ecoute la branche `main`, utilise Node 16, et deploie le dossier `dist/`. Ce workflow est clairement obsolete et non utilise : le site est deploye manuellement via SFTP vers o2switch d'apres le contexte du projet.

### Deploiement actuel

Build local (`npm run build`) puis transfert SFTP du dossier `dist/` vers le serveur o2switch. Aucun script d'automatisation SFTP n'a ete identifie dans le repo. Le processus est entierement manuel.

## 6. SEO technique

### Meta tags dynamiques

- `<title>` : dynamique par page, enrichi automatiquement pour les articles avec songInfo (ajout accords, difficulte, instrument, tempo)
- `<meta name="description">` : dynamique, enrichi pour songInfo
- `<meta name="keywords">` : optionnel, present si defini dans le frontmatter
- `<meta name="robots">` : configurable par page (defaut "index, follow")
- `<link rel="canonical">` : genere dynamiquement

### Open Graph et Twitter Cards

Complet sur toutes les pages :
- `og:type`, `og:url`, `og:title`, `og:description`, `og:image`
- `twitter:card` (summary_large_image), `twitter:url`, `twitter:title`, `twitter:description`, `twitter:image`

### Schema.org JSON-LD

- **Layout.astro** : schema WebPage generique sur toutes les pages
- **ArticleLayout.astro** : schema BlogPosting sur les articles (headline, description, image, author)
- **[slug].astro cours** : schemas Review pour chaque temoignage, schema Course complet
- **FAQSchema.astro** : schema FAQPage quand des FAQs sont presentes
- **BreadcrumbsSchema.astro** : schema BreadcrumbList pour le fil d'Ariane
- Point d'attention : le schema BlogPosting dans [slug].astro est minimal (pas de datePublished, dateModified, publisher dans le schema). Le layout ArticleLayout ajoute probablement ces champs (non verifie integralement)

### Sitemap

Genere dynamiquement par `src/pages/sitemap.xml.ts`. Couvre : blog, cours, programmes, ressources, livres, pages statiques. Filtre les articles non publies (prod !== 'Y') et les dates futures. Reference dans `robots.txt`.

### Robots.txt

Present dans `public/robots.txt`. Bien configure :
- Allow general
- Disallow pages specifiques (404, merci-lead-magnet, preview-refonte, maintenance, etc.)
- Blocage anciennes URLs WordPress
- Autorisation explicite des bots IA (ChatGPT, Perplexity, Claude, Gemini, etc.)
- Reference au sitemap

### Redirections

Non identifiees. Pas de fichier `_redirects`, pas de configuration de redirections dans astro.config.mjs. Les anciennes URLs WordPress ne sont pas redirigees (juste bloquees dans robots.txt).

## 7. Images et assets

### Emplacement

Toutes dans `public/images/`, organisees par sous-dossier thematique (blog, cours, icons, livres, logo, prof, ressource).

### Formats

- 299 fichiers WebP (format principal)
- 187 fichiers JPG/PNG (images plus anciennes ou non converties)
- 23 fichiers autres (SVG, etc.)

### Optimisation

- Script `scripts/convert-to-webp.js` pour conversion manuelle
- Plugins remark custom pour lazy loading (`remark-lazy-images.mjs`) et optimisation (`remark-optimize-images.mjs`)
- astro-compress applique une compression supplementaire au build (sharp, WebP quality 80, AVIF quality 70)
- Pas d'utilisation du composant `<Image>` natif d'Astro (les images sont referencees par chemin dans le markdown et le frontmatter)

### Taille

39 Mo pour le dossier images, 509 fichiers au total.

### Referencement dans les articles

Les images sont referencees par chemin relatif depuis `public/` dans le frontmatter (`ogImage: "/images/blog/mon-image.webp"`) et en markdown standard (`![alt](/images/blog/mon-image.webp)`).

## 8. Analytics, tracking, third-party

### Google Tag Manager

GTM-NP758HSC, charge en dur dans `Layout.astro` (balise script inline + noscript fallback). L'ID est aussi dans `.env.example` comme `PUBLIC_GTM_ID` mais le code utilise l'ID en dur, pas la variable d'environnement.

### Scripts externes

- Google Tag Manager (toutes les pages)
- Vimeo Player API (`player.vimeo.com/api/player.js`) : charge conditionnellement via `ExternalResources.astro`
- YouTube IFrame API (`youtube.com/iframe_api`) : charge conditionnellement
- Aucun Meta Pixel, Plausible, ou autre outil analytics identifie dans le code source (probablement configures dans GTM)

### Variables d'environnement (.env.example)

- `PUBLIC_GTM_ID=GTM-NP758HSC`
- `PUBLIC_SITE_URL=https://musique-facile.fr`
- `ACTIVECAMPAIGN_API_KEY` (commente, optionnel)
- `ACTIVECAMPAIGN_URL` (commente, optionnel)
- `SENDGRID_API_KEY` (commente, optionnel)

### Preconnect/DNS-prefetch

- googletagmanager.com (toujours)
- youtube.com, player.vimeo.com (conditionnel)
- google-analytics.com (Layout.astro)

## 9. Qualite du code et dette technique visible

### Typage TypeScript

Partiel. Les schemas Zod dans `config.ts` fournissent un typage fort pour les collections de contenu. Les composants Astro utilisent des interfaces Props manuelles. Pas de verification stricte (`tsconfig.json` etend juste `astro/tsconfigs/base`).

### Tests

Aucun test identifie (pas de dossier test, pas de framework de test dans les dependances).

### Linting

Pas de configuration ESLint, Prettier, ou autre linter dans le repo.

### Dependances

- Astro 4.15.3 : la version actuelle est Astro 5.x (publiee en 2025). Migration non triviale (breaking changes content collections)
- Le schema blog est defini deux fois : dans `astro.config.mjs` (propriete `collections`, format non-Zod) et dans `src/content/config.ts` (format Zod). C'est le fichier config.ts qui fait foi pour Astro. Le schema dans astro.config.mjs est un vestige, probablement inactif
- astro-compress 2.3.9 : dependance de dev
- unified/remark/rehype en dependencies (probablement utilises uniquement pour le script generate-sitemap, pas pour le pipeline markdown Astro qui a ses propres versions internes)
- `Old/` contient une ancienne version du site avec ses propres node_modules (poids mort)
- Node 16 dans le workflow GitHub Actions vs Node 22 en local

### Dette technique visible

1. **README** : c'est le template par defaut d'Astro "Starter Kit: Basics", non modifie. Aucune documentation projet
2. **Schema blog duplique** : config.mjs vs config.ts
3. **Workflow GitHub Actions obsolete** : deploy.yml pour GitHub Pages avec Node 16
4. **Dossier Old/** : ancienne version du site avec node_modules (~plusieurs centaines de Mo probablement)
5. **Footer duplique** : Footer.astro et FooterModern.astro coexistent (confirme dans les imports, ArticleLayout utilise FooterModern)
6. **GTM ID en dur** : la variable PUBLIC_GTM_ID existe dans .env.example mais n'est pas utilisee dans le code
7. **root/.n8n/** : configuration n8n versionnee dans le repo (git, ssh, binaryData) : potentiel probleme de securite si des cles sont presentes
8. **Pas de redirections** : les anciennes URLs WordPress ne sont pas redirigees, seulement bloquees via robots.txt

## 10. Volumetrie

### Contenu

| Collection   | Nombre de fichiers |
|-------------|-------------------|
| Blog        | 98 articles       |
| Cours       | 18 fiches         |
| Programmes  | 18 programmes     |
| Ressources  | 7                 |
| Livres      | 5                 |
| Legal       | 2                 |
| **Total**   | **148 fichiers MD** |

### Taille du repo

568 Mo (incluant node_modules, Old/, .git). Sans ces dossiers, probablement ~50-60 Mo dont 39 Mo d'images.

### Categories existantes

Blog : debutant, intermediaire, avance, theorie, pratique, tutoriel, general
Instruments : guitare, piano, ukulele, solfege, general
Architecture SEO : articles piliers (pillar: true) + articles satellites (siloSlug pointe vers le pilier)

## 11. URLs exemples pour inspection manuelle

Les 5 articles les plus recents (selon la date git des fichiers) :

1. https://musique-facile.fr/blog/quel-piano-numerique-acheter-guide-comparatif-debutant/
2. https://musique-facile.fr/blog/pourquoi-tu-stagnes-en-musique/
3. https://musique-facile.fr/blog/solfege-noms-des-notes/
4. https://musique-facile.fr/blog/debuter-ukulele-methode-simple-apprendre/
5. https://musique-facile.fr/blog/guide-complet-apprentissage-piano/

Note : l'article #1 a une datePublished au 2026-04-27, soit dans le futur au moment de cet audit. Il ne sera genere au build qu'apres cette date (filtre dans getStaticPaths).

## 12. Compatibilite Vercel

### Ce qui marche out-of-the-box

Astro est un framework de premier plan chez Vercel. Le mode SSG (`output: 'static'`) est supporte nativement. La commande de build standard (`astro build`) et le dossier de sortie (`dist/`) sont auto-detectes par Vercel.

### Configuration Vercel recommandee

- **Framework preset** : Astro
- **Build command** : `npm run build`
- **Output directory** : `dist`
- **Node.js version** : 22.x (a specifier explicitement)
- **Variables d'environnement** : `PUBLIC_GTM_ID`, `PUBLIC_SITE_URL` (bien que non utilisees dans le code actuellement)

### Ce qui poserait probleme

1. **astro-compress** : cette integration fait de la compression post-build. Sur Vercel, ce n'est pas un probleme technique, mais c'est redondant : Vercel applique deja du gzip/brotli sur les assets statiques. Le build sera plus long que necessaire
2. **Temps de build** : ~90 secondes annoncees. Avec 98 articles + 18 cours + images, c'est raisonnable pour Vercel (limite free tier : 45 minutes)
3. **Taille du deploy** : 39 Mo d'images dans public/. Vercel a une limite de 250 Mo sur la sortie. Le build devrait passer sans probleme
4. **Pas de _redirects** : les anciennes URLs WordPress ne seront pas redirigees. Il faudra ajouter un fichier `vercel.json` avec des redirects ou utiliser la config d'Astro

### Ce qui n'est pas un probleme

- Les plugins remark custom fonctionneront sans modification
- Le sitemap dynamique (sitemap.xml.ts) sera genere au build comme prevu
- Les fonts locales (@fontsource) n'ont pas de dependance reseau

## 13. Compatibilite pipeline editorial

### Format d'article a produire

Un fichier Markdown (`.md`, pas `.mdx`) dans `src/content/blog/`.

### Champs front-matter obligatoires pour le pipeline

```yaml
title: "Titre de l'article"               # string, requis
description: "Description courte"          # string, requis
author: "Fred Fieffe"                      # string, requis
ogImage: "/images/blog/nom-image.webp"     # string, chemin dans public/
datePublished: "2026-05-01"                # string, YYYY-MM-DD
dateModified: "2026-05-01"                 # string, YYYY-MM-DD
prod: "Y"                                  # enum Y/N, controle la publication
```

### Champs fortement recommandes pour le SEO

```yaml
instrument: "guitare"                      # enum: guitare, piano, ukulele, solfege, general
level: "debutant"                          # enum: debutant, intermediaire, avance, tous-niveaux
category: "pratique"                       # enum: debutant, intermediaire, etc.
tags: ["tag1", "tag2"]                     # array de strings
schemaType: "BlogPosting"                  # string
introduction: "Texte d'intro..."           # string, affiche dans le hero
meta: "Meta description alternative"       # string
keywords: "mot-cle 1, mot-cle 2"          # string
```

### Champs SEO avances (architecture en silos)

```yaml
siloSlug: "slug-article-pilier"            # string, rattache l'article a un pilier
pillar: false                              # boolean, true si c'est un article pilier
```

### Convention de slug

Le slug est le nom de fichier sans extension. Convention observee : tout en minuscules, mots separes par des tirets, pas d'accents. Exemples : `quel-piano-numerique-acheter-guide-comparatif-debutant`, `pourquoi-tu-stagnes-en-musique`.

### Ou poser les images generees

Dans `public/images/blog/`. Format recommande : WebP. Convention de nommage observee : slug de l'article ou description courte en kebab-case (ex: `guide-piano-numerique-debutant.webp`).

### Structure du corps markdown

- Titres H2 pour les sections principales
- Titres H3 pour les sous-sections
- Pas de H1 dans le corps (le H1 est genere par le template depuis le champ `title`)
- Images en markdown standard : `![alt](/images/blog/fichier.webp)`
- Blocs custom supportes via remark-custom-blocks (format a verifier)
- Liens internes relatifs : `[texte](/blog/slug/)` ou `[texte](/cours/cours-de-guitare/)`

## 14. Points de friction pour l'automatisation

### 1. Image d'en-tete obligatoire

Le champ `ogImage` est requis dans le schema Zod. Si le pipeline genere un article sans image, le build echoue. Le pipeline devra soit generer une image, soit utiliser une image placeholder par defaut. Le composant ArticleLayout utilise aussi cette image comme background du hero : une image manquante degrade visuellement la page.

### 2. Champ `introduction` traite comme texte brut

L'introduction est affichee dans le hero comme texte brut (`{introduction}`), pas comme HTML. Si le pipeline genere du markdown dans ce champ (gras, liens), ca ne sera pas rendu. Le champ `conclusion` en revanche est rendu en HTML (`set:html`). Cette asymetrie est un piege.

### 3. Champ `prod` par defaut

Le schema Zod definit `prod` comme optionnel (`z.enum(['Y', 'N']).optional()`). Si le pipeline omet ce champ, l'article passera le build mais la page [slug].astro filtre explicitement `prod !== 'Y'` : un article sans `prod: Y` ne sera pas genere. Le pipeline doit mettre `prod: "Y"` explicitement.

### 4. Filtre par date de publication

Les articles avec `datePublished` dans le futur ne sont pas generes au build. Si le pipeline genere un article aujourd'hui avec une date du jour, il faut que le build tourne apres cette date. Pas de probleme en soi, mais si le pipeline pre-programme des articles pour dans 3 jours, il faudra un mecanisme de rebuild automatique (cron Vercel, webhook, ou GitHub Action).

### 5. Architecture en silos non optionnelle pour le SEO

Pour que l'article soit correctement lie dans la structure SEO du site, il faut remplir `siloSlug` (slug de l'article pilier parent), `instrument`, `level`, `tags`. Sans ces champs, l'article existe mais il est orphelin : pas de breadcrumb instrument, pas de lien retour vers le pilier, pas de related articles pertinents.

### 6. Images non gerees par Astro Assets

Les images sont dans `public/` et referencees par chemin brut. Le pipeline devra deposer les images dans `public/images/blog/` avant le build. Sur Vercel avec deploiement Git, cela signifie que chaque article commite devra aussi commiter son image. Pas de CDN externe, pas d'API d'upload.

### 7. Pas de validation pre-build

Il n'existe aucun script de validation des frontmatter avant le build. Si le pipeline produit un frontmatter malformatif (champ enum avec une valeur non prevue, champ requis manquant), le build Astro echouera avec une erreur Zod. Le diagnostic ne sera visible que dans les logs de build Vercel. Il serait utile d'avoir un script de validation standalone.

### 8. Schema blog duplique

Le schema dans `astro.config.mjs` (propriete `collections`) utilise un format different du schema Zod dans `config.ts`. Si quelqu'un se fie au schema de astro.config.mjs pour construire le pipeline, il produira un frontmatter incorrect. Seul `config.ts` fait foi.

### 9. FAQs manuelles

Les FAQs sont definies dans le frontmatter, pas generees automatiquement. Pour le SEO, c'est un champ important (schema FAQPage). Le pipeline devra les generer.

### 10. Temps de build complet a chaque article

Astro SSG rebuild la totalite du site a chaque deploy. Avec ~150 fichiers de contenu et 509 images, le build prend ~90 secondes. C'est acceptable mais ca va croitre avec le nombre d'articles. Astro ne supporte pas le build incremental en mode SSG.

## 15. Recommandation d'arbitrage

### Option A : Lift-and-shift Vercel sans refonte

**Travaux necessaires :**
1. Creer un compte Vercel et lier le repo GitHub (~10 min)
2. Configurer le preset Astro, Node 22, variables d'env (~10 min)
3. Ajouter un fichier `vercel.json` pour les redirections WordPress et les headers de cache (~1h)
4. Tester le build sur Vercel et verifier les 5 URLs exemples (~1h)
5. Changer le DNS de o2switch vers Vercel (~30 min + propagation)

**Estimation** : 3-4 heures de travail effectif.

**Risques** : faibles. Astro SSG sur Vercel est un cas d'usage standard. Le seul risque est la decouverte de problemes specifiques au build en CI (dependances natives de sharp, par exemple) qui se resolvent generalement par une version de Node correcte.

**Benefices immediats** : deploy automatique sur push, preview deploys sur les PR, HTTPS automatique, CDN global, pas de SFTP manuel, logs de build accessibles.

### Option B : Refonte partielle avant migration

**Refactors qui vaudraient le coup :**
1. Supprimer le dossier `Old/` et le schema duplique dans astro.config.mjs (~30 min)
2. Migrer vers Astro 5.x (~2-4h, breaking changes sur content collections)
3. Creer un script de validation frontmatter pour le pipeline (~2h)
4. Nettoyer le workflow GitHub Actions obsolete (~10 min)
5. Ajouter le champ `prod` avec defaut "Y" dans le schema pour simplifier le pipeline (~30 min)
6. Migrer les images vers un CDN ou vers Astro Assets (src/assets) pour l'optimisation automatique (~4-6h)
7. Unifier Footer.astro et FooterModern.astro (~1h)
8. Utiliser la variable PUBLIC_GTM_ID au lieu du hardcode (~30 min)

**Estimation** : 12-16 heures pour l'ensemble, dont 6-10h pour les points 2 et 6 qui sont les plus impactants.

**Risques** : la migration Astro 5.x peut provoquer des regressions sur les 98 articles et 18 cours. Necessite un QA visuel. La migration images est un chantier en soi.

**Benefices durables** : pipeline editorial plus simple (moins de champs manuels, validation, images optimisees automatiquement), build plus rapide, moins de dette technique.

### Recommandation : Option A d'abord, puis les refactors de B en iterations

Le lift-and-shift prend 3-4 heures et debloque immediatement toute la chaine : deploy automatique, preview deploys, et surtout la possibilite de tester le pipeline editorial sans gerer le SFTP. Bloquer la migration Vercel sur une refonte partielle qui prend 2-3 jours n'a pas de sens quand le site fonctionne tel quel.

Une fois sur Vercel, les refactors de l'option B (surtout la validation frontmatter et le nettoyage du schema) deviennent des PR classiques avec preview deploy. C'est plus sur et plus rapide que de tout faire d'un bloc avant la migration.

Ce qui pencherait vers B d'abord : si la migration Astro 5.x etait bloquante pour le pipeline editorial (par exemple, si le format des content collections dans Astro 5 simplifiait radicalement le front-matter). Ce n'est pas le cas : le pipeline peut produire des articles compatibles avec Astro 4.x sans friction.

La seule action de B a faire avant le lift-and-shift : supprimer le dossier `Old/` pour alleger le repo (il pese probablement plusieurs centaines de Mo de node_modules inutiles, ce qui ralentit le clone git sur Vercel).
