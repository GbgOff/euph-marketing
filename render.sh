#!/bin/sh
# Rend chaque slide 3:4 de slides/ en PNG 1080x1440 dans output/
# (slide-0*.html = ancienne serie MEMORA 1:1, ignoree)
set -e
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
ROOT=$(cd "$(dirname "$0")" && pwd -W)

for f in "$ROOT"/slides/*.html; do
  name=$(basename "$f" .html)
  case "$name" in slide-0*) continue;; esac
  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=1 --window-size=1080,1440 \
    --virtual-time-budget=4000 \
    --screenshot="$ROOT/output/$name.png" \
    "file:///$ROOT/slides/$name.html" >/dev/null 2>&1
  if [ -f "$ROOT/output/$name.png" ]; then echo "  ok   $name.png"
  else echo "  ECHEC $name.png"; fi
done
