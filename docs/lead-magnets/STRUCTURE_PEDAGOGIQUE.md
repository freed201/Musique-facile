# STRUCTURE_PEDAGOGIQUE.md — Architecture du gabarit

> Document de structuration bloc par bloc pour la génération du gabarit.
> Chaque section précise : **objectif pédagogique** · **contenu** · **composants visuels** · **règles de pagination**.
> Référence design : `DESIGN.md`.

---

## Philosophie pédagogique

Le guide repose sur **3 principes d'apprentissage adulte** qui dictent toutes les décisions de mise en page :

1. **Récompense rapide** : le lecteur doit ressentir une victoire dans les 7 premières minutes de lecture (= jouer son premier accord). Donc le premier accord arrive en page 3, pas en page 8.
2. **Une idée = un objet visuel** : chaque concept clé a un composant graphique dédié (diagramme d'accord, encadré typé, carte conceptuelle). Pas de mur de texte explicatif.
3. **Boucle motivation → action → preuve** : chaque chapitre suit ce cycle. *Pourquoi tu vas y arriver* → *Geste à faire* → *Comment savoir que tu y es*.

---

## Inventaire des blocs (vue d'ensemble)

| # | Bloc | Pages cible | Objectif pédagogique |
|---|---|---|---|
| 1 | Couverture | 1 p. | Établir l'autorité, créer le désir |
| 2 | Promesse & cadre | 1 p. | Reframer la croyance « apprendre la guitare = 3 ans » |
| 3-7 | Les 5 fiches d'accord | 5 p. (1 par accord) | Transmettre 5 gestes techniques mémorables |
| 8 | Carte conceptuelle I-V-vi-IV | 1 p. | Faire comprendre POURQUOI 5 accords suffisent (passage du quoi au pourquoi) |
| 9 | Les 3 enchaînements | 1 p. | Transformer 5 gestes isolés en mouvement musical |
| 10 | La rythmique universelle | 1 p. | Débloquer la dimension temporelle (main droite) |
| 11-12 | Répertoire 100 chansons | 2 p. | Récompense maximale, preuve sociale par les œuvres |
| 13 | Pont vers la suite | 1 p. | CTA principal, sans pression mais clair |
| 14 | Page bonus (récap visuel) | 1 p. | Carte de poche imprimable, viralité |
| 15 | Quatrième de couverture | 1 p. | Signature de marque |

**Total : 15 pages A4** (identique au PDF actuel, mais redistribuées et enrichies).

---

## 1. Couverture (p. 1)

**Objectif** : créer un objet de désir immédiat. Le lecteur doit avoir envie de cliquer « ouvrir » avant même de connaître le contenu.

**Type pédagogique** : amorce affective + signal d'autorité.

**Contenu** :
- Étiquette en haut : `GUIDE GRATUIT · GUITARE` (en `--text-meta`).
- Titre : **« Les 5 Accords Magiques »** en `--text-hero` Fraunces 800, deux lignes maximum.
- Sous-titre italique : *« Joue 100 chansons à la guitare en moins d'une semaine »*.
- Tagline sous filet : **« Pas de solfège. Pas de théorie. Tu joues, c'est tout. »**
- Trois marqueurs d'autorité en bas, séparés par des points médians :
  - `12 ans d'enseignement`
  - `Auteur publié chez Hal Leonard`
  - `Prix Samuel Paty 2024`
- Signature : `Fred Fieffé · Musique Facile · musique-facile.fr`

**Composants visuels** :
- Un **gros numéro « 5 » Fraunces 280pt en outline terracotta**, débordant en filigrane en bas à droite (signature visuelle du guide).
- Une **micro-illustration manche de guitare** en SVG line-art, 80mm de haut, à gauche de la composition. Style éditorial, pas réaliste.
- Filet horizontal terracotta 2pt sous le titre.

**Règle de pagination** : aucun header/footer sur la couverture.

---

## 2. Promesse & cadre (p. 2)

**Objectif** : démolir en 30 secondes la croyance limitante (« faut du solfège, faut des années ») et établir le contrat de lecture.

**Type pédagogique** : reframing cognitif + autorité narrative.

**Contenu** :
- Titre H1 : **« Pourquoi 5 accords suffisent (et pourquoi on ne te l'a pas dit) »**
- Lead italique : 2 lignes de mise en contexte.
- 3 paragraphes corps de texte (reprendre fidèlement le texte actuel page 2 du PDF).
- **Encadré « Histoire vraie »** (safran) reprenant la citation des élèves de conservatoire.
- **Encadré « Promesse »** (terracotta, plus important visuellement) : *« Avec 5 accords seulement, tu joues Hallelujah, No Woman No Cry, Let It Be, Wonderwall... En 7 jours. »*

**Composants visuels** :
- Une **pull-quote** au milieu de page : « En 7 jours. » en Fraunces 56pt terracotta.
- Optionnel : 6 mini-vignettes-pochettes en monochrome terracotta des chansons citées, en bas de page.

---

## 3 à 7. Les 5 fiches d'accord (p. 3 à 7)

**Objectif** : transmettre chaque geste technique de manière indépendante, mémorisable, et testable.

**Type pédagogique** : démonstration motrice avec auto-évaluation immédiate.

### Structure unifiée d'une fiche d'accord

Chaque fiche suit **exactement la même structure** (consistance cognitive = mémorisation accrue) :

```
┌─────────────────────────────────────────────┐
│ [N°] ACCORD                          [tag]  │  ← header
│                                              │
│  Titre H1 : « Em (Mi mineur) »              │
│  Lead italique : "Le plus facile. ..."      │
│                                              │
│  ┌──────────────┐   ┌──────────────────┐   │
│  │  DIAGRAMME   │   │  Description     │   │
│  │   D'ACCORD   │   │  textuelle des   │   │
│  │   (centré)   │   │  doigts          │   │
│  └──────────────┘   └──────────────────┘   │
│                                              │
│  H2 : Comment poser l'accord                │
│  Liste numérotée 3 étapes max               │
│                                              │
│  ┌─ Encadré ASTUCE ─────────────────────┐  │
│  │ La technique du doigt unique         │  │
│  │ ...                                   │  │
│  └───────────────────────────────────────┘  │
│                                              │
│  ┌─ Encadré TEST DE RÉUSSITE ───────────┐  │
│  │ ✓ Tu grattes les 6 cordes...         │  │
│  │ ✓ Tes doigts sont détendus...        │  │
│  └───────────────────────────────────────┘  │
│                                              │
│                              [grand "1" outline]
└─────────────────────────────────────────────┘
```

**Composants visuels signature** :
- **Numéro géant en outline** (Fraunces 280pt, stroke 1.5px terracotta) dans le coin sup. droit, hors grille.
- **Diagramme d'accord** au centre-gauche, 220px de haut, doigts colorés selon convention DESIGN.md §6.2.
- **Encadré ASTUCE** (terracotta) et **encadré TEST** (sauge) en bas.

**Variations par accord** :
- **Em** (p. 3) : 1 encadré astuce « doigt unique ».
- **G** (p. 4) : 1 encadré « pourquoi cet ordre de pose » + lead « accord ouvert le plus joyeux ».
- **D** (p. 5) : 1 encadré astuce « accord à l'envers » + 1 encadré « étouffer les cordes graves » (type ⚠ Erreur à éviter, indigo).
- **C** (p. 6) : 1 paragraphe sur le rôle pivot dans I-V-vi-IV (renvoi vers p. 8).
- **Am** (p. 7) : 1 encadré ASTUCE « passage C → Am » avec le concept d'économie de mouvement.

**Règle de pagination** : chaque accord = 1 page complète. Jamais coupé entre 2 pages (`break-after: page` en CSS print).

---

## 8. Carte conceptuelle I-V-vi-IV (p. 8) ⭐ NOUVEAU BLOC

**Objectif** : passer du « quoi » (5 accords) au « pourquoi » (le système harmonique qui génère 100+ chansons). C'est le moment de bascule pédagogique du guide.

**Type pédagogique** : **carte conceptuelle visuelle** + amorce de pensée systémique.

**Contenu** :
- Titre H1 : **« Le système secret derrière 100 chansons »**
- Lead : *« Ces 4 accords reviennent dans 80% des hits pop des 50 dernières années. Voici pourquoi. »*
- Court paragraphe explicatif (3-4 lignes) en langage simple, jamais théorique.

**Composant visuel central** :
Un **diagramme Mermaid ou SVG custom** montrant le cycle :

```
        C ──────► G
        ▲          │
        │          ▼
        F ◄────── Am
```

Avec autour, en cercle externe, **6 vignettes-pochettes monochromes terracotta** :
- Let It Be — Beatles
- No Woman No Cry — Marley
- Don't Stop Believin' — Journey
- Someone Like You — Adele
- With or Without You — U2
- Take Me Home Country Roads — Denver

Chaque vignette reliée par fine ligne pointillée au cycle central.

**Au bas de page** :
- **Encadré ASTUCE** : *« Tu n'as pas encore le F ? Joue C-G-Am-C, ça marche dans 99% des cas. On verra le F plus tard. »*

**Règle pédagogique cruciale** : ce bloc n'introduit AUCUNE théorie. Pas de mot « tonique », « dominante », « degré ». Juste : « ces 4 accords qui se suivent = 100 chansons. ».

---

## 9. Les 3 enchaînements (p. 9)

**Objectif** : convertir 5 accords statiques en mouvement musical réel.

**Type pédagogique** : pratique séquentielle progressive.

**Contenu** : reprise du contenu actuel page 10 du PDF, restructuré.
- Titre H1 : **« Tes 3 premiers enchaînements »**
- Lead italique.
- **3 cards horizontales** (1/3 de page chacune) :
  - Enchaînement 1 — Em → G
  - Enchaînement 2 — G → D
  - Enchaînement 3 — D → C → Am

Chaque card contient :
- Titre de l'enchaînement en H3.
- Mini-diagramme 2-3 accords miniatures côte à côte avec flèches.
- 2 lignes « Pourquoi » + 2 lignes « Méthode ».

**Encadré final pleine largeur** : ASTUCE « La règle des 10 minutes par jour » avec son explication sur la consolidation du sommeil.

---

## 10. La rythmique universelle (p. 10)

**Objectif** : débloquer la dimension temporelle. C'est souvent l'angle mort le plus frustrant des débutants.

**Type pédagogique** : démonstration kinesthésique + diagnostic d'erreur.

**Contenu** :
- Titre H1 : **« La rythmique qui débloque tout »**
- Lead : *« Un pattern simple. Aller-retour de la main droite. Tu vas voir. »*

**Composant visuel signature** : **un grand bloc rythmique** en font-mono :
```
   1     et     2     et     3     et     4     et
   ↓     ↓     ↓     ↑     ↑
   G     G     G     H     H
```
Flèches en terracotta, légende en dessous.

**Encadré ASTUCE pleine largeur** : « La cause réelle de ton problème de rythme » (la main droite qui s'arrête).

**Mini-section diagnostic** : *« Mets-toi devant un miroir. Joue. Regarde ta main droite. Si elle s'arrête, tu as ton coupable. »*

---

## 11-12. Répertoire 100 chansons (p. 11-12) ⭐ REFONTE MAJEURE

**Objectif** : récompense maximale. Le lecteur doit voir qu'il a accès à un trésor.

**Type pédagogique** : preuve par l'objet + sélection scannable.

**Refonte vs PDF actuel** : abandonner les listes à puces verticales (rébarbatif, prend 3 pages, peu scannable) → passer à un **format grille 3 colonnes de cards** sur 2 pages, classées par progression.

### Mise en page

**Page 11** : titre + 2 premières progressions (I-V-vi-IV + vi-I-V-IV).
**Page 12** : 2 dernières progressions (Em-C-G-D + 3 accords seulement).

### Structure d'une grille de progression

```
┌─ PROGRESSION 1 ────────────────────────────────────────┐
│ C - G - Am - F                                          │
│ Le "I-V-vi-IV" — la progression la plus utilisée en pop │
│                                                          │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐           │
│ │ Let It Be  │ │ Stand By Me│ │ Country Rds│           │
│ │ Beatles    │ │ Ben E. King│ │ J. Denver  │           │
│ │ [I-V-vi-IV]│ │ [I-V-vi-IV]│ │ [I-V-vi-IV]│           │
│ └────────────┘ └────────────┘ └────────────┘           │
│ ... (7 cards de plus)                                   │
└─────────────────────────────────────────────────────────┘
```

**Card chanson** :
- Hauteur fixe (compactes).
- Titre en Fraunces 14pt semibold.
- Artiste en Inter 11pt `--color-ink-muted`.
- Mini-badge pill terracotta avec la progression.
- Fond `--color-paper-warm`, filet 1pt fin `--color-paper-deep`.
- Pas d'ombre.

### Hiérarchie des 4 progressions

1. **C, G, Am, F** (I-V-vi-IV) — 21 chansons
2. **Em, G, D, C** (vi-I-V-IV) — 22 chansons
3. **Em, C, G, D** (variante ballades) — 14 chansons
4. **Em, G, D** (3 accords seulement) — 12 chansons

**Bandeau supérieur** sur p. 11 : *« 100 chansons classées par progression. Choisis-en une, ouvre YouTube, joue dessus. »*

---

## 13. Pont vers la suite (p. 13)

**Objectif** : célébrer + ouvrir la suite naturelle sans pression commerciale agressive.

**Type pédagogique** : reconnaissance d'accomplissement + projection.

**Contenu** :
- Titre H1 : **« Tu as les 5 accords. Et maintenant ? »**
- Phrase d'ouverture : *« Tu as fait le plus dur : commencer. »*
- 1 paragraphe légitimant le fait de « rester là » (anti-pression).
- Sous-titre H2 : « Si tu veux aller plus loin »
- 3 étapes recommandées en cards horizontales :
  1. Le F (et le B7)
  2. L'arpège
  3. Les rythmiques alternatives

**CTA encadré** (terracotta plein, texte crème) :
- **« Si tu veux qu'on continue ensemble »**
- 2 lignes de description du cours en ligne.
- **« 15 jours satisfait ou remboursé. »**
- Lien : `musique-facile.fr/cours/cours-de-guitare`
- Sous le CTA : signature complète (Hal Leonard / 80K élèves / Prix Samuel Paty / contact email).

---

## 14. Page bonus — Carte de poche imprimable (p. 14) ⭐ NOUVEAU

**Objectif** : créer un objet à imprimer/épingler, augmenter la viralité (le lecteur en parle autour de lui).

**Type pédagogique** : aide-mémoire condensé + objet d'engagement.

**Contenu** : sur une seule page, **les 5 diagrammes d'accord en miniature** (3 colonnes × 2 rangées) + le pattern rythmique + le cycle I-V-vi-IV en mini-version.

**Composition** :
- En-tête : *« Ta carte de poche. Imprime-la. Colle-la sur ton mur. »*
- Grille 3×2 des 5 accords + un encart « Cycle » :
  ```
  ┌──────┐ ┌──────┐ ┌──────┐
  │ Em   │ │ G    │ │ D    │
  └──────┘ └──────┘ └──────┘
  ┌──────┐ ┌──────┐ ┌──────┐
  │ C    │ │ Am   │ │Cycle │
  └──────┘ └──────┘ └──────┘
  ```
- Au bas : rythmique en font-mono + 3 enchaînements en mini-format.

**Règle visuelle** : densité plus forte que les autres pages, c'est volontaire (signal « aide-mémoire dense »). Mais hiérarchie typographique conservée.

---

## 15. Quatrième de couverture (p. 15)

**Objectif** : laisser une dernière impression cohérente avec la marque.

**Contenu** :
- En haut : nouveau « 5 » géant en outline (rappel couverture).
- Citation centrale d'un élève (en pull-quote Fraunces 28pt italic).
- Bloc signature Fred Fieffé : photo (si dispo, traitée en duotone terracotta) + bio courte 3 lignes + liens (YouTube, Instagram, TikTok, site).
- Tout en bas : `© 2026 Musique Facile · MusiqFreed EURL · musique-facile.fr`

**Pas de CTA ici** — c'est une page de respiration.

---

## Récapitulatif des composants pédagogiques

| Composant | Pages d'apparition | Rôle pédagogique |
|---|---|---|
| Encadré ASTUCE (terracotta) | 3, 4, 5, 6, 7, 8, 9, 10 | Technique fine de pose / mouvement |
| Encadré HISTOIRE (safran) | 2, 5 | Ancrage affectif, preuve sociale |
| Encadré TEST (sauge) | 3, 4, 5, 6, 7 | Auto-évaluation immédiate |
| Encadré ERREUR (indigo, rare) | 5, 10 | Alerte sur les pièges fréquents |
| Pull-quote | 2, 15 | Bascule émotionnelle |
| Diagramme d'accord | 3, 4, 5, 6, 7, 14 | Mémoire visuelle motrice |
| Carte conceptuelle I-V-vi-IV | 8, 14 | Pensée systémique |
| Card chanson | 11, 12 | Récompense, projection |
| CTA principal | 13 | Conversion |

---

## Règles de pagination print

- Chaque accord (p. 3 à 7) : `break-after: page` strict.
- Chaque encadré : `break-inside: avoid`.
- Diagrammes d'accord et carte conceptuelle : `break-inside: avoid` impératif.
- Header/footer présents sur p. 2 à 14, absents sur p. 1 et p. 15.
- Numérotation : `N / 15` centrée en footer, font-mono 11pt.
