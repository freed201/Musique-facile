---
name: outillage-claude-juillet-2026
description: Refonte du .claude/ (juillet 2026) — 5 hooks actifs, 6 skills, artefacts d'audit dans seo-audit/
type: project
---

Refonte du `.claude/` faite le 2026-07-02 : les 5 hooks PreToolUse sont **réellement enregistrés** dans `.claude/settings.json` (avant, seuls content-laws et no-secrets l'étaient — protect-master, csp-sync et img-alt étaient des garde-fous fantômes). Skills disponibles : `/nouvel-article`, `/preflight-publication`, `/audit-blog`, `/check-deploiement`, `/campagne-geo`, `/brevo-sequence`. Les captures/rapports d'audit vont dans `seo-audit/` (gitignoré), jamais à la racine (~50 PNG historiques y ont été déplacés depuis la racine).

**Why:** Savoir quels garde-fous sont réellement actifs évite de croire à une protection inexistante ou de re-diagnostiquer.

**How to apply:** Si un hook bloque (exit 2), c'est voulu — adapter l'action, ne pas contourner. Pour les tâches récurrentes (diagnostic blog, post-deploy, GEO, Brevo), utiliser le skill dédié plutôt que refaire à la main.
