---
name: preflight-publication
description: Contrôle pré-vol avant de committer ou publier du contenu Musique Facile. À lancer quand l'utilisateur dit « avant de publier », « pré-vol », « vérifie l'article avant commit », « check crédibilité », « prêt à publier ? », ou via /preflight-publication. Valide le build, la crédibilité DGCCRF et les invariants de frontmatter, puis rend un verdict GO / NO-GO.
---

# Préflight publication — Musique Facile

Vérification avant commit/déploiement. Le repo n'a **ni linter ni tests** : `npm run build` est la seule validation automatique. Ce skill ajoute les contrôles métier que le build ne fait pas. Règles de fond (ne pas recopier) : `.claude/rules/contenu-credibilite.md`.

## Workflow

1. **Périmètre.** `git status --porcelain` puis `git diff --name-only`. Ne contrôler que `src/content/**`, `src/pages/**`, `content/lead-magnets/**`.
2. **Build (validation Zod).** Lancer `npm run build`. S'il échoue, STOP et reporter l'erreur de schéma (un frontmatter de content collection viole `src/content/config.ts`).
3. **Crédibilité DGCCRF.** Le hook `check-content-laws.sh` bloque déjà « essai gratuit » et « 2847 » et avertit sur fausses études / fausse rareté / ancienneté. Confirmer ici via `grep -inE` sur les fichiers contenu modifiés :
   - fausses études : `étude.*(MIT|Stanford|Harvard|Cambridge|CNRS|INSERM)`
   - fausse rareté : `plus que [0-9]+ places`, `dernières places`, compteurs
   - chiffres hors officiel : avis ≠ `929` (4,7/5), enseignement ≠ `15 ans`, élèves `80 000+`, musicien `40+ ans`
   Toute occurrence = à corriger ou à sourcer.
4. **Invariants frontmatter blog.** Pour chaque `.md` de `src/content/blog/` modifié : `prod:` présent ; si publication voulue, `prod: "Y"` ET `datePublished` ≤ aujourd'hui ; `siloSlug`/`pillar` cohérents.
5. **Secrets.** Confirmer qu'aucun `xkeysib-…`, `BREVO_API_KEY=…` ni `.env` n'est en staging (le hook `check-no-secrets.sh` bloque au commit ; on vérifie tôt).

## Output

Un tableau de verdict :

| Contrôle | Résultat | Détail |
|---|---|---|
| Build | ✅ / ❌ | … |
| Crédibilité DGCCRF | ✅ / ⚠ | occurrences |
| Frontmatter blog | ✅ / ❌ | champs manquants |
| Secrets | ✅ / ❌ | … |

Puis **Verdict : GO / NO-GO**, suivi du rappel : tout nouveau contenu reste un **BROUILLON à valider par Fred** avant mise en ligne.
