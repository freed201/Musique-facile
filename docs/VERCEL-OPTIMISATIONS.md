# Optimisations Vercel — musique-facile.fr

## Contexte

> **⚠️ Ces optimisations ne sont PAS un enjeu de coût. Ne pas se tromper de motivation.**

Audit de consommation du 20/07/2026 : le site consomme **~5 Go/mois de transfert**, très loin des limites du plan (Hobby = 100 Go, Pro = 1 To). Le poste dominant est la bande passante statique (images + HTML + PDF), pas le compute : **une seule** fonction serverless (`_render.func`), peu appelée. Aucun fichier audio ni vidéo n'est servi par Vercel (tout est en iframe Vimeo/YouTube/Ausha).

**La facture n'est donc pas le problème.** Les chantiers ci-dessous visent uniquement la **vitesse de chargement** (Core Web Vitals, LCP) et le **SEO/GEO**. Si un jour on hésite à les prioriser « pour économiser », c'est un faux motif : le gain est en performance et en référencement, pas en euros.

Hypothèse de trafic retenue pour l'audit (ajustable) : ~30 000 pages vues/mois, ~500 téléchargements de lead magnet/mois, ~1 500 soumissions de formulaire/mois.

---

## Chantiers ouverts

Par ordre de priorité. Statut à tenir à jour en tête de chaque bloc.

### 1. Pages landing en SSR inutile → statique

- **Statut :** À FAIRE
- **Fichiers :** `src/pages/guides/[slug].astro`, `src/pages/merci-lead-magnet.astro`
- **Problème :** ces deux pages portent `export const prerender = false` et passent donc par la fonction serverless `_render.func` **à chaque vue**. Or leur contenu vient d'un **catalogue codé en dur** dans le fichier (aucune donnée dynamique, aucun corps de requête lu). Résultat : une invocation de fonction + aucune mise en cache CDN pour des pages qui n'en ont pas besoin. Ce sont les **pages qui convertissent** (landing lead magnet, page de remerciement) — elles devraient être servies froides depuis l'edge.
- **Action :** retirer `export const prerender = false` et exposer les slugs via `getStaticPaths()` (itérer sur les clés du catalogue déjà présent dans chaque fichier). Vérifier que `merci-lead-magnet` fonctionne sans query param dynamique (sinon, générer une variante par instrument).
- **Vérification :** après `npm run build`, `.vercel/output/functions/_render.func` ne doit **plus** router `/guides/*` ni `/merci-lead-magnet` (contrôler `.vercel/output/config.json`) ; les pages doivent apparaître en HTML statique dans `.vercel/output/static/guides/*/index.html` et `.vercel/output/static/merci-lead-magnet/index.html`.

### 2. Cache-Control immutable sur les PDF lead magnets

- **Statut :** À FAIRE
- **Fichiers :** `vercel.json` (bloc `headers`)
- **Problème :** les 3 PDF (`/lead-magnets/*.pdf`, 1,4–1,6 Mo chacun) sont servis **sans en-tête de cache** : seuls `/assets`, `/fonts` et `/images` bénéficient de la règle immutable. Chaque téléchargement retransfère le fichier entier, sans mutualisation navigateur/CDN.
- **Action :** ajouter une règle `headers` pour `/lead-magnets/(.*)` avec `Cache-Control: public, max-age=31536000, immutable` (calquée sur les règles existantes `/assets`, `/fonts`, `/images`). Une seule entrée. Les PDF sont régénérés sous le même nom de fichier ; si un contenu change, prévoir un cache-buster dans le nom au moment de la régénération.
- **Vérification :** `curl -I https://musique-facile.fr/lead-magnets/guitare-5-accords-magiques.pdf` doit renvoyer `Cache-Control: public, max-age=31536000, immutable`.

### 3. Recompression des ~20 images les plus lourdes

- **Statut :** À FAIRE
- **Fichiers :** `public/images/**` (dont `public/images/blog/jouer-clandestino-guitare-tutoriel.webp` 508 Ko, `public/images/stage-ukulele-juillet-2026-groupe.webp` 244 Ko, `public/images/stage-ukulele-juillet-2026-fun.webp` 224 Ko, `public/images/blog/apprendre-perfect-guitare.webp` 216 Ko, `public/images/prof/yannis.webp` 172 Ko), pipeline `scripts/convert-to-webp.js` (`npm run optimize-images`)
- **Problème :** une poignée de WebP sont anormalement lourds (jusqu'à 508 Ko) — soit une largeur source bien supérieure à la largeur d'affichage réelle, soit une qualité trop haute. Ils pèsent sur le LCP du premier chargement (poste image = plus gros du transfert).
- **Action :** repérer les ~20 images les plus lourdes (`find public/images -iname '*.webp' -exec du -h {} + | sort -rh | head -20`), les **redimensionner à la largeur d'affichage réelle** (largeur max du conteneur, généralement ≤ 1024–1280 px) et réencoder en **qualité 75–80**. Cible : **60–120 Ko/image** sans perte visible. **Toujours au build / hors ligne, jamais en optimisation runtime** (cf. Règles permanentes).
- **Vérification :** aucune image de `public/images` ne dépasse ~120 Ko (`find … | sort -rh | head`) ; contrôle visuel des pages concernées (pas de flou perceptible) ; LCP stable ou amélioré au Lighthouse.

### 4. `inlineStylesheets: 'always'` → `'auto'`

- **Statut :** À FAIRE
- **Fichiers :** `astro.config.mjs` (`build.inlineStylesheets`)
- **Problème :** tout le CSS est inliné dans **chacune des 175 pages** (HTML de 144–312 Ko), et le HTML est servi en `max-age=0`. Un lecteur qui enchaîne plusieurs articles retélécharge le même CSS à chaque page ; le CSS n'est jamais mutualisable/cacheable.
- **Action :** passer à `'auto'` — Astro n'inline alors que le CSS critique et externalise le reste en un fichier caché immutable, allégeant chaque réponse HTML. **Ne pas appliquer à l'aveugle :** c'est un arbitrage **LCP (render-blocking d'un CSS externe) contre poids/transfert**. À valider par un **Lighthouse avant/après** (mobile) sur homepage + une page cours + un article blog. Si le LCP régresse nettement, conserver `'always'` ou envisager un compromis ciblé.
- **Vérification :** Lighthouse mobile avant/après documenté (LCP, poids transféré) ; les pages HTML de `.vercel/output/static/**` doivent être sensiblement plus légères ; un fichier CSS externe caché immutable apparaît dans `.vercel/output/static/assets/`.

---

## Règles permanentes

- **Aucun fichier audio ou vidéo servi depuis Vercel.** Tout passe par iframe (Vimeo pour les cours, YouTube, podcast Ausha). À maintenir : ne jamais déposer de `.mp3/.mp4/.wav/.webm` dans `public/`.
- **Pas d'optimisation d'images au runtime.** Vercel Image Optimization est désactivée (aucune clé `images` dans le `config.json` généré) et doit le rester : toute conversion/recompression se fait **au build** (sharp via `astro:assets` / `astro-compress`) ou hors ligne (`npm run optimize-images`). Activer l'optimisation runtime ajouterait un coût là où il n'y en a aucun.
- **Les sous-domaines `school.` et `ecole.` pointent sur Podia, hors Vercel.** Vérifier la délégation DNS **avant tout transfert de projet ou de team** Vercel : ne pas casser ces enregistrements (checkout/école = business critique).
