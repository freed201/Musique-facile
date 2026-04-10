#!/bin/bash

################################################################################
# SCAN COMPLET MULTI-DOMAINES - O2SWITCH
# Ce script scanne TOUS les domaines d'un compte O2switch pour détecter
# les fichiers malveillants identifiés dans l'infection
################################################################################

echo "========================================================================"
echo "  🔍 SCAN SÉCURITÉ COMPLET - COMPTE O2SWITCH"
echo "========================================================================"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Date et heure
SCAN_DATE=$(date +%Y%m%d_%H%M%S)
REPORT_DIR="scan_report_${SCAN_DATE}"

# Créer le dossier de rapport
mkdir -p "$REPORT_DIR"

echo -e "${GREEN}📁 Dossier de rapport : $REPORT_DIR${NC}"
echo ""

# Détecter le dossier racine (généralement /home/username/)
HOME_DIR=$(pwd)
echo -e "${BLUE}🏠 Dossier de base : $HOME_DIR${NC}"
echo ""

# Initialiser les compteurs
TOTAL_MALWARE=0
TOTAL_SUSPECTS=0
DOMAINS_INFECTED=0

# Fichier de rapport principal
MAIN_REPORT="$REPORT_DIR/RAPPORT_PRINCIPAL.txt"

# Créer l'en-tête du rapport
cat > "$MAIN_REPORT" << EOF
================================================================================
RAPPORT DE SCAN SÉCURITÉ - COMPTE O2SWITCH
================================================================================
Date du scan : $(date)
Dossier scanné : $HOME_DIR

================================================================================
RÉSUMÉ DE L'INFECTION
================================================================================

Malwares recherchés :
- Dossiers : ae508f52/, 408809/
- Fichiers : about.php, radio.php, admin.php, content.php, lock360.php
- Patterns : eval(), base64_decode, curl_init avec URLs suspectes

================================================================================
DOMAINES ANALYSÉS
================================================================================

EOF

echo -e "${YELLOW}[1/6]${NC} Listage de tous les domaines et sous-domaines..."
echo ""

# Trouver tous les dossiers qui pourraient être des domaines
# Sur O2switch, généralement dans public_html, www, ou dossiers de domaines
DOMAIN_DIRS=()

# Chercher les dossiers potentiels de domaines
for dir in */ ; do
    # Ignorer certains dossiers système
    if [[ "$dir" != "mail/" && "$dir" != "tmp/" && "$dir" != "logs/" && "$dir" != ".cpanel/" && "$dir" != "etc/" && "$dir" != "scan_report_"* ]]; then
        DOMAIN_DIRS+=("$dir")
    fi
done

# Si on trouve public_html, chercher aussi dedans
if [ -d "public_html" ]; then
    cd public_html
    for dir in */ ; do
        if [[ "$dir" != "cgi-bin/" && "$dir" != ".well-known/" ]]; then
            DOMAIN_DIRS+=("public_html/$dir")
        fi
    done
    cd "$HOME_DIR"
fi

echo -e "${GREEN}✓${NC} Trouvé ${#DOMAIN_DIRS[@]} domaine(s)/dossier(s) à scanner"
echo ""

# Lister les domaines dans le rapport
echo "Domaines/Dossiers trouvés : ${#DOMAIN_DIRS[@]}" >> "$MAIN_REPORT"
for domain in "${DOMAIN_DIRS[@]}"; do
    echo "  - $domain" >> "$MAIN_REPORT"
done
echo "" >> "$MAIN_REPORT"

echo "=================================================================================" >> "$MAIN_REPORT"
echo "RÉSULTATS DÉTAILLÉS PAR DOMAINE" >> "$MAIN_REPORT"
echo "=================================================================================" >> "$MAIN_REPORT"
echo "" >> "$MAIN_REPORT"

# Scanner chaque domaine
DOMAIN_COUNT=0
for domain in "${DOMAIN_DIRS[@]}"; do
    DOMAIN_COUNT=$((DOMAIN_COUNT + 1))
    domain_clean=$(echo "$domain" | tr -d '/')

    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${MAGENTA}[$DOMAIN_COUNT/${#DOMAIN_DIRS[@]}] SCAN : $domain${NC}"
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    # Rapport pour ce domaine
    DOMAIN_REPORT="$REPORT_DIR/scan_${domain_clean}.txt"

    echo "=== SCAN : $domain ===" >> "$MAIN_REPORT"
    echo "Scan de : $domain" > "$DOMAIN_REPORT"
    echo "Date : $(date)" >> "$DOMAIN_REPORT"
    echo "" >> "$DOMAIN_REPORT"

    DOMAIN_INFECTED=0

    # Vérifier si le dossier existe
    if [ ! -d "$domain" ]; then
        echo -e "${YELLOW}⚠ Dossier introuvable, passage au suivant${NC}"
        echo "STATUT : Dossier introuvable" >> "$DOMAIN_REPORT"
        echo "" >> "$MAIN_REPORT"
        continue
    fi

    cd "$domain"

    # 1. Chercher les dossiers malveillants
    echo -e "${YELLOW}  → Recherche des dossiers malveillants...${NC}"
    MALWARE_DIRS=$(find . -type d \( -name "ae508f52" -o -name "408809" \) 2>/dev/null)

    if [ -n "$MALWARE_DIRS" ]; then
        echo -e "${RED}  ✗ DOSSIERS MALVEILLANTS TROUVÉS :${NC}"
        echo "$MALWARE_DIRS" | while read line; do
            echo -e "${RED}    - $line${NC}"
            TOTAL_MALWARE=$((TOTAL_MALWARE + 1))
            DOMAIN_INFECTED=1
        done
        echo "" >> "$DOMAIN_REPORT"
        echo "⚠️ DOSSIERS MALVEILLANTS TROUVÉS :" >> "$DOMAIN_REPORT"
        echo "$MALWARE_DIRS" >> "$DOMAIN_REPORT"
    else
        echo -e "${GREEN}  ✓ Aucun dossier malveillant${NC}"
        echo "✓ Aucun dossier malveillant" >> "$DOMAIN_REPORT"
    fi
    echo ""

    # 2. Chercher les fichiers malveillants connus
    echo -e "${YELLOW}  → Recherche des fichiers malveillants...${NC}"
    MALWARE_FILES=$(find . -maxdepth 3 -type f \( -name "about.php" -o -name "radio.php" -o -name "admin.php" -o -name "content.php" -o -name "lock360.php" \) 2>/dev/null)

    if [ -n "$MALWARE_FILES" ]; then
        echo -e "${RED}  ✗ FICHIERS MALVEILLANTS TROUVÉS :${NC}"
        echo "$MALWARE_FILES" | while read line; do
            echo -e "${RED}    - $line${NC}"
            TOTAL_MALWARE=$((TOTAL_MALWARE + 1))
            DOMAIN_INFECTED=1
        done
        echo "" >> "$DOMAIN_REPORT"
        echo "⚠️ FICHIERS MALVEILLANTS TROUVÉS :" >> "$DOMAIN_REPORT"
        echo "$MALWARE_FILES" >> "$DOMAIN_REPORT"
    else
        echo -e "${GREEN}  ✓ Aucun fichier malveillant connu${NC}"
        echo "✓ Aucun fichier malveillant connu" >> "$DOMAIN_REPORT"
    fi
    echo ""

    # 3. Chercher eval() dans les PHP
    echo -e "${YELLOW}  → Recherche de eval() dans les fichiers PHP...${NC}"
    EVAL_FILES=$(find . -type f -name "*.php" -exec grep -l "eval(" {} \; 2>/dev/null | head -20)
    EVAL_COUNT=$(echo "$EVAL_FILES" | grep -c . 2>/dev/null || echo 0)

    if [ "$EVAL_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}  ⚠ Trouvé $EVAL_COUNT fichier(s) avec eval()${NC}"
        echo "" >> "$DOMAIN_REPORT"
        echo "⚠️ Fichiers avec eval() ($EVAL_COUNT) :" >> "$DOMAIN_REPORT"
        echo "$EVAL_FILES" >> "$DOMAIN_REPORT"
        TOTAL_SUSPECTS=$((TOTAL_SUSPECTS + EVAL_COUNT))
    else
        echo -e "${GREEN}  ✓ Aucun eval() trouvé${NC}"
    fi
    echo ""

    # 4. Chercher base64_decode dans les PHP
    echo -e "${YELLOW}  → Recherche de base64_decode...${NC}"
    BASE64_FILES=$(find . -type f -name "*.php" -exec grep -l "base64_decode" {} \; 2>/dev/null | head -20)
    BASE64_COUNT=$(echo "$BASE64_FILES" | grep -c . 2>/dev/null || echo 0)

    if [ "$BASE64_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}  ⚠ Trouvé $BASE64_COUNT fichier(s) avec base64_decode${NC}"
        echo "" >> "$DOMAIN_REPORT"
        echo "⚠️ Fichiers avec base64_decode ($BASE64_COUNT) :" >> "$DOMAIN_REPORT"
        echo "$BASE64_FILES" >> "$DOMAIN_REPORT"
        TOTAL_SUSPECTS=$((TOTAL_SUSPECTS + BASE64_COUNT))
    else
        echo -e "${GREEN}  ✓ Aucun base64_decode trouvé${NC}"
    fi
    echo ""

    # 5. Chercher les URLs C&C connues
    echo -e "${YELLOW}  → Recherche des serveurs C&C connus...${NC}"
    CNC_PATTERNS="rakuten.*jp\.click|zvo[0-9]\.xyz|icw7\.com|45\.11\.57\.159"
    CNC_FILES=$(find . -type f -name "*.php" -exec grep -l -E "$CNC_PATTERNS" {} \; 2>/dev/null)

    if [ -n "$CNC_FILES" ]; then
        echo -e "${RED}  ✗ CONNEXIONS C&C DÉTECTÉES :${NC}"
        echo "$CNC_FILES" | while read line; do
            echo -e "${RED}    - $line${NC}"
            DOMAIN_INFECTED=1
        done
        echo "" >> "$DOMAIN_REPORT"
        echo "🚨 CONNEXIONS C&C TROUVÉES :" >> "$DOMAIN_REPORT"
        echo "$CNC_FILES" >> "$DOMAIN_REPORT"
    else
        echo -e "${GREEN}  ✓ Aucune connexion C&C détectée${NC}"
    fi
    echo ""

    # 6. Vérifier le .htaccess
    echo -e "${YELLOW}  → Vérification du .htaccess...${NC}"
    if [ -f ".htaccess" ]; then
        HTACCESS_SIZE=$(wc -l < .htaccess)
        echo -e "${BLUE}  ℹ .htaccess trouvé ($HTACCESS_SIZE lignes)${NC}"
        cp .htaccess "$REPORT_DIR/htaccess_${domain_clean}.txt"
        echo "" >> "$DOMAIN_REPORT"
        echo "ℹ️ .htaccess copié dans le rapport ($HTACCESS_SIZE lignes)" >> "$DOMAIN_REPORT"
    else
        echo -e "${BLUE}  ℹ Aucun .htaccess${NC}"
    fi
    echo ""

    # Résumé pour ce domaine
    if [ "$DOMAIN_INFECTED" -eq 1 ]; then
        echo -e "${RED}═══ DOMAINE INFECTÉ ═══${NC}"
        echo "STATUT : 🔴 INFECTÉ" >> "$DOMAIN_REPORT"
        echo "STATUT : 🔴 INFECTÉ - $domain" >> "$MAIN_REPORT"
        DOMAINS_INFECTED=$((DOMAINS_INFECTED + 1))
    else
        echo -e "${GREEN}═══ DOMAINE SAIN ═══${NC}"
        echo "STATUT : ✅ SAIN" >> "$DOMAIN_REPORT"
        echo "STATUT : ✅ SAIN - $domain" >> "$MAIN_REPORT"
    fi
    echo "" >> "$MAIN_REPORT"

    cd "$HOME_DIR"
    echo ""
done

# Rapport final
echo "=================================================================================" >> "$MAIN_REPORT"
echo "RÉSUMÉ FINAL" >> "$MAIN_REPORT"
echo "=================================================================================" >> "$MAIN_REPORT"
echo "" >> "$MAIN_REPORT"
echo "Total domaines scannés : ${#DOMAIN_DIRS[@]}" >> "$MAIN_REPORT"
echo "Domaines INFECTÉS : $DOMAINS_INFECTED" >> "$MAIN_REPORT"
echo "Domaines SAINS : $((${#DOMAIN_DIRS[@]} - DOMAINS_INFECTED))" >> "$MAIN_REPORT"
echo "Fichiers/Dossiers malveillants : $TOTAL_MALWARE" >> "$MAIN_REPORT"
echo "Fichiers suspects à vérifier : $TOTAL_SUSPECTS" >> "$MAIN_REPORT"
echo "" >> "$MAIN_REPORT"
echo "=================================================================================" >> "$MAIN_REPORT"

# Affichage final
echo ""
echo "========================================================================"
echo -e "${GREEN}✓ SCAN TERMINÉ${NC}"
echo "========================================================================"
echo ""
echo -e "${BLUE}📊 RÉSUMÉ :${NC}"
echo -e "  Domaines scannés    : ${#DOMAIN_DIRS[@]}"
echo -e "  Domaines infectés   : ${RED}$DOMAINS_INFECTED${NC}"
echo -e "  Domaines sains      : ${GREEN}$((${#DOMAIN_DIRS[@]} - DOMAINS_INFECTED))${NC}"
echo -e "  Malwares trouvés    : ${RED}$TOTAL_MALWARE${NC}"
echo -e "  Fichiers suspects   : ${YELLOW}$TOTAL_SUSPECTS${NC}"
echo ""
echo -e "${GREEN}📁 RAPPORTS GÉNÉRÉS :${NC}"
echo -e "  Dossier : ${BLUE}$REPORT_DIR/${NC}"
echo -e "  Rapport principal : ${BLUE}$MAIN_REPORT${NC}"
echo ""
echo -e "${YELLOW}📥 PROCHAINES ÉTAPES :${NC}"
echo -e "  1. Télécharger le dossier complet : ${BLUE}$REPORT_DIR/${NC}"
echo -e "  2. Lire le rapport : ${BLUE}$MAIN_REPORT${NC}"
echo -e "  3. Examiner les rapports détaillés par domaine"
echo -e "  4. Partager les résultats pour analyse"
echo ""
echo "========================================================================"
