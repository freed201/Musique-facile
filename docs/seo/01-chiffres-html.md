# Lot 1 — Les chiffres de preuve dans le HTML

> Branche `feat/seo-lot1-chiffres-html`. **Aucun merge.**
> Objectif : un robot qui n'exécute pas JavaScript et ne scrolle pas lit « 80 000+ »,
> « 4,7/5 » et « 1 400+ » — jamais « 0 ».

## 1. Ce qui a été fait, fichier par fichier

### `src/data/proof.ts` — **nouveau**, source unique
Chaque chiffre y est un objet `ProofStat` avec :
- `display` — la chaîne **écrite dans le HTML au build** ;
- `counter` / `suffix` / `duration` — la cible d'animation, purement facultative ;
- `source` — **champ obligatoire** : la provenance du chiffre, en toutes lettres.

Contenu : `students` (80 000+), `studentsShort` (80 K+, pour le hero étroit), `rating`
(4,7/5), `reviews` (929), `videos` (1 400+), `teachingYears` (15 ans), plus `ratingValue` /
`bestRating` pour le JSON-LD et `ratingSummary` (« 4,7/5 sur 929 avis ») pour les badges.

`reviewsSource` porte la provenance vérifiée : `https://www.skilleos.com/expert/frederic-fieffe`,
relevée le 2026-09-01 — la page affiche bien **4,7/5**, **929 avis** et 88 853 élèves.

La fonction `counterAttrs(stat)` produit les attributs `data-counter*` et **retourne un objet
vide** quand la valeur n'est pas animable. Impossible d'écrire un compteur sans passer par elle.

### `src/scripts/animations.js` — l'animation devient une surcouche
1. `animateCounter()` mémorise `el.textContent` (la vraie valeur, déjà dans le HTML) **avant**
   d'animer, et la restitue à l'arrivée au lieu de la reformater. L'animation ne peut plus
   « corriger » le texte servi aux robots.
2. La branche de repli qui **réécrivait** les compteurs quand `prefers-reduced-motion` était
   actif a été supprimée : il n'y a plus rien à réparer côté client. Ce code était de toute
   façon à moitié mort — il ciblait `.animate-reveal` / `.stagger-item`, deux classes que seul
   `ScrollAnimationManager` pose, donc jamais présentes dans cette branche.
3. Ajout du garde `'IntersectionObserver' in window`. Sans lui, `new ScrollAnimationManager()`
   levait à la construction sur un navigateur sans `IntersectionObserver` et emportait le reste
   de l'initialisation.

### `src/components/HeroModern.astro` — 3 compteurs
Badge « 4.7/5 sur 929 avis » → `{ratingSummary}`. Les 3 cartes lisent `studentsShort`, `videos`
et `rating`. **Changement visible : « Satisfaction 95 % » devient « Note moyenne 4,7/5 »** (voir § 4).

### `src/components/InstructorHighlight.astro` — 4 compteurs
Lisent `students`, `rating`, `videos`, `teachingYears`. La note n'est plus animée : l'ancien
montage `data-counter="4" data-counter-suffix=".7/5"` affichait « 0.7/5 » puis « 1.7/5 » en
cours d'animation, c'est-à-dire un chiffre faux à l'écran pendant une seconde et demie.

### `src/components/TemoignagesModern.astro` — 3 compteurs
Lisent `students`, `reviews`, `videos` ; note du bandeau → `{ratingSummary}`.
**Changement visible : « Satisfaction 95 % » devient « Avis élèves 929 »** — un chiffre qui a
une source, à la place d'un qui n'en avait pas.

### `src/pages/a-propos.astro`
Le bloc hero et la liste « En chiffres » lisent `proof.ts`. La ligne « Taux de satisfaction
95 % » est retirée. La ligne « Avis vérifiés » devient un lien vers la page Skilleos.

### `src/pages/index.astro`
`aggregateRating` du schema `EducationalOrganization` lit `ratingValue` / `reviews.display` /
`bestRating`. La réponse FAQ qui répétait « 4.7/5 basée sur 929 avis » lit `ratingSummary`.

## 2. Sortie brute des vérifications

`npm run build` → **Complete!**, 0 erreur, postbuild `nodejs20.x` appliqué.
⚠️ Rappel : le build écrit dans `.vercel/output/static/`, **pas** dans `dist/` (adapter Vercel).
Les commandes ci-dessous sont celles de la mission, avec le chemin corrigé.

```
$ grep -o "0[^0-9][^<]*Élèves formés" .vercel/output/static/index.html
(aucune sortie — code de retour 1)

$ grep -c "80 000" .vercel/output/static/index.html
1
  ↳ `grep -c` compte les LIGNES, et le HTML minifié tient sur une seule.
    Le compte réel : `grep -o "80 000" … | wc -l` → 22  (avant le lot : 1)

$ grep -o 'data-counter=[^>]*>0<' .vercel/output/static/index.html | wc -l
0                                    (avant le lot : 10)

$ grep -o 'data-counter=[^>]*>[^<]*<' .vercel/output/static/index.html
data-counter=80    data-counter-suffix=" K+" data-duration=2000>80 K+<
data-counter=1400  data-counter-suffix=+     data-duration=2000>1 400+<
data-counter=80000 data-counter-suffix=+     data-duration=2000>80 000+<
data-counter=1400  data-counter-suffix=+     data-duration=2000>1 400+<
data-counter=15    data-counter-suffix=" ans" data-duration=1500>15 ans<
data-counter=80000 data-duration=2000 data-counter-suffix=+>80 000+<
data-counter=929   data-duration=1500>929<
data-counter=1400  data-duration=2000 data-counter-suffix=+>1 400+<

$ les deux notes, non animées, sans attribut data-counter :
class=stat-number …>4,7/5<
class=stat-number …>4,7/5<

$ grep -o '95%\|95 %' .vercel/output/static/index.html .vercel/output/static/a-propos/index.html
(aucune sortie)

$ grep -o '"aggregateRating":{[^}]*}' .vercel/output/static/index.html
"aggregateRating":{"@type":"AggregateRating","ratingValue":"4.7","reviewCount":"929","bestRating":"5"}
```

### Aucun autre texte de la home ne dépend du scroll
```
$ grep -o 'style=display:none[^>]*\|aria-expanded=false' .vercel/output/static/index.html | sort | uniq -c
   2 aria-expanded=false
```
Les deux sont le sous-menu « Cours » et le bouton de menu mobile : de la navigation, dont le
contenu est bien dans le DOM. Aucun `innerHTML` ni `textContent` dans un script inline de la page.
Les 8 sections en `data-animate="reveal"` / `data-stagger-group` ne jouent que sur l'opacité en
CSS, et les classes qui masquent sont posées **par le JavaScript lui-même** : sans JS, tout est
visible d'emblée.

## 3. Ce qui n'a pas été fait

- **`public/llms.txt`** : déjà cohérent (« Plus de 80 000 élèves formés depuis 2015 »), rien à
  corriger. Sa refonte est prévue au lot 5.
- **`offre.astro` et `CourseLayout.astro`** répètent encore « 4.7 » / « 929 » en dur dans leurs
  JSON-LD. Hors périmètre du lot 1 (qui vise la home) ; à basculer sur `proof.ts` au lot 3, en
  même temps que le canonical d'`offre.astro`.
- **Six composants morts** repérés au passage — `About`, `Temoignages`, `Resultats`, `Avantages`,
  `StudentsStats`, `SocialProof` : plus aucun `import` nulle part. `Temoignages.astro` est le
  plus gênant (il génère un `Review` daté avec `new Date()` au build, soit une date fabriquée).
  Suppression proposée au lot 2.

## 4. Décisions qui te reviennent

**Q1 — « Satisfaction 95 % », remplacé sans attendre.** Le chiffre n'est nulle part dans
`contenu-credibilite.md` et n'a pas de source. Je l'ai remplacé par « Note moyenne 4,7/5 » dans
le hero et par « Avis élèves 929 » dans la section témoignages, plutôt que de laisser en ligne
un chiffre indéfendable. **Si ce 95 % a une origine que tu peux montrer, dis-le et je le remets.**
→ *Sans réponse : il reste retiré.*

**Q2 — « 9 210 débutants » sur `/cours/apprendre-guitare-debutant/`.** Chiffre précis, non sourcé,
pas dans les règles. Je n'y ai pas touché (page cours, hors périmètre du lot).
→ *Sans réponse : je le traiterai au lot 3 comme le 95 %, en le remplaçant par un chiffre sourcé.*

**Q3 — Le lien vers Skilleos.** Je l'ai mis en `rel="noopener nofollow" target="_blank"` sur
`/a-propos/` uniquement. `nofollow` parce que c'est une plateforme où tu vends aussi.
→ *Sans réponse : je garde `nofollow`, et j'ajoute le même lien sous la note de la home au lot 2.*
