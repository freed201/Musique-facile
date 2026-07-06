# Article parfait — standard éditorial du blog Musique Facile

Source de vérité du standard qualité d'un article de blog (`src/content/blog/*.md`). Les skills (`/nouvel-article`, `/ameliorer-article`, `/preflight-publication`, `/audit-blog`), l'agent `article-reviewer` et le script `npm run blog:quality` appliquent CE document — ils ne le recopient pas. Les lois de crédibilité (chiffres officiels, mentions interdites DGCCRF) restent dans `.claude/rules/contenu-credibilite.md` et priment sur tout. BROUILLON à valider par Fred.

Fondements : recherche GEO/SEO 2026 (Search Engine Land, llmrefs — answer-first, densité factuelle, fraîcheur ≤3 mois, listes/stats sourcées = +30-40 % de visibilité IA) croisée avec la grille D1-D8 de l'agent `geo-auditor` et les contraintes réelles du pipeline (`src/pages/blog/[slug].astro`, `ArticleLayout`, plugins remark).

## Ce que le pipeline garantit déjà (ne pas refaire à la main)

Meta SEO/OG/Twitter, JSON-LD BlogPosting + Breadcrumb, temps de lecture, TOC (si ≥5 H2/H3), AuthorBio, RelatedArticles, InlineOptIn (si ≥3 H2), BuyingGuideCard, lazy-loading + dimensions d'images, alt de secours, `rel="sponsored"` sur liens affiliés, placement CRO des CTA. Le rédacteur se concentre sur le contenu ; il ne code ni capture email, ni CTA, ni schema à la main.

## Typologie — exigences par type d'article

| Type | Frontmatter spécifique | Corps spécifique |
|---|---|---|
| **Tuto morceau** | `songInfo` complet (tempo, chordCount, key, difficulty, inBook/bookPage), `videos[]` si dispo | Diagrammes d'accords SVG (`npm run chords:generate`), progression pas à pas |
| **Guide d'achat** | `products[]` complet (prix, url affiliée, ratingValue, reviewBody), `hideBuyingGuide: true` | Tableau comparatif, critères de choix explicites, verdict par profil |
| **Pilier** (`pillar: true`) | `faqs[]` manuel (≥3) obligatoire, pas de `siloSlug` | Maillage descendant vers ses satellites ; **mettre à jour `public/llms.txt`** (maintenu à la main) |
| **Satellite** | `siloSlug` = slug d'un article existant avec `pillar: true` | ≥1 lien vers le pilier dans le corps |

## Frontmatter obligatoire (au-delà du schéma Zod)

- `prod: "Y"` ou `"N"` — **toujours présent** (absent = article listé/sitemap mais page 404). Zod l'impose désormais.
- `description` : **80-165 caractères**, formulée comme une réponse (reprise en meta + OG).
- `instrument` : toujours renseigné (`guitare|piano|ukulele|solfege|général`) — pilote breadcrumb, guide d'achat, lead magnet, index instrument.
- `category` + `level` + `tags` (3-6 tags) : pilotent le classement des index et le scoring RelatedArticles.
- `introduction` : **réponse directe de 40-70 mots** à la question du titre (bloc answer-first affiché en tête — levier de citation LLM n°1).
- `faqs[]` : ≥3 Q/R pour les piliers et guides d'achat ; recommandé partout ailleurs (sans `faqs`, une AutoFAQ générique est publiée avec son JSON-LD — acceptable seulement si ses questions template conviennent à l'article).
- `dateModified ≥ datePublished`, **sincère** : ne changer `dateModified` que lors d'une modification substantielle du contenu. Un alignement de masse n'est légitime que s'il suit une vraie refonte de masse (cas du 2026-06-06, refonte SEO/GEO réelle — commits `6de3858`/`0df1784`) ; un bump de date sans changement de fond est interdit.
- `ogImage` : chemin existant dans `public/` (WebP).
- **Interdits** : champs legacy `meta` et `keywords` (redondants avec `description`) ; `datePublished` future sauf publication programmée volontaire.

## Structure du corps

- **Jamais de H1** (`# `) : le layout génère le H1 depuis `title`. Le corps commence à `## `.
- **Premier H2 = « En bref »** : synthèse answer-first (réponse + 3-5 points clés en liste). Ce H2 sert aussi d'ancre au placement CRO.
- **≥3 H2** (sinon l'InlineOptIn ne s'affiche pas), **≥5 H2/H3** pour avoir la table des matières. **≥1 H2 formulé en question** (« Quel ukulélé choisir à moins de 100 € ? ») — les moteurs IA matchent les questions.
- **Passages autonomes** : paragraphes de 2-3 phrases ; chaque section compréhensible isolément (sujet rappelé, pas de « comme vu plus haut ») ; viser ≥1 passage répondable par tranche de 400-600 mots.
- **Densité factuelle** : listes, tableaux, chiffres **sourcés** (nom de la source dans la phrase). Aucun chiffre décoratif inventé (cf. `contenu-credibilite.md`).
- **Pas de HTML inline** (`<div>`, `<style>`, menus maison) : Markdown pur + blocs `::: info|tip|warning|section-colored` (plugin remark). L'anti-modèle est la génération legacy 2024-2025.
- **Images** : WebP dans `public/images/blog/` (`npm run optimize-images`), alt descriptif **unique par image** (pas de copier-coller d'alt), référencées en Markdown relatif.
- **Ton** : first-person incarné (expérience de Fred en cours), pédagogique, français impeccable avec accents.

## Maillage interne

- **≥2 liens internes** dans le corps, en chemins **relatifs** (`/blog/slug/`, `/cours/slug/`) — jamais d'URL absolue `https://musique-facile.fr/...` en interne.
- Satellite → **≥1 lien vers son pilier** ; pilier → liens vers ses satellites principaux.
- Chaque lien `/blog/...` doit pointer vers un article existant **et publié** (`prod: "Y"`, date passée) — un lien vers un article caché est un lien mort.
- `siloSlug` cassé (cible inexistante ou sans `pillar: true`) casse silencieusement PillarLink + breadcrumb : à vérifier systématiquement.

## Fact-checking (obligatoire avant publication)

- Toute affirmation vérifiable — accords, tonalité, tempo, année, auteur d'un morceau ; fait historique ou théorique ; statistique — est **vérifiée par recherche web** (agent `article-reviewer`) ou adossée à une source citée. En cas de doute non tranché : reformuler prudemment ou supprimer.
- Citations et études : uniquement attribuées et vérifiables (jamais de « une étude montre que… » sans source) — cf. interdits DGCCRF.
- Chiffres Musique Facile (avis, ancienneté, élèves, offre) : exclusivement ceux de `contenu-credibilite.md`.

## Fraîcheur

- Les piliers et guides d'achat sont revus **au moins tous les 3 mois** (les citations IA chutent au-delà) : données actualisées, prix vérifiés, `dateModified` mis à jour honnêtement.
- Tout nouveau pilier ou renommage : répercuter dans `public/llms.txt`.

## Contrôles

1. `npm run blog:quality <fichier>` — contrôle mécanique de tout ce qui est mesurable ci-dessus (échec bloquant = NO-GO).
2. Agent `article-reviewer` — fact-checking + qualité GEO + relecture DGCCRF sur le brouillon local.
3. `/preflight-publication` — verdict final GO/NO-GO (build Zod, crédibilité, secrets).
4. Après mise en ligne : `geo-auditor` / `/campagne-geo` mesurent la citabilité réelle sur l'URL publiée.
