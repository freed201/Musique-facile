---
name: campagne-geo
description: Lance une campagne d'audit GEO multi-pages sur musique-facile.fr — audite plusieurs URLs via l'agent geo-auditor, archive captures et rapports dans seo-audit/, produit une synthèse comparative datée. À lancer quand l'utilisateur dit « campagne GEO », « audite le silo ukulélé », « où en est notre citabilité LLM », « refais les tests Perplexity », ou via /campagne-geo. Pour une seule URL, invoquer directement l'agent geo-auditor.
---

# Campagne GEO — Musique Facile

Orchestration d'audits GEO (citabilité LLM + visibilité Google) sur plusieurs pages. L'analyse unitaire est déléguée à l'agent **`geo-auditor`** (`.claude/agents/geo-auditor.md`) — ce skill cadre la campagne, archive et synthétise.

## Workflow

1. **Cadrer la campagne.** Avec l'utilisateur : quel périmètre ? (un silo — ex. tous les articles `siloSlug: <pilier>` —, les 4 piliers, les guides d'achat, ou une liste d'URLs). Lister les URLs publiées correspondantes (frontmatter `prod: "Y"`, slug → `https://www.musique-facile.fr/blog/<slug>/`).
2. **Définir les requêtes cibles** par page (2-3 par URL) : la requête principale de l'article + ses variantes conversationnelles (« comment débuter le ukulélé », « meilleur ukulélé débutant 2026 »…). S'appuyer sur `docs/4-seo-geo-ciblage-strategie.md` pour le mapping.
3. **Auditer** : lancer l'agent `geo-auditor` sur chaque URL (en parallèle si plusieurs). Lui transmettre : l'URL, les requêtes cibles, et le rappel « captures dans `seo-audit/captures/`, nommage `AAAA-MM-JJ-<sujet>-<source>.png` ».
4. **Archiver** : enregistrer chaque rapport d'agent dans `seo-audit/rapports/AAAA-MM-JJ-<slug>.md` (le dossier `seo-audit/` est gitignoré — archives locales).
5. **Synthétiser** dans `seo-audit/rapports/AAAA-MM-JJ-synthese-<campagne>.md` :
   - tableau : URL × score par dimension (D1-D8 du geo-auditor) × cité par Perplexity/Google AI (oui/non) ;
   - top 5 des actions transverses (les problèmes qui reviennent sur plusieurs pages) ;
   - **comparaison avec la campagne précédente** s'il existe un rapport antérieur dans `seo-audit/rapports/` (progrès / régressions).

## Output

- Chemins des rapports archivés + la synthèse complète dans la réponse.
- Actions priorisées P0/P1/P2. Les corrections de contenu qui en découlent passent par les flux normaux (/nouvel-article ou édition + /preflight-publication) — jamais de correction directe pendant la campagne.
