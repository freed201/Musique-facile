# Checklist SEO — sous-domaine `ecole.musique-facile.fr`

> **Statut : BROUILLON à valider par Fred.** Document d'analyse et de marche à suivre, produit lors de l'audit GSC du 16 juillet 2026 (lot 7). Le sous-domaine **n'est pas dans ce dépôt** : il est hébergé par une plateforme tierce. Aucun correctif n'est donc applicable par un commit ici.

## Ce qui a été constaté (juillet 2026)

Le sous-domaine héberge la plateforme de cours. Google y explore des URLs sans valeur de référencement, et la GSC y signale **67 vidéos détectées non indexées**.

État relevé en direct :

| Constat | Détail |
|---|---|
| Plateforme | **Podia** (cookies `_podia_session` / `_podia_storefront_visitor_id`, routeur Heroku, CDN Cloudflare) |
| `robots.txt` | Réduit à `User-agent: *` + `Allow: /`. Aucune exclusion. |
| `sitemap.xml` | Absent (302). Podia [ne génère pas de sitemap](https://help.podia.com/en/articles/11370261-seo-in-podia). |
| Balise `<meta name="robots">` | Aucune sur la home ni sur les pages de vente. |
| En-tête `X-Robots-Tag` | Aucun. |

## Le point contre-intuitif : le robots.txt cible n'est pas la bonne réponse

L'audit proposait, à défaut de réglage plateforme, un robots.txt avec `Disallow: /view/`, `Disallow: /content-assets/`, `Disallow: /*/buy`. **Deux raisons de ne pas s'arrêter là**, vérifiées :

**1. Ces URLs ne sont déjà pas indexables.** Testées sans authentification, c'est-à-dire exactement ce que voit Googlebot :

```
/view/courses/cours-guitare-debutant   → 302 vers /p/products/cours-guitare-debutant
/cours-guitare-debutant/buy            → 302 vers /checkout/cart
/content-assets/public/                → 400
/cours-guitare-debutant                → 200  (page de vente, à garder indexable)
```

Googlebot ne voit donc jamais le contenu d'une leçon : il est redirigé. Les « 67 vidéos non indexées » de la GSC ne sont pas une anomalie à corriger, c'est le **comportement attendu** : Google a découvert les URLs et constaté qu'elles redirigent. Le seul coût réel est du **budget de crawl gaspillé**, pas une fuite de contenu ni une pénalité.

**2. `Disallow` ne désindexe pas — et empêche même de désindexer.** `robots.txt` pilote le *crawl*, pas l'*index*. Une URL bloquée peut rester ou apparaître dans les résultats si des liens externes pointent vers elle, sans snippet. Pire : une page bloquée par `robots.txt` ne peut plus être lue par Googlebot, qui **ne verra jamais un `noindex`** posé dessus. Combiner `Disallow` et `noindex` sur la même URL est donc auto-annulant ([Google Search Central](https://developers.google.com/search/docs/crawling-indexing/block-indexing)).

**Conséquence pratique :** si une page est déjà indexée à tort, il faut la laisser crawlable et lui poser un `noindex`. Le `Disallow` ne se justifie que pour des URLs *jamais indexées* dont on veut seulement économiser le crawl — ce qui est précisément le cas ici.

## Ce qu'il faut chercher dans Podia

### 1. Réglage par page (existe, documenté)

**Chemin exact :** Admin → **Website** → icône de réglages en face de la page → menu de gauche → section **Marketing** → **Search engine visibility**.

Le toggle désactivé retire la page des résultats Google/Bing/Yahoo. Attention à sa portée : il s'applique **page par page**, aux pages du site builder — **pas** aux pages de leçons (`/view/...`), ni aux pages `/buy`, ni aux assets.

À passer en revue : toute page du site builder qui doublonne le site principal (pages de vente redondantes avec `musique-facile.fr/cours/...`, pages de remerciement, pages de test).

### 2. Réglage global (n'existe pas)

Il n'y a **pas** de réglage de visibilité site-wide chez Podia, ni de `robots.txt` éditable par le créateur ([doc Podia](https://help.podia.com/en/articles/11370261-seo-in-podia)). Les contrôles offerts se limitent aux titres, meta descriptions, URLs, ALT d'images et niveaux de titres.

**À vérifier auprès du support Podia** (ce sont les seules questions qui débloqueraient vraiment le sujet) :
- Le `robots.txt` du sous-domaine peut-il être personnalisé sur une offre payante ?
- Un `X-Robots-Tag` ou un `noindex` peut-il être appliqué aux pages `/view/...` et `/checkout/...` ?
- Pourquoi aucun `sitemap.xml` n'est généré, et est-ce prévu ?

## Le robots.txt cible, si Podia le permet un jour

À n'appliquer **que** si le support confirme que le fichier est éditable. Objectif : économiser du budget de crawl sur des URLs qui redirigent de toute façon. Rédigé en un seul groupe `*`, pour la même raison que sur le site principal (RFC 9309 — un robot qui trouve un groupe à son nom ignore le groupe générique, cf. lot 1) :

```
# robots.txt - ecole.musique-facile.fr

User-agent: *
Allow: /

# Espace membre : redirige déjà vers la page produit pour les non-connectés.
# Bloqué ici uniquement pour économiser le budget de crawl.
Disallow: /view/
Disallow: /content-assets/
Disallow: /*/buy
Disallow: /checkout/
```

⚠️ **Ne pas ajouter de `Disallow` sur une page qu'on veut désindexer.** Pour celles-là, utiliser le toggle « Search engine visibility » et laisser Google la crawler jusqu'à ce qu'elle disparaisse de l'index.

## Ce qu'il ne faut surtout pas bloquer

Les pages de vente en racine (`/cours-guitare-debutant`, `/cours-rythmique-ukulele`, etc.) répondent **200** et sont légitimement indexables. Ce sont elles qui convertissent. Un `Disallow: /` global ou trop large sur le sous-domaine leur couperait toute visibilité.

## Ordre de priorité conseillé

1. **Rien d'urgent.** Le sujet est un gaspillage de crawl, pas une fuite ni une pénalité. Le sous-domaine ne concurrence pas `musique-facile.fr` sur les requêtes cibles.
2. Passer en revue le toggle « Search engine visibility » des pages du site builder qui doublonnent le site principal (30 min).
3. Poser les 3 questions ci-dessus au support Podia. Appliquer le robots.txt cible seulement si la réponse est positive.
4. Ignorer les « 67 vidéos non indexées » de la GSC : c'est le comportement normal d'un espace membre.

## Sources

- [Editing page settings — Podia Help Center](https://help.podia.com/en/articles/11370978-editing-page-settings) (chemin du toggle « Search engine visibility »)
- [SEO in Podia — Podia Help Center](https://help.podia.com/en/articles/11370261-seo-in-podia) (absence de sitemap, contrôles disponibles)
- [Block Search Indexing with noindex — Google Search Central](https://developers.google.com/search/docs/crawling-indexing/block-indexing) (`Disallow` empêche Google de voir un `noindex`)
- [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) (règle de sélection du groupe `User-agent`)
