# Scripts de Nettoyage - Musique Facile

## 📁 Fichiers disponibles

### Scripts de nettoyage (à exécuter sur le serveur)

1. **01-scanner-malwares.sh** - Scanner les fichiers malveillants
2. **02-supprimer-malwares.sh** - Supprimer les malwares identifiés
3. **03-corriger-permissions.sh** - Corriger les permissions des fichiers

### Fichiers de maintenance (à uploader sur le serveur)

- **maintenance.html** - Page de maintenance
- **.htaccess-maintenance** - Configuration Apache pour mode maintenance

## 🚀 Utilisation

### 1. Préparer les scripts

```bash
# Rendre les scripts exécutables
chmod +x 01-scanner-malwares.sh
chmod +x 02-supprimer-malwares.sh
chmod +x 03-corriger-permissions.sh
```

### 2. Uploader sur le serveur

**Via FTP/SFTP :**
- Uploader tous les fichiers .sh dans le dossier racine du site
- Uploader maintenance.html dans le dossier racine

**Via SSH (si accès Git) :**
```bash
scp scripts-nettoyage/*.sh user@server:/home/iasv4272/V2.musique-facile.fr/
scp maintenance.html user@server:/home/iasv4272/V2.musique-facile.fr/
```

### 3. Exécuter les scripts

**Connexion SSH au serveur :**
```bash
ssh user@server
cd /home/iasv4272/V2.musique-facile.fr
```

**Étape 1 - Scanner :**
```bash
./01-scanner-malwares.sh
# Examiner les fichiers de résultats (scan_*.txt)
```

**Étape 2 - Supprimer :**
```bash
./02-supprimer-malwares.sh
# Confirmer les suppressions
```

**Étape 3 - Permissions :**
```bash
./03-corriger-permissions.sh
```

### 4. Activer le mode maintenance

**Renommer le .htaccess actuel :**
```bash
mv .htaccess .htaccess.old
```

**Activer le nouveau .htaccess :**
```bash
cp .htaccess-maintenance .htaccess
```

**Modifier avec votre IP :**
```bash
nano .htaccess
# Remplacer XXX.XXX.XXX.XXX par votre vraie IP
# Pour connaître votre IP : curl ifconfig.me
```

## ⚠️ IMPORTANT

- **TOUJOURS** créer une sauvegarde avant d'exécuter les scripts
- **VÉRIFIER** les résultats du scan avant suppression
- **TESTER** après chaque étape
- **NE PAS** exécuter les scripts en production sans test

## 📞 Aide

En cas de problème :
1. Vérifier les logs d'erreur
2. Consulter les fichiers de rapport générés
3. Restaurer depuis la sauvegarde si nécessaire

## ✅ Checklist post-nettoyage

- [ ] Tous les malwares supprimés
- [ ] Permissions corrigées
- [ ] .htaccess vérifié
- [ ] Mots de passe changés
- [ ] Site testé
- [ ] Monitoring installé
