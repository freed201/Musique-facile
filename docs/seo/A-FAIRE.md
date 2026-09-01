# À faire — chantier SEO / visibilité IA

Liste vivante des points en attente. Mise à jour au fil des lots.
Dernière révision : **1er septembre 2026**.

---

## Pour Fred

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

### 2. Décider du sort des notes par cours — **question ouverte**
Chaque fiche `src/content/courses/*.md` porte son propre `ratingValue` et `reviewCount`, qui
alimentent un `aggregateRating` par page cours :

| Cours | Note | Avis annoncés |
|---|---|---:|
| `apprendre-ukulele-debutant` | 4.7 | 360 |
| `lecture-de-notes-niveau-debutant` | 4.6 | 300 |
| `apprendre-les-accords-piano` | 4.8 | 220 |
| `apprendre-guitare-debutant` | 4.7 | 180 |
| `ameliorer-oreille-piano` | 4.4 | 85 |
| `cours-exercices-techniques-piano` | 4.7 | 80 |
| `cours-solfege-rythmes` | 4.6 | 75 |
| `apprendre-piano-facile-guitaristes` | 4.0 | 60 |
| `apprendre-la-rythmique-ukulele-facilement` | 4.6 | 55 |
| `apprendre-piano-shuffle` | 4.5 | 15 |
| `apprendre-guitare-shuffle` | 4.8 | 8 |
| `apprendre-ukulele-shuffle` | 4.8 | 8 |
| *(+ 6 autres fiches)* | | |

Additionnés, ces `reviewCount` dépassent largement les 929 avis de la source Skilleos. Si ces
notes ne correspondent à aucun relevé réel, ce sont de **fausses données structurées** — Google
sanctionne, et les étoiles peuvent disparaître de toutes les pages du site, pas seulement des
pages cours.

→ **Rien n'a été touché.** Trois réponses possibles :
- *(a)* elles viennent d'un export Podia/Skilleos par cours → me donner la source, je l'inscris ;
- *(b)* elles sont estimées → les remplacer par la note globale sourcée (4,7/5 sur 929 avis) ;
- *(c)* on retire l'`aggregateRating` des pages cours et on ne garde que celui de l'organisation.

### 3. Même question pour les stats des pages cours
Le bandeau de chaque page cours affiche `preuveSociale.stats.students` — par exemple
**« 9 210 débutants »** sur `/cours/apprendre-guitare-debutant/` — et un `successRate`. Aucune
source connue. Même arbitrage que le point 2.

### 4. D'où vient « 95 % de satisfaction » ?
Retiré au lot 1 (hero, témoignages, `/a-propos/`) faute de source. Si l'origine existe, il peut
revenir.

### 5. Titles des articles morceau — arbitrage éditorial
Une cinquantaine d'articles ont un `<title>` de 78 à 90 caractères, à cause de l'enrichissement
volontaire par `songInfo` (« … | 7 Accords | Difficulté 3/5 »). Google coupe au-delà de ~60.
On raccourcit, ou on garde et `check:seo` les exempte explicitement ? *(question Q3 du plan)*

### 6. IDs YouTube des 20 guides prioritaires
Nécessaires au lot 4. Liste des articles dans `00-plan.md`, § 5. Trois d'entre eux ont déjà leur
vidéo déclarée dans le frontmatter.

---

## Dette technique repérée, non traitée

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
- **`offre.astro` et `CourseLayout.astro`** répètent « 4.7 » / « 929 » en dur au lieu de lire
  `src/data/proof.ts`. À basculer au lot 3.
- **36 URLs du sitemap** ont un `lastmod` figé en 2025-01, et trois en 2019 / 2021 / 2024.
  Traité au lot 3.

---

## Lots restants

| Lot | Objet | Bloqué par |
|---|---|---|
| 3 | Nettoyage on-page : `##` du guide accords, titles, 3 canonicals, sitemap `lastmod`, RSS, `check:seo` | point 5 pour la partie titles |
| 4 | Vidéos YouTube sur les 20 guides : `VideoEmbed`, `VideoObject`, transcriptions | point 6 |
| 5 | Maillage, réponses directes, `llms.txt` | rien |
