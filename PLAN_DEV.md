# PLAN DE DEVELOPPEMENT — Evolution musique-facile.fr (Avril 2026)

## Analyse de l'ecart actuel / vision

### Etat actuel du codebase

**Architecture solide en place :**
- Design system complet (`design-tokens.css`) avec echelle de couleurs par instrument, typographie, espacements, shadows
- Composants modulaires Astro : HeroModern, CoursGrid, TemoignagesModern, PricingPreview, StickyCTAMobile
- Content collections bien structurees (courses, blog, livres) avec schemas Zod
- Template cours dynamique (`[slug].astro`) alimentant 18 cours depuis le markdown
- Script d'animations existant (`animations.js`) avec IntersectionObserver, countUp, parallax
- Page quiz existante (`quel-instrument-choisir.astro`) + composant `PersonalizationQuiz.astro`
- Dark mode fonctionnel (system + toggle)
- SEO : Schema.org (Organization, Course, FAQ, HowTo, Review), Open Graph, canonicals

**Ecarts principaux avec la vision :**

| Domaine | Actuel | Vision |
|---------|--------|--------|
| **Couleur marque** | Vert turquoise `#00c28e` | Violet profond `#6C3FA0` |
| **Couleurs instruments** | Vert lime, Bleu cyan, Jaune-orange, Rouge | Vert `#4CAF50`, Bleu `#2196F3`, Ambre `#FF9800`, Rouge `#E53935` |
| **Homepage structure** | Hero > Avantages > Cours > Temoignages > Pricing > CTA Final | Hero video + compteurs > Probleme > Instruments > Methode > Fred > Temoignages |
| **Hero homepage** | Image statique + stats texte | Video Fred + compteurs animes |
| **Copywriting** | Oriente fonctionnalites | Oriente transformation |
| **Navbar** | Fond vert opaque fixe | Transparent > opaque au scroll |
| **Animations** | Fade-in basiques | Stagger, countUp, scroll reveals avances |
| **Section "Probleme"** | Absente sur homepage | Pain points empathiques avec icones |
| **Section "Methode"** | Absente sur homepage | Roadmap 4 etapes animee |
| **Section "Fred"** | About.astro (page separee) | Bio + credentials + video 60s sur homepage |
| **Pages cours** | Structure mixte | Decision-first : Hero > Pour qui > Video > Curriculum > Temoignage > Prix > FAQ |
| **Quiz** | Page separee basique | Quiz integre dans le tunnel de conversion |

---

## Phase 0 — Preparation et fondations (1-2 jours)

> Prerequis pour toutes les phases suivantes. Aucune regression visible.

### T0.1 — Creer la branche de travail
- **Priorite** : P0
- **Statut** : FAIT
- **Action** : Creer branche `feature/evolution-2026` depuis master
- **Risque** : Aucun

### T0.2 — Nettoyer les fichiers obsoletes
- **Priorite** : P1
- **Statut** : FAIT
- **Action** : 
  - Supprimer `Hero.astro` (deja supprime dans git status, confirmer)
  - Supprimer `_index-old.astro.bak`
  - Auditer les imports inutilises dans les composants
- **Fichiers** : `src/components/Hero.astro`, `src/pages/_index-old.astro.bak`
- **Risque** : Faible — verifier qu'aucun fichier ne reference Hero.astro

### T0.3 — Unifier le systeme de footer
- **Priorite** : P1
- **Statut** : FAIT
- **Action** : 
  - Les pages cours et quiz utilisent `Footer.astro`, la homepage utilise `FooterModern.astro`
  - Migrer toutes les pages vers `FooterModern.astro` puis supprimer `Footer.astro`
- **Fichiers** : `src/components/Footer.astro`, `src/components/FooterModern.astro`, toutes les pages qui importent Footer
- **Risque** : Moyen — tester chaque page apres migration

---

## Phase 1 — Quick Wins visuels (3-5 jours)

> Impact visuel immediat sans restructuration profonde.

### T1.1 — Compteurs animes dans le hero homepage
- **Priorite** : P0
- **Statut** : FAIT
- **Estimation** : 1 jour
- **Description** : Remplacer les stats statiques ("80K+", "1400+", "95%") par des compteurs qui s'animent au scroll (countUp). Le script `animations.js` a deja une methode `setupCounterAnimations()` — l'exploiter.
- **Fichiers a modifier** :
  - `src/components/HeroModern.astro` — ajouter `data-count-target` sur les `.stat-number`
  - `src/scripts/animations.js` — verifier que le countUp cible bien les bons selecteurs
- **Dependances** : Aucune
- **Verification** : Animation visible au chargement, pas de flash de contenu, `prefers-reduced-motion` respecte

### T1.2 — Headlines transformation sur homepage
- **Priorite** : P0
- **Statut** : FAIT
- **Estimation** : 2 heures
- **Description** : Reformuler les titres pour orienter transformation plutot que fonctionnalites
- **Changements proposes** :
  - Hero : "Apprenez la musique en 15 min par jour" -> "Jouez vos morceaux preferes dans 30 jours" (ou similaire oriente resultat)
  - Cours : "Choisissez votre instrument" -> "Trouvez VOTRE instrument et jouez des ce soir"
  - Avantages : "Jouez en 7 jours" / "15 min suffisent" / "Support reactif" -> formulations axees benefice
  - CTA final : "Pret a commencer votre aventure musicale ?" -> "Votre premiere chanson vous attend"
- **Fichiers a modifier** :
  - `src/pages/index.astro` — props des composants + sections inline
- **Dependances** : Aucune
- **Verification** : Verifier que les titres sont coherents avec le Schema.org

### T1.3 — Espace pour video Fred dans le hero
- **Priorite** : P0
- **Statut** : FAIT
- **Estimation** : 1 jour
- **Description** : Remplacer l'image statique `hero-image` par un emplacement video (iframe YouTube ou lecteur custom). La prop `videoUrl` existe deja dans HeroModern mais n'est pas utilisee.
- **Fichiers a modifier** :
  - `src/components/HeroModern.astro` — conditionner l'affichage image/video
  - `src/pages/index.astro` — passer la videoUrl en prop
- **Dependances** : Necessite l'URL de la video de Fred (a fournir par l'utilisateur)
- **Risque** : Impact LCP si la video est chargee eagerly. Utiliser facade (thumbnail + play button) pour le lazy loading.
- **Verification** : LCP stable, video responsive, fonctionne sur mobile

### T1.4 — Navbar transparent -> opaque au scroll
- **Priorite** : P2
- **Statut** : FAIT
- **Estimation** : 2-3 heures
- **Description** : Le header a deja une classe `.scrolled` qui change le background. Il suffit de modifier l'etat initial pour etre transparent et s'opacifier au scroll.
- **Fichiers a modifier** :
  - `src/components/Header.astro` — modifier le CSS de `.header` (background initial transparent) et `.header.scrolled`
- **Risque** : Moyen — la lisibilite des liens blancs sur fond clair doit etre testee. Peut necessiter un fond sombre initial uniquement sur la homepage.
- **Verification** : Tester sur homepage (fond sombre hero) ET sur pages internes (fond clair)

---

## Phase 2 — Nouvelle palette de couleurs (3-5 jours)

> Changement de l'identite visuelle. Impact large sur tous les composants.

### T2.1 — Migrer la couleur marque vers violet
- **Priorite** : P1
- **Statut** : FAIT
- **Estimation** : 1-2 jours
- **Description** : Remplacer la palette `brand-*` (vert turquoise) par une palette violet `#6C3FA0`. Generer l'echelle 50-950 coherente.
- **Nouvelle palette proposee** :
  ```
  --brand-50: #f5f0fa
  --brand-100: #e8ddf4
  --brand-200: #d4bfea
  --brand-300: #b994db
  --brand-400: #9c6ac8
  --brand-500: #6C3FA0  (couleur de base)
  --brand-600: #5a3488
  --brand-700: #482970
  --brand-800: #361f58
  --brand-900: #241440
  --brand-950: #120a20
  ```
- **Fichiers a modifier** :
  - `src/styles/design-tokens.css` — remplacer les valeurs brand-*
  - `src/styles/design-tokens.css` — mettre a jour les shadows colorees
  - `src/components/Header.astro` — les gradients utilisent des couleurs hardcodees `rgba(0, 194, 142, ...)`. Les remplacer par la nouvelle palette.
- **Risque** : ELEVE — impact sur tous les composants qui utilisent `var(--brand-*)`. Le header, le hero, les boutons, les liens, le footer sont tous concernes.
- **Verification** : Contrast WCAG AA sur tous les boutons/liens. Tester dark mode. Verifier chaque page.

### T2.2 — Migrer les couleurs instruments
- **Priorite** : P1
- **Statut** : FAIT
- **Estimation** : 1 jour
- **Description** : Aligner les couleurs instruments sur la nouvelle charte
- **Changements** :
  - Guitare : `#689f00` -> `#4CAF50` (vert Material)
  - Piano : `#1ca5af` -> `#2196F3` (bleu Material)
  - Solfege : `#be0a00` -> `#E53935` (rouge Material)
  - Ukulele : `#b58600` -> `#FF9800` (ambre Material)
- **Fichiers a modifier** :
  - `src/styles/design-tokens.css` — les echelles `guitar-*`, `piano-*`, `solfege-*`, `ukulele-*`
  - Regenerer les echelles 50-950 pour chaque couleur
- **Dependances** : T2.1 (faire dans le meme sprint pour tester ensemble)
- **Risque** : ELEVE — impact sur CoursGrid, pages cours, themes CSS. Verifier contraste WCAG.
- **Verification** : Contrast AA pour tous les textes colores. Tester les cards cours, les pages cours, les badges.

### T2.3 — Fond sections alternees violet pale
- **Priorite** : P1
- **Statut** : FAIT
- **Estimation** : 2 heures
- **Description** : Alterner fond blanc / fond violet pale `#F7F5FB` sur les sections de la homepage
- **Fichiers a modifier** :
  - `src/styles/design-tokens.css` — ajouter `--bg-alt: #F7F5FB`
  - `src/pages/index.astro` — classes CSS sur les sections
  - Composants concernes
- **Dependances** : T2.1

### T2.4 — Mettre a jour les couleurs hardcodees
- **Priorite** : P1
- **Statut** : FAIT
- **Estimation** : 1 jour
- **Description** : Le Header.astro et d'autres composants ont des couleurs RGB hardcodees (`rgba(0, 194, 142, ...)`). Les migrer vers les variables CSS.
- **Fichiers a modifier** (recherche systematique) :
  - `src/components/Header.astro` — gradients et box-shadows
  - `src/components/HeroModern.astro` — badge, boutons
  - `src/components/StickyCTAMobile.astro`
  - `src/components/FooterModern.astro`
- **Dependances** : T2.1

---

## Phase 3 — Restructuration homepage (1-2 semaines)

> Refonte de l'architecture narrative de la homepage.

### T3.1 — Creer la section "Probleme" (pain points)
- **Priorite** : P1
- **Statut** : FAIT
- **Estimation** : 1 jour
- **Description** : Nouvelle section empathique apres le hero : "Vous vous reconnaissez ?" avec pain points et icones
- **Fichiers a creer** :
  - `src/components/PainPoints.astro`
- **Fichiers a modifier** :
  - `src/pages/index.astro` — inserer apres HeroModern, avant CoursGrid
- **Contenu propose** : 4-6 pain points (ex: "Vous avez essaye seul mais vous tournez en rond", "Vous avez peur de ne pas etre assez doue", etc.)

### T3.2 — Creer la section "Methode" (roadmap 4 etapes)
- **Priorite** : P1
- **Statut** : FAIT
- **Estimation** : 2 jours
- **Description** : Roadmap visuelle en 4 etapes montrant le parcours eleve : Decouverte > Fondamentaux > Pratique > Autonomie
- **Fichiers a creer** :
  - `src/components/MethodRoadmap.astro`
- **Fichiers a modifier** :
  - `src/pages/index.astro` — inserer apres CoursGrid
- **Animations** : Stagger reveal au scroll, etapes qui s'illuminent progressivement
- **Dependances** : Script animations.js existant

### T3.3 — Creer la section "Fred" (bio + credentials sur homepage)
- **Priorite** : P1
- **Statut** : FAIT
- **Estimation** : 1 jour
- **Description** : Section dediee a Fred avec photo, credentials, video 60s. Reprendre les infos de About.astro mais en version condensee.
- **Fichiers a creer** :
  - `src/components/InstructorHighlight.astro`
- **Fichiers a modifier** :
  - `src/pages/index.astro` — inserer apres MethodRoadmap

### T3.4 — Refactorer les cartes instruments avec promesse + CTA
- **Priorite** : P1
- **Statut** : FAIT
- **Estimation** : 1 jour
- **Description** : Les cartes CoursGrid actuelles listent des features. Les reformuler avec une promesse de transformation et un CTA par instrument.
- **Fichiers a modifier** :
  - `src/components/CoursGrid.astro` — refonte des cards
- **Contenu** : Chaque carte = emoji + nom + promesse ("Jouez 100 chansons en 3 mois") + CTA colore

### T3.5 — Reordonner les sections homepage
- **Priorite** : P1
- **Statut** : FAIT
- **Estimation** : 2 heures
- **Description** : Assembler le nouvel ordre dans index.astro :
  1. Header
  2. HeroModern (avec video + compteurs)
  3. PainPoints (section probleme)
  4. CoursGrid (cartes instruments avec promesse)
  5. MethodRoadmap (4 etapes)
  6. InstructorHighlight (Fred)
  7. TemoignagesModern
  8. PricingPreview
  9. CTA Final + FAQ
  10. FooterModern
- **Fichiers a modifier** :
  - `src/pages/index.astro`
- **Dependances** : T3.1, T3.2, T3.3, T3.4

---

## Phase 4 — Refonte pages cours decision-first (1-2 semaines)

> Restructurer le template cours pour optimiser la conversion.

### T4.1 — Auditer la structure actuelle du template cours
- **Priorite** : P1
- **Statut** : FAIT
- **Description** : Le template `[slug].astro` est un fichier >300 lignes. Documenter l'ordre actuel des sections pour planifier la migration.
- **Fichiers concernes** : `src/pages/cours/[slug].astro`, `src/layouts/CourseLayout.astro`

### T4.2 — Ajouter section "Pour qui" (checklist)
- **Priorite** : P1
- **Statut** : FAIT
- **Estimation** : 0.5 jour
- **Description** : Section apres le hero cours : "Ce cours est pour vous si..." avec checklist visuelle
- **Fichiers a creer** :
  - `src/components/CourseTargetAudience.astro`
- **Schema** : Ajouter un champ `targetAudience` dans le frontmatter courses si absent

### T4.3 — Ajouter section "Ce que vous obtenez"
- **Priorite** : P1
- **Statut** : FAIT
- **Estimation** : 0.5 jour
- **Description** : Liste visuelle de tout ce qui est inclus : nombre de videos, duree, bonus, certificat, support
- **Fichiers a creer** :
  - `src/components/CourseIncludes.astro`

### T4.4 — Refactorer la section prix + garantie
- **Priorite** : P1
- **Statut** : FAIT
- **Estimation** : 1 jour
- **Description** : Le pricing est deja dans le frontmatter (`pricing`, `hasCourseInstance.offers`). Creer un composant dedie avec garantie 30 jours mise en avant.
- **Fichiers a creer** :
  - `src/components/CoursePricing.astro`

### T4.5 — Reordonner le template cours
- **Priorite** : P1
- **Statut** : FAIT
- **Estimation** : 1 jour
- **Description** : Nouvel ordre decision-first :
  1. Hero transformation
  2. Pour qui (checklist)
  3. Video 90s
  4. Curriculum oriente resultat (timeline existante)
  5. Temoignage #1
  6. Ce que vous obtenez
  7. Prix + garantie 30 jours
  8. Temoignage #2
  9. CTA final + FAQ
- **Fichiers a modifier** : `src/pages/cours/[slug].astro`
- **Dependances** : T4.2, T4.3, T4.4

---

## Phase 5 — Animations et micro-interactions (3-5 jours)

> Ameliorer le "feeling" du site sans alourdir le JS.

### T5.1 — Scroll animations staggerees
- **Priorite** : P2
- **Statut** : FAIT
- **Estimation** : 1 jour
- **Description** : Ameliorer `animations.js` pour supporter le stagger (delai incremental entre les elements enfants d'un groupe). Appliquer sur : cards instruments, features, timeline.
- **Fichiers modifies** :
  - `src/scripts/animations.js` — refonte avec `setupStaggerGroups()` et attribut `data-stagger-group`
  - `src/components/PainPoints.astro` — `data-stagger-group=".painpoint-card"`, suppression animation CSS inline
  - `src/components/CoursGrid.astro` — `data-stagger-group=".cours-card"`
  - `src/components/MethodRoadmap.astro` — `data-stagger-group=".timeline-step"`, suppression animation CSS inline
  - `src/components/PricingPreview.astro` — `data-stagger-group=".pricing-card"`, suppression script doublon
  - `src/components/CourseIncludes.astro` — `data-stagger-group=".include-card"`
  - `src/components/InstructorHighlight.astro` — `data-stagger-group=".stat"`
  - `src/components/TemoignagesModern.astro` — `data-stagger-group=".stat"`

### T5.2 — Compteurs countUp sur toutes les pages
- **Priorite** : P2
- **Statut** : FAIT
- **Estimation** : 0.5 jour
- **Description** : Generaliser les compteurs animes sur les stats InstructorHighlight et TemoignagesModern.
- **Fichiers modifies** :
  - `src/components/InstructorHighlight.astro` — 4 stats avec `data-counter` (80000, 4.7, 1400, 15)
  - `src/components/TemoignagesModern.astro` — 3 stats avec `data-counter` (80000, 95, 1400)

### T5.3 — Micro-interactions hover et focus
- **Priorite** : P2
- **Statut** : FAIT
- **Estimation** : 1 jour
- **Description** : Affiner les transitions hover et ajouter `focus-visible` pour l'accessibilite.
- **Fichiers modifies** :
  - `src/styles/components.css` — focus-visible global, reduced-motion pour transforms
  - `src/components/Header.astro` — underline smooth sur nav-links + focus-visible
  - `src/components/CourseIncludes.astro` — scale(1.03) + ombre douce au hover
  - `src/pages/index.astro` — focus-visible sur CTA final

### T5.4 — Animations d'entree pour les sections
- **Priorite** : P2
- **Statut** : FAIT
- **Estimation** : 1 jour
- **Description** : Chaque section de la homepage s'anime a l'entree dans le viewport : fade-in + slide-up subtil (20px). Respecter `prefers-reduced-motion`.
- **Fichiers modifies** :
  - `src/scripts/animations.js` — `setupSectionReveal()` + injection CSS dynamique
  - Composants avec `data-animate="reveal"` : PainPoints, CoursGrid, MethodRoadmap, InstructorHighlight, TemoignagesModern, PricingPreview, CTA Final (index.astro)

---

## Phase 6 — Quiz d'orientation ameliore (3-5 jours)

> Transformer le quiz existant en outil de qualification dans le tunnel de conversion.

### T6.1 — Ameliorer le quiz existant
- **Priorite** : P2
- **Statut** : FAIT
- **Estimation** : 2 jours
- **Description** : La page `quel-instrument-choisir.astro` existe deja avec un quiz fonctionnel. L'ameliorer : animations entre questions, barre de progression animee, resultat avec CTA personnalise.
- **Fichiers a modifier** :
  - `src/pages/quel-instrument-choisir.astro`
- **Risque** : Le quiz actuel fonctionne, ne pas casser l'existant

### T6.2 — Integrer un mini-quiz CTA sur la homepage
- **Priorite** : P2
- **Statut** : FAIT
- **Estimation** : 1 jour
- **Description** : Ajouter un teaser quiz sur la homepage qui redirige vers la page complete. "Pas sur de votre instrument ? Faites le quiz en 30 secondes"
- **Fichiers a creer** :
  - `src/components/QuizTeaser.astro`
- **Fichiers a modifier** :
  - `src/pages/index.astro`

---

## Phase 7 — Illustrations et assets (1-2 semaines)

> Remplacer les emojis et images generiques par des assets custom.

### T7.1 — Remplacer les emojis par des icones SVG
- **Priorite** : P2
- **Statut** : FAIT
- **Estimation** : 3 jours
- **Description** : Les composants utilisent massivement des emojis (instruments, features, menu). Les remplacer par des SVG inline pour un rendu plus professionnel et coherent cross-platform.
- **Fichiers concernes** : Header, CoursGrid, HeroModern, PainPoints, MethodRoadmap, PricingPreview
- **Risque** : Faible — amelioration purement visuelle

### T7.2 — Creer ou integrer des illustrations SVG custom
- **Priorite** : P3
- **Statut** : TODO
- **Estimation** : 1-2 semaines
- **Description** : Illustrations personnalisees pour les sections homepage (hero, methode, pain points). Peut etre fait avec un designer externe ou des outils comme Figma/SVGator.
- **Dependances** : Brief graphique a definir avec le client

---

## Recapitulatif par priorite

### P0 — A faire en premier (2-3 jours)
| Tache | Estimation | Risque |
|-------|-----------|--------|
| T1.1 Compteurs animes hero | 1 jour | Faible |
| T1.2 Headlines transformation | 2h | Faible |
| T1.3 Video Fred dans hero | 1 jour | Moyen (LCP) |

### P1 — Sprint principal (2-3 semaines)
| Tache | Estimation | Risque |
|-------|-----------|--------|
| T0.2 Nettoyage fichiers | 2h | Faible |
| T0.3 Unification footer | 0.5 jour | Moyen |
| T2.1 Palette violet | 1-2 jours | ELEVE |
| T2.2 Couleurs instruments | 1 jour | ELEVE |
| T2.3 Fond sections alternees | 2h | Faible |
| T2.4 Couleurs hardcodees | 1 jour | Moyen |
| T3.1 Section Probleme | 1 jour | Faible |
| T3.2 Section Methode | 2 jours | Moyen |
| T3.3 Section Fred | 1 jour | Faible |
| T3.4 Cartes instruments | 1 jour | Faible |
| T3.5 Reordonnancement homepage | 2h | Faible |
| T4.1-T4.5 Refonte pages cours | 3-4 jours | Moyen |

### P2 — Ameliorations (1-2 semaines)
| Tache | Estimation | Risque |
|-------|-----------|--------|
| T1.4 Navbar transparent | 2-3h | Moyen |
| T5.1-T5.4 Animations | 3-4 jours | Faible |
| T6.1-T6.2 Quiz ameliore | 3 jours | Faible |
| T7.1 Icones SVG | 3 jours | Faible |

### P3 — Long terme
| Tache | Estimation | Risque |
|-------|-----------|--------|
| T7.2 Illustrations custom | 1-2 semaines | Faible |

---

## Points d'attention et risques

### Risques techniques
1. **Migration palette couleurs (T2.1-T2.2)** : Impact le plus large. Faire sur une branche dediee, tester TOUTES les pages avant merge. Les couleurs hardcodees dans le Header et d'autres composants necessitent un grep systematique.
2. **Performance LCP (T1.3)** : L'ajout d'une video dans le hero peut degrader le LCP. Utiliser une facade (thumbnail cliquable) qui charge l'iframe au clic.
3. **Dark mode** : La migration couleurs doit etre testee en dark mode aussi. Les overrides dark sont dans `design-tokens.css` et dans certains composants (CoursGrid a ses propres overrides dark).
4. **Build Astro** : Verifier que le build passe apres chaque phase (`npm run build`).

### Risques SEO
1. Ne pas modifier les URLs existantes.
2. Conserver les Schema.org en place sur les pages cours.
3. Les meta descriptions et titres doivent rester optimises si on change les headlines.

### Risques CRO
1. Les changements de copywriting (T1.2) doivent etre coherents avec les stats citees dans le Schema.org et les temoignages.
2. Le reordonnancement des sections cours (T4.5) peut impacter les conversions — prevoir un A/B test si possible.

---

## Ordre d'execution recommande

```
Semaine 1 : T0.1 + T0.2 + T0.3 + T1.1 + T1.2
Semaine 2 : T2.1 + T2.2 + T2.3 + T2.4
Semaine 3 : T1.3 + T1.4 + T3.1 + T3.2 + T3.3
Semaine 4 : T3.4 + T3.5 + T4.1
Semaine 5 : T4.2 + T4.3 + T4.4 + T4.5
Semaine 6 : T5.1 + T5.2 + T5.3 + T5.4
Semaine 7 : T6.1 + T6.2 + T7.1
Semaine 8+ : T7.2 (illustrations custom)
```

---

*Plan cree le 2026-04-07. Derniere mise a jour : 2026-04-07. Phases 0-7.1 terminees (T7.2 hors scope).*
