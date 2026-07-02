#!/usr/bin/env bash
# Garde-fou cohérence des en-têtes de sécurité (NON bloquant).
# Les en-têtes sont définis à deux endroits — voir
# .claude/rules/coherence-en-tetes-securite.md. Seul vercel.json est live.
set -euo pipefail

input="$(cat)"
file="$(printf '%s' "$input" | python3 -c "import sys,json
print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || true)"

case "$file" in
  *vercel.json)
    echo "Rappel cohérence — tu modifies les en-têtes LIVE (vercel.json). Vérifie la CSP miroir dans src/utils/security.ts. Voir .claude/rules/coherence-en-tetes-securite.md." >&2 ;;
  *src/utils/security.ts)
    echo "Rappel cohérence — src/utils/security.ts n'est PAS appliqué en prod (middleware non enregistré). La source LIVE est vercel.json. Voir .claude/rules/coherence-en-tetes-securite.md." >&2 ;;
esac
exit 0
