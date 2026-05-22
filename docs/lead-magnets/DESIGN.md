# DESIGN.md — Système de design « Les 5 Accords Magiques »

> Document de référence pour la génération du gabarit dans Claude Design / Claude Code.
> Cible : PDF print A4 + version web sur musique-facile.fr.
> Auteur : Fred Fieffé · Musique Facile.

---

## 1. Intention de marque

Le gabarit doit être **un objet éditorial chaleureux et autoritaire**, pas une fiche pédagogique scolaire et pas un PDF de coach Instagram. Le ton visuel doit traduire trois promesses :

1. **Confiance immédiate** — l'autorité (Hal Leonard, Prix Samuel Paty, 80K élèves) se voit dès la couverture sans hurler.
2. **Pratique avant théorie** — la mise en page met le geste guitare au centre, jamais le concept abstrait.
3. **Chaleur humaine** — adulte qui reprend la musique après 20 ans, pas étudiant en conservatoire.

**Référence émotionnelle** : un cahier d'atelier italien années 70 mis à jour pour 2026 — papier crème, accents terre cuite, typographies caractérisées, micro-détails éditoriaux (numéros volumineux, marginales, filets fins).

---

## 2. Anti-patterns (ce qu'on évite absolument)

L'esthétique « IA générique » de 2024-2025 est interdite :

- ❌ **Dégradés violets/roses pastel sur fond blanc** (cliché ChatGPT/coach).
- ❌ **Coins arrondis 16px+ partout** — ici les rayons restent ≤ 6px sauf rares cas.
- ❌ **Glassmorphism, neumorphism, ombres molles diffuses**.
- ❌ **Police Inter en titres** (trop générique, signature SaaS). Inter peut servir en body uniquement.
- ❌ **Emojis comme icônes structurelles** (🎸 dans les titres de section). Les emojis restent décoratifs et rares (couverture uniquement, ou en bullet de listes courtes).
- ❌ **Stock photos de guitaristes souriants**. On utilise des diagrammes vectoriels, du type, et des photos d'objet (manche de guitare en macro) si vraiment besoin.
- ❌ **Mots en gras toutes les 3 lignes** (signature LinkedIn). Le gras est rare et stratégique.
- ❌ **Cards blanches avec ombre portée par défaut**. Les blocs se définissent par fond coloré ou filet, pas par drop-shadow.

---

## 3. Palette de couleurs

### 3.1 Tokens primaires

```css
:root {
  /* Base — papier crème chaleureux */
  --color-paper:        #FAF6EE;  /* fond global */
  --color-paper-warm:   #F4EDE0;  /* encadrés, cards */
  --color-paper-deep:   #ECE3D2;  /* séparateurs, marginales */

  /* Encre — noir chaud, jamais #000 */
  --color-ink:          #1F1813;  /* texte principal */
  --color-ink-soft:     #4A3F36;  /* texte secondaire, légendes */
  --color-ink-muted:    #8B7D6F;  /* meta, page numbers, captions */

  /* Accent primaire — terracotta brûlée (signature) */
  --color-accent:       #B8473F;  /* titres, numéros d'accords, CTA */
  --color-accent-deep:  #8E2F2A;  /* hover, accent fort */
  --color-accent-soft:  #E8C9C3;  /* fond d'encadré "astuce" */

  /* Accent secondaire — safran (énergie, repère pédagogique) */
  --color-saffron:      #D98E3C;  /* highlights, doigt #1 schémas */
  --color-saffron-soft: #F3DDB8;  /* fond encadré "histoire" */

  /* Accent tertiaire — vert sauge (calme, repère technique) */
  --color-sage:         #6B7F5C;  /* doigt #2 schémas, checkmarks */
  --color-sage-soft:    #D8DEC9;  /* fond encadré "test" */

  /* Accent quaternaire — bleu indigo profond (rare, autorité) */
  --color-indigo:       #3A4A6B;  /* doigt #3 schémas, citations */
}
```

### 3.2 Règles d'usage

- **Fond global** : toujours `--color-paper`, jamais blanc pur.
- **Accent terracotta** : maximum 1 grosse zone d'accent par page (couverture, début de chapitre, CTA). Le reste = utilisation ponctuelle (numéros, filets sous titres, mots-clés).
- **Code couleur des 4 encadrés pédagogiques** (voir STRUCTURE_PEDAGOGIQUE.md §4) :
  - **Astuce / Technique** → fond `--color-accent-soft` + filet `--color-accent`.
  - **Histoire vraie** → fond `--color-saffron-soft` + filet `--color-saffron`.
  - **Test de réussite** → fond `--color-sage-soft` + filet `--color-sage`.
  - **Citation / Pull-quote** → pas de fond, juste filet épais `--color-accent` à gauche.

---

## 4. Typographie

### 4.1 Système de polices

**Display + Body** : combinaison à 2 familles, toutes deux Google Fonts (libres, gratuites, héberge­ables) :

```css
/* Display — serif éditoriale caractérisée */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,400;9..144,600;9..144,800;9..144,900&display=swap');

/* Body + UI — sans-serif neutre mais soignée */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Monospace pour rythmiques / tablatures */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap');

:root {
  --font-display: 'Fraunces', Georgia, serif;
  --font-body:    'Inter', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', ui-monospace, monospace;
}
```

**Pourquoi Fraunces et pas une serif classique** : Fraunces a un axe `SOFT` et `WONK` qui lui donne un caractère éditorial moderne sans être chic-prétentieux. Elle vit dans la même famille mentale que la presse magazine indé (Romance, Tea, etc.), exactement le registre voulu.

### 4.2 Échelle typographique

Système modulaire basé sur 1.25 (major third) à partir de 16px body :

| Token | Taille | Usage |
|---|---|---|
| `--text-hero` | 64px / 1.05 / weight 800 | Titre couverture |
| `--text-h1` | 40px / 1.15 / weight 700 | Titres de chapitre |
| `--text-h2` | 28px / 1.2 / weight 600 | Sous-titres |
| `--text-h3` | 20px / 1.3 / weight 600 | Titres d'encadrés, sections |
| `--text-lead` | 18px / 1.5 / weight 400 italic | Intros de chapitre |
| `--text-body` | 16px / 1.65 / weight 400 | Corps de texte |
| `--text-small` | 14px / 1.5 / weight 400 | Légendes, notes |
| `--text-meta` | 12px / 1.4 / weight 500 uppercase tracking 0.08em | Étiquettes, headers/footers |

### 4.3 Règles typographiques fines

- **Titres en Fraunces** avec axe `opsz` exploité (display=144 sur le hero, =72 sur H1, =36 sur H2). Cela donne automatiquement de la nuance optique.
- **Italique strictement éditorial** (citations, leads, légendes, jamais pour insister sur un mot).
- **Pas de souligné**, jamais. Les liens sont en `--color-accent` + filet 2px en-dessous (border-bottom).
- **Ligatures activées** : `font-feature-settings: "liga", "kern", "ss01";` sur Fraunces.
- **Chiffres tabulaires** sur les numéros d'accord, les tablatures, les pages.

---

## 5. Espacement et grille

### 5.1 Échelle d'espacement (base 4px)

```css
:root {
  --space-1: 4px;   --space-2: 8px;    --space-3: 12px;
  --space-4: 16px;  --space-5: 24px;   --space-6: 32px;
  --space-7: 48px;  --space-8: 64px;   --space-9: 96px;
  --space-10: 128px;
}
```

### 5.2 Grille de page

**Format print** : A4 (210 × 297 mm).
**Marges** : 18mm haut · 18mm bas · 20mm extérieur · 20mm intérieur.
**Grille interne** : 12 colonnes, gouttière 6mm.
**Header** : filet fin terracotta 1pt, logo Musique Facile à gauche, nom du guide à droite, 10pt.
**Footer** : numéro de page centré (font-mono, 11pt), `© Musique Facile · musique-facile.fr` à gauche, `Fred Fieffé` à droite.

**Pour le web (musique-facile.fr)** : container max-width 760px, padding latéral fluide 24px → 48px.

---

## 6. Composants visuels signature

### 6.1 Numéros d'accord (signature forte)

Sur les pages d'accord (Em, G, D, C, Am), un **gros numéro Fraunces 200pt** en outline (stroke 1.5px terracotta, fill transparent) occupe le coin supérieur droit, débordant légèrement de la marge. C'est le signature move visuel du gabarit — fonctionne en print comme en web.

### 6.2 Diagrammes d'accords

Conserver le style du PDF actuel (SVG vectoriel, fond crème, frettes terracotta, doigts colorés par index/majeur/annulaire) **mais** :
- Pastilles de doigts en couleur sémantique : doigt 1 = safran, doigt 2 = sauge, doigt 3 = indigo, doigt 4 = terracotta (cohérent dans tout le doc).
- Numéro de doigt en blanc, Fraunces 600, dans la pastille.
- Cordes étouffées (×) en `--color-ink-muted`, cordes ouvertes (○) en `--color-ink`.
- Hauteur fixée à 220px (print) / responsive (web).

### 6.3 Encadrés pédagogiques

Tous les encadrés suivent ce modèle unifié (variations de couleur uniquement) :

```
┌────────────────────────────────────────┐
│ [PICTO 24px]  ÉTIQUETTE EN CAPS         │  ← header coloré
├────────────────────────────────────────┤
│                                         │
│  Titre du bloc (Fraunces H3)            │
│                                         │
│  Corps en Inter 16px, leading 1.65.     │
│  Maximum 5 lignes idéalement.            │
│                                         │
└────────────────────────────────────────┘
   filet 3px à gauche en couleur d'accent
```

**4 types autorisés, jamais davantage** :
1. 🔑 **Astuce / Technique** (terracotta)
2. 💬 **Histoire vraie** (safran)
3. ✓ **Test de réussite** (sauge)
4. ⚠ **Erreur à éviter** (indigo, rare)

Les pictos sont des **SVG line-icons custom** (style Lucide modifié), jamais des emojis dans le rendu final (sauf couverture).

### 6.4 Carte conceptuelle I-V-vi-IV

**Composant central du guide** — actuellement absent du PDF original.
Un diagramme Mermaid ou SVG montrant le **cycle des 4 accords** comme moteur de 100+ chansons, avec :
- 4 cercles (C, G, Am, F) reliés par flèches courbes.
- Au centre : « Le système qui débloque 80% de la pop ».
- Autour : 6-8 vignettes-pochettes stylisées de chansons emblématiques (Let It Be, No Woman No Cry, etc.) en monochrome terracotta.

### 6.5 Grille des 100 chansons

Plutôt qu'une liste à puces, présentation en **grille de cards 3 colonnes** (print) / 2 colonnes (web mobile), chaque card contenant :
- Titre de chanson en Fraunces 16px semibold
- Artiste en Inter 13px ink-muted
- Mini-badge de progression (chip pill 10px terracotta : « I-V-vi-IV »)
- Optionnel : durée moyenne d'apprentissage (« ⏱ 15 min »)

### 6.6 Pull-quotes (citations élèves)

Filet épais 4px terracotta à gauche, texte Fraunces 22px italic light, signature en Inter 12px uppercase tracking 0.1em. Aucun fond. Marge verticale généreuse (--space-8 dessus et dessous).

### 6.7 Tablatures et rythmiques

En `--font-mono`, encadrées dans un bloc fond `--color-paper-warm` :
```
1  et  2  et  3  et  4  et
↓   ↓   ↓   ↑   ↑
```
Les flèches ↓↑ en `--color-accent`. Les chiffres en `--color-ink-soft`.

### 6.8 CTAs

Pas de gros bouton plein écran. Les CTAs sont :
- **CTA intra-guide** : un encadré filet terracotta 2pt, fond `--color-paper-warm`, max 80mm de large, centré.
- **CTA final** : occupation pleine largeur de la zone de texte, fond terracotta `--color-accent`, texte crème. Coins droits (radius 4px max). Pas de hover-effect sur print, juste un bouton net.

---

## 7. Iconographie et illustrations

- **Pictos** : custom SVG line-icons, stroke 1.5px, terminaisons rondes. Inspiration Lucide / Phosphor en version éditoriale (plus de chair, moins de geek). Jamais Font Awesome.
- **Illustrations** : éviter absolument les illustrations vectorielles type unDraw / Storyset. Préférer :
  - **Diagrammes techniques** (accords, schémas de doigts, cycles harmoniques).
  - **Photographies cropées en macro** d'objets guitare (manche, mécaniques, médiator) traitées en duotone terracotta/crème.
  - **Patterns décoratifs** : lignes de portée musicale stylisées en fin filet, suggérant la musique sans la dessiner.

---

## 8. Animations (version web uniquement)

Sur la version web sur musique-facile.fr, garder ultra-discret :
- **Scroll reveal** des encadrés (translateY 12px → 0, opacity 0 → 1, durée 400ms, easing `cubic-bezier(0.22, 1, 0.36, 1)`).
- **Hover sur les cards chansons** : élévation subtile (translateY -2px, ombre légère terracotta `0 4px 12px rgba(184, 71, 63, 0.08)`).
- **Pas de parallax**, pas de loader, pas d'animation lottie.

---

## 9. Contraintes techniques

- **Accessibilité** : ratios de contraste WCAG AA minimum. `--color-accent #B8473F` sur `--color-paper #FAF6EE` = ratio 6.8:1 ✓.
- **Tailles de police minimales** : 14px web, 10pt print.
- **Print** : CSS `@media print` avec ajustements (suppression des animations, recadrage des marges, contrôle des sauts de page via `break-inside: avoid` sur les encadrés et les accords).
- **Export PDF** : générable depuis Chromium headless (Puppeteer / Playwright) ou depuis Claude Code en HTML → PDF.
- **Poids** : tous les assets vectoriels SVG inline pour PDF léger (< 1 Mo cible).

---

## 10. Checklist finale avant export

- [ ] Aucun coin arrondi > 8px (sauf badges chansons en pill 999px).
- [ ] Aucune ombre molle floue (uniquement filets, fonds colorés, ou ombres dures éditoriales).
- [ ] Aucun dégradé bicolore violet/rose/bleu (les seuls dégradés autorisés : terracotta → safran sur très rares zones de bascule, jamais en fond de page).
- [ ] Polices Fraunces et Inter chargées via `<link rel="preconnect">` Google Fonts.
- [ ] Hiérarchie typographique vérifiée à chaque page (ne jamais sauter de H1 à H3).
- [ ] Header/footer présents sur toutes les pages sauf couverture.
- [ ] Numéro de page en font-mono, pas en font-display.
- [ ] Un seul accent fort par page (jamais 3 zones terracotta vives qui se concurrencent).
- [ ] Tous les encadrés respectent une des 4 typologies. Aucun encadré « libre ».
- [ ] La couverture montre clairement les 3 marqueurs d'autorité (Hal Leonard, Prix Samuel Paty, 80K élèves).
