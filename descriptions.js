#!/usr/bin/env node
/**
 * descriptions.js — écrit posts/<slug>/description.txt : exactement le texte
 * à coller dans TikTok (légende + hashtags), sans le reste du legende.md.
 * Appelé automatiquement par render.sh, jamais à éditer à la main.
 */
const fs = require('fs');
const path = require('path');

const POSTS = path.join(__dirname, 'posts');

/** Extrait une section "## titre" du legende.md. */
function section(md, titre) {
  const lines = md.split(/\r?\n/);
  const start = lines.findIndex((l) => l.trim().toLowerCase() === `## ${titre}`);
  if (start === -1) return [];
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => l.startsWith('## '));
  return end === -1 ? rest : rest.slice(0, end);
}

function buildCaption(md) {
  const legende = section(md, 'légende')
    .map((l) => l.replace(/^>\s?/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const hashtags = section(md, 'hashtags')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('#'))
    .join(' ')
    .trim();

  if (!legende) return null;
  return hashtags ? `${legende}\n\n${hashtags}` : legende;
}

for (const d of fs.readdirSync(POSTS, { withFileTypes: true })) {
  if (!d.isDirectory()) continue;
  const mdPath = path.join(POSTS, d.name, 'legende.md');
  if (!fs.existsSync(mdPath)) continue;
  const txt = buildCaption(fs.readFileSync(mdPath, 'utf8'));
  if (!txt) {
    console.log(`    ${d.name} : aucune section "## Légende"`);
    continue;
  }
  if (/^\s*à écrire\s*$/i.test(txt)) continue; // légende pas encore rédigée
  fs.writeFileSync(path.join(POSTS, d.name, 'description.txt'), txt + '\n', 'utf8');
  console.log(`    ${d.name}/description.txt  (${txt.length} car.)`);
}
