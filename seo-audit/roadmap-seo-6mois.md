# Roadmap SEO 6 mois — musique-facile.fr
**Généré le : 2026-02-17**
**Objectif : +50% trafic organique en 6 mois | Conquête FR + EN/DE/ES/IT**

---

## Contexte & état des lieux

| Atout | Détail |
|---|---|
| Framework | Astro SSG — Netlify |
| Contenu | 80+ articles blog, 18+ pages cours (markdown frontmatter) |
| Preuves sociales | 80 000+ élèves, note 4.7/5 |
| Offre | Paiement unique, accès à vie |
| Schémas existants | Schema.org Course sur pages cours |
| Sitemap | Dynamique, mais sans hreflang |

---

## Problèmes critiques à corriger (classés par priorité)

| # | Problème | Fichier(s) concerné(s) | Impact |
|---|---|---|---|
| 1 | Sitemap sans hreflang | `astro.config.mjs`, `Layout.astro` | Critique |
| 2 | Pas de BreadcrumbList sur les pages cours | `src/pages/cours/[slug].astro`, `src/layouts/CourseLayout.astro` | Haute |
| 3 | reviewCount incohérent (guitare 180, piano 1500 vs 2847 total) | `src/content/courses/*.md` | Haute |
| 4 | ogImage accueil = logo (mauvais CTR social) | `src/pages/index.astro` ou Layout racine | Moyenne |
| 5 | Title auto-tronqué avec "..." si trop long | `src/layouts/CourseLayout.astro` | Moyenne |
| 6 | Pas de FAQPage schema sur les pages cours | `src/pages/cours/[slug].astro` | Haute |
| 7 | Schema WebPage basique dans Layout.astro | `src/layouts/Layout.astro` | Moyenne |

---

## Outils recommandés (stack SEO projet)

| Outil | Usage | Fréquence |
|---|---|---|
| Google Search Console | Impressions, positions, CTR, erreurs index | Hebdomadaire |
| Google Analytics 4 | Trafic organique, conversions, comportement | Hebdomadaire |
| Screaming Frog SEO Spider | Audit technique complet, crawl | M1 + M3 + M6 |
| Rich Results Test (Google) | Validation schémas JSON-LD | Après chaque déploiement |
| Schema Markup Validator | Validation schémas complets | Après chaque déploiement |
| Ahrefs / SEMrush | Recherche mots-clés, analyse concurrents, backlinks | Mensuel |
| PageSpeed Insights / Lighthouse | Core Web Vitals | M1 + M3 + M6 |
| Notion / Linear | Suivi tâches SEO | Continu |
| DeepL Pro | Traductions EN/DE/ES/IT (M4-M5) | M4-M5 |
| Netlify Analytics | Données first-party sans cookie | Continu |

---

## MOIS 1 : Fondations techniques (Semaines 1-4)

**Objectif du mois :** Corriger tous les problèmes techniques bloquants, poser des bases solides pour l'indexation et les Rich Results.

---

### Semaine 1 — Audit complet + corrections critiques (schémas, canonical, meta)

#### Tâche 1.1 — Audit Screaming Frog complet
- **Action :** Crawler l'intégralité du site (pages cours, blog, accueil, ressources). Exporter les rapports : balises title/meta dupliquées ou manquantes, canonical absents ou incorrects, redirections 3xx/4xx, images sans alt, pages orphelines.
- **Fichiers :** Aucun (audit externe)
- **Impact SEO :** Base de travail pour toutes les semaines suivantes
- **Difficulté :** 2/5
- **Responsable :** SEO

#### Tâche 1.2 — Vérification et correction des balises canonical
- **Action :** S'assurer que chaque page exporte une balise `<link rel="canonical" href="..." />` correcte. Dans Astro SSG, vérifier que le canonical est généré dynamiquement depuis `Astro.url` et non hardcodé. Aucune page ne doit être en self-canonical avec une URL différente de l'URL canonique cible.
- **Fichiers :** `src/layouts/Layout.astro`, `src/layouts/CourseLayout.astro`, `src/layouts/BlogLayout.astro` (si existant)
- **Code type :**
```astro
<link rel="canonical" href={new URL(Astro.url.pathname, Astro.site).toString()} />
```
- **Impact SEO :** Haute — évite la dilution de jus de lien
- **Difficulté :** 2/5
- **Responsable :** Dev

#### Tâche 1.3 — Audit et correction Schema.org Course existants
- **Action :** Passer chaque fichier `src/content/courses/*.md` dans le Rich Results Test. Identifier les champs manquants ou invalides (`provider`, `offers.price`, `aggregateRating.reviewCount`). Corriger les incohérences de `reviewCount` (voir problème #3 — aligner sur une valeur cohérente par cours ou sur la valeur globale 80 000+ élèves).
- **Fichiers :** `src/content/courses/*.md`, `src/pages/cours/[slug].astro`
- **Impact SEO :** Haute — Rich Results "Course" dans SERP
- **Difficulté :** 3/5
- **Responsable :** Dev + SEO

#### Tâche 1.4 — Correction title auto-tronqué
- **Action :** Dans `CourseLayout.astro`, identifier le code qui génère le title. S'il concatene plusieurs champs et dépasse 60 caractères, tronquer proprement avec une logique JS (`title.length > 60 ? title.slice(0, 57) + '...' : title`) ou, mieux, définir un `seoTitle` court dans le frontmatter de chaque cours pour bypasser la génération automatique.
- **Fichiers :** `src/layouts/CourseLayout.astro`, `src/content/courses/*.md`
- **Impact SEO :** Moyenne — CTR SERP
- **Difficulté :** 2/5
- **Responsable :** Dev

#### Tâche 1.5 — Audit des balises meta description
- **Action :** Identifier les pages sans meta description ou avec une description trop courte (<120 caractères) ou trop longue (>160 caractères). Liste minimale : accueil, 18 pages cours, top 20 articles blog.
- **Fichiers :** `src/layouts/Layout.astro`, `src/layouts/CourseLayout.astro`, `src/content/courses/*.md`
- **Impact SEO :** Moyenne — CTR
- **Difficulté :** 2/5
- **Responsable :** SEO + Content

---

### Semaine 2 — Intégration FAQPage schema sur 6 pages cours

#### Tâche 2.1 — Identification des 6 pages cours prioritaires
- **Action :** Sélectionner les 6 pages cours avec le meilleur potentiel de Rich Results FAQ : guitare débutant, piano débutant, ukulélé débutant, solfège, guitare avancée, piano avancée. Ces pages ont déjà un composant FAQ existant dans le frontmatter — vérifier la structure des données.
- **Fichiers :** `src/content/courses/*.md` (frontmatter section `faq`)
- **Impact SEO :** Haute — Rich Results FAQ = +30% surface SERP
- **Difficulté :** 1/5
- **Responsable :** SEO

#### Tâche 2.2 — Génération du JSON-LD FAQPage dans CourseLayout
- **Action :** Dans `src/pages/cours/[slug].astro` ou `src/layouts/CourseLayout.astro`, ajouter la génération conditionnelle du schema FAQPage depuis les données frontmatter `faq`. Si le composant FAQ existe déjà côté HTML, s'assurer que le JSON-LD est également présent dans le `<head>`.
- **Fichiers :** `src/pages/cours/[slug].astro`, `src/layouts/CourseLayout.astro`
- **Code type :**
```astro
{course.data.faq && course.data.faq.length > 0 && (
  <script type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": course.data.faq.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  })} />
)}
```
- **Impact SEO :** Haute
- **Difficulté :** 3/5
- **Responsable :** Dev

#### Tâche 2.3 — Rédaction / enrichissement des FAQ dans les 6 fichiers cours
- **Action :** S'assurer que chaque cours prioritaire contient au minimum 5 questions/réponses pertinentes dans le frontmatter. Les questions doivent correspondre aux requêtes réelles des internautes (utiliser "People Also Ask" de Google et suggestions GSC).
- **Fichiers :** `src/content/courses/apprendre-guitare-debutant.md`, `src/content/courses/piano-facile-apprendre-debutant.md`, `src/content/courses/apprendre-ukulele-debutant.md`, `src/content/courses/solfege-expert-formation.md`, `src/content/courses/maitrise-technique-guitare-avancee.md`, `src/content/courses/maitrise-technique-piano-avancee.md`
- **Impact SEO :** Haute
- **Difficulté :** 2/5
- **Responsable :** Content

#### Tâche 2.4 — Validation Rich Results Test
- **Action :** Tester chaque page modifiée dans https://search.google.com/test/rich-results. Corriger les erreurs signalées avant déploiement.
- **Fichiers :** N/A (test externe)
- **Impact SEO :** Critique pour validation
- **Difficulté :** 1/5
- **Responsable :** SEO

---

### Semaine 3 — BreadcrumbList sur toutes les pages (cours, blog, ressources)

#### Tâche 3.1 — Implémentation BreadcrumbList JSON-LD dans CourseLayout
- **Action :** Ajouter le schema BreadcrumbList dans le `<head>` de chaque page cours. La hiérarchie cible est : Accueil > Cours > [Instrument] > [Titre du cours].
- **Fichiers :** `src/layouts/CourseLayout.astro`, `src/pages/cours/[slug].astro`
- **Code type :**
```astro
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": "https://musique-facile.fr/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Cours",
      "item": "https://musique-facile.fr/cours/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": course.data.instrument,
      "item": `https://musique-facile.fr/cours/${course.data.instrument}/`
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": course.data.title,
      "item": `https://musique-facile.fr/cours/${course.slug}/`
    }
  ]
})} />
```
- **Impact SEO :** Haute — Breadcrumbs visibles dans SERP
- **Difficulté :** 3/5
- **Responsable :** Dev

#### Tâche 3.2 — Implémentation BreadcrumbList sur les articles blog
- **Action :** Même logique dans le layout blog. Hiérarchie : Accueil > Blog > [Catégorie] > [Titre article].
- **Fichiers :** Layout blog (à identifier — potentiellement `src/pages/blog/[slug].astro`)
- **Impact SEO :** Haute
- **Difficulté :** 3/5
- **Responsable :** Dev

#### Tâche 3.3 — Composant Breadcrumb HTML visible (accessibilité + UX)
- **Action :** En plus du JSON-LD, ajouter un fil d'Ariane HTML visible en haut de chaque page cours et article blog. Utiliser des balises `<nav aria-label="fil d'Ariane">` et `<ol>` pour l'accessibilité.
- **Fichiers :** `src/components/Breadcrumb.astro` (créer), `src/layouts/CourseLayout.astro`, layout blog
- **Impact SEO :** Moyenne (UX + maillage interne)
- **Difficulté :** 2/5
- **Responsable :** Dev

---

### Semaine 4 — Correction incohérences (reviewCount, ogImage accueil, title truncation)

#### Tâche 4.1 — Alignement reviewCount dans tous les fichiers cours
- **Action :** Décider d'une stratégie cohérente : soit utiliser le nombre total global (2847 ou aligner avec 80 000+ élèves), soit utiliser un nombre par instrument cohérent et documenté. Mettre à jour tous les fichiers `.md` concernés. Ne jamais avoir guitare à 180 et piano à 1500 pour le même schema global.
- **Fichiers :** `src/content/courses/*.md` (champ `aggregateRating.reviewCount` dans frontmatter ou dans le template)
- **Valeurs recommandées :** reviewCount = 2847 global (cohérent avec le chiffre schema.org existant), ratingValue = 4.7
- **Impact SEO :** Haute — évite pénalité pour données structurées trompeuses
- **Difficulté :** 2/5
- **Responsable :** SEO + Dev

#### Tâche 4.2 — Remplacement ogImage accueil par image métier
- **Action :** Créer ou commander une image Open Graph dédiée pour la page d'accueil (1200x630px). Elle doit représenter un élève jouant de la musique, inclure le logo musique-facile.fr en overlay, et afficher la proposition de valeur principale. Remplacer le logo actuellement utilisé comme ogImage dans le head de la page accueil.
- **Fichiers :** `public/images/og-image-accueil.webp` (à créer), `src/pages/index.astro` ou `src/layouts/Layout.astro`
- **Impact SEO :** Moyenne — CTR depuis réseaux sociaux et partages
- **Difficulté :** 3/5 (nécessite création visuelle)
- **Responsable :** Dev + Design

#### Tâche 4.3 — Enrichissement Schema WebPage dans Layout.astro
- **Action :** Remplacer le schema WebPage basique par un schema `WebSite` avec `SearchAction` sur la page d'accueil, et des schemas `WebPage` enrichis (avec `about`, `author`, `dateModified`) sur les pages intérieures.
- **Fichiers :** `src/layouts/Layout.astro`
- **Code type :**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Musique Facile",
  "url": "https://musique-facile.fr",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://musique-facile.fr/recherche?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```
- **Impact SEO :** Moyenne
- **Difficulté :** 3/5
- **Responsable :** Dev

#### Tâche 4.4 — Correction finale title truncation
- **Action :** Vérifier sur les 18 pages cours que le title affiché dans Screaming Frog (colonne "Title 1") ne contient aucun "..." de troncature Astro. Si des titles dépassent 60 caractères, écrire un champ `seoTitle` court dans le frontmatter et le lire en priorité dans le layout.
- **Fichiers :** `src/content/courses/*.md`, `src/layouts/CourseLayout.astro`
- **Impact SEO :** Moyenne — CTR
- **Difficulté :** 2/5
- **Responsable :** SEO + Dev

---

### KPIs Mois 1

| KPI | Cible | Outil de mesure |
|---|---|---|
| Erreurs schema.org | 0 erreur critique (Rich Results Test) | Rich Results Test / Schema Validator |
| Pages avec canonical correct | 100% des pages crawlées | Screaming Frog |
| Pages avec meta description | 100% pages cours + top 20 blog | Screaming Frog |
| FAQPage schema validé | 6 pages cours | Rich Results Test |
| BreadcrumbList présent | 100% cours + 100% blog | Screaming Frog |
| reviewCount cohérent | 0 incohérence | Audit manuel |
| Core Web Vitals | LCP < 2.5s, CLS < 0.1 | PageSpeed Insights |

---

## MOIS 2 : Optimisation on-page (Semaines 5-8)

**Objectif du mois :** Maximiser le CTR et les impressions GSC via des meta tags optimisés et une production de contenu cluster structurée.

---

### Semaine 5 — Meta tags optimisés sur toutes les pages prioritaires

#### Tâche 5.1 — Audit CTR GSC par page
- **Action :** Dans Google Search Console > Performances > Pages, trier par impressions décroissantes. Identifier les 20 pages avec le CTR le plus faible (<2%). Ces pages sont prioritaires pour l'optimisation des titles et meta descriptions.
- **Fichiers :** N/A (audit GSC)
- **Impact SEO :** Haute
- **Difficulté :** 1/5
- **Responsable :** SEO

#### Tâche 5.2 — Réécriture titles pages cours (formule CTR)
- **Action :** Réécrire les balises title de toutes les pages cours selon la formule : `[Bénéfice principal] | [Mot-clé principal] | Musique Facile`. Exemples : "Apprendre la guitare en 30 jours | Cours débutant | Musique Facile" (57 caractères). Le mot-clé principal doit être en début de title.
- **Fichiers :** `src/content/courses/*.md` (champ `seoTitle` ou `title`), `src/layouts/CourseLayout.astro`
- **Impact SEO :** Haute — CTR direct
- **Difficulté :** 2/5
- **Responsable :** SEO + Content

#### Tâche 5.3 — Réécriture meta descriptions pages cours (formule conversion)
- **Action :** 120-155 caractères. Formule : `[Chiffre social proof] + [Bénéfice] + [Différenciateur] + [CTA implicite]`. Exemple : "80 000 élèves satisfaits. Apprenez la guitare seul en 30 jours, accès à vie, sans abonnement. Niveau débutant à avancé."
- **Fichiers :** `src/content/courses/*.md`, `src/layouts/CourseLayout.astro`
- **Impact SEO :** Haute — CTR
- **Difficulté :** 2/5
- **Responsable :** Content

#### Tâche 5.4 — Optimisation titles et meta descriptions top 20 articles blog
- **Action :** Même démarche que 5.2/5.3 pour les 20 articles blog avec le plus d'impressions GSC. Intégrer les requêtes exactes depuis GSC dans les titles.
- **Fichiers :** `src/content/blog/*.md` (top 20)
- **Impact SEO :** Haute
- **Difficulté :** 2/5
- **Responsable :** SEO + Content

---

### Semaine 6 — 8 articles cluster (priorité P1 guitare + piano)

#### Tâche 6.1 — Définition de la stratégie cluster guitare
- **Action :** Identifier la page pilier guitare (`/cours/apprendre-guitare-debutant`). Définir 4 articles satellites couvrant les requêtes longue traîne gravitant autour : accords de base, entretien guitare, types de guitares, apprendre les gammes. Chaque satellite doit pointer vers la page pilier via un lien interne contextuel.
- **Fichiers :** N/A (stratégie)
- **Impact SEO :** Haute — topical authority guitare
- **Difficulté :** 2/5
- **Responsable :** SEO

#### Tâche 6.2 — Rédaction 4 articles cluster guitare
- **Sujets :**
  1. "Les 10 accords de guitare indispensables pour débutants" — mot-clé cible : "accords guitare débutant" (vol. ~2 400/mois)
  2. "Comment entretenir sa guitare : guide complet nettoyage et réglage" — mot-clé : "entretien guitare" (vol. ~880/mois)
  3. "Quelle guitare choisir pour débuter ? Acoustique, classique ou électrique" — mot-clé : "choisir guitare débutant" (vol. ~1 600/mois)
  4. "Apprendre les gammes de guitare : méthode progressive" — mot-clé : "gammes guitare débutant" (vol. ~720/mois)
- **Fichiers :** `src/content/blog/` (4 nouveaux fichiers .md)
- **Format :** 1 500-2 000 mots, H2/H3 structurés, 1 lien interne vers page pilier, schema Article JSON-LD
- **Impact SEO :** Haute
- **Difficulté :** 3/5
- **Responsable :** Content

#### Tâche 6.3 — Rédaction 4 articles cluster piano
- **Sujets :**
  1. "Les gammes de piano pour débutants : do majeur à la bonne vitesse" — mot-clé : "gammes piano débutant" (vol. ~590/mois)
  2. "Lire une partition de piano : guide pas-à-pas pour débuter" — mot-clé : "lire partition piano" (vol. ~1 300/mois)
  3. "Quel piano numérique choisir en 2026 ? Top 5 pour débuter" — mot-clé : "piano numérique débutant" (vol. ~2 900/mois)
  4. "Apprendre le piano seul sans prof : est-ce possible ?" — mot-clé : "apprendre piano seul" (vol. ~2 400/mois)
- **Fichiers :** `src/content/blog/` (4 nouveaux fichiers .md)
- **Impact SEO :** Haute
- **Difficulté :** 3/5
- **Responsable :** Content

---

### Semaine 7 — 8 articles cluster (priorité P1 ukulélé + transversal)

#### Tâche 7.1 — Rédaction 4 articles cluster ukulélé
- **Sujets :**
  1. "Les 5 accords ukulélé pour jouer 100 chansons" — mot-clé : "accords ukulele" (vol. ~3 600/mois)
  2. "Quel ukulélé choisir pour débuter ? Soprano, concert ou tenor" — mot-clé : "choisir ukulele" (vol. ~1 000/mois)
  3. "Accorder son ukulélé : guide complet avec accordeur en ligne" — mot-clé : "accorder ukulele" (vol. ~2 900/mois)
  4. "Ukulélé vs guitare : lequel apprendre en premier ?" — mot-clé : "ukulele ou guitare" (vol. ~480/mois)
- **Fichiers :** `src/content/blog/` (4 nouveaux fichiers .md)
- **Impact SEO :** Haute
- **Difficulté :** 3/5
- **Responsable :** Content

#### Tâche 7.2 — Rédaction 4 articles cluster transversal (solfège, motivation, méthode)
- **Sujets :**
  1. "Comment lire les notes de musique en 1 semaine : méthode express" — mot-clé : "lire notes musique" (vol. ~1 600/mois)
  2. "Combien de temps faut-il pour apprendre la musique ?" — mot-clé : "apprendre musique temps" (vol. ~880/mois)
  3. "Pratiquer la musique 20 minutes par jour : la méthode efficace" — mot-clé : "progresser musique pratique" (vol. ~320/mois)
  4. "Les meilleures applications pour apprendre la musique en 2026" — mot-clé : "application apprendre musique" (vol. ~1 900/mois)
- **Fichiers :** `src/content/blog/` (4 nouveaux fichiers .md)
- **Impact SEO :** Haute
- **Difficulté :** 3/5
- **Responsable :** Content

---

### Semaine 8 — Optimisation maillage interne existant

#### Tâche 8.1 — Audit du maillage interne actuel
- **Action :** Avec Screaming Frog (onglet "Inlinks"), identifier les pages orphelines (0 liens internes entrants) et les pages sous-linkées (<3 liens entrants). Cartographier les clusters guitare, piano, ukulélé, solfège.
- **Fichiers :** N/A (audit Screaming Frog)
- **Impact SEO :** Haute — distribution du PageRank
- **Difficulté :** 2/5
- **Responsable :** SEO

#### Tâche 8.2 — Ajout liens contextuels dans articles existants vers pages cours
- **Action :** Dans les 20 articles blog les plus trafiqués, ajouter 1 à 2 liens internes contextuels vers les pages cours correspondantes. Les ancres doivent être des mots-clés (ex. "cours de guitare débutant" plutôt que "cliquez ici").
- **Fichiers :** `src/content/blog/*.md` (top 20)
- **Impact SEO :** Haute
- **Difficulté :** 2/5
- **Responsable :** Content + SEO

#### Tâche 8.3 — Création de sections "Articles liés" sur les pages cours
- **Action :** Ajouter en bas de chaque page cours une section "Pour aller plus loin" avec 3 liens vers articles blog pertinents. Automatiser depuis le frontmatter (`relatedPosts: [slug1, slug2, slug3]`).
- **Fichiers :** `src/pages/cours/[slug].astro`, `src/layouts/CourseLayout.astro`, `src/content/courses/*.md`
- **Impact SEO :** Moyenne (maillage + UX)
- **Difficulté :** 3/5
- **Responsable :** Dev + SEO

#### Tâche 8.4 — Optimisation ancres textes internes
- **Action :** S'assurer que les ancres des liens internes vers pages cours contiennent les mots-clés cibles. Remplacer les ancres génériques ("cliquez ici", "en savoir plus") par des ancres descriptives.
- **Fichiers :** `src/content/blog/*.md`, `src/pages/*.astro`
- **Impact SEO :** Haute
- **Difficulté :** 2/5
- **Responsable :** Content

---

### KPIs Mois 2

| KPI | Cible | Outil de mesure |
|---|---|---|
| Impressions GSC | +10% vs M1 | Google Search Console |
| CTR moyen pages cours | >3% | Google Search Console |
| Articles publiés | 16 nouveaux articles indexés | GSC > Index |
| Pages orphelines | 0 | Screaming Frog |
| Liens internes par page cours | Minimum 5 inlinks | Screaming Frog |
| Positions top 20 | +15 nouveaux mots-clés | GSC / Ahrefs |

---

## MOIS 3 : Contenu & outils interactifs (Semaines 9-12)

**Objectif du mois :** Créer des pages "outils" attractives à fort potentiel de trafic et backlinks, et compléter la stratégie cluster FR.

---

### Semaine 9 — 8 articles cluster supplémentaires

#### Tâche 9.1 — 4 articles cluster guitare avancé / niveau intermédiaire
- **Sujets :**
  1. "La technique du fingerpicking à la guitare : exercices progressifs" — mot-clé : "fingerpicking guitare" (vol. ~1 900/mois)
  2. "Barre à la guitare : comment réussir les accords barrés enfin !" — mot-clé : "accord barré guitare" (vol. ~2 400/mois)
  3. "Improvisation blues à la guitare : les gammes pentatoniques" — mot-clé : "impro guitare blues" (vol. ~590/mois)
  4. "Comment composer ses premières chansons à la guitare" — mot-clé : "composer chanson guitare" (vol. ~390/mois)
- **Fichiers :** `src/content/blog/` (4 nouveaux fichiers .md)
- **Impact SEO :** Haute
- **Difficulté :** 3/5
- **Responsable :** Content

#### Tâche 9.2 — 4 articles cluster piano avancé / technique
- **Sujets :**
  1. "Le jazz au piano pour débutants : accords 7ème et voicings simples" — mot-clé : "jazz piano débutant" (vol. ~720/mois)
  2. "Comment améliorer sa vitesse au piano : exercices Hanon modernisés" — mot-clé : "vitesse piano exercices" (vol. ~480/mois)
  3. "Jouer en rythme au piano : guide métronome et synchronisation" — mot-clé : "rythme piano métronome" (vol. ~290/mois)
  4. "Transposer une mélodie au piano : comprendre la tonalité" — mot-clé : "transposer piano" (vol. ~590/mois)
- **Fichiers :** `src/content/blog/` (4 nouveaux fichiers .md)
- **Impact SEO :** Haute
- **Difficulté :** 3/5
- **Responsable :** Content

---

### Semaine 10 — Page comparatif cours musique en ligne

#### Tâche 10.1 — Création de la page `/comparatif-cours-musique-en-ligne`
- **Action :** Créer une page dédiée comparant les principales plateformes d'apprentissage musical en ligne (musique-facile.fr vs Fender Play vs Yousician vs flowkey). La page met en avant les avantages du paiement unique vs abonnement. C'est une page à fort potentiel SEO sur des requêtes transactionnelles.
- **Fichiers :** `src/pages/comparatif-cours-musique-en-ligne.astro` (à créer)
- **Mots-clés cibles :** "cours musique en ligne comparatif" (vol. ~880/mois), "meilleur site apprendre guitare" (vol. ~1 600/mois), "alternative yousician" (vol. ~720/mois)
- **Structure :** H1 > Tableau comparatif > Sections détaillées par concurrent > CTA fort musique-facile.fr
- **Schema :** `ItemList` ou tableau structuré
- **Impact SEO :** Haute — intention transactionnelle, backlinks naturels potentiels
- **Difficulté :** 4/5
- **Responsable :** Dev + Content + SEO

#### Tâche 10.2 — Ajout liens vers la page comparatif depuis articles blog
- **Action :** Identifier 5 articles blog existants où un lien vers `/comparatif-cours-musique-en-ligne` est pertinent. Ajouter les liens contextuels.
- **Fichiers :** `src/content/blog/*.md` (sélection)
- **Impact SEO :** Moyenne
- **Difficulté :** 1/5
- **Responsable :** Content

---

### Semaine 11 — Outil accordeur guitare en ligne

#### Tâche 11.1 — Création de la page `/outils/accordeur-guitare`
- **Action :** Développer un accordeur guitare fonctionnel en JavaScript utilisant la Web Audio API (microphone). Interface : visualiseur de fréquence, note détectée, indication sharp/flat. La page doit être entièrement statique (pas de backend).
- **Fichiers :** `src/pages/outils/accordeur-guitare.astro` (à créer), `public/js/tuner.js` (à créer)
- **Mots-clés cibles :** "accordeur guitare en ligne" (vol. ~33 100/mois), "accorder guitare microphone" (vol. ~2 400/mois), "accordeur guitare gratuit" (vol. ~12 100/mois)
- **Schema :** `SoftwareApplication` ou `WebApplication`
- **Meta title :** "Accordeur Guitare en Ligne Gratuit — Microphone | Musique Facile" (58 caractères)
- **Impact SEO :** Tres haute — volume de recherche massif, forte attractivité backlinks
- **Difficulté :** 4/5
- **Responsable :** Dev

#### Tâche 11.2 — Intégration CTA vers cours guitare dans la page accordeur
- **Action :** Après le widget accordeur, ajouter une section "Vous accordez votre guitare ? C'est le moment de l'apprendre !" avec un CTA vers `/cours/apprendre-guitare-debutant`.
- **Fichiers :** `src/pages/outils/accordeur-guitare.astro`
- **Impact SEO :** Haute (conversion)
- **Difficulté :** 1/5
- **Responsable :** Dev + Content

---

### Semaine 12 — Outil métronome + dictionnaire accords guitare

#### Tâche 12.1 — Création de la page `/outils/metronome`
- **Action :** Développer un métronome web en JavaScript (Web Audio API). Fonctionnalités : BPM ajustable (40-240), tap tempo, indicateur visuel. Interface claire et mobile-friendly.
- **Fichiers :** `src/pages/outils/metronome.astro` (à créer), `public/js/metronome.js` (à créer)
- **Mots-clés cibles :** "métronome en ligne" (vol. ~27 100/mois), "métronome gratuit" (vol. ~8 100/mois)
- **Schema :** `WebApplication`
- **Impact SEO :** Tres haute — fort volume, backlinks musicaux
- **Difficulté :** 4/5
- **Responsable :** Dev

#### Tâche 12.2 — Création de la page `/outils/accords-guitare`
- **Action :** Développer un dictionnaire d'accords guitare interactif. Afficher les diagrammes d'accords pour les 50 accords les plus courants (Do, Ré, Mi, Fa, Sol, La, Si et variantes). Utiliser du SVG ou Canvas pour les diagrammes.
- **Fichiers :** `src/pages/outils/accords-guitare.astro` (à créer), `src/data/chords.json` (à créer)
- **Mots-clés cibles :** "accords guitare" (vol. ~60 500/mois), "dictionnaire accords guitare" (vol. ~1 300/mois), "tableau accords guitare" (vol. ~3 600/mois)
- **Schema :** `ItemList` d'accords
- **Impact SEO :** Tres haute — volume massif, excellent potentiel backlinks
- **Difficulté :** 4/5
- **Responsable :** Dev

#### Tâche 12.3 — Page hub `/outils/` listant tous les outils
- **Action :** Créer une page d'index `/outils/` présentant les 3 outils disponibles avec descriptions et liens. Intégrer dans le menu de navigation principal.
- **Fichiers :** `src/pages/outils/index.astro` (à créer), composant navigation
- **Impact SEO :** Moyenne — page hub de maillage
- **Difficulté :** 2/5
- **Responsable :** Dev

---

### KPIs Mois 3

| KPI | Cible | Outil de mesure |
|---|---|---|
| Nouveaux articles indexés | 8 articles (total 24 sur la période) | GSC > Index |
| Trafic outil accordeur | 500+ visites/mois | GA4 |
| Trafic outil métronome | 300+ visites/mois | GA4 |
| Trafic page comparatif | 200+ visites/mois | GA4 |
| Backlinks nouveaux (outils) | 5+ domaines référents | Ahrefs |
| Impressions GSC globales | +25% vs M0 | GSC |

---

## MOIS 4 : International EN (Semaines 13-16)

**Objectif du mois :** Lancer la version anglophone du site avec hreflang correct, 5 pages cours traduites et 5 articles blog traduits.

---

### Semaine 13 — Audit technique hreflang + structure /en/

#### Tâche 13.1 — Définition de la stratégie d'internationalisation
- **Action :** Décider de la structure d'URL internationales. Pour un site Astro SSG sur Netlify, la structure sous-répertoire `/en/`, `/de/`, `/es/`, `/it/` est recommandée (vs sous-domaine). Documenter la décision dans un fichier de configuration.
- **Fichiers :** `astro.config.mjs`, documentation interne
- **Avantages /en/ vs en.musique-facile.fr :** Meilleure transmission de l'autorité du domaine principal
- **Impact SEO :** Critique pour toute la stratégie internationale
- **Difficulté :** 3/5
- **Responsable :** SEO + Dev

#### Tâche 13.2 — Configuration i18n dans Astro
- **Action :** Configurer le module i18n d'Astro pour gérer les locales. Créer la structure de dossiers `src/pages/en/`, `src/content/courses-en/`, `src/content/blog-en/`. Configurer les redirections par défaut.
- **Fichiers :** `astro.config.mjs`, `src/pages/en/` (structure), `src/i18n/` (fichiers de traduction UI)
- **Code type (astro.config.mjs) :**
```js
export default defineConfig({
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'de', 'es', 'it'],
    routing: {
      prefixDefaultLocale: false
    }
  }
})
```
- **Impact SEO :** Critique
- **Difficulté :** 4/5
- **Responsable :** Dev

#### Tâche 13.3 — Audit des URLs cibles EN et mapping FR→EN
- **Action :** Créer un tableau de mapping FR→EN des URLs prioritaires. Les slugs EN doivent être en anglais (pas de translittération). Exemple : `/cours/apprendre-guitare-debutant` → `/en/courses/learn-guitar-for-beginners`.
- **Fichiers :** Document SEO (tableau de mapping)
- **Impact SEO :** Haute
- **Difficulté :** 2/5
- **Responsable :** SEO

---

### Semaine 14 — Traduction EN pages prioritaires (accueil + 5 pages cours)

#### Tâche 14.1 — Traduction page d'accueil EN
- **Action :** Traduire et adapter la page d'accueil pour le marché anglophone. Ne pas faire une traduction mot à mot : adapter la proposition de valeur, les chiffres sociaux (80 000+ students), les CTA. Cibler les requêtes EN globales.
- **Fichiers :** `src/pages/en/index.astro` (à créer), `src/content/homepage-en.md` (optionnel)
- **Mots-clés EN cibles :** "learn guitar online" (vol. ~22 200/mois), "online music lessons" (vol. ~18 100/mois)
- **Impact SEO :** Haute
- **Difficulté :** 3/5
- **Responsable :** Content (traducteur EN natif recommandé)

#### Tâche 14.2 — Traduction 5 pages cours EN
- **Pages prioritaires (par volume de recherche EN) :**
  1. `/en/courses/learn-guitar-for-beginners` — "learn guitar for beginners" (vol. ~27 100/mois)
  2. `/en/courses/learn-piano-for-beginners` — "learn piano for beginners" (vol. ~22 200/mois)
  3. `/en/courses/learn-ukulele-for-beginners` — "learn ukulele" (vol. ~18 100/mois)
  4. `/en/courses/guitar-chords` — "guitar chords" (vol. ~246 000/mois)
  5. `/en/courses/music-theory-basics` — "music theory basics" (vol. ~12 100/mois)
- **Fichiers :** `src/content/courses-en/*.md` (5 fichiers)
- **Impact SEO :** Haute
- **Difficulté :** 3/5
- **Responsable :** Content

---

### Semaine 15 — Traduction EN 5 articles blog top trafic

#### Tâche 15.1 — Sélection des 5 articles FR à traduire
- **Action :** Identifier dans GSC les 5 articles FR avec le plus d'impressions. Vérifier que leurs sujets ont un volume de recherche EN significatif. Créer les versions EN adaptées (pas de traduction littérale — optimiser pour les requêtes EN).
- **Articles candidats (à confirmer avec GSC réel) :**
  1. Guide complet apprentissage piano → "/en/blog/how-to-learn-piano-complete-guide"
  2. Apprendre guitare facilement → "/en/blog/learn-guitar-easily-beginners-guide"
  3. Débuter ukulélé → "/en/blog/how-to-start-ukulele-beginners"
  4. Pourquoi tu stagnesprogresses → "/en/blog/why-you-plateau-in-music-and-how-to-fix-it"
  5. Séance pratique 30 minutes → "/en/blog/30-minute-effective-music-practice-session"
- **Fichiers :** `src/content/blog-en/` (5 fichiers .md)
- **Impact SEO :** Haute
- **Difficulté :** 3/5
- **Responsable :** Content

---

### Semaine 16 — Sitemap multilingue + balises hreflang dans Layout.astro

#### Tâche 16.1 — Intégration balises hreflang dans Layout.astro
- **Action :** Pour chaque page, injecter les balises `<link rel="alternate" hreflang="..." href="..." />` dans le `<head>`. Inclure toujours `hreflang="x-default"` pointant vers la version FR. Utiliser les props Astro pour passer les URLs alternatives depuis chaque page.
- **Fichiers :** `src/layouts/Layout.astro`, `src/layouts/CourseLayout.astro`
- **Code type :**
```astro
---
interface Props {
  hreflang?: { lang: string; url: string }[];
}
const { hreflang = [] } = Astro.props;
---
{hreflang.map(({ lang, url }) => (
  <link rel="alternate" hreflang={lang} href={url} />
))}
<link rel="alternate" hreflang="x-default" href={canonicalFR} />
```
- **Impact SEO :** Critique pour l'indexation multilingue
- **Difficulté :** 4/5
- **Responsable :** Dev

#### Tâche 16.2 — Mise à jour sitemap XML multilingue
- **Action :** Configurer `@astrojs/sitemap` pour inclure toutes les locales. Vérifier que le sitemap généré contient les balises `<xhtml:link rel="alternate" hreflang="...">` pour chaque URL.
- **Fichiers :** `astro.config.mjs` (config sitemap)
- **Code type :**
```js
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: {
          fr: 'fr-FR',
          en: 'en-US',
          de: 'de-DE',
          es: 'es-ES',
          it: 'it-IT',
        }
      }
    })
  ]
})
```
- **Impact SEO :** Critique
- **Difficulté :** 3/5
- **Responsable :** Dev

#### Tâche 16.3 — Soumission sitemap EN à GSC (propriété séparée ou URL prefix)
- **Action :** Dans Google Search Console, s'assurer que le sitemap `/sitemap.xml` (incluant les URLs `/en/`) est soumis. Vérifier l'indexation dans le rapport de couverture après 1 semaine.
- **Fichiers :** N/A (GSC)
- **Impact SEO :** Haute
- **Difficulté :** 1/5
- **Responsable :** SEO

---

### KPIs Mois 4

| KPI | Cible | Outil de mesure |
|---|---|---|
| Pages EN indexées | 5 pages cours + accueil EN | GSC > Index |
| Hreflang valide | 0 erreur hreflang | Google Search Console |
| Trafic EN | +200% vs M3 (depuis base quasi-zéro) | GA4 segment EN |
| Articles EN indexés | 5 articles | GSC |
| Sitemap multilingue | Soumis et crawlé | GSC > Sitemaps |
| Impressions EN | 500+ impressions/semaine | GSC |

---

## MOIS 5 : International DE + ES + IT (Semaines 17-20)

**Objectif du mois :** Étendre la présence internationale aux marchés allemand, espagnol et italien, et compléter la stratégie de contenu FR.

---

### Semaine 17 — Traduction DE pages prioritaires + meta localisés

#### Tâche 17.1 — Traduction accueil + 3 pages cours DE
- **Action :** Adapter la page d'accueil et les 3 pages cours les plus populaires pour le marché allemand. Les Allemands sont le 2ème marché européen pour l'apprentissage musical en ligne.
- **Pages prioritaires DE :**
  1. `/de/` — "Gitarre lernen online" (vol. ~14 800/mois DE)
  2. `/de/kurse/gitarre-lernen-anfaenger` — "Gitarre lernen für Anfänger" (vol. ~8 100/mois)
  3. `/de/kurse/klavier-lernen-anfaenger` — "Klavier lernen" (vol. ~12 100/mois)
  4. `/de/kurse/ukulele-lernen` — "Ukulele lernen" (vol. ~6 600/mois)
- **Fichiers :** `src/pages/de/index.astro`, `src/content/courses-de/*.md` (3 fichiers)
- **Note importante :** Utiliser DeepL Pro puis relecture native. Les meta descriptions DE doivent être rédigées nativement.
- **Impact SEO :** Haute
- **Difficulté :** 3/5
- **Responsable :** Content (traducteur DE natif)

#### Tâche 17.2 — Configuration hreflang DE dans Layout + sitemap
- **Action :** Étendre la configuration hreflang et sitemap pour inclure la locale `de` (développée en S16).
- **Fichiers :** `src/layouts/Layout.astro`, `astro.config.mjs`
- **Impact SEO :** Critique
- **Difficulté :** 2/5
- **Responsable :** Dev

---

### Semaine 18 — Traduction ES pages prioritaires + meta localisés

#### Tâche 18.1 — Traduction accueil + 3 pages cours ES
- **Action :** L'espagnol est la 3ème langue d'internet. Cibler l'Espagne principalement, avec des adaptations pour Mexique et Amérique latine si possible (mais garder l'espagnol neutre en priorité).
- **Pages prioritaires ES :**
  1. `/es/` — "aprender guitarra online" (vol. ~9 900/mois ES)
  2. `/es/cursos/aprender-guitarra-principiantes` — "aprender guitarra para principiantes" (vol. ~5 400/mois)
  3. `/es/cursos/aprender-piano-principiantes` — "aprender piano desde cero" (vol. ~8 100/mois)
  4. `/es/cursos/aprender-ukulele` — "aprender ukulele" (vol. ~4 400/mois)
- **Fichiers :** `src/pages/es/index.astro`, `src/content/courses-es/*.md` (3 fichiers)
- **Impact SEO :** Haute
- **Difficulté :** 3/5
- **Responsable :** Content (traducteur ES natif)

---

### Semaine 19 — Traduction IT pages prioritaires + meta localisés

#### Tâche 19.1 — Traduction accueil + 3 pages cours IT
- **Pages prioritaires IT :**
  1. `/it/` — "imparare chitarra online" (vol. ~6 600/mois IT)
  2. `/it/corsi/imparare-chitarra-principianti` — "imparare a suonare la chitarra" (vol. ~3 600/mois)
  3. `/it/corsi/imparare-piano-principianti` — "imparare a suonare il pianoforte" (vol. ~4 400/mois)
  4. `/it/corsi/imparare-ukulele` — "imparare ukulele" (vol. ~1 300/mois)
- **Fichiers :** `src/pages/it/index.astro`, `src/content/courses-it/*.md` (3 fichiers)
- **Impact SEO :** Moyenne (marché plus petit)
- **Difficulté :** 3/5
- **Responsable :** Content (traducteur IT natif)

#### Tâche 19.2 — Validation hreflang complet (FR + EN + DE + ES + IT)
- **Action :** Utiliser l'outil de validation hreflang (hreflang.org ou Screaming Frog mode hreflang checker) pour valider que toutes les pages dans toutes les langues ont les balises réciproques correctes. Les erreurs hreflang non réciproques sont ignorées par Google.
- **Fichiers :** N/A (audit)
- **Impact SEO :** Critique
- **Difficulté :** 2/5
- **Responsable :** SEO

---

### Semaine 20 — 10 articles cluster FR restants

#### Tâche 20.1 — 5 articles cluster solfège + théorie musicale
- **Sujets :**
  1. "Comprendre le cycle des quintes : explication simple et applications" — mot-clé : "cycle des quintes" (vol. ~1 900/mois)
  2. "Les intervalles en musique : guide complet pour débutants" — mot-clé : "intervalles musique" (vol. ~1 300/mois)
  3. "Apprendre le solfège adulte : est-ce trop tard ?" — mot-clé : "solfège adulte" (vol. ~880/mois)
  4. "Comment lire une tablature de guitare : guide illustré" — mot-clé : "lire tablature guitare" (vol. ~2 900/mois)
  5. "Les modes de la gamme majeure : dorien, phrygien, lydien expliqués" — mot-clé : "modes gamme majeure" (vol. ~720/mois)
- **Fichiers :** `src/content/blog/` (5 nouveaux fichiers .md)
- **Impact SEO :** Haute
- **Difficulté :** 3/5
- **Responsable :** Content

#### Tâche 20.2 — 5 articles comparatifs + guides d'achat
- **Sujets :**
  1. "Guitare acoustique vs électrique : tout ce qu'il faut savoir avant d'acheter" — mot-clé : "guitare acoustique vs electrique" (vol. ~3 600/mois)
  2. "Les meilleures méthodes pour apprendre la guitare en 2026" — mot-clé : "meilleure méthode guitare" (vol. ~1 000/mois)
  3. "Piano numérique vs piano acoustique : lequel choisir en 2026 ?" — mot-clé : "piano numerique vs acoustique" (vol. ~1 300/mois)
  4. "Fender Play vs Musique Facile : comparatif honnête 2026" — mot-clé : "fender play avis" (vol. ~2 400/mois)
  5. "Apprendre la musique en ligne : avantages et inconvénients" — mot-clé : "cours musique en ligne" (vol. ~3 600/mois)
- **Fichiers :** `src/content/blog/` (5 nouveaux fichiers .md)
- **Impact SEO :** Haute — intention transactionnelle
- **Difficulté :** 3/5
- **Responsable :** Content

---

### KPIs Mois 5

| KPI | Cible | Outil de mesure |
|---|---|---|
| Pages internationales indexées | 15+ (EN + DE + ES + IT) | GSC |
| Hreflang sans erreur | 0 erreur réciproque | Screaming Frog hreflang |
| Trafic DE | Premiers signaux (>100 clics/mois) | GA4 |
| Trafic ES | Premiers signaux (>100 clics/mois) | GA4 |
| Trafic IT | Premiers signaux (>50 clics/mois) | GA4 |
| Nouveaux articles FR indexés | 10 | GSC |
| Total articles publiés (M1-M5) | 42+ nouveaux articles | GSC |

---

## MOIS 6 : Analyse, ajustements & link building (Semaines 21-24)

**Objectif du mois :** Mesurer les résultats de 5 mois de travail, optimiser ce qui sous-performe, et amorcer une stratégie de link building durable.

---

### Semaine 21 — Analyse GSC + Analytics (trafic, positions, CTR)

#### Tâche 21.1 — Rapport de performance complet M0 → M6
- **Action :** Extraire de GSC les données sur 6 mois. Comparer : clics totaux, impressions, CTR moyen, positions moyennes par page et par pays. Identifier les pages qui ont progressé et celles qui stagnent. Calculer le delta de trafic organique total.
- **Fichiers :** Export CSV GSC, rapport GA4
- **Impact SEO :** Mesure ROI
- **Difficulté :** 2/5
- **Responsable :** SEO

#### Tâche 21.2 — Analyse des pages sous-performantes
- **Action :** Identifier les pages avec >1 000 impressions mais CTR <1.5% (candidats pour A/B test meta), les pages avec CTR correct mais positions 11-20 (à renforcer par liens internes et contenu), les pages qui ont perdu des positions depuis M1.
- **Fichiers :** N/A (analyse GSC)
- **Impact SEO :** Haute (priorisation)
- **Difficulté :** 2/5
- **Responsable :** SEO

#### Tâche 21.3 — Rapport Core Web Vitals
- **Action :** Passer toutes les pages modifiées dans PageSpeed Insights. Vérifier que les outils interactifs (accordeur, métronome) ne dégradent pas le LCP ou le CLS. Corriger les régressions.
- **Fichiers :** Pages outils + pages cours
- **Impact SEO :** Haute (ranking factor)
- **Difficulté :** 3/5
- **Responsable :** Dev + SEO

---

### Semaine 22 — A/B test meta tags (pages sous-performantes)

#### Tâche 22.1 — Sélection des 10 pages pour A/B test
- **Action :** Depuis l'analyse S21, sélectionner les 10 pages avec le plus grand potentiel de gain CTR. Rédiger des variantes de title et meta description. Les variants doivent tester : présence de chiffres, emojis (attention : risque de filtrage par Google), questions vs affirmations, mots forts (gratuit, rapide, facile).
- **Fichiers :** `src/content/courses/*.md`, `src/content/blog/*.md`
- **Impact SEO :** Moyenne à Haute
- **Difficulté :** 3/5
- **Responsable :** SEO

#### Tâche 22.2 — Implémentation et suivi des variantes
- **Action :** Déployer les variantes. Attendre minimum 2 semaines avant jugement (volume de données). Utiliser GSC pour comparer le CTR avant/après par page. Documenter les résultats dans un fichier de tracking.
- **Fichiers :** Fichiers .md modifiés, fichier de tracking SEO
- **Impact SEO :** Haute (apprentissage systémique)
- **Difficulté :** 2/5
- **Responsable :** SEO

---

### Semaine 23 — Link building : guest posts blogs musicaux FR + EN

#### Tâche 23.1 — Prospection blogs musicaux FR
- **Action :** Identifier 20 blogs musique FR avec DA >20, publiant régulièrement (>1 article/mois), acceptant les contributions. Secteurs : guitare, piano, solfège, instruments, apprentissage. Rédiger un email de prospection personnalisé proposant un article invité de qualité (1500+ mots) sur un sujet de valeur pour leur audience.
- **Cibles potentielles :** Blogs guitare-mania.fr, accordéon-passion, blogs professeurs de musique indépendants, sites d'écoles de musique avec section blog.
- **Fichiers :** N/A (prospection externe)
- **Objectif :** 5 liens dofollow depuis domaines FR DA>20
- **Impact SEO :** Haute — autorité de domaine
- **Difficulté :** 5/5
- **Responsable :** SEO + Content

#### Tâche 23.2 — Prospection blogs musicaux EN
- **Action :** Même démarche pour les blogs EN anglophones. Cibler des blogs de niche musicale avec une audience internationale. Les liens EN depuis domaines anglophones renforcent aussi la version FR.
- **Cibles :** Guitar World (difficile), blogs professeurs EN indépendants, forums guitare internationaux avec section articles.
- **Objectif :** 3 liens dofollow depuis domaines EN DA>25
- **Impact SEO :** Haute
- **Difficulté :** 5/5
- **Responsable :** SEO + Content

#### Tâche 23.3 — Stratégie de link building naturel via outils
- **Action :** Soumettre les outils (accordeur, métronome, dictionnaire accords) aux répertoires d'outils musicaux en ligne, forums guitare (Ultimate Guitar, etc.), groupes Facebook musique. Les outils sont naturellement partageables et génèrent des liens sans démarchage.
- **Fichiers :** N/A (outreach)
- **Impact SEO :** Haute — backlinks naturels durables
- **Difficulté :** 3/5
- **Responsable :** SEO

---

### Semaine 24 — Bilan 6 mois + plan mois 7-12

#### Tâche 24.1 — Rapport de bilan complet
- **Action :** Produire un rapport complet comparant M0 et M6 pour tous les KPIs définis. Inclure : trafic organique total, répartition par langue, positions clés conquises, backlinks gagnés, revenus attribuables au SEO (si tracking).
- **Fichiers :** `seo-audit/bilan-6mois.md` (à créer en S24)
- **Impact SEO :** Mesure ROI
- **Difficulté :** 2/5
- **Responsable :** SEO

#### Tâche 24.2 — Identification des quick wins mois 7-12
- **Action :** Depuis les données GSC, identifier les mots-clés en positions 4-10 qui méritent un effort de contenu ou de links supplémentaire pour passer en top 3. Ce sont les "quick wins" M7.
- **Fichiers :** N/A (analyse)
- **Impact SEO :** Haute
- **Difficulté :** 2/5
- **Responsable :** SEO

#### Tâche 24.3 — Plan de contenu M7-M12
- **Action :** Sur la base des performances M1-M6, définir les 40+ articles et pages à produire sur les 6 prochains mois. Prioriser : contenu cluster manquant, pages outils supplémentaires (accordeur piano, accordeur basse, dictionnaire accords piano), expansion internationale (PT, NL).
- **Fichiers :** `seo-audit/roadmap-seo-mois7-12.md` (à créer)
- **Impact SEO :** Planification long terme
- **Difficulté :** 3/5
- **Responsable :** SEO + Content

---

### KPIs Mois 6

| KPI | Cible | Outil de mesure |
|---|---|---|
| Trafic organique total | +50% vs M0 (baseline) | GA4 + GSC |
| Positions top 10 | 5+ nouvelles positions top 10 | GSC / Ahrefs |
| Trafic international (hors FR) | >15% du trafic total | GA4 |
| Trafic outil accordeur | 2 000+ visites/mois | GA4 |
| Backlinks nouveaux | 10+ domaines référents DA>20 | Ahrefs |
| CTR moyen pages cours | >4% | GSC |
| Pages indexées totales | +60 pages vs M0 | GSC > Index |
| Impressions GSC totales | +80% vs M0 | GSC |

---

## Tableau de bord KPIs synthétique

| Mois | KPI principal | Cible | Outil |
|---|---|---|---|
| M1 | Schémas sans erreur | 0 erreur Rich Results Test | Rich Results Test |
| M1 | Canonical | 100% pages | Screaming Frog |
| M2 | Impressions GSC | +10% | GSC |
| M2 | CTR pages cours | >3% | GSC |
| M3 | Nouveaux articles indexés | 8 | GSC |
| M3 | Trafic accordeur | 500+ visites/mois | GA4 |
| M4 | Pages EN indexées | 5+ | GSC |
| M4 | Trafic EN | +200% vs M3 | GA4 |
| M5 | Pages internationales | 15+ | GSC |
| M6 | Trafic organique total | +50% vs M0 | GA4 + GSC |
| M6 | Positions top 10 | 5+ nouvelles | GSC / Ahrefs |

---

## Notes de mise en oeuvre

### Gestion des priorités
- Les tâches "Dev" et "SEO" de M1 sont bloquantes pour tout le reste. Ne pas démarrer M2 sans les canonicals et schémas validés.
- Les outils interactifs (M3) peuvent être développés en parallèle des articles M2 si les ressources Dev le permettent.
- Les traductions internationales (M4-M5) nécessitent un budget de traduction natif. DeepL seul ne suffit pas pour des pages commerciales.

### Risques identifiés
| Risque | Impact | Mitigation |
|---|---|---|
| Vidéos Vimeo cassées (existant) | Moyen — UX dégradée sur pages cours | Contacter Vimeo ou migrer vers solution hébergée |
| Schema reviewCount incohérent (existant) | Haute — pénalité données trompeuses | Corriger en S4 au plus tard |
| Deux footers coexistants (Footer.astro vs FooterModern.astro) | Faible SEO — confusion maintenance | Unifier en M1 ou documenter l'intention |
| Budget traduction M4-M5 | Moyen | Prévoir budget dès M1 |
| Hreflang mal implémenté | Critique | Valider avec Screaming Frog avant déploiement |

### Stack technique recommandée
```
Audit    : Screaming Frog + Rich Results Test + GSC + PageSpeed Insights
Mots-clés: Ahrefs (ou SEMrush) + Google Suggest + People Also Ask
Contenu  : Notion (brief) + Google Docs (rédaction) + markdown pour Astro
i18n     : Module @astrojs/i18n + DeepL Pro + relecture native
Outils   : Web Audio API (accordeur, métronome) + SVG (diagrammes accords)
Analytics: GA4 + GSC + Netlify Analytics
Links    : Ahrefs (suivi backlinks) + Hunter.io (prospection)
```

---

*Roadmap générée le 2026-02-17 pour musique-facile.fr*
*Framework : Astro SSG | Hébergement : Netlify | Objectif : +50% trafic organique en 6 mois*
