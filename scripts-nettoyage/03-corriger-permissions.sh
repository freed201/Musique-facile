#!/bin/bash

# Script de correction des permissions
# Sécurise les permissions des fichiers et dossiers

echo "=========================================="
echo "  CORRECTION DES PERMISSIONS"
echo "=========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Chemin du site
SITE_PATH="/home/iasv4272/V2.musique-facile.fr"

echo -e "${YELLOW}[1/4]${NC} Correction des permissions des dossiers (755)..."
find "$SITE_PATH" -type d -exec chmod 755 {} \;
echo -e "${GREEN}✓${NC} Dossiers : 755 (rwxr-xr-x)"
echo ""

echo -e "${YELLOW}[2/4]${NC} Correction des permissions des fichiers (644)..."
find "$SITE_PATH" -type f -exec chmod 644 {} \;
echo -e "${GREEN}✓${NC} Fichiers : 644 (rw-r--r--)"
echo ""

echo -e "${YELLOW}[3/4]${NC} Sécurisation des fichiers sensibles (600)..."
# Fichiers de configuration sensibles
for file in .env .env.local config.php wp-config.php; do
    if [ -f "$SITE_PATH/$file" ]; then
        chmod 600 "$SITE_PATH/$file"
        echo -e "${GREEN}✓${NC} $file : 600 (rw-------)"
    fi
done
echo ""

echo -e "${YELLOW}[4/4]${NC} Vérification du propriétaire des fichiers..."
CURRENT_USER=$(whoami)
echo "Propriétaire actuel : $CURRENT_USER"
echo ""
echo -e "${YELLOW}Voulez-vous changer le propriétaire ? (oui/non)${NC}"
read -r CHANGE_OWNER

if [ "$CHANGE_OWNER" = "oui" ]; then
    echo "Entrez le nom d'utilisateur propriétaire :"
    read -r OWNER_USER
    chown -R "$OWNER_USER":"$OWNER_USER" "$SITE_PATH"
    echo -e "${GREEN}✓${NC} Propriétaire changé : $OWNER_USER"
fi
echo ""

echo "=========================================="
echo -e "${GREEN}PERMISSIONS CORRIGÉES${NC}"
echo "=========================================="
echo ""
echo "Résumé :"
echo "  - Dossiers : 755 (lecture/exécution pour tous)"
echo "  - Fichiers : 644 (lecture pour tous)"
echo "  - Fichiers sensibles : 600 (lecture/écriture propriétaire uniquement)"
echo ""
