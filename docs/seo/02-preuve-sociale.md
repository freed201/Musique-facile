# Lot 2 — La preuve sociale : sourcée ou retirée

> Branche `feat/seo-lot2-preuve-sociale`, **basée sur `feat/seo-lot1-chiffres-html`** (PR #55)
> parce que les deux lots touchent les mêmes composants. **Aucun merge.**

## Le point de départ a changé en cours de route

Le plan prévoyait de livrer deux variantes et de te laisser choisir. Deux réponses ont tranché
à ma place :

1. **La source des avis existe** : `https://www.skilleos.com/expert/frederic-fieffe`. Page
   vérifiée le 1er septembre 2026, elle affiche bien **4,7/5** et **929 avis**. La note reste
   donc affichée, avec sa provenance visible.
2. **Les trois témoignages sont du stock**, confirmé. Ils sont retirés, pas masqués.

C'est la variante (a) du plan, avec une vraie source à la place du texte à confirmer.

## 1. Ce qui a été fait, fichier par fichier

### `src/data/testimonials.ts` — **nouveau**, typé, vide
Interface `Testimonial` avec **`date` obligatoire** (format `AAAA-MM`), `name` en prénom +
initiale, `instrument`, `sourceUrl` / `sourceName` optionnels. Le fichier documente ce qu'il
faut réunir avant de publier un avis : l'accord de l'élève, une identité réduite, la date, et
l'URL si l'avis existe en ligne. Sans accord et sans date, on ne publie pas.

Le tableau est vide. Le remplir suffit à faire réapparaître le carrousel — aucun composant à
retoucher.

### `src/components/TemoignagesModern.astro`
- Les trois témoignages codés en dur (Marie Dubois, Thomas Martin, Sophie Laurent) sont supprimés.
- Le composant lit `testimonials.ts`. **Deux états** : tableau vide → pas de carrousel, la
  section se réduit à la note et à sa source ; tableau rempli → le carrousel revient.
- Le titre s'adapte : « Ce que nos élèves en disent » n'a plus de sens sans témoignage, il
  devient « La note de nos élèves ».
- **Ligne de source ajoutée sous la note** : « 929 avis vérifiés sur Skilleos — relevé le
  1er septembre 2026 », le nombre étant un lien vers la page.
- La carte de témoignage adopte le format cible : instrument · mois et année · lien vers l'avis.
- Le script du carrousel est déjà gardé par `if (carousel)` : sans carrousel rendu, il ne fait rien.

### `src/pages/index.astro`
- `aggregateRating` porte désormais `"url": reviewsSource.url`.
- Le titre n'est plus passé en dur au composant, qui le choisit selon son état.

### `src/pages/5-accords-magiques.astro` — deux blocs fabriqués retirés
Cette page portait **deux** blocs que je n'avais pas vus en phase 0 :
- un bandeau avec deux photos de banque d'images en guise d'élèves et la mention
  « Téléchargé par plus de 80 000 guitaristes » — qui confond le nombre d'élèves formés avec un
  nombre de téléchargements du PDF, jamais mesuré. Remplacé par la note réelle et sa source ;
- une section entière « Ils ont transformé leur jeu grâce à ce guide » avec deux témoignages
  inventés (« Marie D., Débutante, 34 ans » ; « Thomas L., Étudiant, 22 ans ») illustrés par les
  mêmes photos stock. **Supprimée.**

⚠️ Le formulaire de capture de cette page n'a **pas** été touché — ni son markup, ni son POST
vers `/api/subscribe`. Seuls les blocs de preuve sociale au-dessus et en dessous ont bougé.

### `src/content/livres/40-chansons-francaises-et-hits-pop-rock.md`
Cette fiche portait trois témoignages signés **Marie Dubois, Thomas Martin** et Julie Lefebvre —
les noms exacts du lot confirmé fabriqué. `testimonials: []`, avec un commentaire expliquant
pourquoi.

### `src/pages/livres/[slug].astro`
L'`<aside>` « Ce qu'en pensent nos lecteurs » ne s'affiche plus quand la liste est vide (sinon
la fiche gardait un titre suivi de rien).

### Fichiers supprimés
- `src/components/Temoignages.astro` — composant mort (plus importé nulle part) qui générait
  en prime un `Review` daté avec `new Date()` au build : une date fabriquée à chaque déploiement.
- `public/images/marie.webp`, `thomas.webp`, `sophie.webp` — photos de banque d'images, plus
  référencées nulle part après ce lot.

## 2. Sortie brute des vérifications

`npm run build` → **Complete!**, 0 erreur.

```
$ grep -rl 'Marie Dubois\|Thomas Martin\|Sophie Laurent\|Julie Lefebvre\|Marie D\.\|Thomas L\.' \
    .vercel/output/static --include='*.html'
(liste vide)                                         OK

$ grep -rl 'marie\.webp\|thomas\.webp\|sophie\.webp' .vercel/output/static --include='*.html'
(liste vide)                                         OK

$ grep -c '<blockquote' .vercel/output/static/index.html
0            (avant : 3 témoignages)                 OK

$ grep -c 'Ce qu.en pensent nos lecteurs' \
    .vercel/output/static/livres/40-chansons-francaises-et-hits-pop-rock/index.html
0                                                    OK

$ grep -o '<h2 class=testimonials-title[^>]*>[^<]*' .vercel/output/static/index.html
<h2 class=testimonials-title …>La note de nos élèves

$ ligne de source rendue sur la home :
<a href=https://www.skilleos.com/expert/frederic-fieffe rel="noopener nofollow" target=_blank>
  929 avis vérifiés sur Skilleos</a><span class=rating-source-date>— relevé le 1er septembre 2026</span>

$ grep -o '"aggregateRating":{[^}]*}' .vercel/output/static/index.html
{"@type":"AggregateRating","ratingValue":"4.7","reviewCount":"929","bestRating":"5",
 "url":"https://www.skilleos.com/expert/frederic-fieffe"}
```

Les occurrences de `testimonial-card` qui subsistent dans `index.html` sont des **règles CSS**,
pas du HTML : le carrousel n'est plus rendu.

## 3. Ce qui n'a pas été fait, et pourquoi

### `itemReviewed` n'a pas été ajouté — volontairement
Le plan demandait un `itemReviewed` sur l'`aggregateRating`. Je ne l'ai pas mis : cet
`aggregateRating` est **déjà une propriété du nœud `EducationalOrganization`**, qui *est*
l'entité notée. Ajouter un `itemReviewed` reviendrait à déclarer un second nœud décrivant la
même organisation — redondant, et une source d'avertissements dans les outils de validation.
J'ai mis `url` à la place, qui rend la note vérifiable. Dis-moi si tu veux quand même `itemReviewed`.

### 58 témoignages non tranchés restent en ligne
C'est le sujet de la question ci-dessous. Je n'y ai pas touché parce que je n'ai pas de
confirmation qu'ils sont fabriqués, contrairement aux six retirés.

## 4. Suite donnée : les 54 témoignages des pages cours sont retirés

Fred a répondu le 1er septembre : les autres avis posent le même problème, il fournira de vrais
témoignages. Les **54 témoignages des 18 fiches `src/content/courses/*.md`** sont donc passés à
`testimonials: []`, avec un commentaire expliquant pourquoi dans chaque fichier.

Conséquences dans le rendu :
- **Plus aucun schema `Review` sur les pages cours** (`grep -rl '"@type":"Review"' … → 0`).
  Ces `Review` portaient en prime un `datePublished` égal à la date de publication du cours,
  c'est-à-dire une date d'avis fabriquée.
- Le témoignage mis en avant et le bloc des témoignages restants ne sont plus rendus.

### Un effet de bord rattrapé
La section 11 de `cours/[slug].astro` était **entièrement** enveloppée dans
`{remainingTestimonials.length > 0 && (…)}`. Vider les témoignages a donc d'abord fait
disparaître **aussi le bandeau de statistiques et les logos partenaires** (Hal Leonard,
LinkedIn Learning, Skilleos) des 18 pages cours — des signaux, eux, parfaitement légitimes.
Le garde ne couvre plus que le bloc des témoignages ; stats et partenaires sont revenus.

```
$ page /cours/apprendre-guitare-debutant/ après correction
  <section class=preuve-sociale        1   (revenue)
  élèves satisfaits                    1   (revenu)
  Ils nous font confiance              1   (revenu)
  testimonial-highlight-text           0   (retiré)
  aria-label=Témoignages               0   (retiré)
```

### Ce qui reste en ligne
Les **4 témoignages des fiches livres** (« Marie, maman d'Emma » ; « Seb, papa d'Ethan »
et 2 autres) : ils sonnent vrais — détails concrets, tournures naturelles — et rien n'indique
qu'ils appartiennent au lot fabriqué. Ils restent, à vérifier par Fred.

## 5. Décision qui te revient

**Q1 — Les notes par cours sont-elles réelles ?** *(nouvelle, découverte pendant ce lot)*

Chaque fiche cours porte son propre `ratingValue` / `reviewCount`, qui alimente un
`aggregateRating` par page : 4.7 sur **360** avis pour le ukulélé débutant, 4.6 sur **300** pour
la lecture de notes, 4.8 sur **220** pour les accords piano, 4.7 sur **180** pour la guitare
débutant… **Additionnés, ces décomptes dépassent largement les 929 avis de la source Skilleos.**

Si ces notes ne correspondent à aucun relevé, ce sont de fausses données structurées : Google
peut retirer les étoiles de **tout le site**, pas seulement des pages cours.

→ **Je n'y ai pas touché.** (a) elles viennent d'un export par cours → donne-moi la source ;
(b) elles sont estimées → je les remplace par la note globale sourcée ; (c) je retire
l'`aggregateRating` des pages cours et ne garde que celui de l'organisation.
→ *Sans réponse : rien ne bouge, mais le risque reste ouvert. Consigné dans `docs/seo/A-FAIRE.md`.*

Même question pour `preuveSociale.stats.students` — « 9 210 débutants » sur la page guitare.

**Q2 — Le lien Skilleos.** Il est en `rel="noopener nofollow"`, sur `/a-propos/`, la home et la
page `/5-accords-magiques/`. → *Sans réponse : je garde `nofollow`.*
