# 🛡️ Guide de Nettoyage Complet - Musique Facile

**Date de l'incident :** 10 février 2026
**Type d'attaque :** Backdoors PHP multiples + Web Shells
**Statut projet local :** ✅ PROPRE (aucune infection détectée)
**Statut serveur production :** 🔴 INFECTÉ

---

## 📊 RÉSUMÉ DE L'INFECTION

### Fichiers malveillants identifiés :

1. **index.php** (racine)
   - Backdoor sophistiquée
   - Serveur C&C : `http://6559-ch4-v305.rakuten58jp.click`
   - Modifie .htaccess
   - Collecte d'informations serveur

2. **ae508f52/about.php**
   - Faux outil de sécurité "Monarx"
   - Triple encodage (base64 + strrev + rot13)
   - Utilise eval()

3. **408809/** (dossier complet)
   - **about.php** : Shell web complet (file manager)
   - **index.php** : Downloader (télécharge code depuis `https://51la.zvo2.xyz/a2.txt`)
   - **radio.php** : Backdoor déguisée en plugin "WP Super Cache"
   - **1.txt** : Chemin du serveur (`/home/iasv4272/V2.musique-facile.fr`)

### Serveurs C&C (Command & Control) :
- `http://6559-ch4-v305.rakuten58jp.click`
- `https://c.zvo4.xyz/`
- `https://c2.icw7.com/`
- `http://45.11.57.159/`
- `https://51la.zvo2.xyz/`

---

## 🎯 PLAN D'ACTION EN 11 ÉTAPES

### ✅ ÉTAPE 1 : Sauvegarder les données importantes

**Actions :**

1. **Sauvegarder la base de données**
   ```bash
   # Via phpMyAdmin
   # Aller sur phpMyAdmin > Sélectionner la BD > Exporter > Méthode rapide > Exécuter

   # OU via SSH :
   mysqldump -u VOTRE_USER -p NOM_DATABASE > backup_$(date +%Y%m%d).sql
   ```

2. **Télécharger les fichiers de configuration**
   - Via FTP, télécharger : `.env`, `astro.config.mjs`, etc.

3. **Créer une liste des fichiers actuels**
   ```bash
   cd /home/iasv4272/V2.musique-facile.fr
   find . -type f > liste_fichiers_$(date +%Y%m%d).txt
   ```

**✓ Critère de validation :** Vous avez une sauvegarde complète de la BD et des configs

---

### 🔐 ÉTAPE 2 : Changer tous les mots de passe

**Actions :**

1. **Mot de passe FTP/SFTP**
   - Panel hébergement > Comptes FTP > Changer le mot de passe

2. **Mot de passe SSH**
   ```bash
   passwd
   # Entrer le nouveau mot de passe (2 fois)
   ```

3. **Mot de passe MySQL**
   ```sql
   mysql -u root -p
   ALTER USER 'VOTRE_USER'@'localhost' IDENTIFIED BY 'NOUVEAU_MDP';
   FLUSH PRIVILEGES;
   EXIT;
   ```

4. **Mot de passe panel hébergement**
   - Se connecter au panel > Sécurité/Profil > Changer MDP

5. **Tokens Netlify** (si utilisé)
   - Dashboard Netlify > User settings > Applications > Révoquer l'ancien > Créer nouveau

**Recommandations MDP :**
- Minimum 16 caractères
- Majuscules + minuscules + chiffres + symboles
- Utiliser un gestionnaire de mots de passe (1Password, Bitwarden, etc.)

**✓ Critère de validation :** Tous les accès ont de nouveaux mots de passe forts

---

### 🚧 ÉTAPE 3 : Mettre le site en mode maintenance

**Actions :**

1. **Uploader maintenance.html**
   ```bash
   # Via FTP, uploader le fichier maintenance.html à la racine
   ```

2. **Connaître votre IP**
   ```bash
   # Sur votre machine locale
   curl ifconfig.me
   # Notez l'IP affichée (ex: 123.45.67.89)
   ```

3. **Modifier .htaccess-maintenance**
   - Ouvrir le fichier `.htaccess-maintenance`
   - Remplacer `XXX.XXX.XXX.XXX` par votre vraie IP (2 endroits)

4. **Activer le mode maintenance**
   ```bash
   # Via SSH sur le serveur
   cd /home/iasv4272/V2.musique-facile.fr
   mv .htaccess .htaccess.OLD-INFECTED
   # Uploader .htaccess-maintenance via FTP et le renommer en .htaccess
   ```

**✓ Critère de validation :** Le site affiche la page de maintenance pour tous sauf vous

---

### 🔍 ÉTAPE 4 : Scanner et identifier les malwares

**Actions :**

1. **Uploader le script de scan**
   ```bash
   # Via FTP, uploader scripts-nettoyage/01-scanner-malwares.sh
   ```

2. **Rendre le script exécutable**
   ```bash
   # Via SSH
   cd /home/iasv4272/V2.musique-facile.fr
   chmod +x 01-scanner-malwares.sh
   ```

3. **Exécuter le scan**
   ```bash
   ./01-scanner-malwares.sh
   ```

4. **Examiner les résultats**
   ```bash
   # Télécharger via FTP les fichiers de résultats :
   # - scan_eval.txt
   # - scan_base64.txt
   # - scan_curl.txt
   # - scan_exec.txt
   # - scan_dossiers_suspects.txt
   # - scan_fichiers_suspects.txt
   # - rapport_scan.txt

   # Examiner chaque fichier pour identifier les malwares
   ```

**⚠️ ATTENTION :** Certains fichiers légitimes peuvent contenir base64_decode ou curl_init. Vérifier manuellement !

**✓ Critère de validation :** Vous avez une liste complète des fichiers suspects

---

### 🗑️ ÉTAPE 5 : Supprimer les malwares

**Actions :**

1. **Uploader le script de suppression**
   ```bash
   # Via FTP, uploader scripts-nettoyage/02-supprimer-malwares.sh
   chmod +x 02-supprimer-malwares.sh
   ```

2. **Exécuter la suppression**
   ```bash
   ./02-supprimer-malwares.sh
   # Répondre 'oui' à la confirmation de sauvegarde
   # Taper 'SUPPRIMER' pour confirmer
   ```

3. **Vérifier le .htaccess**
   ```bash
   cat .htaccess.OLD-INFECTED
   # Vérifier qu'il ne contient pas de code malveillant
   # Comparer avec un .htaccess propre
   ```

4. **Supprimer manuellement les autres fichiers suspects**
   ```bash
   # Si d'autres fichiers ont été identifiés lors du scan
   rm -f /chemin/vers/fichier-suspect.php
   ```

**✓ Critère de validation :** Tous les dossiers/fichiers malveillants sont supprimés

---

### 🚀 ÉTAPE 6 : Déployer une version propre

**Actions :**

1. **Sur votre machine locale, build le projet**
   ```bash
   cd "/Users/musiqfreed/Documents/project Musique Facile"
   npm run build
   # Attend la fin du build (~90s)
   ```

2. **Uploader les fichiers propres**

   **Option A - Via FTP/SFTP :**
   - Se connecter au serveur
   - Supprimer TOUS les fichiers du dossier `dist/` (sauf .htaccess si sain)
   - Uploader le contenu de votre dossier `dist/` local vers le serveur

   **Option B - Via SSH/rsync :**
   ```bash
   rsync -avz --delete dist/ user@server:/home/iasv4272/V2.musique-facile.fr/
   ```

   **Option C - Via Git/Netlify :**
   ```bash
   git add .
   git commit -m "Deploy clean version after security incident"
   git push origin master
   # Netlify redéploiera automatiquement
   ```

3. **Vérifier les fichiers uploadés**
   ```bash
   # Via SSH
   cd /home/iasv4272/V2.musique-facile.fr
   ls -la
   # Vérifier qu'il n'y a plus de dossiers ae508f52, 408809
   ```

**✓ Critère de validation :** Le site contient uniquement des fichiers propres du build

---

### 🔒 ÉTAPE 7 : Corriger les permissions

**Actions :**

1. **Uploader et exécuter le script de permissions**
   ```bash
   # Via FTP, uploader scripts-nettoyage/03-corriger-permissions.sh
   chmod +x 03-corriger-permissions.sh
   ./03-corriger-permissions.sh
   ```

2. **Vérifier les permissions manuellement**
   ```bash
   # Dossiers doivent être 755
   ls -ld /home/iasv4272/V2.musique-facile.fr/

   # Fichiers doivent être 644
   ls -l /home/iasv4272/V2.musique-facile.fr/*.html

   # Fichiers sensibles doivent être 600
   ls -l /home/iasv4272/V2.musique-facile.fr/.env
   ```

3. **Vérifier le propriétaire**
   ```bash
   ls -l /home/iasv4272/V2.musique-facile.fr/
   # Le propriétaire doit être votre user, PAS www-data ou apache
   ```

**✓ Critère de validation :** Permissions correctes (755/644/600) et propriétaire correct

---

### 🛡️ ÉTAPE 8 : Renforcer la sécurité

**Actions :**

1. **Installer le .htaccess sécurisé**
   ```bash
   # Via FTP, uploader .htaccess-securise et le renommer en .htaccess
   # OU via SSH :
   cp .htaccess-securise .htaccess
   ```

2. **Vérifier que le .htaccess fonctionne**
   ```bash
   # Tester l'accès à un fichier qui devrait être bloqué
   curl -I https://votre-site.fr/.env
   # Devrait retourner 403 Forbidden
   ```

3. **Configurer le pare-feu serveur** (si accès)
   ```bash
   # Installer fail2ban (si pas déjà installé)
   sudo apt-get install fail2ban

   # Configurer fail2ban pour SSH
   sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
   sudo nano /etc/fail2ban/jail.local
   # Activer les protections SSH et HTTP
   ```

4. **Désactiver fonctions PHP dangereuses** (dans php.ini si accès)
   ```ini
   disable_functions = exec,passthru,shell_exec,system,proc_open,popen,curl_exec,curl_multi_exec,parse_ini_file,show_source,eval
   ```

**✓ Critère de validation :** .htaccess sécurisé actif + fonctions dangereuses désactivées

---

### 📊 ÉTAPE 9 : Installer un système de monitoring

**Actions :**

1. **Scanner en ligne**
   - Aller sur https://sitecheck.sucuri.net
   - Entrer votre URL : `https://v2.musique-facile.fr`
   - Lancer le scan
   - Vérifier qu'aucun malware n'est détecté

2. **Installer un plugin de sécurité** (si WordPress/CMS)
   - Wordfence Security
   - Sucuri Security
   - iThemes Security

3. **Configurer les alertes de modification de fichiers**
   ```bash
   # Créer un hash MD5 de tous les fichiers actuels
   find /home/iasv4272/V2.musique-facile.fr -type f -exec md5sum {} \; > fichiers_propres.md5

   # Vérifier quotidiennement avec un cron :
   # 0 2 * * * cd /home/iasv4272/V2.musique-facile.fr && find . -type f -exec md5sum {} \; | diff - fichiers_propres.md5 | mail -s "Fichiers modifiés" votre@email.com
   ```

4. **Activer les logs détaillés**
   - Dans le panel hébergement > Logs
   - Activer les logs d'accès et d'erreur

5. **S'inscrire à un service de monitoring** (optionnel)
   - UptimeRobot (gratuit)
   - Pingdom
   - StatusCake

**✓ Critère de validation :** Scan propre + système d'alerte configuré

---

### ✅ ÉTAPE 10 : Tester le site nettoyé

**Actions :**

1. **Tests fonctionnels**
   - Naviguer sur toutes les pages principales
   - Tester les formulaires (si présents)
   - Vérifier que tous les cours s'affichent correctement
   - Tester sur mobile et desktop

2. **Scanner à nouveau**
   ```bash
   # Re-exécuter le script de scan
   ./01-scanner-malwares.sh
   # Vérifier que tous les fichiers sont propres
   ```

3. **Scanner avec plusieurs outils en ligne**
   - https://sitecheck.sucuri.net
   - https://www.virustotal.com (entrer l'URL)
   - https://quttera.com
   - https://unmaskparasites.com

4. **Vérifier les logs**
   ```bash
   tail -f /var/log/apache2/access.log
   # Surveiller pendant 15-30 minutes
   # Vérifier qu'il n'y a pas de requêtes suspectes
   ```

5. **Tester la performance**
   - https://pagespeed.web.dev
   - Vérifier que le temps de chargement est normal

**✓ Critère de validation :** Tous les tests passent, aucun malware détecté

---

### 🌐 ÉTAPE 11 : Remettre le site en ligne

**Actions :**

1. **Désactiver le mode maintenance**
   ```bash
   # Via SSH
   cd /home/iasv4272/V2.musique-facile.fr
   rm .htaccess
   cp .htaccess-securise .htaccess
   rm maintenance.html
   ```

2. **Vérifier que le site fonctionne**
   - Ouvrir le site dans un navigateur privé/incognito
   - Vérifier toutes les pages principales
   - Tester depuis différents appareils

3. **Surveiller pendant les premières heures**
   ```bash
   # Surveiller les logs en temps réel
   tail -f /var/log/apache2/access.log
   tail -f /var/log/apache2/error.log
   ```

4. **Documenter l'incident**
   - Noter la date et l'heure de détection
   - Lister tous les fichiers malveillants trouvés
   - Documenter les actions prises
   - Sauvegarder cette documentation

5. **Planifier les suivis**
   - **J+1 :** Scanner à nouveau
   - **J+7 :** Scan complet + vérification logs
   - **J+15 :** Scan + audit de sécurité
   - **J+30 :** Scan final + bilan

**✓ Critère de validation :** Site en ligne, fonctionnel, aucune activité suspecte

---

## 📝 CHECKLIST POST-NETTOYAGE

- [ ] Sauvegarde complète effectuée
- [ ] Tous les mots de passe changés
- [ ] Mode maintenance activé
- [ ] Scan complet effectué
- [ ] Tous les malwares supprimés (ae508f52, 408809, etc.)
- [ ] Version propre déployée
- [ ] Permissions corrigées (755/644/600)
- [ ] .htaccess sécurisé installé
- [ ] Monitoring configuré
- [ ] Tests complets passés
- [ ] Site remis en ligne
- [ ] Surveillance active pendant 30 jours

---

## 🚨 COMMENT ILS SONT ENTRÉS ?

**Vecteurs d'attaque possibles :**

1. ❌ **Plugins/thèmes obsolètes** (si CMS)
2. ❌ **Mots de passe faibles**
3. ❌ **Permissions de fichiers incorrectes** (777)
4. ❌ **Faille dans un formulaire**
5. ❌ **Injection SQL**
6. ❌ **Fichier uploadé malveillant**
7. ❌ **Accès FTP compromis**

**Actions préventives futures :**

1. ✅ Toujours utiliser des mots de passe forts
2. ✅ Mettre à jour régulièrement le CMS/plugins
3. ✅ Ne jamais utiliser chmod 777
4. ✅ Valider et sanitiser TOUS les inputs utilisateurs
5. ✅ Utiliser un WAF (Web Application Firewall)
6. ✅ Activer l'authentification à deux facteurs (2FA)
7. ✅ Sauvegarder régulièrement
8. ✅ Scanner régulièrement (1x/semaine minimum)

---

## 📞 BESOIN D'AIDE ?

Si vous rencontrez des problèmes :

1. **Vérifier les logs d'erreur**
   ```bash
   tail -100 /var/log/apache2/error.log
   ```

2. **Restaurer depuis la sauvegarde**
   - Si quelque chose ne fonctionne pas, restaurer la BD
   - Re-déployer les fichiers

3. **Contacter l'hébergeur**
   - Si l'infection persiste
   - Si vous n'avez pas accès SSH

4. **Scanner avec d'autres outils**
   - clamav (antivirus Linux)
   - rkhunter (rootkit hunter)
   - Sucuri (service payant complet)

---

## 🎯 RÉSUMÉ RAPIDE

1. ✅ **Sauvegarder** (BD + configs)
2. 🔐 **Changer MDP** (FTP, SSH, MySQL, panel)
3. 🚧 **Mode maintenance**
4. 🔍 **Scanner** (./01-scanner-malwares.sh)
5. 🗑️ **Supprimer** (./02-supprimer-malwares.sh)
6. 🚀 **Déployer propre** (npm run build + upload)
7. 🔒 **Permissions** (./03-corriger-permissions.sh)
8. 🛡️ **Sécuriser** (.htaccess-securise)
9. 📊 **Monitoring** (Sucuri, logs, alertes)
10. ✅ **Tester** (scans, fonctionnel)
11. 🌐 **En ligne** (désactiver maintenance)

**Temps estimé :** 2-4 heures selon votre hébergeur

---

**Date de création de ce guide :** 10 février 2026
**Version :** 1.0
**Auteur :** Claude Code (Anthropic)
