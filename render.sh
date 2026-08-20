#!/bin/sh
# render.sh [slug] — rend les slides en PNG 1080x1440 dans posts/<slug>/png/
# Sans argument : rend tous les posts.
set -e
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
ROOT=$(cd "$(dirname "$0")" && pwd -W)

for dir in "$ROOT"/posts/*/; do
  slug=$(basename "$dir")
  [ -n "$1" ] && [ "$1" != "$slug" ] && continue
  ls "$dir"[0-9]*.html >/dev/null 2>&1 || continue
  mkdir -p "$dir/png"
  echo "  $slug"
  for f in "$dir"[0-9]*.html; do
    name=$(basename "$f" .html)
    "$CHROME" --headless --disable-gpu --hide-scrollbars \
      --force-device-scale-factor=1 --window-size=1080,1440 \
      --virtual-time-budget=4000 \
      --screenshot="$ROOT/posts/$slug/png/$name.png" \
      "file:///$ROOT/posts/$slug/$name.html" >/dev/null 2>&1
    if [ -f "$ROOT/posts/$slug/png/$name.png" ]; then echo "    ok    $name.png"
    else echo "    ECHEC $name.png"; fi
  done
done
