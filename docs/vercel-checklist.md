# Checklist de deploiement Vercel

## 1. Creation du projet

- [ ] Importer le repo GitHub dans Vercel (dashboard > New Project)
- [ ] Framework preset : Astro (devrait etre auto-detecte)
- [ ] Build command : `npm run build` (configure dans vercel.json)
- [ ] Output directory : `dist` (configure dans vercel.json)
- [ ] Node.js version : 22.x (lu depuis package.json engines)

## 2. Variables d'environnement

Configurer dans Vercel > Project Settings > Environment Variables :

- `PUBLIC_GTM_ID` = `GTM-NP758HSC`
- `PUBLIC_SITE_URL` = `https://musique-facile.fr`

## 3. Domaine de preview

- [ ] Configurer un sous-domaine de preview (ex: `preview.musique-facile.fr`) pour tester avant la bascule DNS
- [ ] Verifier que le preview deploy fonctionne sur une PR de test

## 4. Verifications post-preview (avant bascule DNS)

Tester sur le domaine de preview :

- [ ] Page d'accueil
- [ ] 5 articles de blog recents :
  - /blog/quel-piano-numerique-acheter-guide-comparatif-debutant/
  - /blog/pourquoi-tu-stagnes-en-musique/
  - /blog/solfege-noms-des-notes/
  - /blog/debuter-ukulele-methode-simple-apprendre/
  - /blog/guide-complet-apprentissage-piano/
- [ ] Page cours : /cours/cours-de-guitare/
- [ ] /sitemap.xml (accessible et bien forme)
- [ ] /robots.txt (accessible)
- [ ] Lighthouse : score performance > 90
- [ ] Verifier que GTM se charge (onglet Network dans DevTools)
- [ ] Verifier les headers de cache sur un asset statique (doit etre immutable, 1 an)

## 5. Bascule DNS

- [ ] Baisser le TTL DNS a 300s (5 min) au moins 24h avant la bascule
- [ ] Ajouter le domaine `musique-facile.fr` dans Vercel > Project Settings > Domains
- [ ] Modifier les enregistrements DNS chez le registrar pour pointer vers Vercel (CNAME ou A record selon les instructions Vercel)
- [ ] Verifier la propagation DNS (dig, nslookup, ou whatsmydns.net)
- [ ] Verifier le certificat HTTPS (Vercel le genere automatiquement via Let's Encrypt)
- [ ] Tester les memes URLs que ci-dessus sur le domaine de production

## 6. Post-bascule

- [ ] Verifier Google Search Console : pas d'erreurs de crawl
- [ ] Soumettre le sitemap dans GSC si necessaire
- [ ] Surveiller les logs de build Vercel pendant les premiers jours
- [ ] Ajouter les redirections WordPress dans vercel.json apres audit GSC
