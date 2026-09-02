# Outil « Quel accord apprendre ensuite ? »

> Branche `feat/outil-quel-accord-apprendre`. **Aucun merge.**

## 1. Pourquoi cette question, et pas « que puis-je jouer ? »

L'idée de départ était : *je coche les accords que je connais, on me dit ce que je peux jouer*.
Mesuré sur le catalogue, elle ne tient pas :

| Accords connus | Morceaux jouables entièrement |
|---|---:|
| C, G, D | **0** |
| C, G, D, Am | **0** |
| + Em, F | 2 |
| 9 accords | 8 |

Un débutant qui coche ses quatre premiers accords obtiendrait **une page vide**. C'est
décourageant, et c'est une promesse fausse.

La question inversée — *quel accord dois-je apprendre maintenant ?* — utilise la même donnée et
transforme cette rareté en prochaine étape. Elle répond aussi à une angoisse réelle : « je
stagne, je fais quoi ? »

## 2. La donnée : trois sources, une seule juste

Le fichier `sources-privees/accords.json`, qui servait de relevé, s'est révélé **faux sur les
trois morceaux vérifiés page par page dans le livre** :

| Morceau | Livre (PDF) | `accords.json` | `chordCount` de l'article |
|---|---|---|---|
| Smells Like Teen Spirit p.100 | E5, A5, G5, C5, F5 | `['E']` ✗ tronqué | 6 ✗ |
| Les Copains d'abord p.38 | 13 accords | 8 ✗ intro oubliée | **13 ✓** |
| Redemption Song p.60 | G, Em, C, C/B, Am, D | 7, dont un `Am6` ✗ **inventé** | 4 ✗ |

Il tronque, il oublie des sections entières, et il ajoute un accord absent de la page. Il est
abandonné au profit d'une extraction directe du livre.

Un détail éclaire un faux désaccord : sur *Smells Like Teen Spirit*, le livre donne les **formes**
(E5, A5, G5, C5) et l'article les accords **entendus** avec le capo case 1 (F5, Bb5, Ab5, Db5).
Les deux disaient vrai, ils ne comptaient pas la même chose.

## 3. `scripts/extract-book-chords.mjs`

Extrait les accords du PDF page par page, regroupe les morceaux à cheval sur deux pages, relève
le tempo, et relie chaque morceau à son tutoriel publié.

**Ce qu'il ne sait pas faire, et le dit.** Sur les morceaux en power chords, `C5` perd parfois
son `5` quand le texte est réordonné, produisant un `C` fantôme. Aucune règle automatique ne
distingue ce cas d'un vrai `C` voisin d'un `C7` : les morceaux concernés sortent en
`statut: "a-verifier"` et **l'outil les ignore**, plutôt que d'être publiés avec un doute.
Deux morceaux sont dans ce cas (*Smells Like Teen Spirit*, *Don't Stop Me Now*).

**Trois défauts d'appariement corrigés en cours de route**, tous trouvés en relisant la table :
- « Hey Ya! » s'appariait à « Hey Jude » — après filtrage, le titre se réduisait au seul mot
  « hey » ;
- « One » se retrouvait dans « Mr. J**one**s » par simple inclusion de chaîne ;
- « Machistador » n'était relié à rien, l'artiste `-M-` ne survivant pas à la normalisation.

L'appariement raisonne désormais en **mots entiers**, se sert de l'artiste comme départage, et
accepte un titre d'un seul mot s'il est assez distinctif. Contrôle final : **39 morceaux reliés,
0 faux**.

Le JSON produit est versionné, sans les numéros de page du livre : le site se construit sans le
PDF, qui reste privé.

**Ajouter un morceau vérifié** : ouvrir `src/data/song-chords.json`, corriger la liste `accords`
si besoin, passer `statut` à `"verifie"`. L'outil le prend au build suivant, et le script
conserve ce statut aux extractions ultérieures.

## 4. La page

`/outils/quel-accord-apprendre/` — **37 morceaux**, 47 accords distincts.

**Tout est dans le HTML rendu au build** : les 37 morceaux avec leurs accords, tempo et niveau,
le classement des accords les plus fréquents, et les liens vers les 37 tutoriels. Le JavaScript
ne fait que filtrer et réordonner. Sans lui, la page reste entièrement lisible et indexable.

```
$ contenu du HTML servi, JavaScript désactivé
37 morceaux listés · 27 cases à cocher · 40 liens vers les tutoriels · 12 accords classés
```

Le H1 est suivi d'une réponse directe de 45 mots, conforme à la règle du silo.

## 4 bis. Les tutoriels vidéo par accord

Fred a une série de Shorts « Accord X (nom français) à la guitare | Tuto facile », un par accord.
Elle referme la boucle : l'outil ne se contente plus de dire *apprends Bm*, il montre comment.

Recensée dans YouTube Studio (elle n'était pas trouvable publiquement, la plupart des vidéos
étant **programmées**) : **13 accords guitare**, dont 6 déjà en ligne et 7 planifiés jusqu'au
19 octobre 2026.

**Une vidéo n'est proposée que si sa date de mise en ligne est passée.** C'est la même règle que
pour la publication des articles, et elle a une conséquence agréable : la page s'enrichit toute
seule à mesure que la série sort, sans rien à modifier. Aujourd'hui A, A7, Bm, C, C7 et Cmaj7 ;
D arrive le 7 septembre, G le 12 octobre.

Les liens sont **dans le HTML rendu** — portés par les cases à cocher en `data-video` et affichés
dans le classement des accords les plus fréquents. Le script les relit depuis le DOM plutôt que
d'embarquer un second jeu de données. Ce sont de simples liens vers YouTube : **rien n'est chargé
depuis YouTube tant que le visiteur ne clique pas.**

Rendu obtenu :

```
Apprenez Bm   Voir comment le poser (24 s) → youtube.com/shorts/oemCK1s-CYA
Il vous manque uniquement cet accord pour jouer 3 morceaux de plus :
  Un autre monde · L'Opportuniste · What's Up
Vous pouvez déjà jouer 3 morceaux : So Lonely · Stand By Me · Mr. Jones
```

## 5. Un bug d'affichage trouvé, et qui touchait l'accueil

La zone de résultat s'affichait **en clair sur clair** en mode sombre. En cherchant pourquoi :
`--bg-alt` (`#F7F5FB`) n'était **jamais redéfini** pour le thème sombre, alors que le texte, lui,
passait en clair.

Six composants utilisent ce token comme fond. Trois compensaient par une surcharge locale.
**`TemoignagesModern` ne le faisait pas** — donc la section « La note de nos élèves » de la page
d'accueil était illisible en mode sombre, en production.

Mesuré dans le navigateur, avant et après la correction du token :

```
accueil — note de nos élèves    fond rgb(247,245,251) / texte rgb(241,245,249)   contraste 1,03
                                → fond rgb(30,41,59)  / texte rgb(241,245,249)   contraste 13,35

outil — zone de résultat        idem : 1,03 → 13,35
```

Corrigé à la racine, dans les deux blocs de `design-tokens.css` (préférence système **et** choix
explicite du thème), plutôt qu'en ajoutant une quatrième rustine locale.

## 6. Vérifications

```
$ npm run build                      [build] Complete!   0 erreur
$ npm run check:seo                  ✓ Aucun défaut nouveau

$ appariement livre → tutoriel       39 reliés, 0 faux, 1 sans tutoriel
$ morceaux utilisables par l'outil   37 (statut ok, tutoriel publié)
$ morceaux écartés par précaution    2 (doute d'extraction non levé)

$ essai réel dans le navigateur, thème sombre, avec G C Am D Em F Dm A cochés
  « Apprenez Bm — il vous manque uniquement cet accord pour jouer 3 morceaux de plus :
    Un autre monde, L'Opportuniste, What's Up »
  « Vous pouvez déjà jouer 3 morceaux : So Lonely, Stand By Me, Mr. Jones »
```

## 7. Ce qui reste à décider

**Q1 — Publier les accords par morceau.** L'outil expose la liste d'accords de 37 morceaux de
ton livre. C'est ce que font tous les sites de tablatures, et chaque morceau renvoie vers son
tutoriel — mais c'est ta décision, pas la mienne. Le livre lui-même n'est pas cité et ses
numéros de page ne sortent jamais du fichier privé.
→ *Sans réponse : rien n'est mergé.*

**Q2 — Les deux morceaux écartés.** *Smells Like Teen Spirit* et *Don't Stop Me Now* attendent
que quelqu'un regarde leur page. Pour le premier, ma lecture de la page 100 donne
**E5, A5, G5, C5, F5** — si tu confirmes, je passe son statut à `verifie` et il rejoint l'outil.

**Q3 — Les `chordCount` faux des articles.** Sur les trois vérifiés, un seul est juste. Ces
chiffres alimentent les titles et les données structurées des pages morceau. Je peux les
corriger depuis le livre, en te soumettant la liste avant application.
