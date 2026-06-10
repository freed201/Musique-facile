# Configuration Google Search Console

## Étape 1 : Ajouter votre propriété

1. Aller sur : https://search.google.com/search-console
2. Cliquer sur **"Ajouter une propriété"**
3. Choisir **"Préfixe d'URL"**
4. Entrer : `https://musique-facile.fr`

## Étape 2 : Vérifier la propriété

Google vous donnera une balise HTML comme ceci :

```html
<meta name="google-site-verification" content="VOTRE_CODE_UNIQUE" />
```

### Pour l'ajouter au site :

1. **Copier le code de vérification** fourni par Google
2. **Éditer le fichier** : `src/layouts/Layout.astro`
3. **Ajouter la balise** dans le `<head>`, ligne ~30 :

```astro
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="VOTRE_CODE_ICI" />

  <!-- ... reste du head ... -->
</head>
```

4. **Rebuild et redéployer** :
```bash
npm run build
git add .
git commit -m "Add: Google Search Console verification meta tag"
git push origin master
```

5. **Attendre 2-3 minutes** que Netlify déploie
6. **Retourner sur Google Search Console** et cliquer sur "Vérifier"

## Étape 3 : Soumettre le Sitemap

Une fois la propriété vérifiée :

1. Dans le menu de gauche, cliquer sur **"Sitemaps"**
2. Dans le champ "Ajouter un sitemap", entrer : `sitemap.xml`
3. Cliquer sur **"Envoyer"**

**Résultat attendu** :
- Statut : Réussi
- URLs découvertes : ~180+
- Première indexation : 2-7 jours

## Étape 4 : Configuration Bing Webmaster Tools (Bonus)

**Option rapide - Import depuis Google** :
1. Aller sur : https://www.bing.com/webmasters
2. Cliquer sur **"Import from Google Search Console"**
3. Autoriser l'accès
4. ✅ Tout est importé automatiquement (sitemap inclus)

**Option manuelle** :
1. Aller sur : https://www.bing.com/webmasters
2. Ajouter le site : `https://musique-facile.fr`
3. Vérifier avec la même balise meta que Google
4. Soumettre le sitemap : `https://musique-facile.fr/sitemap.xml`

## Étape 5 : Monitoring Initial (Semaine 1)

### Dans Google Search Console, surveiller :

1. **Couverture** (Coverage)
   - Pages indexées : Objectif 180+
   - Erreurs : Objectif 0

2. **Performances** (Performance)
   - Clics : Baseline
   - Impressions : Baseline
   - CTR : Baseline
   - Position moyenne : Baseline

3. **Expérience** (Core Web Vitals)
   - LCP : < 2.5s ✅
   - FID : < 100ms ✅
   - CLS : < 0.1 ✅

4. **Améliorations** (Enhancements)
   - Rich results : VideoObject, HowTo, FAQPage, Breadcrumbs
   - Erreurs : Objectif 0

### Alertes à configurer

**Dans Google Search Console > Paramètres > Notifications par e-mail** :
- ✅ Problèmes de couverture
- ✅ Problèmes de Core Web Vitals
- ✅ Problèmes de sécurité et actions manuelles
- ✅ Nouvelles issues de structured data

## Étape 6 : Tests Rich Snippets

Après 48-72h, tester quelques pages :

### Pages à tester en priorité

1. **Homepage**
   - https://search.google.com/test/rich-results?url=https://musique-facile.fr
   - Schemas attendus : Organization, WebSite

2. **Page cours**
   - https://search.google.com/test/rich-results?url=https://musique-facile.fr/cours/apprendre-guitare-debutant
   - Schemas attendus : Course, BreadcrumbList

3. **Article tutoriel**
   - https://search.google.com/test/rich-results?url=https://musique-facile.fr/blog/apprendre-wonderwall-guitare
   - Schemas attendus : BlogPosting, VideoObject, HowTo, FAQPage, BreadcrumbList

4. **Page catégorie blog**
   - https://search.google.com/test/rich-results?url=https://musique-facile.fr/blog/guitare
   - Schemas attendus : Blog, CollectionPage

## Calendrier d'Indexation Attendu

| Jour | Événement |
|------|-----------|
| J+0 | Soumission sitemap |
| J+1 | Première découverte par Googlebot |
| J+2-3 | Début de l'indexation (10-20% des pages) |
| J+7 | 50-60% des pages indexées |
| J+14 | 80-90% des pages indexées |
| J+30 | 100% des pages indexées |
| J+30 | Premiers rich snippets visibles dans SERP |

## KPIs à Suivre (Mois 1-3)

### Mois 1
- [ ] 100% des pages indexées (180+)
- [ ] 0 erreurs critiques SEO
- [ ] Core Web Vitals : 100% "Good"
- [ ] Baseline de trafic organique établi

### Mois 2
- [ ] +20-30% trafic organique vs baseline
- [ ] 5-10 mots-clés dans Top 10 Google
- [ ] 30+ mots-clés dans Top 50 Google
- [ ] Premiers rich snippets visibles

### Mois 3
- [ ] +40-50% trafic organique vs baseline
- [ ] 15-20 mots-clés dans Top 10 Google
- [ ] 60+ mots-clés dans Top 50 Google
- [ ] Rich snippets sur 20%+ des pages

## Ressources Utiles

- **Google Search Console** : https://search.google.com/search-console
- **Bing Webmaster Tools** : https://www.bing.com/webmasters
- **Rich Results Test** : https://search.google.com/test/rich-results
- **Schema Validator** : https://validator.schema.org/
- **PageSpeed Insights** : https://pagespeed.web.dev/

---

**Note** : Sauvegardez le code de vérification Google quelque part en sécurité. Vous en aurez besoin si vous devez reverifier le site.
