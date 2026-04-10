# 🚀 Commandes Rapides - Nettoyage Musique Facile

## 📋 Checklist Rapide

```bash
# 1. SAUVEGARDER
mysqldump -u USER -p DATABASE > backup_$(date +%Y%m%d).sql

# 2. CHANGER MDP
passwd                    # SSH
# FTP/MySQL via panel

# 3. MODE MAINTENANCE
mv .htaccess .htaccess.OLD
# Uploader .htaccess-maintenance renommé en .htaccess

# 4. SCANNER
chmod +x 01-scanner-malwares.sh
./01-scanner-malwares.sh

# 5. SUPPRIMER
chmod +x 02-supprimer-malwares.sh
./02-supprimer-malwares.sh

# 6. DÉPLOYER PROPRE
# Sur machine locale :
npm run build
# Puis uploader dist/ via FTP

# 7. PERMISSIONS
chmod +x 03-corriger-permissions.sh
./03-corriger-permissions.sh

# 8. SÉCURISER
cp .htaccess-securise .htaccess

# 9. TESTER
./01-scanner-malwares.sh  # Re-scanner
# Vérifier sur https://sitecheck.sucuri.net

# 10. EN LIGNE
rm maintenance.html
# .htaccess déjà ok (étape 8)
```

---

## 🔍 Commandes de Diagnostic

```bash
# Lister fichiers récents (30 jours)
find . -type f -mtime -30 -ls

# Chercher eval dans PHP
grep -r "eval(" . --include="*.php"

# Chercher base64_decode
grep -r "base64_decode" . --include="*.php"

# Chercher curl_init
grep -r "curl_init" . --include="*.php"

# Vérifier les dossiers suspects
find . -type d -name "ae508f52" -o -name "408809"

# Lister tous les .php à la racine
ls -la *.php

# Voir le contenu d'un fichier suspect
cat fichier-suspect.php | less

# Vérifier .htaccess
cat .htaccess
```

---

## 🗑️ Commandes de Suppression

```bash
# ATTENTION : Vérifier avant de supprimer !

# Supprimer les dossiers malveillants
rm -rf ae508f52
rm -rf 408809

# Supprimer fichiers suspects (vérifier d'abord !)
rm -f about.php
rm -f radio.php
rm -f admin.php
rm -f content.php

# Backup avant suppression
mkdir backup_malware_$(date +%Y%m%d)
mv ae508f52 backup_malware_$(date +%Y%m%d)/
mv 408809 backup_malware_$(date +%Y%m%d)/
```

---

## 🔒 Commandes de Permissions

```bash
# Dossiers → 755
find . -type d -exec chmod 755 {} \;

# Fichiers → 644
find . -type f -exec chmod 644 {} \;

# Fichiers sensibles → 600
chmod 600 .env
chmod 600 .env.local
chmod 600 config.php

# Vérifier propriétaire
ls -l
chown -R USER:USER .
```

---

## 🔐 Commandes MySQL

```bash
# Sauvegarder
mysqldump -u USER -p DATABASE > backup.sql

# Restaurer
mysql -u USER -p DATABASE < backup.sql

# Changer mot de passe
mysql -u root -p
ALTER USER 'USER'@'localhost' IDENTIFIED BY 'NOUVEAU_MDP';
FLUSH PRIVILEGES;
EXIT;

# Créer nouvel utilisateur
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON database.* TO 'newuser'@'localhost';
FLUSH PRIVILEGES;
```

---

## 📊 Commandes de Monitoring

```bash
# Surveiller logs en temps réel
tail -f /var/log/apache2/access.log
tail -f /var/log/apache2/error.log

# Dernières 100 lignes des logs
tail -100 /var/log/apache2/access.log

# Chercher IP suspectes
grep "408809\|ae508f52\|about.php\|radio.php" /var/log/apache2/access.log

# Créer hash MD5 des fichiers
find . -type f -exec md5sum {} \; > fichiers_propres.md5

# Comparer avec hash précédent
find . -type f -exec md5sum {} \; | diff - fichiers_propres.md5
```

---

## 🌐 Tests de Sécurité

```bash
# Tester si fichier .env est accessible
curl -I https://votre-site.fr/.env
# Doit retourner 403 Forbidden

# Tester si about.php est bloqué
curl -I https://votre-site.fr/about.php
# Doit retourner 403 Forbidden

# Vérifier headers de sécurité
curl -I https://votre-site.fr
# Vérifier présence de X-XSS-Protection, X-Frame-Options, etc.

# Connaître votre IP
curl ifconfig.me

# Tester depuis une autre IP
curl https://votre-site.fr
# Doit afficher maintenance.html si mode maintenance actif
```

---

## 🚀 Déploiement

```bash
# LOCAL - Build
cd "/Users/musiqfreed/Documents/project Musique Facile"
npm run build

# SERVEUR - Via rsync
rsync -avz --delete dist/ user@server:/home/iasv4272/V2.musique-facile.fr/

# SERVEUR - Via Git
git add .
git commit -m "Deploy clean version"
git push origin master

# Vérifier déploiement
ssh user@server
cd /home/iasv4272/V2.musique-facile.fr
ls -la
```

---

## 🔥 Urgence - Commandes Critiques

```bash
# BLOQUER TOUT LE TRAFIC (urgence absolue)
echo "Order Deny,Allow" > .htaccess
echo "Deny from all" >> .htaccess
echo "Allow from VOTRE_IP" >> .htaccess

# DÉSACTIVER PHP (urgence)
echo "php_flag engine off" > .htaccess

# VOIR PROCESSUS SUSPECTS
ps aux | grep php
ps aux | grep apache

# TUER UN PROCESSUS
kill -9 PID

# VÉRIFIER CONNEXIONS ACTIVES
netstat -an | grep ESTABLISHED

# BLOQUER UNE IP IMMÉDIATEMENT
iptables -A INPUT -s IP_MALVEILLANTE -j DROP
```

---

## 📱 Contacts Utiles

**Hébergeur :**
- Support : [numéro/email]
- Panel : [URL]

**Services de Scan :**
- Sucuri : https://sitecheck.sucuri.net
- VirusTotal : https://www.virustotal.com
- Quttera : https://quttera.com

**Outils en ligne :**
- Connaître son IP : https://ifconfig.me
- Test HTTP headers : https://securityheaders.com
- Test SSL : https://www.ssllabs.com/ssltest/

---

## ⏱️ Timeline Recommandée

**Jour 0 (aujourd'hui) :**
- Étapes 1-8 (4h)

**Jour +1 :**
- Re-scanner
- Vérifier logs
- Étapes 9-11 si tout OK

**Jour +7 :**
- Scan complet
- Audit logs
- Vérifier performances

**Jour +15 :**
- Scan de sécurité
- Review des accès

**Jour +30 :**
- Scan final
- Bilan complet
- Documentation

---

## 🎯 En Cas de Problème

**Site ne charge plus :**
```bash
# Vérifier logs d'erreur
tail -50 /var/log/apache2/error.log

# Vérifier .htaccess
cat .htaccess

# Tester syntaxe Apache
apachectl configtest

# Redémarrer Apache
sudo service apache2 restart
```

**Toujours des malwares :**
```bash
# Re-scanner complet
./01-scanner-malwares.sh

# Vérifier si nouveaux fichiers
find . -mtime -1

# Vérifier cron jobs
crontab -l

# Vérifier processus en cours
ps aux | grep -E "php|curl|wget"
```

**Permissions cassées :**
```bash
# Reset complet
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
chown -R USER:USER .
```

---

**💡 Astuce :** Sauvegardez ce fichier sur votre machine locale pour référence rapide !
