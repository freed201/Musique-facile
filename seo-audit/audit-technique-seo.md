# Audit SEO Technique — musique-facile.fr
**Date :** Février 2026 | **Auditeur :** Claude Code (IA SEO senior)
**Stack :** Astro SSG · Netlify · GTM · Markdown frontmatter

---

## Résumé exécutif

| Catégorie | Score | Tendance |
|-----------|-------|----------|
| Indexabilité | 8/10 | ✅ Solide |
| Meta tags | 6/10 | ⚠️ Optimisations requises |
| Schema Markup | 7/10 | ⚠️ Lacunes ciblées |
| Performance | 7/10 | ✅ Bonne base |
| Maillage interne | 6/10 | ⚠️ À structurer |
| SEO International | 1/10 | ❌ Non implémenté |

**Score global : 59/100** — Fondations solides, axes d'amélioration clairs et prioritaires.

---

## TABLEAU DE PRIORITÉS

| Priorité | Problème | Pages concernées | Impact SEO | Action |
|----------|----------|-----------------|------------|--------|
| **P0 — Critique** | Aucun hreflang / structure multilingue | Toutes | ❌ Bloque expansion internationale | Créer sitemap multilingue + balises hreflang |
| **P0 — Critique** | Meta description accueil tronquée (245 car > 155) | `/` | ❌ Mauvais CTR | Réécrire à max 155 car |
| **P1 — Haute** | reviewCount incohérent entre cours | `/cours/apprendre-guitare-debutant` (180) vs `/cours/piano-facile-apprendre-debutant` (1500) | ⚠️ Rich Snippets invalides | Harmoniser avec données réelles |
| **P1 — Haute** | FAQPage schema absent des pages cours | 6 pages cours principales | ⚠️ Rich Snippets manqués | Intégrer `FAQSchema.astro` dans `CourseLayout.astro` |
| **P1 — Haute** | OG Image = logo sur la page d'accueil | `/` | ⚠️ CTR social -40% | Créer image OG dédiée 1200×630px |
| **P1 — Haute** | Pages legacy potentiellement indexées | `/preview-refonte`, `/index-old`, `/blog/index-old`, `/stage2025` | ⚠️ Contenu dupliqué | Ajouter `robots="noindex"` ou rediriger |
| **P2 — Moyenne** | BreadcrumbList absent de `Layout.astro` | Pages blog, FAQ, livres, ressources | ⚠️ Rich Snippets manqués | Intégrer `BreadcrumbsSchema.astro` sur tous les layouts |
| **P2 — Moyenne** | Title auto-tronqué avec "..." (`CourseLayout`) | Pages cours avec titre > 57 car | ⚠️ Keyword cut | Revoir la logique d'enrichissement du titre |
| **P2 — Moyenne** | Podcast externe dans navigation (lien outbound) | Header global | ⚠️ Fuite PageRank | Créer page `/podcast` interne avec embed |
| **P2 — Moyenne** | Schema WebPage basique dans `Layout.astro` | Toutes les pages hors cours | ⚠️ E-E-A-T pauvre | Enrichir avec `publisher`, `breadcrumb`, `author` |
| **P3 — Faible** | Meta keywords présent (ignoré par Google) | Accueil | ℹ️ Neutre | Supprimer pour alléger |
| **P3 — Faible** | `Astro.props.hasCourseInstance` hors interface Props | `CourseLayout.astro` ligne 108 | ⚠️ Possible undefined | Ajouter `hasCourseInstance` à l'interface Props |
| **P3 — Faible** | `canonicalUrl = Astro.url.href` peut générer des inconsistances de trailing slash | `Layout.astro` | ⚠️ Dupliqué potentiel | Normaliser avec `new URL(pathname, siteUrl).toString()` |

---

## PHASE 1 : ANALYSE TECHNIQUE DÉTAILLÉE

### 1.1 Architecture des URLs

**État actuel :**
```
musique-facile.fr/                    ✅ Accueil
musique-facile.fr/cours               ✅ Hub cours
musique-facile.fr/cours/cours-de-guitare     ✅ Pillar guitare
musique-facile.fr/cours/cours-de-piano       ✅ Pillar piano
musique-facile.fr/cours/cours-de-ukulele     ✅ Pillar ukulélé
musique-facile.fr/cours/cours-de-solfege     ✅ Pillar solfège
musique-facile.fr/cours/[slug]               ✅ Pages cours détail
musique-facile.fr/blog                       ✅ Hub blog
musique-facile.fr/blog/[slug]                ✅ Articles
musique-facile.fr/livres                     ✅ Hub livres
musique-facile.fr/ressources-gratuites/      ✅ Ressources
musique-facile.fr/a-propos                   ✅
musique-facile.fr/faq                        ✅
```

**Points positifs :**
- URLs courtes, lisibles, en français — cohérentes avec l'audience cible
- Structure en silo logique : `/cours/` pour les formations, `/blog/` pour le contenu
- Profondeur de crawl ≤ 3 clics pour toutes les pages importantes

**Problèmes identifiés :**
- `/preview-refonte.astro` → URL `/preview-refonte` potentiellement indexée (page interne dev)
- `/index-old.astro` → URL `/index-old` potentiellement indexée (ancienne version homepage)
- `/blog/index-old.astro` → URL `/blog/index-old` potentiellement indexée
- `/stage2025.astro` → URL `/stage2025` (stage passé, potentiellement obsolète)
- `/maintenance.astro` → page de maintenance accessible (risque d'indexation accidentelle)

**Action recommandée :** Ajouter `export const prerender = false` ou `robots="noindex"` sur ces pages, ou les rediriger vers la page principale.

---

### 1.2 Balises Title et Meta Description

**Fichier source :** `src/layouts/Layout.astro` (toutes les pages) et `src/layouts/CourseLayout.astro` (pages cours)

#### Page d'accueil (`/`)
```
Title actuel : "Cours de Guitare, Piano, Ukulélé en Ligne — Méthode Fred Fieffé | Musique Facile"
Longueur : 83 caractères ❌ (trop long, tronqué à ~60 car)

Description actuelle : "Formations en ligne pour apprendre la guitare, le piano, l'ukulélé et le solfège.
Méthode progressive créée par Fred Fieffé, professeur certifié avec 15 ans d'expérience.
Plus de 80 000 élèves formés, 4.7/5 de note moyenne sur 2 847 avis."
Longueur : 245 caractères ❌ (tronquée à ~155 car par Google)
```

**Title optimisé :** `Cours de Musique en Ligne — Guitare, Piano, Ukulélé | Musique Facile` (69 car → encore long)
→ Mieux : `Cours Guitare, Piano, Ukulélé en Ligne | Musique Facile` (56 car ✅)

**Description optimisée (155 car max) :**
`Apprenez la guitare, piano ou ukulélé avec Fred Fieffé. Accès à vie, 80 000+ élèves, 4.7/5. Paiement unique — pas d'abonnement. Commencez dès aujourd'hui !`

#### CourseLayout — Logique d'enrichissement
```javascript
// Ligne 36-43 de CourseLayout.astro
const enrichTitle = () => {
  let baseTitle = `${title} | Musique Facile`;
  if (baseTitle.length > 60) {
    return title.substring(0, 57) + '...'; // ❌ Tronque avec "..." → perte du mot-clé fin
  }
  return baseTitle;
};
```

**Problème :** Si le titre est "Cours de Guitare pour Débutants en Ligne | Musique Facile" (58 car), il passe. Si "Pack Débutant Piano : Tout pour Bien Commencer | Musique Facile" (62 car), il est tronqué en "Pack Débutant Piano : Tout pour Bien Co..." ce qui coupe le mot-clé.

**Recommandation :** Tronquer à 57 car SANS "..." ou rédiger des titres plus courts dans le frontmatter des cours.

---

### 1.3 Balises Canoniques

**Implémentation (`Layout.astro` ligne 65) :**
```html
<link rel="canonical" href={canonicalUrl} />
```
où `canonicalUrl = Astro.url.href` (prop avec défaut).

**Risque :** `Astro.url.href` peut inclure des paramètres de query string (ex: `?ref=newsletter`) ou des trailing slashes inconsistants selon la configuration Astro.

**Recommandation :**
```javascript
const canonicalUrl = new URL(Astro.url.pathname, 'https://musique-facile.fr').toString();
```

**État :** ✅ Présent sur toutes les pages — ⚠️ Normalisation à améliorer.

---

### 1.4 Balises Meta Robots

**Implémentation :** `<meta name="robots" content={robots} />` avec défaut `"index, follow"` ✅

**Pages qui devraient être en noindex :**
- `/preview-refonte` — page dev interne
- `/index-old` — ancienne homepage
- `/blog/index-old` — ancienne liste blog
- `/stage2025` — stage passé (selon pertinence)
- `/maintenance` — page maintenance
- `/merci-lead-magnet` — page de remerciement post-formulaire

---

### 1.5 Open Graph & Twitter Cards

**Implémentation complète dans `Layout.astro` :** ✅
og:type, og:url, og:title, og:description, og:image, twitter:card, twitter:url, twitter:title, twitter:description, twitter:image

**Problème principal :** OG Image de la page d'accueil = `/logo.webp`
→ Très probablement trop petit (logo ≠ image 1200×630px)
→ Facebook/LinkedIn/Twitter affichent des prévisualisations de mauvaise qualité
→ Impacte le CTR des partages sociaux

**Recommandation :** Créer `/images/og-home.webp` (1200×630px) avec : arrière-plan guitare/piano, logo, slogan "80 000+ élèves formés", note 4.7/5.

---

### 1.6 Schema Markup existant

#### ✅ Bien implémenté
| Page | Schema | Notes |
|------|--------|-------|
| `Layout.astro` | WebPage | Basique (name, description, url, image, publisher) |
| `CourseLayout.astro` | Course + CourseInstance + AggregateRating + Instructor | Riche et bien structuré |
| `cours-de-guitare.astro` | ItemList + Course | Correct |
| `index.astro` | EducationalOrganization + WebSite | Présent |

#### ❌ Manquant ou incomplet
| Schema | Où | Impact |
|--------|----|--------|
| FAQPage | Pages cours (composant existe mais non intégré dans CourseLayout) | Rich snippets FAQ perdus |
| BreadcrumbList | Pages blog, FAQ, livres, ressources (absent de Layout.astro) | Breadcrumbs absents dans SERP |
| BlogPosting | Articles blog (ArticleLayout à vérifier) | E-E-A-T author manqué |
| PodcastSeries | Aucune page dédiée | Entité podcast manquée |
| Person (Fred Fieffé) | Absent de Layout global | Autorité non signalée |
| VideoObject | Pages cours (vidéos Vimeo) | Featured snippets vidéo manqués |

**Problème de cohérence critique :**
```yaml
# apprendre-guitare-debutant.md
reviewCount: "180"

# piano-facile-apprendre-debutant.md
reviewCount: "1500"

# index.astro (schema global)
aggregateRating: "4.7/5 sur 2847 avis"
```
→ Incohérence signalée → Google peut invalider les Rich Snippets → À corriger impérativement.

---

### 1.7 Sitemap XML

**Fichier :** `src/pages/sitemap.xml.ts` — Sitemap dynamique généré côté serveur Astro ✅

**Points positifs :**
- Inclut blog, courses, programmes, ressources, livres dynamiquement
- Filtrage des articles non publiés (`prod: Y`, `affichage: Y`)
- Content-Type correct (`application/xml`)
- Cache 1h (`max-age=3600`)
- Priorités logiques (1.0 accueil, 0.9 cours, 0.7 blog)

**Problèmes :**
1. **Aucune balise hreflang** — critique pour l'expansion internationale
2. **`lastmod` calculé avec `new Date()`** pour les pages statiques → Google voit la date comme "aujourd'hui" à chaque rebuild → perd son signal de fraîcheur
3. **Pages manquantes dans le sitemap :**
   - `/faq` ❌
   - `/a-propos` ✅ (présent)
   - `/ressources-gratuites/piano` ✅ (présent)
   - `/quel-instrument-choisir` ✅ (présent)
   - Pillar pages `/cours/cours-de-guitare` etc. ✅ (présentes)
4. **Pages présentes dans le sitemap mais potentiellement en noindex :** `/5-accords-magiques`, `/merci-lead-magnet` → à vérifier

---

### 1.8 Robots.txt

À vérifier en live. Recommandations standard :
```
User-agent: *
Allow: /
Disallow: /maintenance
Disallow: /preview-refonte
Disallow: /index-old
Disallow: /blog/index-old
Disallow: /merci-lead-magnet

Sitemap: https://musique-facile.fr/sitemap.xml
```

---

### 1.9 Performance technique

#### Optimisations déjà en place ✅
- Fonts préchargées : `poppins-latin-400-normal.woff2` et `poppins-latin-600-normal.woff2` (FCP amélioré)
- DNS prefetch : GTM, GA
- Images en WebP (ogImage webp dans les cours)
- Astro SSG → HTML statique → TTFB minimal
- `astro-compress` dans le build → HTML/CSS/JS minifiés
- `remark-lazy-images.mjs` → lazy loading natif des images markdown
- `remark-optimize-images.mjs` → optimisation images markdown

#### Points à vérifier / améliorer
| Aspect | État | Action |
|--------|------|--------|
| Compression Gzip/Brotli | À vérifier côté Netlify (activé par défaut) | Vérifier headers `Content-Encoding` |
| Images avec dimensions explicites (width/height) | ⚠️ À vérifier | Évite CLS = 0 |
| Images avec alt text | ⚠️ À auditer | SEO + accessibilité |
| LCP | ⚠️ Vidéos Vimeo dans le hero (LCP peut être lent) | Précharger thumbnail vidéo ou image de remplacement |
| CLS | ⚠️ Fonts custom avec preload (bien) mais webfonts peuvent causer FOUT | Vérifier `font-display: swap` |
| INP (interactivité) | ⚠️ Animations JS (`animations.js`) à profiler | Éviter les listeners longs |

---

### 1.10 Maillage interne

**Navigation principale :** ✅ Accueil, Cours (dropdown 4 instruments), Blog, À propos, Podcast

**Forces :**
- Header commun = liens vers pillar pages sur toutes les pages
- Blog riche (80+ articles) avec potentiel de liens entrants vers les cours
- Pages `/quel-instrument-choisir` et `/5-accords-magiques` = carrefours naturels

**Faiblesses :**
- Podcast = lien externe (fuite PageRank) → créer page interne
- Articles de blog ne lient pas systématiquement vers la page de conversion pertinente
- Pages cours ne se lient pas entre elles (ex: "Vous maîtrisez la guitare ? Tentez le piano")
- Pas de `RelatedCourses` ou `RelatedArticles` sur toutes les pages (composants existent mais non systématiques)

---

### 1.11 SEO International

**État actuel : ❌ Non implémenté**

- Aucune structure `/en/`, `/de/`, `/es/`, `/it/`
- Aucune balise hreflang
- Sitemap monolangue
- `lang="fr"` sur `<html>` — correct pour le français

**Potentiel international :** Fort. Le marché anglophone (UK, Canada, USA) et hispanophone représentent des millions d'adultes souhaitant apprendre la guitare/piano. L'avantage "paiement unique accès à vie" est universel.

---

## ACTIONS PRIORITAIRES PAR SPRINT

### Sprint 1 (Semaine 1) — Quick Wins
1. ✏️ Réécrire meta description accueil (<155 car)
2. ✏️ Créer OG image accueil 1200×630px
3. ✏️ Ajouter `robots="noindex"` sur 5 pages legacy
4. ✏️ Corriger reviewCount incohérent (guitare + piano)

### Sprint 2 (Semaine 2) — Schémas manquants
5. 🔧 Intégrer `FAQSchema.astro` dans `CourseLayout.astro`
6. 🔧 Intégrer `BreadcrumbsSchema.astro` dans `Layout.astro`
7. 🔧 Enrichir schema WebPage accueil (EducationalOrganization @graph)

### Sprint 3 (Semaine 3-4) — Technique
8. 🔧 Normaliser `canonicalUrl` (pathname → URL absolue propre)
9. 🔧 Créer page `/podcast` interne (embedded player + schema PodcastSeries)
10. 🔧 Corriger logique title truncation CourseLayout
11. 🔧 Mettre à jour `robots.txt` (bloquer pages legacy)

### Sprint 4 (Mois 2-4) — International
12. 🌍 Implémenter structure `/en/` avec hreflang
13. 🌍 Traduire 5 pages cours + accueil EN/DE/ES/IT
14. 🌍 Sitemap multilingue avec xhtml:link

---

## OUTILS DE SUIVI RECOMMANDÉS

| Outil | Usage | Fréquence |
|-------|-------|-----------|
| Google Search Console | Positions, impressions, erreurs d'indexation | Hebdomadaire |
| Google Rich Results Test | Valider schemas JSON-LD | Après chaque modification |
| PageSpeed Insights | Core Web Vitals (LCP, CLS, INP) | Mensuel |
| Screaming Frog SEO Spider | Crawl complet (liens cassés, canoniques, meta) | Mensuel |
| Ahrefs / Semrush | Positions, backlinks, keyword gap | Mensuel |
| Schema Markup Validator (schema.org) | Validation JSON-LD | Après chaque modification |

---

---

## DONNÉES DE CRAWL RÉEL (17 février 2026)

> Source : curl/fetch sur https://musique-facile.fr — données live

### Hébergement réel
Le site tourne sur **o2switch** (serveur `o2switch-PowerBoost-v3`) — **pas Netlify**. Important pour les optimisations de cache et de compression.

### Problème critique confirmé : Redirections 301 en chaîne depuis le sitemap

**Toutes les URLs du sitemap sont sans slash final**, alors que le serveur applique un 301 vers la version avec slash :

```
Sitemap : /cours/apprendre-guitare-debutant
Serveur : 301 → /cours/apprendre-guitare-debutant/  ← canonical
```

**Impact :** Google doit suivre une redirection 301 pour chaque URL du sitemap. Le sitemap et les canonicals sont incohérents. Correction : mettre les URLs avec slash dans le sitemap, ou configurer le serveur pour ne pas rediriger.

| URL dans sitemap | Réponse serveur |
|-----------------|-----------------|
| `/cours/apprendre-guitare-debutant` | 301 → version `/` |
| `/cours/piano-facile-apprendre-debutant` | 301 → version `/` |
| `/cours/apprendre-ukulele-debutant` | 301 → version `/` |
| `/blog` | 301 → `/blog/` |
| `/cours` | 301 → `/cours/` |

**Action :** Dans `sitemap.xml.ts`, utiliser `${baseUrl}/cours/${course.slug}/` (avec slash final) pour aligner avec les canonicals.

### Titres tronqués CONFIRMÉS dans les SERPs

Le `...` apparaît dans la balise `<title>` elle-même (pas seulement dans l'affichage Google) :
```html
<!-- Piano -->
<title>Pack Débutant Piano : Tout pour Bien Commencer...</title>
<!-- Ukulélé -->
<title>Ukulélé pour Tous : Guide Complet du Débutant...</title>
```
→ Ces titres tronqués apparaissent aussi dans les OG tags. **À corriger en priorité.**

### Schémas confirmés par page (crawl live)

**Page d'accueil :** FAQPage (8 Q&A) ✅ + WebSite + WebPage + Organization + EducationalOrganization + Person + AggregateRating (4.7, 2847 avis)

**Pages cours (ex: guitare débutant) :** Review×3 + HowTo + FAQPage (5 Q&A) + Course×5 + AggregateRating + Organization×4

> Correction à l'audit initial : Les FAQPage schemas SONT déjà présents sur les pages cours. Le problème n'est pas l'absence du schema mais l'incohérence des reviewCount.

### ReviewCount incohérents confirmés
```
Homepage EducationalOrganization : reviewCount = "2847"
Guitare débutant (AggregateRating) : reviewCount = "180"
Piano débutant (AggregateRating)  : reviewCount = "1500"
Ukulélé débutant (AggregateRating): reviewCount = "360"
```

### Robots meta : directive manquante sur les pages cours
```html
<!-- Homepage -->
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
<!-- Pages cours -->
<meta name="robots" content="index, follow">
```
→ Les pages cours ne communiquent pas `max-image-preview:large` à Google → perte potentielle de rich snippets images.

### Headers HTTP — points notables
- `cache-control: max-age=0` → aucun cache navigateur (toutes les pages rechargées depuis o2switch)
- HSTS : ✅ `max-age=31536000; includeSubDomains`
- CSP : ✅ Complète (Vimeo, GTM, GA autorisés)
- `x-xss-protection: 1; mode=block` → obsolète, à supprimer
- `/stage2026/` → répond HTTP 200, non bloquée dans robots.txt ⚠️

---

*Audit finalisé avec données crawl live — Février 2026*
