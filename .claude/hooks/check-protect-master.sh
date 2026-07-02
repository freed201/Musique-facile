#!/usr/bin/env bash
# Garde-fou « branche protégée » — interdit d'écrire directement sur master.
# master = prod : tout push déclenche un déploiement Vercel automatique, donc
# le contenu doit passer par une branche + PR validée par Fred.
# Voir .claude/rules/contenu-credibilite.md (contenu = BROUILLON à valider).
set -euo pipefail

input="$(cat)"
cmd="$(printf '%s' "$input" | python3 -c "import sys,json
print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null || true)"

# N'agir que sur commit / push.
case "$cmd" in
  *"git commit"*|*"git push"*) : ;;
  *) exit 0 ;;
esac

branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '')"

block=0
reason=""
case "$cmd" in
  *"git commit"*)
    if [ "$branch" = "master" ]; then block=1; reason="commit direct sur master"; fi ;;
esac
if [ "$block" -eq 0 ]; then
  case "$cmd" in
    *"git push"*)
      if [ "$branch" = "master" ] || printf '%s' "$cmd" | grep -qE '[[:space:]:]master([[:space:]]|$)'; then
        block=1; reason="push sur master"
      fi ;;
  esac
fi

if [ "$block" -eq 1 ]; then
  echo "Garde-fou branche protégée — $reason BLOQUÉ." >&2
  echo "master = prod (déploiement Vercel automatique). Le contenu reste un BROUILLON à valider par Fred." >&2
  echo "Passe par une branche puis une PR : git switch -c <type>/<sujet> ; git push -u origin <branche> ; gh pr create." >&2
  exit 2
fi
exit 0
