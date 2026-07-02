#!/usr/bin/env bash
# Garde-fou « secret » — empêche de committer la clé API Brevo (xkeysib-…)
# ou un fichier .env. Les secrets vivent dans les env vars Vercel + .env local.
set -euo pipefail

input="$(cat)"
cmd="$(printf '%s' "$input" | python3 -c "import sys,json
print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null || true)"

# N'agir que sur les commandes qui écrivent dans l'index / l'historique git.
case "$cmd" in
  *"git commit"*|*"git add"*) : ;;
  *) exit 0 ;;
esac

staged="$(git diff --cached 2>/dev/null || true)"
names="$(git diff --cached --name-only 2>/dev/null || true)"
# L'outillage (.claude/, CLAUDE.md) documente les motifs interdits : on l'exclut
# du test « affectation », mais PAS du test « vraie clé » (xkeysib- reste global).
staged_hors_outillage="$(git diff --cached -- . ':(exclude).claude' ':(exclude)CLAUDE.md' 2>/dev/null || true)"

bad=()
if printf '%s' "$staged" | grep -qE 'xkeysib-[A-Za-z0-9]'; then
  bad+=("clé API Brevo (xkeysib-…) présente dans le diff indexé.")
fi
if printf '%s' "$staged_hors_outillage" | grep -qE 'BREVO_API_KEY[[:space:]]*=[[:space:]]*[^[:space:]]'; then
  bad+=("affectation BREVO_API_KEY=… présente dans le diff indexé.")
fi
if printf '%s' "$names" | grep -qE '(^|/)\.env(\.|$)'; then
  bad+=("un fichier .env est en staging (il doit rester gitignored).")
fi

if [ "${#bad[@]}" -gt 0 ]; then
  echo "Garde-fou secret — commit bloqué :" >&2
  for b in "${bad[@]}"; do echo "  • $b" >&2; done
  echo "Retire le secret : git restore --staged <fichier> ; gère la clé via env vars Vercel + .env local." >&2
  exit 2
fi
exit 0
