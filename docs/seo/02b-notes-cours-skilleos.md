# Lot 2 bis — Les notes des pages cours alignées sur Skilleos

> Branche `fix/notes-cours-skilleos`, partie de `master` à jour (lots 1 et 2 mergés).
> Déclenché par la réponse de Fred du 1er septembre : *« tu peux aller retrouver mes cours sur
> Skilleos, c'est les mêmes »*, puis précisé par lui : *« les avis n'ont pas été gonflés car
> certains cours sont dispo aussi sur ma plateforme donc il y a des élèves, mais le gros de la
> statistique vient de Skilleos donc comme c'est plus simple, on prend Skilleos. »*

## 1. Le problème, correctement posé

Chaque fiche `src/content/courses/*.md` portait son propre `ratingValue` / `reviewCount`, publiés
en `aggregateRating` sur la page du cours. Additionnés, ces décomptes annonçaient **3 826 avis**.

**Ces chiffres n'étaient pas inventés.** Fred l'a précisé : plusieurs cours sont vendus à la fois
sur Skilleos et sur sa propre plateforme, qui a ses élèves et ses retours. Les décomptes du site
agrégeaient donc les deux. Le problème n'est pas l'honnêteté du chiffre, c'est sa **vérifiabilité** :
un lecteur, un robot ou un contrôleur ne peut confronter à rien un total qui mélange une source
publique et une source privée. Or Google demande qu'un `aggregateRating` corresponde à des avis
réellement consultables.

Décision de Fred : **on ne publie que les chiffres Skilleos**, publics et donc opposables. On
affiche moins que la réalité, mais tout ce qui est affiché se vérifie en un clic.

Un vrai défaut, en revanche, dans le layout : le repli `ratingValue || "4.7"` /
`reviewCount || "929"` attribuait à **un seul cours** la totalité des avis de l'organisation dès
qu'une fiche n'avait pas ses champs. Celui-là est supprimé.

## 2. Ce que le relevé Skilleos donne

Relevé le 1er septembre 2026 sur `skilleos.com`, page expert + pages catégories (guitare, piano,
ukulélé, théorie musicale). **20 cours retrouvés sur les 21 annoncés**, totalisant **902 avis** —
à 27 avis des 929 affichés par la plateforme. Cet écart de 3 % correspond au cours manquant :
la cohérence arithmétique confirme que le relevé est bon.

Détail : Guitare fondamentaux 4.7/199 · Piano fondamentaux 4.7/124 · Solfège fondamentaux
4.7/114 · Ukulélé fondamentaux 4.7/112 · Piano accords 4.8/50 · Guitare enfants 4.7/41 ·
Solfège avancé P1 4.7/40 · Piano enfants 4.7/39 · Cycle des quintes 4.8/32 · Solfège avancé P2
4.7/25 · Guitare avancée 4.6/20 · Ukulélé enfants 4.6/18 · Piano avancé 4.9/16 · Piano oreille
4.4/15 · Ukulélé comptines 4.7/13 · Ukulélé improvisation 4.5/12 · Piano muscler ses doigts
4.6/9 · Ukulélé techniques avancées 4.6/9 · Piano les Tenues 4.7/7 · Progresser en guitare par
le piano 4.0/7.

**Détail qui confirme la bonne foi des données d'origine : les `ratingValue` du site étaient déjà
identiques à ceux de Skilleos** — 4.4 pour l'oreille, 4.0 pour le piano-guitaristes, 4.9 pour le
piano avancé. Seuls les décomptes différaient, précisément parce qu'ils additionnaient les élèves
de la plateforme de Fred à ceux de Skilleos.

## 3. Correspondances appliquées

| Fiche du site | Avant | Après | Cours Skilleos |
|---|---:|---:|---|
| `piano-facile-apprendre-debutant` | 4.7 / **1500** | 4.7 / **124** | Piano : les fondamentaux |
| `apprendre-guitare-debutant` | 4.7 / 180 | 4.7 / **199** | Guitare : les Fondamentaux |
| `apprendre-ukulele-debutant` | 4.7 / **360** | 4.7 / **112** | Ukulélé : les fondamentaux |
| `lecture-de-notes-niveau-debutant` | 4.6 / **300** | 4.7 / **114** | Solfège : les fondamentaux |
| `apprendre-les-accords-piano` | 4.8 / **220** | 4.8 / **50** | Piano : les accords |
| `comprendre-cycle-des-quintes` | 4.8 / 120 | 4.8 / **32** | Le cycle des quintes |
| `maitrise-technique-guitare-avancee` | 4.5 / **380** | 4.6 / **20** | Guitare : techniques avancées |
| `maitrise-technique-piano-avancee` | 4.9 / **260** | 4.9 / **16** | Piano : Techniques avancées |
| `ameliorer-oreille-piano` | 4.4 / 85 | 4.4 / **15** | Piano : Travailler son oreille |
| `apprendre-piano-facile-guitaristes` | 4.0 / 60 | 4.0 / **7** | Progresser en guitare en apprenant le piano |
| `cours-solfege-rythmes` * | 4.6 / 75 | 4.7 / **40** | Solfège : techniques avancées (partie 1) |
| `solfege-expert-formation` * | 4.8 / 45 | 4.7 / **25** | Solfège : techniques avancées (partie 2) |
| `cours-exercices-techniques-piano` * | 4.7 / 80 | 4.6 / **9** | Piano : Muscler ses doigts |
| `apprendre-la-rythmique-ukulele-facilement` | 4.6 / 55 | 4.6 / **9** | Ukulélé : Techniques avancées |
| `piano-force-agilite` * | 4.8 / 75 | 4.7 / **7** | Piano : les Tenues |
| `apprendre-guitare-shuffle` | 4.8 / 8 | **retiré** | aucune fiche Skilleos |
| `apprendre-piano-shuffle` | 4.5 / 15 | **retiré** | aucune fiche Skilleos |
| `apprendre-ukulele-shuffle` | 4.8 / 8 | **retiré** | aucune fiche Skilleos |

**Total annoncé : 3 826 → 779 avis.** Le site sous-déclare volontairement : les retours reçus sur
la plateforme de Fred ne sont plus comptés, faute d'être publiquement consultables.

Les correspondances sont établies sur le titre, la description et la durée. Deux d'entre elles
se sont jouées sur la durée : `solfege-expert-formation` déclare `PT1H25M`, exactement la durée
de « Solfège : techniques avancées (partie 2) » ; `lecture-de-notes-niveau-debutant` déclare
`PT2H20M` contre 2h18 pour « Solfège : les fondamentaux ».

**\* Les cinq lignes marquées demandent ta confirmation** (voir § 6).

## 4. Le code ne peut plus publier de note sans source

- `src/content/config.ts` — nouveau champ **`ratingSourceUrl`** (`z.string().url().optional()`).
  Le commentaire du schéma pose la règle : les trois champs vont ensemble.
- `src/layouts/CourseLayout.astro` — le repli `|| "4.7"` / `|| "929"` est **supprimé**.
  L'`aggregateRating` n'est publié que si les trois champs sont présents (`hasSourcedRating`),
  et il porte alors `"url"` vers la fiche Skilleos du cours.
- `src/pages/cours/[slug].astro` — transmet `ratingSourceUrl`.
- Chaque fiche modifiée porte en frontmatter un commentaire nommant le cours Skilleos source et
  la date du relevé.

Concrètement : une note ne peut plus apparaître dans les données structurées sans l'URL qui
permet de la vérifier.

## 5. Sortie brute des vérifications

`npm run build` → **Complete!**, 0 erreur.

```
$ aggregateRating publié, page par page (extrait)
apprendre-guitare-debutant       "ratingValue":"4.7","reviewCount":"199",
                                 "url":"…/cours/apprendre-guitare-en-ligne"
piano-facile-apprendre-debutant  "ratingValue":"4.7","reviewCount":"124",
                                 "url":"…/cours/apprendre-jouer-piano-en-ligne-debutant"
apprendre-guitare-shuffle        (aucun — pas de source)
apprendre-piano-shuffle          (aucun — pas de source)
apprendre-ukulele-shuffle        (aucun — pas de source)

$ somme des reviewCount publiés sur /cours/
779          (avant : 3826 — source Skilleos : 929)

$ pages cours sans aggregateRating et sans casse : 3 sur 18
```

## 6. Décisions qui te reviennent

**Q1 — Cinq correspondances à confirmer.** Titre et durée ne concordent pas parfaitement :

| Fiche du site | Ce que j'ai retenu | Le doute |
|---|---|---|
| `cours-solfege-rythmes` « Art du Rythme : Techniques Avancées Solfège **2** » | Solfège avancé **partie 1** (4.7/40) | Le titre dit « 2 », mais la durée `PT2H` colle à la partie 1 (1h57), pas à la partie 2 (1h25). |
| `solfege-expert-formation` | Solfège avancé **partie 2** (4.7/25) | Retenu par la durée : `PT1H25M` = 1h25 exactement. |
| `cours-exercices-techniques-piano` « Renforcez l'agilité de vos doigts » | Piano : **Muscler ses doigts** (4.6/9) | Le sens colle parfaitement, la durée non (`PT2H15M` contre 1h51). |
| `piano-force-agilite` « nuances, de la douceur à la puissance » | Piano : **les Tenues** (4.7/7) | Rapprochement le plus fragile des cinq. La durée du site (`PT10H`) semble erronée. |
| `apprendre-la-rythmique-ukulele-facilement` | Ukulélé : **Techniques avancées** (4.6/9) | L'URL Skilleos contient littéralement `rythmique-ukulele-confirme` — je suis confiant. |

→ *Sans réponse : ces correspondances restent en place. Une inversion entre deux cours ne
changerait que des notes proches (4.6 ↔ 4.7), l'enjeu est faible mais réel.*

**Q2 — Les trois cours « shuffle » n'ont plus de note.** Ce sont des exclusivités de ta
plateforme : ils ont donc de vrais élèves, mais aucune page publique où un lecteur puisse
vérifier une note. Leurs pages n'affichent plus d'étoiles dans les résultats Google.
→ *Sans réponse : elles restent sans note.* Si tu peux exporter les avis de ta plateforme avec
leur date, on les publie en `Review` individuels — c'est vérifiable autrement qu'en agrégé, et
ça vaut mieux qu'un chiffre global sans source.

**Q3 — Les nombres d'élèves par cours n'ont pas été touchés.** Ils totalisent **59 340**, ce qui
reste **sous les 88 853 élèves affichés par Skilleos** : rien d'incohérent, contrairement aux avis.
Ils restent invérifiables un par un. (Une coquille corrigée au passage : `4.900+` → `4 900+`
sur le cours ukulélé débutant.)
→ *Sans réponse : ils restent tels quels.*

## 7. Trouvé au passage, non corrigé

**La règle `prefers-reduced-motion` est cassée sur les 178 pages du site.**
`src/styles/design-tokens.css:423` déclare `animation-duration: 0.01ms !important` ; le
minifieur de `astro-compress` le réécrit en **`animation-duration: NaNs !important`**, une valeur
invalide que le navigateur ignore. Résultat : les animations continuent de tourner pour les
personnes qui demandent explicitement de les réduire. Correction d'une ligne (`0.01ms` → `1ms`
ou `0s`), à faire au lot 3 avec le reste de l'accessibilité.
