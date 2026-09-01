# Lot 5 — Maillage interne et réponses directes

> Branche `feat/seo-lot5-maillage`, partie de `master` à jour. **Aucun merge.**

## 1. J'ai commencé par mesurer, et deux tâches sur quatre étaient déjà faites

### Les réponses directes existent partout
Le plan demandait de vérifier qu'un paragraphe de réponse de 2-3 phrases suit le H1, et d'en
proposer là où il manque. **Mesuré sur les 22 pages cours et les 10 guides principaux : il n'en
manque aucun.** Toutes tiennent sous 30 mots.

```
cours/apprendre-guitare-debutant           23 mots  « La méthode pas à pas qui a permis à… »
cours/piano-facile-apprendre-debutant      23 mots  « 148 leçons progressives pour passer de… »
blog/accords-guitare-debutant-guide-ultime 23 mots  « Sept accords ouverts suffisent pour… »
blog/guide-complet-apprentissage-piano     26 mots  « Jouer votre première mélodie en 2-3… »
…22 pages cours + 10 guides, toutes conformes
```

Rien à proposer, donc rien à te faire valider sur ce point.

### Le maillage éditorial est sain
Le plan supposait un maillage pauvre. Mesuré sur les 98 articles publiés, en comptant les liens
**réellement écrits dans le Markdown** (hors navigation) :

- médiane **2** liens internes, moyenne 4,2 ;
- **97 articles sur 98** respectent la règle des ≥2 liens de `article-parfait.md` ;
- les piliers maillent vers le bas comme prévu : 60 liens sur le pilier guitare, 22 sur
  « pourquoi tu stagnes », 20 sur le pilier piano.

**Les silos sont intacts** : 93 articles portent un `siloSlug`, **0 est cassé** (cible existante,
publiée et marquée `pillar`).

### Un bloc « Guides liés » aurait fait doublon
`RelatedArticles` existe déjà et note ses candidats par tags (50 points), instrument (30),
niveau (20), avec un bonus de 40 pour le même silo. C'est exactement la sélection « par
instrument et niveau » demandée. Ajouter un troisième bloc de liens aurait dilué, pas renforcé.

## 2. Les 22 liens `/cours/` : d'où ils venaient vraiment

Décomposition sur `/blog/accords-guitare-debutant-guide-ultime/` :

| Zone | Avant | Nature |
|---|---:|---|
| `<header>` | 10 | Menu de navigation, 5 cibles × 2 (menu desktop + menu mobile) |
| Corps de page | 5 | **4 génériques** + 1 CTA contextuel |
| `<footer>` | 7 | 4 de la colonne « Cours » + **3 répétés** dans le paragraphe « univers » |

Le corps de l'article lui-même n'en contenait **aucun** : les 22 venaient du gabarit.

### Ce qui a été retiré

**Le bloc « Alors, prêt(e) à rejoindre l'aventure ? »** (`blog/[slug].astro`) affichait les
**quatre instruments sur chaque article**, quel qu'en soit le sujet. Un article sur les accords
de guitare renvoyait autant vers le piano, l'ukulélé et le solfège que vers la guitare. Retiré :
`ArticleCTA`, juste en dessous, pointe déjà vers le cours correspondant à l'instrument de
l'article, avec son propre pitch.

**Les 3 liens répétés du pied de page.** Le paragraphe « L'univers Musique Facile » reprenait
Guitare, Piano et Solfège, déjà présents dans la colonne « Cours » du même pied de page. Ce
paragraphe sert à montrer l'écosystème **externe** (Ukulélé-Facile.fr, Kid&Zic) : il ne garde
plus que ça.

### Ce qui n'a pas été touché
Les 10 liens du menu et les 4 de la colonne « Cours » du pied de page. C'est de la navigation :
elle est identique sur toutes les pages du site, les moteurs la traitent comme telle, et
l'amputer nuirait aux visiteurs sans rien apporter.

## 3. Avant / après, sur les 102 articles

| Moyenne par article | Avant | Après | Delta |
|---|---:|---:|---:|
| liens `/cours/` | 22,5 | **15,6** | −6,8 |
| dont **dans le corps de page** | 5,5 | **1,6** | −3,8 |
| liens internes (toutes destinations) | 36,8 | **30,0** | −6,8 |

Détail sur quelques articles :

| Article | `/cours/` avant → après | dans le corps avant → après |
|---|---|---|
| `accords-guitare-debutant-guide-ultime` | 22 → **15** | 5 → **1** |
| `apprendre-wonderwall-guitare` | 22 → **15** | 5 → **1** |
| `debuter-ukulele-methode-simple-apprendre` | 25 → **18** | 8 → **4** |
| `quel-ukulele-acheter-guide-comparatif-debutant` | 24 → **17** | 7 → **3** |
| `guide-complet-apprentissage-piano` | 28 → **21** | 11 → **7** |
| `apprendre-la-guitare-facilement-guide-complet-pour-debutants` | 27 → **20** | 10 → **6** |

Le corps de page passe d'une moyenne de 5,5 liens `/cours/` indifférenciés à **1,6**, soit le
CTA contextuel et, sur les guides, les liens que l'auteur a écrits lui-même.

## 4. `public/llms.txt` refondu

- Les deux sections « guides d'achat » et « guides piliers » sont remplacées par **une liste
  unique des 10 guides à citer en priorité**, chacun avec **une ligne décrivant ce qu'il
  contient** — pas seulement son titre.
- Nouvelle section **« Suivre les publications »** : le flux `/rss.xml` et le `sitemap.xml`.
- Les chiffres sont alignés sur `src/data/proof.ts` et **portent leur source** :
  « 4,7/5 sur 929 avis vérifiés — source : skilleos.com/expert/frederic-fieffe ».
- Coquille corrigée : « 1400+ » → « 1 400+ ».

**Les 41 URLs citées par le fichier ont été vérifiées une par une contre le build : 0 introuvable.**

## 5. Sortie brute des vérifications

```
$ npm run build
[build] Complete!     0 erreur

$ npm run check:seo
● 46 défaut(s) hérité(s), tolérés
✓ Aucun défaut nouveau.

$ silos cassés (cible inexistante, non publiée, ou non marquée pillar)
0 sur 93 articles avec siloSlug

$ liens internes vers un article inexistant ou non publié
0
  (2 signalements initiaux étaient de faux positifs : le fichier
   Nous-on-sait-guitare-tuto.md porte une majuscule, Astro produit bien
   le slug nous-on-sait-guitare-tuto et la page existe)

$ URLs citées dans llms.txt et absentes du build
0 sur 41

$ réponses directes après le H1
22 pages cours + 10 guides : toutes présentes, toutes < 30 mots
```

## 6. Ce qui n'a pas été fait

**Le CTA « en tête ».** Le plan demandait un CTA en début d'article. Je ne l'ai pas ajouté :
`CLAUDE.md` note que le blog est déjà saturé en capture, et l'article porte déjà, dans l'ordre,
un `PillarLink` vers son pilier, une `BuyingGuideCard` après le premier H2, un `InlineOptIn` aux
deux tiers, puis l'`ArticleCTA` final. Ajouter un cinquième point d'appel dégraderait la lecture.
Dis-moi si tu veux quand même en ajouter un.

**Les liens externes** — toujours ouvert, c'est le dernier chantier du corpus. **81 articles sur
103 n'ont aucun lien sortant.** Le choix demande un jugement éditorial ; je peux proposer une
sélection par lots de 10 (source du morceau, page officielle de l'artiste, fabricant pour les
guides d'achat). Consigné dans `A-FAIRE.md`.

## 7. Décision qui te revient

**Q1 — Le bloc « Alors, prêt(e) à rejoindre l'aventure ? » disparaît des 102 articles.** C'est le
seul changement visible de ce lot. Le CTA contextuel qui le suivait immédiatement reste en place.
→ *Sans réponse : il reste retiré.* Si tu tiens à un bloc de fin d'article multi-instruments, je
peux le rendre contextuel — l'instrument de l'article en premier, les autres en retrait — plutôt
que de le supprimer.
