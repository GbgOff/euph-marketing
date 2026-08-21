#!/usr/bin/env node
/**
 * descriptions.js — écrit posts/<slug>/description.txt : exactement le texte
 * à coller dans TikTok (légende + hashtags), sans le reste du legende.md.
 * Appelé automatiquement par render.sh.
 */
const fs = require('fs');
const path = require('path');
const { listPosts, buildCaption } = require('./publish.js');

for (const post of listPosts()) {
  if (!fs.existsSync(post.md)) continue;
  const txt = buildCaption(post.md);
  if (/^\s*à écrire\s*$/i.test(txt)) continue; // légende pas encore rédigée
  fs.writeFileSync(path.join(post.dir, 'description.txt'), txt + '\n', 'utf8');
  console.log(`    ${post.slug}/description.txt  (${txt.length} car.)`);
}
