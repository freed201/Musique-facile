#!/bin/bash

# Script pour normaliser le champ prod dans tous les articles blog

cd "$(dirname "$0")/.."

echo "🔧 Normalisation des champs 'prod' dans les articles..."
echo ""

# Compteurs
added=0
fixed=0
skipped=0

# Traiter tous les fichiers markdown du blog
for file in src/content/blog/*.md; do
  filename=$(basename "$file")

  # Vérifier si le fichier a déjà le champ prod
  if grep -q "^prod:" "$file"; then
    # Vérifier si c'est prod: "N"
    if grep -q '^prod: "N"' "$file"; then
      # Remplacer prod: "N" par prod: N
      sed -i '' 's/^prod: "N"/prod: N/' "$file"
      echo "✏️  Corrigé prod: \"N\" → prod: N dans $filename"
      ((fixed++))
    else
      echo "⏭️  $filename a déjà le champ prod"
      ((skipped++))
    fi
  else
    # Ajouter prod: Y après la ligne title
    sed -i '' '/^title:/a\
prod: Y
' "$file"
    echo "✅ Ajouté prod: Y à $filename"
    ((added++))
  fi
done

echo ""
echo "📊 Résumé :"
echo "  - Champs prod ajoutés : $added"
echo "  - Champs prod corrigés : $fixed"
echo "  - Articles déjà OK : $skipped"
echo ""
echo "✅ Normalisation terminée !"
