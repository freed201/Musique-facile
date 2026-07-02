# Cohérence des en-têtes de sécurité — Musique Facile

Les en-têtes de sécurité (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) sont définis à **deux endroits** dans le repo. Cette règle fixe la source de vérité — sinon les deux divergent silencieusement (c'est **déjà le cas**). BROUILLON à valider par Fred.

## Source de vérité : `vercel.json > headers`
- En production (Vercel), les en-têtes appliqués à **toutes les réponses** viennent de `vercel.json > headers` (`source: "/(.*)"`). C'est la **seule** source réellement live.
- Toute modification de CSP / sécurité se fait **ici en premier**.

## ⚠️ Le middleware Astro n'est PAS enregistré (dette à trancher)
- `src/utils/middleware/security.ts` exporte un `onRequest` qui applique `src/utils/security.ts`. MAIS Astro ne charge un middleware que depuis `src/middleware.ts` (ou `src/middleware/index.ts`). Ce fichier **n'existe pas** → le middleware n'est **jamais exécuté**, et la CSP de `security.ts` (qui diverge déjà de `vercel.json`) est **morte**.
- **Décision à valider par Fred** : soit **(a)** enregistrer le middleware (`src/middleware.ts` ré-exportant `onRequest`) ET aligner sa CSP sur `vercel.json` ; soit **(b)** supprimer `security.ts` + le middleware mort et acter `vercel.json` comme source unique. Tant que ce n'est pas tranché, **ne pas se fier à `security.ts`**.

## Règle pratique
- Modifier la CSP → éditer `vercel.json`. Si l'option (a) est un jour retenue, répliquer **à l'identique** dans `security.ts`.
- Ne jamais ajouter une source d'en-têtes via `public/_headers` : Vercel **ignore** ce format Netlify (cf. CLAUDE.md).

## Garde-fou
Le hook PreToolUse `.claude/hooks/check-csp-sync.sh` (matcher `Write|Edit`) **avertit** (exit 0, non bloquant) à chaque édition de `vercel.json` ou `src/utils/security.ts` : rappel de la source de vérité et de la 2e définition. La cohérence exacte des deux CSP reste une **revue humaine** (deux formats non comparables mécaniquement).