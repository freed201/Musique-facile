#!/usr/bin/env bash
# Garde-fou en-têtes de sécurité (NON bloquant).
# Depuis le 2026-09-02, vercel.json est la source UNIQUE — la copie morte
# src/utils/security.ts a été supprimée. Voir
# .claude/rules/coherence-en-tetes-securite.md
set -euo pipefail

input="$(cat)"
file="$(printf '%s' "$input" | python3 -c "import sys,json
print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || true)"

case "$file" in
  *vercel.json)
    echo "Rappel — tu modifies les en-têtes de sécurité LIVE. Lance 'npm run check:headers' avant de commiter : il vérifie les six en-têtes et les origines dont le site dépend (youtube-nocookie, ausha, GTM). Voir .claude/rules/coherence-en-tetes-securite.md." >&2 ;;
  *src/middleware.ts|*src/middleware/index.ts|*src/utils/security.ts)
    echo "Attention — tu recrées une SECONDE source d'en-têtes de sécurité. Elle avait déjà divergé en silence et a été supprimée le 2026-09-02. La source unique est vercel.json. Voir .claude/rules/coherence-en-tetes-securite.md." >&2 ;;
esac
exit 0
