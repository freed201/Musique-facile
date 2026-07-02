---
name: docs-historiques-obsoletes
description: Le référentiel docs/1-…9 (janv. 2026) décrit une stack Netlify + ActiveCampaign périmée — la réalité est Vercel + Brevo
type: project
---

Le référentiel numéroté `docs/1-…` à `docs/9-…` (v1.0, 2026-01-19) décrit encore **Netlify + ActiveCampaign** et un script `npm run generate-sitemap` qui n'existe plus (le sitemap est la route `src/pages/sitemap.xml.ts`). La réalité depuis mai 2026 : **Vercel + Brevo**. Des bandeaux ⚠️ ont été ajoutés en tête de ces fichiers en juillet 2026.

**Why:** Suivre aveuglément ces docs ferait recréer des configs Netlify ou des intégrations ActiveCampaign mortes.

**How to apply:** Pour les processus opérationnels, se fier à `CLAUDE.md`, `docs/vercel-checklist.md`, `docs/BREVO_SETUP.md`, `docs/EMAIL_SEQUENCES.md` (à jour). Les docs 1-9 restent valables pour les concepts (silos SEO, funnel) mais pas pour l'outillage.
