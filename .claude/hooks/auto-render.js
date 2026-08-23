#!/usr/bin/env node
/**
 * auto-render.js — hook PostToolUse : le rendu est automatique.
 *
 *   posts/<slug>/html/02.html  ->  refait cette slide
 *   posts/<slug>/legende.md    ->  refait le description.txt
 *   design/*.css, design/*.js  ->  refait toutes les slides du dépôt
 *
 * Il n'y a donc jamais de PNG en retard sur sa source. Branché dans
 * .claude/settings.json. Ne bloque jamais : en cas de souci, une ligne et exit 0.
 */
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');

let brut = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => (brut += c));
process.stdin.on('end', () => {
  let cible; // argument passé à render.js ; [] = tout le dépôt
  try {
    const evt = JSON.parse(brut || '{}');
    const p = evt.tool_input && evt.tool_input.file_path;
    if (!p) return;

    // chemin relatif au dépôt, séparateurs normalisés
    const bouts = path.relative(ROOT, path.resolve(p)).split(path.sep).join('/').split('/');

    if (bouts[0] === 'design' && /\.(css|js)$/.test(bouts[bouts.length - 1])) {
      cible = []; // le système de design a bougé : tout est périmé
    } else if (bouts[0] === 'posts' && bouts.length === 4 && bouts[2] === 'html' && bouts[3].endsWith('.html')) {
      cible = [`${bouts[1]}/${path.basename(bouts[3], '.html')}`];
    } else if (bouts[0] === 'posts' && bouts.length === 3 && bouts[2] === 'legende.md') {
      cible = [bouts[1], "--description"];
    } else {
      return;
    }
  } catch {
    return;
  }

  const r = spawnSync(process.execPath, [path.join(ROOT, 'render.js'), ...cible], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  const sortie = [(r.stdout || '').trim(), (r.stderr || '').trim()].filter(Boolean).join('\n');
  process.stdout.write(sortie + '\n');
});
