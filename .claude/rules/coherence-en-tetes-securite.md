# En-têtes de sécurité — Musique Facile

## Une seule source : `vercel.json > headers`

Les en-têtes appliqués à toutes les réponses (CSP, HSTS, X-Frame-Options,
Referrer-Policy, Permissions-Policy, X-Content-Type-Options) sont déclarés dans
`vercel.json`, bloc `source: "/(.*)"`. C'est la **seule** source, et elle est
réellement servie — vérifiable d'un `curl -I https://musique-facile.fr/`.

Toute modification de la CSP se fait **là, et nulle part ailleurs**.

## Le doublon a été supprimé le 2026-09-02

`src/utils/security.ts` et `src/utils/middleware/security.ts` définissaient une
seconde version de ces en-têtes. Elle n'a **jamais** été appliquée : Astro ne
charge un middleware que depuis `src/middleware.ts` ou `src/middleware/index.ts`,
et aucun des deux n'existait. Le middleware avait d'ailleurs un import cassé
(`../utils/security` depuis `src/utils/middleware/` pointait vers
`src/utils/utils/`) : il n'aurait même pas compilé.

Les deux fichiers sont supprimés, et pas seulement parce qu'ils étaient morts.
La copie avait divergé au point de devenir **dangereuse si on l'activait** :

- elle autorisait `'unsafe-eval'`, absent de la CSP réelle ;
- elle référençait encore `freed201.activehosted.com`, ActiveCampaign, abandonné
  pour Brevo ;
- il lui manquait `youtube-nocookie.com` et `player.ausha.co`, dont dépendent
  aujourd'hui les façades vidéo et le podcast — les activer aurait cassé ces
  pages.

## Le garde-fou

`npm run check:headers` (scripts/check-security-headers.mjs) vérifie que
`vercel.json` déclare bien les six en-têtes, que la CSP conserve ses directives
structurantes (`default-src`, `object-src`, `base-uri`, `form-action`,
`frame-ancestors`), qu'elle n'a pas réintroduit `'unsafe-eval'`, et qu'elle
autorise toujours les origines dont le site dépend. Avec `--prod`, il interroge
en plus le site en ligne.

Il échoue aussi si `src/middleware.ts`, `src/middleware/index.ts` ou
`src/utils/security.ts` réapparaissent : **deux sources d'en-têtes finissent
toujours par diverger**, c'est précisément ce qui s'est produit ici.

Si la parité en développement local devient un besoin (aujourd'hui `astro dev`
ne sert aucun de ces en-têtes), c'est une décision à prendre explicitement, pas
un middleware à réintroduire au passage.

Ne jamais ajouter `public/_headers` : Vercel **ignore** ce format Netlify.
