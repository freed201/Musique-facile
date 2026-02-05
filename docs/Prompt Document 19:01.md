RÔLE
Tu es un “Documentation Architect” + “Technical Writer” senior. Tu travailles DANS le repo du site musique-facile.fr (stack Astro static) et tu dois produire une documentation ultra complète, maintenable, et exploitable comme “source de vérité” pour tous les futurs développements.

CONTEXTE (STACK CONFIRMÉE À VALIDER DANS LE CODE)
- Framework/SSG : Astro (site statique, output: "static") via astro dans package.json
- Build tool : Vite (configuré dans astro.config.mjs)
- Langage/outillage : Node.js + TypeScript (@types/node, typescript, scripts TS)
- Markdown/Content : Unified + Remark + Rehype (unified, remark-parse, remark-rehype, rehype-stringify) + plugins custom src/remark-*.mjs
- Images : Sharp (Astro image service + dep sharp) + script scripts/convert-to-webp.js
- Minification : Terser (terser + options Vite)
- Hébergement/headers : Netlify (netlify.toml)
- Fonts : Fontsource Poppins + Raleway (@fontsource/*)

OBJECTIF FINAL
Créer / mettre à jour une documentation en 9 fichiers Markdown dans /docs, numérotés, avec des titres compréhensibles, interconnectés par des liens, et 100% basés sur le code réel.
Cette doc servira de base à tout futur dev : elle doit donc expliquer le “comment ça marche” (as-is) + donner les règles pour évoluer sans casser.

CONTRAINTE CRITIQUE (NON NÉGOCIABLE)
- Interdiction de modifier le code du site.
- Tu peux UNIQUEMENT créer / modifier des fichiers dans /docs (et rien d’autre).
- Ne lance pas de commandes qui modifient le repo : PAS de npm install, pas de formatters, pas de scripts qui réécrivent des fichiers.
- Autorisés : lecture de fichiers (cat), listing (ls/find), recherche (rg/grep), consultation de package.json, astro.config.mjs, netlify.toml, etc.

RÈGLE “ZÉRO INVENTION”
- Tout ce qui est “en place” doit être prouvé par le code (fichiers/paths).
- Si un point est stratégique mais non présent dans le code, tu le mets dans “Recommandations / TODO”, séparé de “Existant”.

STRUCTURE OBLIGATOIRE : 9 DOCUMENTS DANS /docs
- /docs/1-architecture-technique-stack.md
- /docs/2-structure-projet-conventions.md
- /docs/3-workflow-publication-automatisation.md
- /docs/4-seo-geo-ciblage-strategie.md
- /docs/5-optimisation-images-performances.md
- /docs/6-conversion-engagement-funnel.md
- /docs/7-maintenance-monitoring-runbook.md
- /docs/8-seo-technique-structured-data.md
- /docs/9-workflows-checklists-operationnels.md

SI LES FICHIERS EXISTENT DÉJÀ
- Mets-les à jour (sans supprimer des infos utiles), aligne-les sur le template standard ci-dessous, corrige incohérences, ajoute sections manquantes.
SI ILS N’EXISTENT PAS
- Crée-les avec le contenu complet.

TEMPLATE STANDARD À RESPECTER DANS CHAQUE DOC
Chaque fichier commence par :
1) Titre H1 clair
2) Bloc “Meta” (en texte, pas besoin de frontmatter) :
   - Version : v1.0
   - Last updated : YYYY-MM-DD (date du jour)
   - Périmètre : (ce que couvre le doc)
   - Audience : (dev / SEO / marketing / ops / mix)
   - Liens : vers les autres docs pertinents (au moins 5 liens au total par doc)
3) Sections minimales (adaptées selon le doc) :
   - Vue d’ensemble (2-10 lignes)
   - Existant dans ce repo (as-is) : faits prouvés + chemins de fichiers
   - Comment ça marche (explication concrète)
   - Où toucher dans le code (liste de fichiers/dirs + responsabilités)
   - Conventions & règles à respecter (ce qui évite la casse)
   - Antipatterns / pièges (erreurs fréquentes spécifiques)
   - Checklist de validation (comment vérifier que c’est OK)
   - TODO / Recommandations (séparé et clairement identifié)

EXIGENCE QUALITÉ
- Ajoute au moins 1 diagramme Mermaid par doc quand ça a du sens (architecture, funnel, pipelines, etc.).
- Ajoute des tableaux quand utile (scripts, env vars, pages types, etc.).
- Ajoute des exemples concrets tirés du repo : frontmatter réel, structure d’une page, exemple de plugin remark, exemple de config netlify/headers.
- Mentionne les chemins exacts des fichiers importants (ex: astro.config.mjs, src/remark-*.mjs, scripts/convert-to-webp.js, netlify.toml, etc.).
- Pour les extraits de code : courts, utiles, et contextualisés (ne copie pas des pavés).

PROCÉDURE DE TRAVAIL (À EXÉCUTER MAINTENANT)
Étape A — Inventory “read-only”
1) Liste l’arborescence :
   - Racine du repo
   - /src (components, layouts, pages, content, styles…)
   - /public (assets)
   - /scripts
   - /docs (état actuel)
2) Ouvre et analyse impérativement :
   - package.json (+ lockfile seulement en lecture)
   - astro.config.mjs
   - tsconfig.json (si présent)
   - netlify.toml
   - vite config si séparée (vite.config.*) ou config intégrée Astro
   - tous les src/remark-*.mjs
   - scripts/convert-to-webp.js
   - toute config SEO : sitemap/robots, integrations Astro, RSS, redirects, headers, etc.
3) Déduis et note (avec preuves) :
   - scripts npm disponibles (dev/build/preview/lint/test/seo/…)
   - structure du routing Astro (où sont les pages)
   - où vivent les contenus (markdown, collections, frontmatter)
   - comment le pipeline Remark/Rehype est branché
   - comment l’optimisation images est réalisée (Sharp + script)
   - comment Netlify déploie (build command, publish dir, headers, redirects)
   - présence d’analytics, pixels, formulaire contact, newsletter, tracking UTM, etc. (si présent)
4) Recherche (rg/grep) des éléments clés :
   - “remark” “rehype” “unified”
   - “sharp” “AstroImage”
   - “terser”
   - “sitemap” “robots” “canonical”
   - “ld+json” “schema” “json-ld”
   - “gtag” “gtm” “analytics” “plausible”
   - “newsletter” “mail” “contact”
   - “process.env” (inventaire des variables d’environnement)
   -> Résultat attendu : une liste de constats prouvés (path + description).

Étape B — Production /docs (uniquement)
1) Crée ou mets à jour les 9 fichiers dans /docs avec les noms exacts.
2) Applique le template standard.
3) Ajoute des liens croisés entre docs :
   - En haut (Meta) + en bas (“Voir aussi”)
4) Inclus des “preuves repo” :
   - sections “Fichiers de référence” avec paths exacts
   - liste des scripts package.json (table)
   - liste des env vars (table) : NOM, où utilisé (path), description, obligatoire (si déductible)
5) Termine chaque doc par une checklist actionnable.

CONTENU ATTENDU PAR DOCUMENT (GUIDE PRÉCIS)
DOC 1 — Architecture technique & Stack
- Diagramme Mermaid : Astro build pipeline → output static → Netlify CDN/headers.
- Inventaire dépendances clés + rôle + où configuré.
- Astro config : integrations, markdown, image service, build output.
- Vite/Terser : où, comment, options.
- Netlify : build/publish, headers, redirects, caching.
- Chaîne Markdown : remark-parse → remark-rehype → rehype-stringify + plugins custom.
- Où sont les “entry points” (main pages/layouts).

DOC 2 — Structure projet & Conventions
- Arborescence annotée du repo.
- Conventions nommage (Astro/TS/JS/MJS/MD).
- Patterns composants / layouts / pages.
- Où vivent les styles (global, modules, tailwind si présent).
- Conventions de contenu : frontmatter, slugs, tags, catégories, instruments.
- Règles Git/branches si déductibles (sinon TODO).

DOC 3 — Workflow publication & Automatisation
- “Créer un article” : de 0 à commit (basé sur la structure réelle).
- Templates : exemple de frontmatter réel.
- Comment les remark plugins automatisent (TOC, headings, transformations, shortcodes, etc.) selon le code.
- Scripts utiles (convert-to-webp, autres scripts).
- Checklist de publication : preview local, build, validation liens, etc.

DOC 4 — SEO & Géo-ciblage (stratégie + ce qui est en place)
- Sépare clairement :
  A) SEO existant (prouvé : meta, canonical, sitemap, robots, OG, pages, structure)
  B) Stratégie recommandée (piliers/cluster, pages locales) si non implémentée
- Mapping “types de pages” → objectifs SEO.
- Internal linking : si présent, comment ; sinon recommandations.
- Mesure : quels outils/points de contrôle (GSC, lighthouse) -> checklist.

DOC 5 — Optimisation images & Performances
- Sharp/Astro Image : comment utilisé, conventions alt/dimensions, responsive.
- Script convert-to-webp.js : usage, entrées/sorties, limites, intégration (si hook build).
- Perf : LCP/CLS/INP (côté code : images, fonts, JS).
- Caching strategy Netlify (si headers présents).
- Checklist perf + “où intervenir”.

DOC 6 — Conversion & Engagement Funnel
- Sépare :
  A) Funnel réellement présent dans le repo (CTA, formulaires, pages, tracking)
  B) Funnel recommandé (structure landing, preuves sociales, lead magnet, emails) en TODO
- Pages de conversion : cours, programmes, contact, newsletter, etc. (déduites du routing).
- Tracking : events/UTM si présent.
- Checklist CRO (sans modifier le code).

DOC 7 — Maintenance & Monitoring (Runbook)
- Déploiement : comment déclenché, logs Netlify, rollback (si déductible).
- Routine audits : broken links, performance, SEO, deps (sans exécuter d’actions destructrices).
- Gestion incidents : 404, build fail, image pipeline, remark plugin errors.
- Stratégie updates deps : règles, fréquence, précautions.
- Checklist hebdo/mensuelle/trimestrielle.

DOC 8 — SEO technique & Structured Data
- Meta tags : existants (preuves) + recommandations.
- sitemap/robots : existants (preuves) + recommandations.
- JSON-LD/schema : présent ? où ? quels types ? (Course, FAQ, Breadcrumb, Organization, Person…)
- Hreflang : présent ? où ? (sinon TODO)
- Netlify headers sécurité : HSTS, CSP si présent (sinon TODO raisonné).
- Checklist validation : Rich Results Test, Lighthouse SEO, GSC.

DOC 9 — Workflows & Checklists opérationnels
- Procédures step-by-step basées sur le repo :
  - Ajouter un article blog
  - Ajouter une page cours/programme
  - Ajouter/optimiser une image
  - Corriger une 404 (Netlify redirects si présents)
  - Vérifier SEO technique (sitemap/robots/canonical)
  - Vérifier perf (lighthouse + points repo)
- Matrice “tâche → fichiers concernés → commande de vérif”.

FORMAT “RAPPORT FINAL” (APRÈS AVOIR ÉCRIT /docs)
Tu termines en affichant :
- Liste des fichiers créés/mis à jour (9 fichiers) + 1 ligne de résumé chacun.
- Un checklist global “Documentation prête” (oui/non) avec points à compléter.
- IMPORTANT : ne propose pas de modifier du code, uniquement la doc.

RAPPEL INTERDICTIONS
- Pas de modification hors /docs
- Pas de dépendances installées
- Pas d’exécution de scripts qui écrivent des fichiers
- Pas d’approximation : prouver ou marquer TODO

GO : exécute l’inventory, puis génère/maj les 9 docs dans /docs selon les règles ci-dessus.
