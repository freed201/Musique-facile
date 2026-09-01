# Lot 3 — Nettoyage on-page

> Branche `feat/seo-lot3-onpage`, partie de `master` à jour (lots 1, 2 et 2 bis mergés).
> **Aucun merge.** Les titles proposés ci-dessous sont appliqués dans la branche : rien
> n'atteint la production tant que tu n'as pas mergé, la PR **est** l'étape de validation.

## 1. Le H2 qui affichait `## `

`src/content/blog/accords-guitare-debutant-guide-ultime.md:38` contenait littéralement
`## ## Pourquoi apprendre les accords de guitare ?`, suivi d'un `### Introduction` orphelin.
Faute de frappe dans la source, pas un bug de plugin : **occurrence unique** dans tout
`src/content/` (`grep -rn '^#\{1,6\} #'` → rien d'autre). Corrigé, et la règle est désormais
tenue par `check:seo`, qui refuse tout titre commençant par un dièse.

## 2. Titles et descriptions

| Page | Avant | Après |
|---|---|---|
| `/` | 68 · « École de Musique en Ligne : Guitare, Piano, Ukulélé \| Musique Facile » | **60** · « Cours de guitare, piano et ukulélé en ligne \| Musique Facile » |
| `/a-propos/` | 74 · « À propos de Fred Fieffé et Musique Facile — Professeur de Musique en Ligne » | **60** · « Fred Fieffé, professeur de musique en ligne \| Musique Facile » |
| `/auteur/fred-fieffe/` | 74 · « Fred Fieffé — Auteur, musicien professionnel et formateur \| Musique Facile » | **53** · « Fred Fieffé, auteur chez Hal Leonard \| Musique Facile » |
| `/blog/` | 69 · « Blog Musique Facile : Apprendre la Guitare, Piano, Ukulélé et Solfège » | **59** · « Blog : apprendre guitare, piano et ukulélé \| Musique Facile » |
| guide accords | 39 · « Accords Guitare Débutant - Guide Ultime » | **60** · « Accords guitare débutant : les 7 essentiels \| Musique Facile » |

Chacun place le mot-clé en tête et la marque en fin.

Point d'attention sur les deux pages « Fred » : elles avaient des titles quasi jumeaux. Elles
sont maintenant distinctes — `/a-propos/` porte le rôle (professeur), `/auteur/` porte le
signal E-E-A-T (auteur chez Hal Leonard).

Descriptions ramenées dans la fourchette 120-160 : `/a-propos/` 165 → **140**,
`/auteur/fred-fieffe/` **262** → 154, `/blog/` 169 → **144**, `/5-accords-magiques/` 165 → **153**.
Celle du guide accords passe de 114 à **145** caractères et répond à la question du titre.

## 3. Canonicals

Trois pages émettaient une canonical sans barre finale alors qu'elles sont servies avec :
`offre.astro:9`, `faq.astro:14`, `quel-instrument-choisir.astro:9` — toutes du même motif
`new URL('/page', …)`. Corrigées.

Contrôle sur la totalité du build : **177 pages, 0 incohérence**. La règle est désormais tenue
par `check:seo`, qui compare la canonical au chemin réel du fichier.

## 4. Sitemap

### Ce que j'ai trouvé en cherchant les « vraies » dates
Le plan prévoyait de dater chaque URL avec `git log -1` sur le fichier. **Mesuré, c'est pire** :

| Source de date | Répartition sur les 103 articles |
|---|---|
| `dateModified` du frontmatter | 85 en 2026-07, 8 en 2026-06, 7 en 2026-08, 2 en 2026-02, 1 en 2025-03 |
| date git du fichier | **94 en 2026-07**, 7 en 2026-08, 2 en 2026-05 |

Git ne distingue pas une refonte de fond d'une passe cosmétique : le commit `469ee72`
(« uniformise les slashs finaux des liens internes ») a touché 57 fichiers pour 909 lignes et
daterait ces 57 articles de juillet 2026. Le regroupement observé par l'audit correspond donc à
de vraies campagnes de juillet — dont `65c34cc`, « mise à niveau qualité complète du corpus »,
50 fichiers et 2 847 lignes. **Le frontmatter reste le meilleur signal**, et c'est celui qui est
conservé pour les collections.

### Ce qui était réellement faux, et qui est corrigé
Une table `REVISIONS` de 20 dates **saisies à la main** datait les pages statiques. Elle dérivait
dès qu'on modifiait une page sans y penser — au moment où j'écris, elle annonçait encore
`accueil: 2026-07-16` alors que la page d'accueil a changé aux lots 1 et 2.

Remplacée par `src/data/page-revisions.json`, généré par
`scripts/generate-page-revisions.mjs` (`npm run seo:revisions`) à partir de
`git log -1 --format=%cI` sur le fichier de chaque page. Le fichier est **précalculé et
versionné** parce que Vercel clone en profondeur limitée : interroger git au build donnerait
une date fausse, ou rien.

Un premier jet élargissait la date aux composants importés par la page. Résultat : `Header` et
`FooterModern` étant partagés, **les 24 pages recevaient la même date** — exactement le défaut
qu'on corrige. Abandonné au profit du fichier de la page seul, et le choix est documenté dans
le script.

### Sincérité des dates
- **`<lastmod>` est omis** quand aucune date fiable n'existe, au lieu d'en inventer une. Une
  balise absente vaut mieux qu'une date que Google apprend à ignorer.
- Les **18 fiches cours** et la fiche livre « 40 chansons » passent à `dateModified: 2026-09-01` :
  les lots 2 et 2 bis leur ont retiré une section entière de témoignages, c'est une modification
  de fond, leur date de 2025 était devenue fausse.
- Les dates anciennes qui **restent** (2019 et 2021 pour deux livres, 2025-01 pour les
  programmes et ressources) sont justes : ces pages n'ont pas bougé. Je n'y touche pas.

Résultat : 170 URLs, **0 sans `<lastmod>`**, et 22 URLs correctement datées de septembre 2026
au lieu d'un bloc figé.

## 5. Flux RSS

`@astrojs/rss` ajouté (dépendance officielle Astro, 1 paquet). `src/pages/rss.xml.ts` publie les
**20 articles les plus récents**, avec le même filtre de publication que partout ailleurs
(`prod: "Y"` **et** date de publication passée).

Le `<link rel="alternate" type="application/rss+xml">` est ajouté aux **quatre** layouts :
`Layout`, `ArticleLayout`, `CourseLayout` et `ProgrammeLayout` construisent chacun leur propre
`<head>` — ne le mettre que dans `Layout.astro` aurait laissé les articles et les cours sans
flux déclaré. `robots.txt` mentionne le flux.

## 6. Accessibilité

### `prefers-reduced-motion` ne fonctionnait sur aucune page
`src/styles/design-tokens.css:423` déclarait `animation-duration: 0.01ms !important`. Le
minifieur CSS d'`astro-compress` réécrit cette valeur sous-milliseconde en
**`animation-duration: NaNs !important`** — invalide, donc ignorée par le navigateur. Les
animations tournaient pour les personnes qui demandent explicitement de les réduire, **sur les
178 pages du site**. Valeur portée à `1ms` : 0 page contient encore `NaNs`.

### Les défauts annoncés par l'audit ne sont pas reproductibles
10 `<img>`, **toutes avec un `alt`** ; 66 `<a>`, **toutes avec un texte ou un `aria-label`**.
`check:seo` empêche désormais toute régression sur ces deux points.

### Trois pages sorties de l'index
`public/lead-magnets/*.html` sont les gabarits de rendu des PDF. Servis publiquement, jamais
liés, sans canonical : trois pages fines indexables pour rien. Passées en
`noindex, nofollow` + `Disallow` dans `robots.txt`. Elles peuvent sans doute être supprimées —
seuls les `.pdf` sont référencés par les e-mails Brevo — mais je ne supprime pas sans ton accord.

## 7. `npm run check:seo`

`scripts/check-seo.mjs` parcourt le HTML **réellement produit** et échoue sur : title > 60,
description > 160, canonical ≠ chemin du fichier, titre commençant par `#`, `<img>` sans `alt`,
`<a>` sans texte ni `aria-label`. Les pages en `noindex` et la 404 sont hors périmètre.

**Deux bugs dans mes propres règles, trouvés en la faisant tourner :**
1. L'exemption « le lien est nommé par l'`alt` de son image » utilisait
   `alt=(?!["']?\s*["'])`. Le guillemet optionnel permettait de matcher zéro caractère, puis le
   guillemet requis matchait le guillemet ouvrant : **tout `alt` était vu comme vide**, d'où
   **72 faux positifs**. Remplacé par une extraction explicite de la valeur.
2. La détection de `noindex` supposait `name` avant `content`. Le minifieur réordonne les
   attributs (`<meta content="noindex, nofollow" name=robots>`) : 3 pages échappaient à
   l'exemption. Corrigé.

**Dette héritée assumée.** Restaient 46 défauts antérieurs — 21 titles et 25 descriptions hors
gabarit sur des articles publiés, dont la réécriture demande ta validation éditoriale. Ils sont
listés un par un dans `scripts/seo-baseline.json`. Le contrôle **les affiche, ne bloque pas
dessus, et échoue sur tout défaut nouveau**. Quand un défaut hérité est corrigé, le script le
signale pour qu'on retire la ligne. La liste est faite pour se vider.

Les articles « morceau » bénéficient d'une exemption séparée et explicite : leur title enrichi
par `songInfo` est toléré jusqu'à 90 caractères (question Q3 non tranchée).

## 8. La page `/offre/` attribuait 929 avis à quatre produits différents

Trouvé en basculant `offre.astro` sur `src/data/proof.ts`, comme promis au lot 1 : les **quatre**
schemas `Product` (packs guitare, ukulélé, piano débutant, piano avancé) portaient chacun
« 4.7 sur 929 avis ». Soit les mêmes avis Skilleos revendiqués quatre fois, pour quatre packs
qui n'existent pas sur Skilleos.

C'est exactement le défaut corrigé sur les pages cours. Même règle appliquée : **les quatre
`aggregateRating` sont retirés**. Les 929 avis notent le catalogue dans son ensemble, ils restent
sur l'`EducationalOrganization` de la page d'accueil, avec leur source. La note affichée à
l'écran sur `/offre/` gagne au passage sa provenance : « Note moyenne 4,7/5 — 929 avis vérifiés
sur Skilleos ».

## 9. Sortie brute des vérifications

```
$ npm run build
[build] Complete!     0 erreur

$ npm run check:seo
check:seo — 181 pages analysées dans .vercel/output/static/
⚠ 22 avertissement(s) : {"description-courte":22}
● 46 défaut(s) hérité(s), tolérés : {"title-trop-long":21,"description-trop-longue":25}
✓ Aucun défaut nouveau.

$ test de régression (title allongé artificiellement sur /contact/)
✖ 1 défaut(s) NOUVEAU(X) : {"title-trop-long":1}      → le contrôle mord bien

$ canonicals comparées au chemin réel
177 pages, 0 incohérente(s)              (avant : 3)

$ titres commençant par un dièse
aucun                                    (avant : 1)

$ pages contenant « animation-duration:NaNs »
0                                        (avant : 178)

$ flux RSS
20 items · <link rel=alternate> présent sur la home, un article et une page cours

$ sitemap
170 URLs · 0 sans <lastmod> · 22 datées de 2026-09 au lieu d'un bloc figé

$ /offre/ : nombre d'aggregateRating
0                                        (avant : 4)
```

## 10. Décisions qui te reviennent

**Q1 — Les cinq titles proposés au § 2 te conviennent-ils ?** Ils sont appliqués dans la branche,
rien n'est en ligne avant ton merge.
→ *Sans réponse : ils partent tels quels au merge.*

**Q2 — Les 46 défauts hérités.** 21 titles et 25 descriptions à réécrire, tous sur des articles
publiés. Je peux te proposer les réécritures par lots de 10, pour validation.
→ *Sans réponse : ils restent dans la baseline, visibles à chaque contrôle.*

**Q3 — Les trois gabarits `public/lead-magnets/*.html`.** Sortis de l'index ; seuls les `.pdf`
sont référencés par les e-mails. Je les supprime ?
→ *Sans réponse : ils restent, en `noindex`.*

**Q4 — Les titles des articles morceau** (question ouverte depuis le plan). Tant qu'elle n'est
pas tranchée, `check:seo` les tolère jusqu'à 90 caractères, exemption explicite et documentée.
→ *Sans réponse : on garde l'enrichissement `songInfo`.*
