#!/bin/sh
# go.sh <slug> — de l'HTML à la file d'attente Buffer, en une commande.
#   1. rend les PNG    2. les pousse sur GitHub Pages    3. crée le post Buffer
set -e
cd "$(dirname "$0")"

if [ -z "$1" ]; then echo "usage: sh go.sh <slug>   (voir posts.json)"; exit 1; fi

echo "1/3  rendu des slides"
sh render.sh "$1"

echo "2/3  mise en ligne"
git add -A
if git diff --cached --quiet; then
  echo "     rien de nouveau à pousser"
else
  git commit -qm "visuels: $1"
  git push -q
  echo "     poussé"
fi

echo "3/3  envoi vers Buffer"
node publish.js "$1" --wait
