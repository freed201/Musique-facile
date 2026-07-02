---
name: contenu-credibilite
description: Lois de crédibilité du contenu Musique Facile — chiffres officiels et mentions interdites (risque DGCCRF). À consulter avant toute rédaction ou édition de contenu marketing/éditorial.
metadata:
  type: project
---

# Crédibilité du contenu — lois Musique Facile

Le contenu public engage la responsabilité légale (DGCCRF) et la confiance. Ces règles sont **non négociables**. BROUILLON à valider par Fred.

## Chiffres officiels (ne jamais inventer ni gonfler)
- Avis : **4,7/5 sur 929 avis** — JAMAIS 2847 (ancien chiffre erroné, corrigé partout).
- Fred Fieffé : **musicien 40+ ans**, **15 ans d'enseignement** (pas 35, pas 20), **80 000+ élèves**.
- Toute statistique publiée doit être sourçable ; pas de chiffre « décoratif » inventé.

## Mentions interdites
- **« essai gratuit »** : interdit. Le modèle est **paiement unique, accès à vie, garantie 15 jours remboursé** — il n'y a PAS d'essai gratuit.
- **Fausse rareté / fausse urgence** (« plus que X places », compteurs) : interdit (pratique trompeuse, DGCCRF). Les composants UrgencyBanner / FOMONotifications ont été supprimés — ne pas les recréer.
- **Fausses études / citations inventées** (« étude MIT/Stanford… » non vérifiable) : interdit. Toute citation doit être attribuée et vérifiable.

## Garde-fou
Le hook PreToolUse `.claude/hooks/check-content-laws.sh` (matcher Write|Edit, limité à `src/content/**` et `src/pages/**`) BLOQUE (exit 2) l'écriture de « essai gratuit » et de « 2847 ». Les autres règles (fausse rareté, fausses études) restent en vérification humaine / revue — étendre le hook si un motif récurrent apparaît.
