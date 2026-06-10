# Vérification Déploiement Netlify

## ✅ Résolu - Situation Normale
59 articles affichés (correct - 15 articles programmés pour dates futures)

## Actions à Faire

### 1. Vérifier le statut Netlify
1. Aller sur : https://app.netlify.com
2. Cliquer sur votre site "Musique Facile"
3. Vérifier que le dernier déploiement :
   - Est bien le commit `88b200b` (Fix: Normalisation champs prod...)
   - Statut : **Published** (pas "Building" ou "Failed")
   - Durée : ~1-2 minutes pour le déploiement

### 2. Si le déploiement est ancien
Si le dernier déploiement n'est PAS le commit `88b200b` :

```bash
# Forcer un nouveau déploiement
git commit --allow-empty -m "Trigger: Force Netlify rebuild"
git push origin master
```

### 3. Vider le cache Netlify
Sur Netlify dashboard :
1. Site settings > Build & deploy > Post processing
2. Cliquer sur "Clear cache and retry deploy"

### 4. Vider le cache navigateur
- **Chrome/Edge** : Cmd + Shift + R (Mac) ou Ctrl + Shift + R (Windows)
- **Safari** : Cmd + Option + E puis Cmd + R
- **Firefox** : Cmd + Shift + R (Mac) ou Ctrl + Shift + R (Windows)

Ou tester en **navigation privée** :
```bash
open -a "Google Chrome" --args --incognito https://musique-facile.fr/blog
```

### 5. Vérifier le nombre d'articles en production
```bash
curl https://musique-facile.fr/blog 2>/dev/null | grep -o "Affichage de [0-9]* articles"
```

**Résultat attendu** : "Affichage de 74 articles"

## Résumé des Articles

| Catégorie | Nombre |
|-----------|--------|
| **Total articles** | 93 |
| Cachés (prod: N uniquement) | 5 |
| Cachés (prev - série uniquement) | 8 |
| Cachés (prod: N + prev) | 6 |
| Cachés (dates futures) | 15 |
| **Visibles actuellement** | **59** |

**Calcul** : 93 - 5 - 8 - 6 - 15 = 59 ✅

**Note** : 15 articles sont programmés pour publication future (entre le 9 février et le 4 mai 2026). Ils apparaîtront automatiquement à leur date de publication.

## Si le problème persiste

Contactez le support Netlify ou vérifiez les logs de build :
- Netlify dashboard > Deploys > [dernier déploiement] > Deploy log
- Rechercher des erreurs ou warnings liés aux articles blog
