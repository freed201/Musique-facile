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

### 4. D'où vient « 95 % de satisfaction » ?
Retiré au lot 1 (hero, témoignages, `/a-propos/`) faute de source. Si l'origine existe, il peut
revenir.

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
- **`src/utils/security.ts` et son middleware ne sont jamais exécutés** : Astro ne charge un
  middleware que depuis `src/middleware.ts`, qui n'existe pas. La CSP réellement appliquée est
  celle de `vercel.json`. Décision à prendre — enregistrer le middleware et aligner les deux CSP,
  ou supprimer le code mort. Voir `.claude/rules/coherence-en-tetes-securite.md`.

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

### Reste à trancher, article par article

Les vingt autres. Pour chacun, la question est la même : *combien d'accords cet
article enseigne-t-il vraiment ?* Les cas les plus nets :

- **Viva la Vida** — annonce 9, montre 4, le texte dit 4. Le livre en compte 8.
- **Ironic** — annonce 9, montre 4. Le livre en compte 6.
- **Perfect** — annonce 8, montre 4, le texte dit 4 et 8 à deux endroits.
- **More Than Words** — **aucun `chordCount`**, le texte dit 12, le livre 12.
- **Don't Stop Me Now** — annonce 7, le relevé vérifié par Fred en donne 15.

Un outil manque ici : rien ne contrôle que `chordCount`, le nombre de schémas et
le nombre d'accords cités dans le texte se répondent. C'est ce désaccord
silencieux qui a laissé ces vingt-trois écarts s'installer.

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
