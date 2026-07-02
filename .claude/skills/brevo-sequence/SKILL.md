---
name: brevo-sequence
description: Gère les templates et séquences email Brevo de Musique Facile via le MCP Brevo — création/mise à jour de templates depuis docs/EMAIL_SEQUENCES.md, inspection des listes/segments, envoi de tests. À lancer quand l'utilisateur dit « mets à jour la séquence email », « crée le template J+3 », « état des listes Brevo », « envoie-moi un test », ou via /brevo-sequence. Jamais d'envoi de campagne réelle sans confirmation explicite.
---

# Séquences email Brevo — Musique Facile

Gestion de l'email marketing via les outils MCP Brevo (`mcp__claude_ai_Brevo__*` — charger via ToolSearch). Sources de vérité : `docs/EMAIL_SEQUENCES.md` (12 templates HTML « ton Fred », séquences J+1/J+3/J+7/J+14 par lead magnet), `docs/BREVO_SETUP.md` (listes, attributs, automations). Les emails J0 transactionnels vivent dans le code (`src/pages/api/_lead-magnet-emails.ts`) — ne pas les dupliquer côté Brevo.

## Garde-fous (NON négociables)

- **Jamais d'envoi de campagne réelle** ni d'activation d'automation sans confirmation explicite de Fred dans la conversation.
- **Tout template créé/modifié → email de test d'abord** via `templates_send_test_template` à **f.fieffe@gmail.com**, et attendre le retour de Fred.
- **Ne jamais modifier ni supprimer des contacts** ; la liste `BREVO_LIST_STAGE_2026` est isolée (RGPD) — n'y toucher sous aucun prétexte.
- Contenu des emails soumis aux règles `.claude/rules/contenu-credibilite.md` : chiffres figés (4,7/5 sur 929 avis, 15 ans d'enseignement, 80 000+ élèves), pas d'« essai gratuit », pas de fausse urgence. Le code promo officiel des séquences est `MAGIQUE15`.
- Jamais de clé API en clair dans le repo ou la conversation (le hook `check-no-secrets.sh` bloque les commits fautifs).

## Workflow

1. **État des lieux** : `lists_get_lists`, `segments_get_segments`, `templates_get_smtp_templates` → cartographier l'existant côté Brevo et le comparer à `docs/EMAIL_SEQUENCES.md` (templates manquants, obsolètes, divergents).
2. **Créer / mettre à jour** les templates demandés avec `templates_create_smtp_template` : HTML repris de `EMAIL_SEQUENCES.md`, adapté si Fred le demande. Nommage clair : `MF — <lead magnet> — J+<n> — <objet court>`. Sender = celui validé dans `senders_get_senders`.
3. **Tester** : `templates_send_test_template` vers f.fieffe@gmail.com. Lister ce qui a été envoyé et à quoi Fred doit être attentif (affichage mobile, liens PDF, code promo).
4. **Documenter** : si le contenu d'un template diverge désormais de `docs/EMAIL_SEQUENCES.md`, proposer la mise à jour du doc (même PR de contenu).
5. **Activation** : la connexion template ↔ automation (workflows J+1/J+3/…) se fait dans le dashboard Brevo par Fred — fournir la checklist exacte des étapes restantes (cf. `docs/BREVO_SETUP.md`).

## Output

- Tableau : template × statut (créé / mis à jour / test envoyé / en attente de validation Fred).
- Écarts constatés entre Brevo et `EMAIL_SEQUENCES.md`.
- Checklist des actions manuelles restantes dans le dashboard.
