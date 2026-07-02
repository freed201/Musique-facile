#!/usr/bin/env bash
# Garde-fou « crédibilité contenu » — bloque les mentions interdites (DGCCRF)
# et AVERTIT sur les motifs à risque (revue humaine). Voir .claude/rules/contenu-credibilite.md
set -euo pipefail

input="$(cat)"
# Extraction d'un champ par chemin de clés (évite tout échappement de quotes
# dans du code Python inline — un \" passé via $1 n'est pas retraité par bash
# et produisait une SyntaxError avalée par 2>/dev/null → hook inerte).
field() { printf '%s' "$input" | python3 -c '
import sys, json
d = json.load(sys.stdin)
for k in sys.argv[1:]:
    d = d.get(k, {}) if isinstance(d, dict) else {}
print(d if isinstance(d, str) else "")' "$@" 2>/dev/null || true; }

tool="$(field tool_name)"
file="$(field tool_input file_path)"

# Ne JAMAIS contrôler .claude/ ni CLAUDE.md : ils citent les termes interdits.
case "$file" in
  *"/.claude/"*|*CLAUDE.md) exit 0 ;;
esac
# Ne contrôler QUE le contenu éditorial.
case "$file" in
  *src/content/*.md|*src/content/*.mdx|*src/pages/*.astro|*src/pages/*.md) : ;;
  *) exit 0 ;;
esac

case "$tool" in
  Write) text="$(field tool_input content)" ;;
  Edit)  text="$(field tool_input new_string)" ;;
  *) exit 0 ;;
esac

# --- 1) BLOCAGE DUR (exit 2) : mentions toujours fausses pour Musique Facile ---
violations=()
if printf '%s' "$text" | grep -iqE 'essai[[:space:]-]*gratuit'; then
  violations+=("« essai gratuit » interdit — modèle = paiement unique + garantie 15 j remboursé.")
fi
if printf '%s' "$text" | grep -qE '(^|[^0-9])2847([^0-9]|$)'; then
  violations+=("« 2847 » avis : chiffre erroné — officiel = 929 avis (4,7/5).")
fi
if [ "${#violations[@]}" -gt 0 ]; then
  echo "Garde-fou crédibilité — écriture BLOQUÉE dans $file :" >&2
  for v in "${violations[@]}"; do echo "  • $v" >&2; done
  echo "Voir .claude/rules/contenu-credibilite.md ; corrige puis relance." >&2
  exit 2
fi

# --- 2) AVERTISSEMENTS (exit 0) : motifs à risque → revue humaine (Fred) ---
# Faux positifs possibles : on NE BLOQUE PAS, on signale pour validation.
warnings=()
if printf '%s' "$text" | grep -iqE 'étude[s]?[^.]{0,40}(MIT|Stanford|Harvard|Cambridge|Oxford|Yale|Princeton|CNRS|INSERM)'; then
  warnings+=("Étude attribuée à une grande institution — vérifier la source ou retirer (fausses études interdites DGCCRF).")
fi
if printf '%s' "$text" | grep -iqE '(plus que|ne reste[nt]? (plus )?que|derni[eè]res?)[[:space:]]+[0-9]+[[:space:]]+places?'; then
  warnings+=("Compteur de places / rareté — interdit si non réel (DGCCRF). Vérifier que la limite est factuelle.")
fi
if printf '%s' "$text" | grep -iqE '(20|25|30|35) ans d.(enseignement|enseignant)'; then
  warnings+=("Ancienneté d'enseignement suspecte — officiel = 15 ans (musicien 40+ ans). Vérifier.")
fi
if [ "${#warnings[@]}" -gt 0 ]; then
  echo "Garde-fou crédibilité — À VÉRIFIER (non bloquant) dans $file :" >&2
  for w in "${warnings[@]}"; do echo "  ⚠ $w" >&2; done
  echo "Brouillon à valider par Fred — voir .claude/rules/contenu-credibilite.md" >&2
fi
exit 0
