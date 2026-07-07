#!/usr/bin/env bash
# Garde-fou qualité blog (NON bloquant) — avertit sur les anti-patterns du
# standard .claude/rules/article-parfait.md à l'écriture d'un article.
# Non bloquant : des articles legacy porteurs de ces motifs sont encore
# édités pour d'autres raisons (le blocage dur reste réservé au DGCCRF).
set -euo pipefail

input="$(cat)"
field() { printf '%s' "$input" | python3 -c '
import sys, json
d = json.load(sys.stdin)
for k in sys.argv[1:]:
    d = d.get(k, {}) if isinstance(d, dict) else {}
print(d if isinstance(d, str) else "")' "$@" 2>/dev/null || true; }

tool="$(field tool_name)"
file="$(field tool_input file_path)"

case "$file" in
  */src/content/blog/*.md) : ;;
  *) exit 0 ;;
esac

case "$tool" in
  Write) text="$(field tool_input content)" ;;
  Edit)  text="$(field tool_input new_string)" ;;
  *) exit 0 ;;
esac

warn() { echo "Garde-fou qualité blog — $1 dans $file (non bloquant, standard : .claude/rules/article-parfait.md)." >&2; }

# H1 en début de ligne : le layout génère déjà le H1 depuis `title` (double H1 SEO).
if printf '%s' "$text" | grep -qE '^# [^#]'; then
  warn "H1 (« # … ») détecté — le corps commence à ## (le layout rend le H1)"
fi

# HTML inline : Markdown pur + blocs ::: info|tip|warning à la place.
if printf '%s' "$text" | grep -qiE '<style[ >]'; then
  warn "bloc <style> inline détecté — utiliser les tokens CSS du site"
fi

# URL interne absolue : casse la portabilité et le maillage relatif.
if printf '%s' "$text" | grep -qE 'https?://(www\.)?musique-facile\.fr/'; then
  warn "URL interne absolue détectée — utiliser un chemin relatif (/blog/…, /cours/…)"
fi

exit 0
