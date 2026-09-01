# À faire — chantier SEO / visibilité IA

Liste vivante des points en attente. Mise à jour au fil des lots.
Dernière révision : **1er septembre 2026** (après le lot 3).

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

### 6. IDs YouTube des 20 guides prioritaires
Nécessaires au lot 4. Liste des articles dans `00-plan.md`, § 5. Trois d'entre eux ont déjà leur
vidéo déclarée dans le frontmatter.

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
| 4 | Vidéos YouTube sur les 20 guides : `VideoEmbed`, `VideoObject`, transcriptions | point 6 |
| 5 | Maillage, réponses directes, `llms.txt` | rien |
