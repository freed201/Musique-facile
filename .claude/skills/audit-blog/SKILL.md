---
name: audit-blog
description: Diagnostique l'état des ~100 articles du blog Musique Facile — articles invisibles, silos cassés, frontmatter incomplet, doublons. À lancer quand l'utilisateur dit « audit du blog », « pourquoi cet article ne s'affiche pas », « état des silos », « articles manquants », « check le blog », ou via /audit-blog. Produit un tableau priorisé des problèmes, ne modifie rien sans accord.
---

# Audit du blog — Musique Facile

Diagnostic en lecture seule de `src/content/blog/*.md`. Le schéma Zod fait foi (`src/content/config.ts`, collection `blog`). Rappel des règles de publication : un article n'est public que si `prod: "Y"` **ET** `datePublished ≤ aujourd'hui` (filtre dans `blog/[slug].astro` et les index).

## Workflow

1. **Visibilité.** Lancer `npm run blog:analyze` (= `node scripts/analyze-blog-articles.js`) : classe les articles en visibles / cachés (`prod: "N"`, `prev`, `datePublished` futur) / erreurs de parsing. Reporter les comptes et les listes.
2. **Silos.** Pour chaque article : si `siloSlug` est présent, vérifier que le pilier cible existe (`src/content/blog/<siloSlug>.md`) et porte `pillar: true`. Signaler : `siloSlug` orphelin, pilier sans aucun article rattaché, article sans silo (ni `pillar` ni `siloSlug`).
3. **Frontmatter CRO/SEO.** Signaler par article visible : `leadMagnet` absent (capture email InlineOptIn non ciblée), `image`/`ogImage` absent, `description` absente ou > 160 caractères, `faqs[]` absent sur les piliers et guides d'achat (`products[]` présent).
4. **Doublons & incohérences.** Titres quasi identiques (même sujet traité deux fois), `datePublished` > `dateModified`, slugs très proches.
5. **Crédibilité (échantillon).** `grep -rinE "essai gratuit|2847|plus que [0-9]+ places" src/content/blog/` — doit être vide (filet au-delà du hook, qui ne protège que les écritures futures).

## Output

Un tableau priorisé :

| Priorité | Problème | Articles concernés | Action proposée |
|---|---|---|---|
| P0 | article voulu public mais invisible | … | corriger `prod`/date |
| P1 | silo cassé | … | corriger `siloSlug` / rattacher |
| P2 | frontmatter incomplet | … | compléter |

Puis les comptes globaux (visibles / cachés / erreurs). **Ne rien corriger sans validation de Fred** — proposer les corrections, appliquer sur demande, puis /preflight-publication avant commit.
