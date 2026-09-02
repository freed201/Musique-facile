# À faire — chantier SEO / visibilité IA

Liste vivante des points en attente. Mise à jour au fil des lots.
Dernière révision : **1er septembre 2026** (après le lot 5, dernier lot du plan).

---

## Pour Fred

### 0. Exporter les avis de la plateforme Musique Facile — **piste ouverte**
Les cours vendus sur la plateforme de Fred ont de vrais élèves et de vrais retours, aujourd'hui
non publiés faute de page publique de référence. Un export daté permettrait de les publier en
`Review` individuels (auteur, date, texte), ce qui est vérifiable autrement qu'en agrégé. C'est
notamment la seule façon de redonner des étoiles aux trois cours « shuffle ».

### 1. Trouver de vrais avis d'élèves — **prioritaire**
Tous les témoignages fabriqués ont été retirés du site (lot 2). Il n'en reste aucun sur la home,
les 18 pages cours, la fiche livre « 40 chansons françaises » et `/5-accords-magiques/`.

Ce qu'il faut réunir pour en publier un :
1. **l'accord de l'élève** pour une publication nominative ;
2. une **identité réduite** : prénom + initiale du nom, jamais le nom complet ;
3. le **mois et l'année** où l'avis a été donné ;
4. l'**URL** de l'avis s'il existe en ligne (Skilleos, YouTube, commentaire public).

Les points 1 et 3 sont obligatoires. Sans eux, on ne publie pas.

**Où les déposer** : `src/data/testimonials.ts` pour la page d'accueil (fichier typé, il suffit
d'ajouter des entrées, le carrousel réapparaît tout seul). Pour les pages cours, le champ
`preuveSociale.testimonials` de chaque `src/content/courses/*.md`.

**Piste la plus rapide** : la page Skilleos de Fred (929 avis) est publique. Les avis qui y
figurent sont donc déjà citables, à condition de les reproduire mot pour mot avec leur date et
un lien vers la page.

### 2. ~~Décider du sort des notes par cours~~ — **fait le 2026-09-01**
Les décomptes d'origine n'étaient pas inventés : ils additionnaient les élèves de Skilleos et ceux
de la plateforme de Fred. Ils n'étaient simplement pas vérifiables par un tiers. Décision de Fred :
on ne publie que les chiffres Skilleos, publics. Les 15 cours ayant une fiche Skilleos portent sa
note et son décompte réels, avec l'URL de la fiche dans le JSON-LD ; les 3 cours « shuffle »,
exclusifs à la plateforme de Fred, n'ont plus de note faute de page publique de référence.
**Total annoncé : 3 826 → 779 avis** — une sous-déclaration assumée.
Voir `docs/seo/02b-notes-cours-skilleos.md`. Cinq correspondances restent à confirmer par Fred.

### 3. Nombres d'élèves par cours — vérifié, rien d'alarmant
Les `preuveSociale.stats.students` totalisent **59 340**, ce qui reste **sous les 88 853 élèves
affichés par Skilleos**. Contrairement aux avis, il n'y a pas d'incohérence arithmétique. Ils
restent invérifiables un par un, mais ne constituent pas un risque immédiat. Une coquille a été
corrigée : `4.900+` → `4 900+` sur le cours ukulélé débutant.

### 4. ~~D'où vient « 95 % de satisfaction » ?~~ — **retiré le 2026-09-02**

Fred : « ne vient de rien (ou c'est peut-être une version 100 % des notes de Skilleos) ».
La mention est supprimée de `About.astro` (deux endroits).

**Pourquoi elle n'était pas convertible.** Une note moyenne de 4,7/5 et un taux
de satisfaction sont deux mesures différentes : la moyenne ne dit pas quelle
part des élèves est satisfaite. La version rigoureuse serait « X % des avis
sont à 4 ou 5 sur 5 », qui demande la distribution complète des 929 notes.

**Ce que dit l'échantillon.** Sur les 45 avis que Skilleos expose publiquement
(3 par fiche, 15 fiches), 43 sont à 4/5 ou plus, soit 96 %. C'est troublant de
proximité avec le 95 % annoncé — mais ces 45 avis sont ceux que Skilleos choisit
d'afficher, vraisemblablement les meilleurs. L'échantillon est biaisé et ne
justifie pas la publication.

**Pour le republier**, il faudrait exporter depuis Skilleos la répartition des
929 notes. Si tu l'obtiens, le chiffre redevient publiable, sourcé et daté.

### 5. Titles des articles morceau — arbitrage éditorial
Une cinquantaine d'articles ont un `<title>` de 78 à 90 caractères, à cause de l'enrichissement
volontaire par `songInfo` (« … | 7 Accords | Difficulté 3/5 »). Google coupe au-delà de ~60.
On raccourcit, ou on garde et `check:seo` les exempte explicitement ? *(question Q3 du plan)*

### 6. ~~IDs YouTube des 20 guides prioritaires~~ — **sans objet, traité au lot 4**
54 articles déclaraient déjà des vidéos : 135 identifiants étaient dans le repo, il n'y avait
rien à fournir. En revanche **17 vidéos étaient mortes** et ont été remplacées (voir
`docs/seo/04-videos.md`). Reste deux choses de ton côté :
- **Transcriptions** : le champ `transcript` et son rendu en `<details>` sont prêts. Un export
  des sous-titres YouTube de tes vidéos principales serait le levier de citabilité le plus
  direct qui reste.
- **Mr. Jones** : la vidéo compagnon `jkFHCYOB5VI`, dont la description pointe vers l'article,
  est **non répertoriée**. J'ai pris la version publique à la place. À toi de voir si tu la publies.

### 7. Liens externes — chantier éditorial
**81 articles sur 103 n'ont aucun lien sortant.** C'est un signal de « page fermée ». Le choix
d'un lien pertinent demande un jugement éditorial : je peux proposer une sélection par lots de
10 (source du morceau, page officielle de l'artiste, fabricant pour les guides d'achat).

---

## Dette technique repérée, non traitée

- ~~`prefers-reduced-motion` cassé sur les 178 pages~~ — **corrigé au lot 3** (`0.01ms` → `1ms`).
- **46 défauts SEO hérités** figés dans `scripts/seo-baseline.json` : 21 titles > 60 caractères et
  25 descriptions > 160, tous sur des articles publiés. `npm run check:seo` les affiche sans
  bloquer et échoue sur tout défaut nouveau. À résorber par lots, avec validation éditoriale.
- **3 gabarits `public/lead-magnets/*.html`** passés en `noindex` au lot 3. Seuls les `.pdf` sont
  référencés par les e-mails Brevo : ils sont probablement supprimables.
- ~~`offre.astro` et `CourseLayout` répètent « 4.7 » / « 929 » en dur~~ — **corrigé** : les 4
  `aggregateRating` de `/offre/` sont retirés (mêmes avis revendiqués 4 fois), la note affichée
  lit `src/data/proof.ts`.

- **51 images `public/images/cours/*/testimonial-*.webp`** ne sont plus référencées depuis le
  retrait des témoignages. À supprimer une fois le point 1 tranché (certaines pourraient servir
  si de vrais élèves acceptent d'être photographiés).
- **Cinq composants morts** : `About.astro`, `Resultats.astro`, `Avantages.astro`,
  `StudentsStats.astro`, `SocialProof.astro` — plus importés nulle part. (`Temoignages.astro`,
  le sixième, a été supprimé au lot 2 : il fabriquait une date de `Review` au build.)
- ~~**`src/utils/security.ts` et son middleware ne sont jamais exécutés**~~ — **réglé le
  2026-09-02**. Le code mort est supprimé et `vercel.json` est la source unique, gardée par
  `npm run check:headers`. La copie n'était pas seulement morte, elle était devenue dangereuse :
  elle autorisait `'unsafe-eval'`, référençait encore ActiveCampaign, et ignorait
  `youtube-nocookie.com` et `player.ausha.co` — l'activer aurait cassé les façades vidéo et le
  podcast. Voir `.claude/rules/coherence-en-tetes-securite.md`.

---

## Lots restants

| Lot | Objet | Bloqué par |
|---|---|---|
| ~~3~~ | ~~Nettoyage on-page~~ — **livré** (PR lot 3) | — |
| ~~4~~ | ~~Vidéos YouTube~~ — **livré** (PR lot 4) | — |
| ~~5~~ | ~~Maillage, réponses directes, `llms.txt`~~ — **livré** (PR lot 5) | — |

## `chordCount` des articles-morceau — analyse du 2026-09-02

Trois nombres coexistent pour chaque morceau, et ils ne veulent pas dire la même
chose :

- **`chordCount`** du frontmatter — ce que l'article *annonce* ;
- **schémas** — le nombre de diagrammes d'accords réellement affichés ;
- **livre** — le relevé de `src/data/song-chords.json`.

**Un écart n'est pas automatiquement une erreur.** *Redemption Song* déclare 4
accords, en montre 4, et le livre en compte 6 : l'article dit explicitement
« quatre accords ouverts suffisent, la version complète ajoute trois
enrichissements ». Son `chordCount` est juste — c'est celui de la version
enseignée. Aligner mécaniquement sur le livre l'aurait rendu faux.

Le bon `chordCount` est **le nombre d'accords que l'article enseigne**, pas
celui du livre. Et pour 21 des 23 morceaux, le relevé du livre est en statut
« ok » (extraction PDF), non relu à la main : il ne fait pas autorité contre le
texte d'un article.

| Article | annoncé | schémas | livre | statut du relevé |
|---|---:|---:|---:|---|
| [apprendre-chasing-cars-guitare](/blog/apprendre-chasing-cars-guitare/) | 5 | 0 | 4 | ok |
| [tutoriel-jveux-du-soleil-chanson-francaise](/blog/tutoriel-jveux-du-soleil-chanson-francaise/) | 3 | 3 | 4 | ok |
| [apprendre-one-guitare](/blog/apprendre-one-guitare/) | 5 | 4 | 4 | ok |
| [apprendre-un-autre-monde-guitare](/blog/apprendre-un-autre-monde-guitare/) | 6 | 6 | 4 | ok |
| [apprendre-where-is-my-mind-guitare](/blog/apprendre-where-is-my-mind-guitare/) | 6 | 3 | 4 | ok |
| [jouer-fields-of-gold-sting](/blog/jouer-fields-of-gold-sting/) | 6 | 5 | 5 | ok |
| [jouer-hallelujah-jeff-buckley-guitare](/blog/jouer-hallelujah-jeff-buckley-guitare/) | 6 | 6 | 5 | ok |
| [apprendre-respire-guitare](/blog/apprendre-respire-guitare/) | 6 | 6 | 5 | ok |
| [apprendre-une-belle-histoire-guitare](/blog/apprendre-une-belle-histoire-guitare/) | 8 | 4 | 5 | ok |
| [apprendre-wonderwall-guitare](/blog/apprendre-wonderwall-guitare/) | 7 | 5 | 5 | ok |
| [apprendre-back-to-black-guitare](/blog/apprendre-back-to-black-guitare/) | 7 | 7 | 6 | ok |
| [apprendre-ironic-guitare](/blog/apprendre-ironic-guitare/) | 9 | 4 | 6 | ok |
| [apprendre-lucky-man-guitare](/blog/apprendre-lucky-man-guitare/) | 5 | 3 | 6 | ok |
| [apprendre-partons-vite-guitare](/blog/apprendre-partons-vite-guitare/) | 7 | 6 | 6 | ok |
| [apprendre-perfect-guitare](/blog/apprendre-perfect-guitare/) | 8 | 4 | 6 | ok |
| [apprendre-redemption-song-guitare](/blog/apprendre-redemption-song-guitare/) | 4 | 4 | 6 | ok |
| [apprendre-whats-up-guitare](/blog/apprendre-whats-up-guitare/) | 3 | 3 | 6 | ok |
| [apprendre-smells-like-teen-spirit-guitare](/blog/apprendre-smells-like-teen-spirit-guitare/) | 5 | 5 | 5 | verifie |
| [tutoriel-everybody-hurts-facile](/blog/tutoriel-everybody-hurts-facile/) | 9 | 7 | 8 | ok |
| [apprendre-hey-jude-guitare](/blog/apprendre-hey-jude-guitare/) | 9 | 6 | 8 | ok |
| [apprendre-viva-la-vida-guitare](/blog/apprendre-viva-la-vida-guitare/) | 9 | 4 | 8 | ok |
| [tutoriel-more-than-words-guitare](/blog/tutoriel-more-than-words-guitare/) | — | 5 | 12 | ok |
| [tutoriel-dont-stop-me-now-queen](/blog/tutoriel-dont-stop-me-now-queen/) | 7 | 6 | 15 | verifie |

### Traité le 2026-09-02

- **Smells Like Teen Spirit** — annonçait 6, en enseigne 5 (E5, A5, G5, C5 au
  couplet, F5 au pont) et le relevé vérifié par Fred en donne 5. Corrigé à 5,
  et ses 5 schémas ajoutés — l'article n'en affichait aucun.
- **Wonderwall** — `chordCount: 7` est juste (5 formes + 2 basses descendantes,
  G/E et G/F#, que le texte nomme). Ses 5 formes principales ont maintenant
  leur schéma ; les deux basses n'existent pas au catalogue.
- **Chasing Cars** — `chordCount: 5` est juste (A, D, Dsus2, E, E/G#). Schémas
  **volontairement non ajoutés** : l'article précise que le livre prend le A et
  le Dsus2 en position haute (5e case) et le E/G# en 4e ; afficher les positions
  ouvertes contredirait le texte. Il faudrait générer ces positions-là.

### Tranché le 2026-09-02

Règle retenue : **`chordCount` = le nombre d'accords que la phrase de l'article
annonce elle-même**, dans sa section « Quels accords… ? ». C'est la promesse
faite au lecteur, et c'est ce que le titre et la description reprennent. Le
relevé du livre ne fait pas autorité contre elle : un tuto enseigne souvent une
version simplifiée, et pour 21 des 23 morceaux ce relevé n'est même pas relu.

Onze articles corrigés :

| Article | avant | après | ce que dit son texte |
|---|---:|---:|---|
| J'veux du soleil | 3 | 4 | « Quatre accords : Bm, F#, Em et Dm » |
| Hallelujah | 6 | 5 | « Cinq accords : C, Am, F, G et E7 » |
| Ironic | 9 | 8 | « huit couleurs d'accords » |
| Lucky Man | 5 | 6 | « Six accords : G, D, Dsus2, Asus2, Asus4 et Em » |
| Partons vite | 7 | 6 | « Six accords : C, Em, Am, G, Dm et FMaj7/C » |
| Viva la Vida | 9 | 4 | « Une boucle de 4 accords », sur tout le morceau |
| More Than Words | absent | 12 | « Douze accords, sans capo » |
| Smells Like Teen Spirit | 6 | 5 | 4 power chords + F5 au pont |
| Machistador | 4 | 3 | « Trois accords seulement : Gm, B et C » |
| Wild World | 8 | 9 | « Neuf accords : Am, D/F#, G, C, F, Dm, E, G6 et G7 » |
| Across the Universe | 8 | 5 | « Cinq accords : D, A, A7, G et Em7 » |
| Les Copains d'abord | 13 | 8 | « Huit accords : D, E7, G, F#, F#7, A7, Bm et C7 » |

Les autres étaient déjà justes malgré leur écart au livre — Redemption Song (4),
Don't Stop Me Now (7), Hey Jude (9, version du livre), Perfect (8), What's Up
(3), Everybody Hurts (9), Back to Black (7), Une belle histoire (8), Respire
(6), Fields of Gold (6), One (5), Un autre monde (6), Where Is My Mind (6),
Wonderwall (7), Chasing Cars (5).

Quatre de ces corrections viennent d'articles **hors des 23** : le nouveau
contrôle `W-ACCORDS` de `npm run blog:quality` les a trouvés seul, parce que
leur `chordCount` collait au livre tout en contredisant leur propre texte.

### Reste à faire sur les schémas

**Chasing Cars** attend ses diagrammes : son texte précise que le livre prend le
A et le Dsus2 en position haute (5e case) et le E/G# en 4e. Ces positions-là ne
sont pas au catalogue — il faut les y ajouter avant d'illustrer l'article,
sinon les schémas contrediraient le texte.

## Diagrammes d'accords — deux points ouverts

### Valider les 36 doigtés ajoutés le 2026-09-02

Ils comblent les accords du répertoire de l'outil qui n'avaient aucun schéma
(18 accords couverts avant, 54 sur 56 après). Ce sont les positions standard,
et chacune a été vérifiée par calcul : les notes produites par le doigté sont
comparées à la formule de l'accord. Mais **Fred ne les a pas relues une par
une**. Elles portent `source: 'standard'` dans `scripts/lib/chord-diagrams.mjs`
— il suffit de passer une entrée à `'livre'` après relecture.

Planche de contact des 36 : `seo-audit/captures/2026-09-02-planche-doigtes.html`.

Deux accords restent volontairement sans schéma, leur doigté variant trop d'un
arrangement à l'autre : **Bb7sus4** et **B/G**.

### Une incohérence dans le catalogue existant : `fmaj7-c`

`scripts/lib/chord-diagrams.mjs` décrit `Fmaj7/C` par `[0, 3, 3, 2, 1, 0]`,
c'est-à-dire **corde de mi grave jouée à vide**. Les notes obtenues sont
Mi Do Fa La Do Mi : la basse est un **mi**, pas un **do**. Ce doigté est donc
un Fmaj7/E, ou bien c'est le nom qui est faux.

La correction probable est d'étouffer la corde grave — `[-1, 3, 3, 2, 1, 0]`
donne bien Do Fa La Do Mi, basse do. **Je n'ai rien changé** : cette position
vient du livre et de la relecture de Fred, c'est à lui de trancher. Le
diagramme est publié tel quel sur `/blog/apprendre-partons-vite-guitare/`.

## Titres et descriptions — dette soldée le 2026-09-02

Les 46 défauts hérités (21 titres > 60 caractères, 25 descriptions > 160) sont
corrigés et `scripts/seo-baseline.json` est **vide** : toute nouvelle dérive
fait désormais échouer `npm run check:seo`, au lieu d'être tolérée.

### Deux points repérés en chemin, hors périmètre

**Doublon de métadonnées entre deux programmes piano.**
`piano-facile-apprendre-debutant` et `piano-force-agilite` portaient exactement
la même description ET portent toujours **le même titre** — « Cours de Piano
Débutant - Guide Complet ». Ce sont pourtant deux programmes différents : le
premier va jusqu'aux morceaux (Ode à la joie, Alléluia, 337 lignes), le second
s'arrête aux bases du clavier (121 lignes). Leurs descriptions sont désormais
distinctes ; **les titres restent à différencier**, ils ne dépassaient pas
60 caractères et n'étaient donc pas dans les 46.

À noter aussi : le slug `piano-force-agilite` ne correspond pas à son contenu
(« Les Bases du Clavier »). Le renommer changerait l'URL — à trancher.

**18 descriptions trop courtes** (< 120 caractères) restent en avertissement,
dont plusieurs pages de livres qui affichent la description générique du site
au lieu d'une phrase propre au livre. Exemple : *Les Plus Belles Comptines avec
mon Ukulélé Volume 2* annonce « Apprenez la musique facilement avec nos
formations en ligne ». C'est un manque à gagner sur des pages produit.

---

## Redirections — passe du 2026-09-02

Diagnostic complet des 57 redirections internes, testées en direct sur le site.
**Elles fonctionnent toutes.** Elles font deux sauts au lieu d'un
(`/stage2025` → `/stage2025/` → `/stage2026/`, Vercel ajoutant le slash avant
d'appliquer la redirection) : Google gère ça sans difficulté, ça ne vaut pas
une restructuration. Les 146 « pages avec redirection » signalées par Search
Console sont le fonctionnement normal, pas un défaut.

Une seule était cassée, et elle l'est depuis longtemps :
`/wp-content/uploads/[...slug]` → `/images/[...slug]`. Le motif n'est pas
substitué dans la destination : toutes les anciennes URL d'images partaient
vers l'URL littérale « /images/[...slug] », en 404. Et même substituée, la
destination n'aurait pas existé — l'arborescence d'images WordPress n'a pas
survécu à la refonte.

Corrigé, avec les règles `/wp-content/` et `/wp-includes/` retirées : ces
chemins ne contenaient que des assets, et rediriger une requête d'image vers
une page HTML est lu par Google comme une soft-404, plus mauvais qu'une vraie
404. Quatre articles dépubliés que Google garde en mémoire ont reçu une
redirection vers leur équivalent vivant, et la variante en majuscule
`/blog/Nous-on-sait-guitare-tuto` aussi.

`npm run check:redirects` garde l'ensemble : destination existante, aucun motif
littéral, aucune chaîne, aucune redirection masquant une page vivante.

### Ce que le diagnostic a corrigé dans l'analyse précédente

Les **522 pages « explorées, actuellement non indexées »** ne sont PAS un
gisement, contrairement à ce que laissait croire le seul chiffre. En regardant
les URL : une bonne moitié appartiennent à **`ecole.musique-facile.fr`** — la
propriété Search Console est une propriété de domaine, elle englobe donc la
plateforme de cours, dont les leçons sont derrière un accès élève et n'ont pas
vocation à être indexées. Le reste est fait de variantes sans slash final, qui
redirigent correctement, et d'entrées anciennes déjà résorbées.

Le chiffre qui compte : **171 pages indexées pour 172 au sitemap**. Le site est
indexé en quasi-totalité.

---

## Points laissés ouverts au 2026-09-02 (arrêt des modifications)

### Contenu

- **Chasing Cars n'a pas ses diagrammes.** Son texte précise que le livre prend
  le A et le Dsus2 en **position haute (5e case)** et le E/G# en **4e**. Ces
  positions ne sont pas au catalogue de doigtés : les ajouter d'abord, sinon
  les schémas contrediraient l'article. C'est le seul des trois articles sans
  schéma qui reste en l'état.

- **Deux programmes piano partagent le même titre** — « Cours de Piano Débutant
  - Guide Complet » : `piano-facile-apprendre-debutant` et
  `piano-force-agilite`. Leurs descriptions ont été différenciées le 2026-09-02,
  pas leurs titres (ils tenaient sous 60 caractères, donc hors du lot). Second
  point sur le même fichier : le slug `piano-force-agilite` ne correspond pas à
  son contenu, qui s'arrête aux bases du clavier. Le renommer changerait l'URL.

- **18 descriptions sont trop courtes** (< 120 caractères), signalées en
  avertissement par `npm run check:seo`. Plusieurs pages de livres affichent la
  description générique du site au lieu d'une phrase sur le livre — *Les Plus
  Belles Comptines avec mon Ukulélé Volume 2* annonce « Apprenez la musique
  facilement avec nos formations en ligne ». C'est un manque à gagner sur des
  pages produit.

- **Trois chansons de l'outil ukulélé attendent un arbitrage** : *La Vie en
  Rose*, *Riptide* et *Somewhere Over the Rainbow*, dont les deux articles
  sources donnent des accords différents. Elles restent hors de l'outil tant que
  ce n'est pas tranché (`src/data/ukulele-songs.json`, statut « conflit »).

### Technique

- **En développement local, aucun en-tête de sécurité n'est servi.** Ils
  viennent de `vercel.json`, appliqué au déploiement ; `astro dev` n'en sert
  aucun. Si la parité locale devient un besoin, c'est une décision à prendre
  explicitement — surtout pas un middleware à réintroduire au passage, voir
  `.claude/rules/coherence-en-tetes-securite.md`.

- **La page `/outils/quel-accord-ukulele-apprendre/` n'a pas de `lastmod`** dans
  le sitemap : c'est la seule des 172 URL dans ce cas. `page-revisions.json` est
  généré depuis les dates git par `npm run seo:revisions`, qui n'a pas été
  relancé depuis la création de la page. Sans conséquence pour l'indexation —
  l'URL est bien présente — mais à régénérer au prochain lot.

- **Le relevé du livre reste non vérifié pour 37 morceaux sur 39.** Seuls
  *Smells Like Teen Spirit* et *Don't Stop Me Now* ont été relus par Fred. Les
  autres portent le statut « ok » de l'extraction PDF. C'est ce qui limite
  aujourd'hui la confiance qu'on peut accorder au catalogue de l'outil.

