# Exploration : refonte de la page d'accueil, rentrée 2026

Compte rendu du travail de design mené du 4 au 6 septembre 2026 avec Fred.
Ce document est de l'information, pas une feuille de route : rien de ce qui
est décrit ici n'est en production, et ce n'est pas parce que c'est écrit que
c'est décidé. BROUILLON, à relire par Fred.

**Le code vit sur la branche `exploration/home-rentree-2026`.** Elle n'est pas
destinée à être fusionnée. Pour revoir les maquettes tourner :

```bash
git switch exploration/home-rentree-2026
npm install          # six polices y sont ajoutées
npm run dev -- --port 4399
```

Puis `/carte-postale/`, `/carnet-dix/`, `/home-v8/`, `/carnet/`, `/on-discute/`.
Toutes ces pages sont en `noindex` et exclues dans `robots.txt`.

---

## 1. Le point de départ

La page d'accueil vendait correctement mais ressemblait, selon les mots de
Fred, à « celui qui vend aussi des fenêtres ». Trois reproches revenus à
chaque passe :

- **C'est froid.** On vend de la musique et de l'art, ça ne se sent nulle part.
- **C'est une landing page**, pas une expérience. Des blocs empilés, des
  arguments, un prix.
- **C'est boutique.** Le visiteur ne reconnaît pas une école, il reconnaît un
  gabarit.

Une erreur factuelle a aussi été trouvée en route : la page annonçait le piano
à 299 € alors que le Pack de rentrée est à 99 €. Elle reste à corriger sur la
fiche du cours de piano, qui affiche toujours 299 € sans mentionner le Pack.

---

## 2. Ce qui est décidé

Ces points ont été tranchés par Fred et ne sont plus à rediscuter.

**La page d'accueil reste une vitrine.** Elle envoie vers le carnet, elle ne
l'est pas. Fred : « on doit voir la home comme la home qui envoie vers cela.
J'adore ce carnet mais c'est pas une home. »

**Pas de catalogue sur la page d'accueil.** Huit maquettes de catalogue ont été
rejetées avant d'accepter le diagnostic : aucune ne pouvait marcher, parce que
dix-huit formations ne se rangent pas dans un bloc de page d'accueil. À la
place, quatre portes par instrument, qui annoncent les niveaux disponibles sans
lister les cours. Fred : « il faut pouvoir annoncer la couleur qu'il y a pour
tous les niveaux. »

**Typographie.** Rubik pour les titres et le texte, Square Peg pour l'écriture
à la main, Fraunces en italique pour les mots qui portent l'émotion. Le duo
Bricolage Grotesque plus Instrument Serif a été écarté : c'est devenu la
signature visuelle des sites générés en 2024 et 2025. Caveat aussi, trop vue.
Square Peg a été choisie après comparaison de quinze écritures manuscrites, sur
le critère lisibilité à petite taille pour un public de 40 à 70 ans.

**Couleur.** Une teinte par instrument, en deux tons, sans jaune. Le vert
guitare Material `#4CAF50` est remplacé par un vert canard `#2b8f6f`, à la
demande de Fred : « ce vert est moche, un poil plus canard ». Le fond vert avec
du jaune a été rejeté sans appel.

**Le header prend la couleur de l'univers**, sur toutes les pages, pas
seulement les pages de cours. Mis en place par `--header-bg` et
`--header-solid`, posés par la classe `theme-*` que les layouts mettent sur le
`body`.

**L'appel principal sera la carte postale.** Choisie parmi dix directions.

---

## 3. Ce qui a plu

### La carte postale (`/carte-postale/`)

La direction retenue. Au repos on voit le recto, une photo de l'instrument.
Elle se retourne pendant que la page descend, et découvre le mot manuscrit de
Fred sur toute la moitié gauche, avec le timbre dentelé, l'oblitération,
l'adresse et le lien vers le carnet. Le mot et l'adresse changent selon
l'instrument.

Trois déclencheurs ont été câblés pour comparer : au défilement, automatique
après deux secondes, au survol. **Le défilement est recommandé** : il suit le
rythme du visiteur, il ne retire pas le recto à quelqu'un qui le lisait, et il
se déclenche sans geste particulier. Un clic retourne la carte dans tous les
cas, ce qui règle le tactile.

Les quatre photos n'existent pas encore. Les prompts de génération sont dans
`public/images/carte/README.md` sur la branche d'exploration. Tant qu'un
fichier manque, le recto retombe sur un dessin CSS : pas d'image cassée.

### Le carnet de trente jours (`/carnet/`)

Fred : « 5 et 6 sont de superbes expériences ». Une page par jour, et chaque
page se joue vraiment : un accordeur avec deux modes dont un qui cache la
réponse, un jeu d'accords, un métronome avec détection du tempo tapé, une
partition qui défile en jouant. Tout est synthétisé en Web Audio, sans aucun
fichier son. La progression est gardée en `localStorage`.

C'est la pièce la plus aboutie de l'exploration. Elle ne peut pas servir de
page d'accueil, mais elle mérite d'exister.

### La conversation (`/on-discute/`)

Fred : « je trouve la 7 parfaite pour convaincre un hésitant, donc à garder
dans un coin du site ». Une suite de questions qui aboutit à un plan de
rentrée personnalisé. À placer dans le parcours, pas en page d'accueil.

### Les dix directions de design (`/carnet-dix/`)

Dix objets différents pour le même appel, gardés comme référence : le cachet
rond dont le texte tourne, la fiche d'emprunt de bibliothèque, le billet à
souche, l'affiche typographique, l'éphéméride, la carte postale, la une de
journal, la portée, l'enveloppe à cachet de cire, les trente cases.

Le tampon revient dans plusieurs : c'est l'élément que Fred a aimé d'emblée et
qui a survécu à toutes les passes.

---

## 4. Ce qui a été rejeté, et pourquoi

Aussi utile que le reste, pour ne pas y revenir.

| Rejeté | Raison donnée |
|---|---|
| Bloc d'appel en aplat de couleur | « J'aime pas le fond vert, j'ai pas le marqueur » |
| Fond vert avec du jaune | « C'est moche », ça fait drapeau, pas atelier |
| Papier ligné, réglure de carnet | « J'aime pas le côté carnet avec les traits » |
| Huit maquettes de catalogue | « Rien me plaît » |
| Frise sonore sous le bloc d'appel | « Je parle de style de design, pas de ça » |
| Variantes successives du même bloc | « Tu restes sur la même chose mais en un peu différent » |
| Vert Material `#4CAF50` | Criard et daté |
| Bricolage Grotesque + Instrument Serif | Signature des sites générés récents |
| Caveat | La manuscrite la plus utilisée du web, fait gadget |

**La leçon transversale.** Quand une proposition est rejetée trois fois de
suite, ce n'est pas le réglage qui est en cause, c'est le parti pris. Il faut
changer d'objet, pas ajuster des marges. Les dix directions sont nées de ce
constat, et c'est la première fois qu'une proposition a été retenue du premier
coup.

**Sur les blocs d'appel primés.** Une recherche sur une douzaine de sites
récompensés, en lisant leur CSS, donne trois enseignements. Chez les meilleurs,
le bloc n'a pas de conteneur : Kinfolk tient tout avec deux filets de deux
pixels et une phrase de quarante. Aucun n'écrit « inscrivez-vous », ils nomment
l'objet, et Varani Gin écrit « recevez votre lettre ». Enfin, aucun n'utilise
la réglure Seyès, ce qui en fait le seul motif qu'un public français lit
instantanément comme « cahier ».

---

## 5. Les recettes CSS qui valent d'être reprises

Ces bouts de code sont réutilisables ailleurs sur le site, indépendamment de
la refonte.

### Un tampon à l'encre inégale

Le rendu « vrai tampon » ne vient pas d'une image mais d'un masque de bruit
appliqué à l'élément. Deux variables suffisent, à poser sur un conteneur :

```css
--erosion: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='e'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7 0.55' numOctaves='4' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='1.8' intercept='-0.16'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23e)'/%3E%3C/svg%3E");

.encre {
  -webkit-mask-image: var(--erosion);
  mask-image: var(--erosion);
  mask-size: 140px 140px;
}
```

`slope` et `intercept` dosent l'érosion. Au-delà de `slope: 2.2`, le tampon
devient illisible.

### La fibre du papier

Même principe, mais en fond, et avec une fréquence différente sur les deux
axes. C'est ce qui fait la différence avec un grain isotrope, qui ressemble à
un filtre de téléphone :

```css
--fibre: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)'/%3E%3C/svg%3E");

.papier::after {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background-image: var(--fibre); background-size: 200px 200px;
  mix-blend-mode: multiply; opacity: 0.05;
}
```

Au-delà de `0.06` d'opacité, ça se voit trop. En thème sombre, `multiply`
efface au lieu d'imprimer : il faut passer en `screen` avec une encre claire.

### Un timbre dentelé, sans image

Quatre gradients radiaux, un par bord, composés en intersection :

```css
.timbre {
  --r: 4.5px; --s: 12px;
  -webkit-mask:
    radial-gradient(var(--r) at 50% 0,    #0000 98%, #000) 0 0 / var(--s) 100%,
    radial-gradient(var(--r) at 50% 100%, #0000 98%, #000) 0 0 / var(--s) 100%,
    radial-gradient(var(--r) at 0 50%,    #0000 98%, #000) 0 0 / 100% var(--s),
    radial-gradient(var(--r) at 100% 50%, #0000 98%, #000) 0 0 / 100% var(--s);
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}
```

**`mask-composite` n'est pas optionnel.** Par défaut les masques s'additionnent,
donc sans lui, rien n'est découpé. Safari avant la version 15.4 veut
`-webkit-mask-composite: source-in`.

### Un texte qui tourne autour d'un cercle

Du SVG avec `textPath`, et une rotation appliquée au groupe et non au SVG,
pour que le centre reste fixe :

```html
<svg viewBox="0 0 220 220">
  <defs>
    <path id="arc" d="M110,110 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
  </defs>
  <g class="mots"><text><textPath href="#arc">TEXTE · TEXTE ·&nbsp;</textPath></text></g>
</svg>
```

```css
.mots { transform-box: view-box; transform-origin: 50% 50%; animation: tourne 40s linear infinite; }
```

Le texte doit faire le tour complet sans se chevaucher : à `font-size: 11.5px`
et `letter-spacing: 0.12em` sur un rayon de 82, il faut une soixantaine de
caractères.

### Une carte qui se retourne au défilement

L'angle est calculé depuis le centre de la carte et non depuis son bord haut,
sinon elle est déjà à demi retournée quand elle apparaît :

```js
const centre = rect.top + rect.height / 2;
const p = Math.min(1, Math.max(0, (innerHeight - centre) / (innerHeight * 0.5)));
element.style.setProperty('--tour', `${p * 180}deg`);
```

Zéro quand le centre affleure le bas de l'écran, cent quatre-vingts quand il
atteint le milieu. Le listener de `scroll` est passif et passe par
`requestAnimationFrame`.

---

## 6. Les pièges rencontrés

Ceux qui ont coûté du temps, pour ne pas les repayer.

**Le CSS scopé d'Astro n'atteint pas les éléments créés en JavaScript.** Il
faut `:global()`. Rencontré trois fois, dont une où toute la page du quiz
paraissait « moche » simplement parce que ses boutons, créés par script,
n'avaient aucun style.

**`box-shadow` ignore `clip-path` et `mask`.** Dès qu'une forme est découpée,
ticket, timbre, marque-page, l'ombre doit passer par `filter: drop-shadow()`.
C'est la première cause de rendu raté sur ce type d'objet.

**`filter` sur un élément en `transform-style: preserve-3d` aplatit la scène.**
La carte postale ne montrait jamais son dos à cause d'une simple ombre portée.
L'ombre doit aller sur chaque face, pas sur le conteneur qui tourne.

**Une colonne de grille en `auto` peut déborder son conteneur.** Un enfant en
`width: max-content` élargit la colonne, et un `width: min(100%, …)` se calcule
alors sur la colonne élargie. Le remède est `grid-template-columns: minmax(0, 1fr)`.

**`--space-7` n'existe pas** dans `design-tokens.css`. L'échelle va de 0 à 6,
puis 8, 10, 12, 16, 20, 24, 32. Une valeur inconnue dans un raccourci `padding`
invalide la déclaration entière, qui tombe à zéro.

**`var(--surface)` n'est défini nulle part** dans le projet, alors que
`--surface-light` l'est. Les fonds concernés sont donc transparents. Corrigé
sur le quiz, reste à corriger `src/pages/index.astro` ligne 313.

**Le mode sombre casse les métaphores papier.** Tout ce qui est posé en
`mix-blend-mode: multiply` disparaît sur fond sombre. Les pages d'étude forcent
`color-scheme: light` pour cette raison ; une intégration en production devra
traiter le cas.

---

## 7. Conformité, ce qui a été corrigé en route

Rappel : les règles sont dans `.claude/rules/contenu-credibilite.md`.

- `/offre/` : le cadeau physique offert est retiré, à la demande de Fred. La
  date de fin de l'offre est fixée au 16 octobre 2026 et affichée, ce qui évite
  l'offre « limitée » sans échéance.
- `/quel-instrument-choisir/` : trois témoignages inventés et un chiffre
  invérifiable retirés. **Cette correction est sortie de l'exploration et part
  en production séparément.**
- Le prix du piano sur la page d'accueil annonçait 299 € au lieu du Pack à 99 €.

Deux points restent en suspens, côté Fred :

- Les URL d'achat sur la plateforme de cours contiennent encore « cadeau »,
  alors que le cadeau n'existe plus.
- La fiche du cours de piano affiche 299 € sans mentionner le Pack à 99 €.

---

## 8. Si on reprend le chantier

Dans l'ordre :

1. Générer les quatre photos de recto, prompts dans
   `public/images/carte/README.md` sur la branche d'exploration.
2. Intégrer la carte postale dans `home-v8`, qui porte encore l'ancien bloc.
3. Nettoyer les polices : six ont été ajoutées pour différencier les dix
   directions, seules celles de la direction retenue doivent rester.
4. Supprimer les pages d'étude devenues inutiles une fois le design figé :
   `/typo/`, `/carnet-cta/`, `/etude-formations/`, `/etude-formations-2/`,
   `/home-v2/`, `/home-v3/`, `/home-v4/`, `/home-v6/`, et leurs lignes dans
   `robots.txt`.
5. Décider du sort du carnet et de la conversation, qui méritent une place
   dans le site même si la page d'accueil change peu.
