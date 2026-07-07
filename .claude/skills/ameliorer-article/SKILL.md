---
name: ameliorer-article
description: Met à niveau un article de blog Musique Facile existant vers le standard « article parfait » (structure GEO, maillage, métadonnées, fact-checking). À lancer quand l'utilisateur dit « améliore cet article », « mets à niveau … », « remise à niveau du blog », « traite le backlog legacy », « corrige les H1 / le HTML inline », ou via /ameliorer-article. C'est l'outil des lots de remise à niveau des articles legacy 2024-2025.
---

# Améliorer un article existant — Musique Facile

Mise à niveau d'un article de `src/content/blog/` vers le standard `.claude/rules/article-parfait.md` (le lire, ne pas le recopier). Règles de fond : `.claude/rules/contenu-credibilite.md`. Travailler sur branche dédiée, jamais sur `master`.

## Workflow

1. **Diagnostic.** `npm run blog:quality <slug>` : lister les erreurs (bloquantes) et avertissements. Pour un lot : `npm run blog:quality -- --all --json` puis choisir les articles à traiter (proposer l'ordre à Fred : erreurs d'abord, puis articles à fort trafic/silo).
2. **Corrections mécaniques** (ne changent pas le fond) :
   - H1 dans le corps (`^# `) → convertir en H2 ou supprimer (le layout génère le H1 depuis `title`).
   - HTML inline (`<div>`, `<style>`, menus maison) → Markdown pur + blocs `::: info|tip|warning` (plugin remark).
   - URLs absolues `https://musique-facile.fr/...` → chemins relatifs.
   - Champs legacy `meta`/`keywords` → supprimer ; compléter `instrument`/`category`/`level`/`tags` (3-6).
   - Liens morts → re-pointer vers un article publié équivalent (vérifier `prod: "Y"`).
3. **Enrichissement éditorial** (change le fond — c'est lui qui justifie un nouveau `dateModified`) :
   - `introduction` answer-first (40-70 mots) si absente ; premier H2 « En bref » avec synthèse en liste.
   - ≥1 H2 reformulé en question ; passages rendus auto-suffisants.
   - Maillage : ≥2 liens internes relatifs, dont le pilier pour un satellite.
   - `faqs[]` (≥3) pour piliers et guides d'achat ; sinon vérifier que l'AutoFAQ générique convient.
   - Ne PAS ajouter de capture email (InlineOptIn est injecté automatiquement).
4. **Fact-checking.** Pour tout article dont le fond a été touché (ou dont les faits n'ont jamais été vérifiés) : lancer l'agent **article-reviewer** sur le fichier. Corriger les points 🔴 bloquants, arbitrer les 🟠 avec Fred si besoin.
5. **dateModified sincère.** Mettre à jour `dateModified` **uniquement** si l'étape 3 ou 4 a modifié le fond. Une correction purement mécanique (étape 2) ne justifie pas de bump. Ne jamais faire de mise à jour de masse des dates.
6. **Contre-vérification.** `npm run blog:quality <slug>` doit passer sans erreur. Puis **/preflight-publication** (build Zod + DGCCRF + secrets) avant commit.
7. **Commit par lot cohérent** (ex. « lot 1 : H1 legacy guitare ») + PR. Si un article amélioré est un pilier renommé/ajouté : mettre à jour `public/llms.txt`.

## Output

- Par article : erreurs avant → après (`blog:quality`), résumé des changements de fond, verdict article-reviewer.
- Rappel : **toute modification de fond reste un BROUILLON à valider par Fred**.
