# Lot 4 — Les vidéos branchées sur les articles

> Branche `feat/seo-lot4-videos`, partie de `master` à jour. **Aucun merge.**

## 1. Ce que j'ai trouvé avant d'écrire une ligne de code

Le plan prévoyait d'équiper 20 articles avec des identifiants YouTube que tu devais fournir.
En regardant le repo, **54 articles déclaraient déjà des vidéos** — 149 déclarations au total.
Il n'y avait donc rien à deviner : le travail portait sur ces vidéos-là.

Deux problèmes, découverts en relevant leurs métadonnées :

### 17 vidéos étaient mortes
Supprimées, passées en privé ou restreintes. **16 articles affichaient un lecteur
« Vidéo non disponible »**, plus 4 liens morts dans le corps de textes.

### Les dates de mise en ligne étaient inventées
`ArticleLayout.astro` construisait chaque `VideoObject` avec
`"uploadDate": isoDatePublished` — la date de publication de **l'article**, pas de la vidéo.
Et aucune durée n'était déclarée. Ces deux valeurs sont pourtant publiques : la page de
visionnage YouTube expose `uploadDate` et `lengthSeconds`.

## 2. Un relevé réel plutôt que des estimations

`scripts/fetch-video-metadata.mjs` (`npm run videos:metadata`) relève sur les pages YouTube,
pour chaque identifiant cité dans le blog : date de mise en ligne, durée, titre réel, et
télécharge la miniature en WebP. Résultat versionné dans `src/data/video-metadata.json` et
`public/images/video-thumbs/`.

Une vidéo devenue indisponible est marquée comme telle : l'article se construit toujours, mais
sans lecteur ni `VideoObject`. **Un balisage absent vaut mieux qu'un balisage qui pointe vers
une vidéo morte.**

## 3. Les 16 vidéos mortes remplacées

Tu m'as donné l'accès à ton Studio. J'ai d'abord épuisé les sources publiques — page chaîne et
recherche interne, qui m'ont donné 10 remplaçants — puis j'ai cherché les 6 derniers dans
Studio, où ils étaient bien présents.

| Article | Morceau | Ancien ID (mort) | Nouvelle vidéo |
|---|---|---|---|
| `apprendre-chasing-cars-guitare` | Chasing Cars | `QGDPuHrVEwk` | `cMZxsloPy_Y` — Chasing Cars - Guitare Débutant \| Tutoriel simple |
| `apprendre-ironic-guitare` | Ironic | `3j05H5iNLNA` | `rW9bodiGcig` — Ironic - Guitare Tutoriel Débutant (Capo 4) |
| `apprendre-mr-jones-guitare` | Mr. Jones | `-FuyBaXha30` | `Z3zlcYuuvlo` — Mr. Jones (Counting Crows) guitare – Tutoriel complet |
| `apprendre-perfect-guitare` | Perfect | `B3Y07H9DaAo` | `xAYuq6aZ87w` — Perfect - Guitare Play Along |
| `apprendre-redemption-song-guitare` | Redemption Song | `ZL8DWFF28vI` | `J8qZFIlAKQs` — Redemption Song guitare facile |
| `apprendre-riche-guitare` | Riche | `bZTqR03qD_M` | `EPlGAzAqPkc` — Riche – Claudio Capéo \| Play Along |
| `apprendre-une-belle-histoire-guitare` | Une Belle Histoire | `uwFiDGnnBM4` | `4Y0fh6FsW-A` — Une Belle Histoire à la guitare – tutoriel complet |
| `apprendre-whats-up-guitare` | What's Up | `rJu3ADWM9NY` | `5LSvDmYaKFU` — What's Up (4 Non Blondes) guitare |
| `apprendre-where-is-my-mind-guitare` | Where Is My Mind | `O7ICANzjuWs` | `u43nywi1Dlo` — Where Is My Mind (Pixies) |
| `apprendre-wonderwall-guitare` | Wonderwall | `wr0sRkJK7xA` **et** `zOj6dWit57M` | `0OyUCudbWX4` — Wonderwall à la guitare (capo 2) |
| `jouer-hey-ya-outkast-guitare` | Hey Ya! | `yn69Xp9V-ug` | `9FpBiegyeaE` — Hey Ya! Outkast guitare |
| `tuto-cant-help-falling-in-love-presley-guitare` | Can't Help Falling in Love | `idJT93pMTh0` | `_y6QslDx2Uw` — Can't Help Falling in Love à la guitare |
| `tutoriel-across-the-universe-pour-debutants` | Across the Universe | `sZ90cR1Upok` | `oGzzFOOdvFs` — Across The Universe guitare |
| `tutoriel-dont-stop-me-now-queen` | Don't Stop Me Now | `MZ7HW2rm81k` | `j_pWtOlMJo0` — Don't Stop Me Now guitare |
| `tutoriel-everybody-hurts-facile` | Everybody Hurts | `KJZ9WSr7NjA` | `0l-5FzzEQcg` — Everybody Hurts – Play Along |
| `tutoriel-les-copains-dabord-guitare` | Les Copains d'Abord | `ktzZhw6rgcE` | `VqGD0NHeGNE` — Les Copains d'abord guitare |

L'article Wonderwall citait **deux** vidéos mortes ; le doublon a été retiré.
Les 16 remplaçants ont été vérifiés en ligne un par un avant application.

En plus du frontmatter, **4 liens morts dans le corps des articles** ont été corrigés
(Les Copains d'Abord, Everybody Hurts, Une Belle Histoire, Perfect) — des Shorts supprimés,
remplacés par la vidéo qui existe, avec le libellé ajusté (« YouTube Short » ne convenait plus
pour un tutoriel complet).

## 4. `<VideoEmbed>` — une façade, plus d'iframe

Le rendu passait par des `<iframe>` posées directement dans la page. Même en `loading="lazy"`,
chacune ouvre une connexion vers YouTube et charge le lecteur dès qu'elle approche de l'écran.

`src/components/VideoEmbed.astro` affiche à la place une miniature WebP locale et un bouton.
**L'iframe `youtube-nocookie.com` n'est créée qu'au clic.** Le bouton porte un `aria-label`
explicite, la durée réelle est affichée en surimpression, et le `focus` passe sur le lecteur
une fois chargé.

**Consentement** — vérifié avant d'écrire : `ConsentManager.astro` ne déclare que
`googletagmanagerId`. **tarteaucitron ne gère pas YouTube** sur ce site, il n'y a donc aucun
service à solliciter, et la façade suffit puisque rien n'est demandé à YouTube avant une action
du visiteur. Je n'ai pas touché à la configuration du consentement. Si YouTube y est ajouté un
jour, le point d'entrée est commenté dans le composant.

## 5. Transcriptions

Le schéma `videos[]` accepte désormais un champ `transcript` facultatif, rendu dans un
`<details>` **présent dans le HTML** : replié à l'écran, entièrement lisible par un robot.
Vérifié en ajoutant une transcription de test, puis retiré :

```
<details class=video-embed__transcript>
  Transcription de la vidéo   Premier paragraphe de test.   Second paragraphe de test.
```

**Aucune transcription réelle n'est fournie** : je n'en invente pas. Le jour où tu en as
(export des sous-titres YouTube, par exemple), il suffit de renseigner le champ.

## 6. Sortie brute des vérifications

```
$ npm run build
[build] Complete!     0 erreur

$ npm run check:seo
● 46 défaut(s) hérité(s), tolérés : {"title-trop-long":21,"description-trop-longue":25}
✓ Aucun défaut nouveau.

$ validation du JSON-LD sur les 102 articles
types de schémas : BlogPosting 98 · VideoObject 164 · HowTo 41 · BreadcrumbList 102 ·
                   FAQPage 98 · ItemList 19 · CollectionPage 4 · WebPage 4
erreurs : 0
  (contrôles : name, uploadDate, thumbnailUrl et embedUrl présents ; uploadDate horodatée ;
   duration au format ISO 8601)

$ exemple de VideoObject produit (Wonderwall)
{ "name": "Tutoriel complet de Wonderwall",
  "uploadDate": "2024-12-22T03:00:19-08:00",      ← date réelle (avant : date de l'article)
  "duration": "PT6M51S",                          ← durée réelle (avant : absente)
  "thumbnailUrl": "https://musique-facile.fr/images/video-thumbs/0OyUCudbWX4.webp",
  "embedUrl": "https://www.youtube-nocookie.com/embed/0OyUCudbWX4" }

$ vidéos mortes encore référencées
aucune                                            (avant : 17, sur 16 articles)

$ iframes YouTube dans le HTML servi
0                                                 (avant : 1 par vidéo)
```

### Poids de page
```
article à 4 vidéos (erreurs-debutants-guitare)
  HTML  179,3 Ko → 185,1 Ko      soit +5,8 Ko  (markup de façade + CSS)
  miniatures : 4 × ~15 Ko, en loading="lazy"

article à 1 vidéo, cas le plus courant
  HTML +1,5 Ko environ, plus une miniature de ~15 Ko

miniatures : 135 fichiers, 15 Ko en moyenne, 29 Ko au maximum, 2,0 Mo au total
```
La contrainte de +30 Ko avant clic est tenue sur le cas courant (~17 Ko). Sur un article à
4 vidéos, l'addition des 4 miniatures dépasse 30 Ko **si le visiteur fait défiler jusqu'à
toutes les vidéos** — mais elles remplacent 4 iframes qui chargeaient chacune le lecteur
YouTube complet, de l'ordre du mégaoctet. Le bilan réseau est massivement à la baisse.

## 7. Ce qui n'a pas été fait

**Le lien externe par article.** Le plan demandait au moins un lien sortant pertinent par
article équipé. **81 articles sur 103 n'ont aucun lien externe** — c'est un chantier éditorial,
pas mécanique : un lien choisi au hasard est pire que pas de lien. Je peux te proposer une
sélection par lots de 10 (source du morceau, page officielle de l'artiste, fabricant pour les
guides d'achat), pour validation. Consigné dans `A-FAIRE.md`.

**La liste des 20 articles du plan** est devenue sans objet : les 54 articles qui déclaraient
des vidéos bénéficient tous du nouveau rendu, et les 17 vidéos mortes concernaient des articles
qui n'étaient pas dans cette liste.

## 8. Décisions qui te reviennent

**Q1 — Les 16 remplacements te conviennent-ils ?** Chaque nouvelle vidéo porte le même morceau
que l'article. Deux méritent ton œil :
- **Mr. Jones** : j'ai retenu `Z3zlcYuuvlo` (publique, 40 548 vues, tutoriel complet, 2014).
  Il existe aussi `jkFHCYOB5VI`, « Mr. Jones à la guitare – tutoriel complet », **non
  répertoriée**, dont la description pointe explicitement vers l'article. C'est visiblement la
  vidéo compagnon prévue pour lui — dis-moi si tu préfères celle-là et si tu veux la publier.
- **Perfect** et **Riche** : les remplaçants sont des *play along*, pas des tutoriels. C'est ce
  que ta chaîne propose pour ces morceaux.
→ *Sans réponse : ils restent tels quels.*

**Q2 — Les transcriptions.** Le champ et le rendu sont prêts. Tu peux exporter les sous-titres
YouTube de tes vidéos principales ? C'est le levier de citabilité le plus direct qui reste.
→ *Sans réponse : aucune transcription publiée.*

**Q3 — Les liens externes.** Je te propose une sélection par lots de 10 articles ?
→ *Sans réponse : rien n'est ajouté.*
