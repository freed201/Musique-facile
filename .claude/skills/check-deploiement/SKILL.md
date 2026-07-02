---
name: check-deploiement
description: Vérifie un déploiement Vercel de musique-facile.fr après un merge sur master — statut du build, erreurs runtime, puis contrôle live des pages clés (200, SEO, JSON-LD, GTM, en-têtes de sécurité). À lancer quand l'utilisateur dit « vérifie le déploiement », « check le deploy », « la prod est-elle OK ? », « post-deploy », ou via /check-deploiement. Encode docs/vercel-checklist.md.
---

# Check déploiement — Musique Facile

Vérification post-déploiement (master = prod, déploiement auto Vercel sur push). Read-only : aucun redéploiement ni rollback sans accord explicite de Fred.

## Workflow

1. **Statut Vercel** (MCP Vercel — charger via ToolSearch si besoin) :
   - `list_deployments` → dernier déploiement production : état (READY/ERROR), commit associé.
   - Si ERROR : `get_deployment_build_logs` et reporter l'erreur (penser au postbuild `patch-vercel-runtime.mjs` — un build sans lui casse le runtime Node).
   - `get_runtime_errors` / `get_runtime_logs` sur les dernières heures : erreurs des Vercel Functions (`/api/subscribe`, `/api/contact`, `/api/stage-inscription`).
2. **Pages clés live** (Playwright ; fallback `curl` + WebFetch) — échantillon : `https://www.musique-facile.fr/` , une page cours (`/cours/guitare-debutant` ou équivalente), un article blog récent, `/ressources-gratuites`, `/blog`. Pour chacune :
   - HTTP 200 (et redirection www/apex correcte) ;
   - `<title>`, `meta description`, `link rel="canonical"` présents ;
   - JSON-LD présent (`script[type="application/ld+json"]`) et parseable ;
   - **GTM ne se charge PAS avant consentement** (ConsentManager/tarteaucitron) — aucune requête `googletagmanager.com` au premier chargement sans interaction ;
   - pas d'erreur console bloquante.
3. **En-têtes** : `curl -sI https://www.musique-facile.fr/` → vérifier CSP, HSTS, X-Frame-Options, Referrer-Policy (source de vérité : `vercel.json > headers`, cf. `.claude/rules/coherence-en-tetes-securite.md`) ; sur un asset de `/_astro/`, cache `immutable` 1 an.
4. **Sitemap & robots** : `/sitemap.xml` répond 200 et contient les nouvelles URLs attendues ; `/robots.txt` et `/llms.txt` répondent 200.

## Output

| Contrôle | Résultat | Détail |
|---|---|---|
| Build Vercel | ✅ / ❌ | commit, durée |
| Erreurs runtime API | ✅ / ⚠ | … |
| Pages clés (5) | ✅ / ❌ | par page |
| GTM après consentement | ✅ / ❌ | … |
| En-têtes sécurité + cache | ✅ / ⚠ | … |
| Sitemap / robots / llms.txt | ✅ / ❌ | … |

Puis **Verdict : PROD OK / À CORRIGER** avec les actions proposées. Captures éventuelles dans `seo-audit/captures/` (jamais à la racine).
