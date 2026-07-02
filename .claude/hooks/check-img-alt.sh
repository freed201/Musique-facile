#!/usr/bin/env bash
# Garde-fou a11y / GEO (NON bloquant) — avertit si une balise <img> sans alt
# est introduite. alt = accessibilité + citabilité LLM (images indexables).
# Heuristique simple (faux positifs possibles) → on AVERTIT seulement.
set -euo pipefail

input="$(cat)"
# Extraction d'un champ par chemin de clés (un \" passé via $1 n'est pas
# retraité par bash → SyntaxError Python silencieuse → hook inerte).
field() { printf '%s' "$input" | python3 -c '
import sys, json
d = json.load(sys.stdin)
for k in sys.argv[1:]:
    d = d.get(k, {}) if isinstance(d, dict) else {}
print(d if isinstance(d, str) else "")' "$@" 2>/dev/null || true; }

tool="$(field tool_name)"
file="$(field tool_input file_path)"

case "$file" in
  *.astro|*.md|*.mdx|*.html) : ;;
  *) exit 0 ;;
esac

case "$tool" in
  Write) text="$(field tool_input content)" ;;
  Edit)  text="$(field tool_input new_string)" ;;
  *) exit 0 ;;
esac

# Au moins une balise <img ...> sans attribut alt= (mono-ligne).
if printf '%s' "$text" | grep -ioE '<img[^>]*>' | grep -ivq 'alt='; then
  echo "Garde-fou a11y/GEO — <img> sans attribut alt dans $file (non bloquant)." >&2
  echo "Ajoute un alt descriptif (accessibilité + citabilité LLM). Composant <Image> d'Astro : utilise la prop alt." >&2
fi
exit 0
