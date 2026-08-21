#!/usr/bin/env node
/**
 * tiktok.js [slug] — prépare un post pour un dépôt manuel dans TikTok Studio.
 *
 *   node tiktok.js douze-oeuvres
 *
 * Met la légende dans le presse-papier et ouvre le dossier des images.
 * Il ne reste qu'à glisser les PNG dans TikTok Studio et coller la légende.
 * Sans argument : liste les posts disponibles.
 *
 * Pourquoi ce script plutôt que Buffer : Buffer ne sait pas déposer dans les
 * brouillons TikTok, et sa publication par notification n'arrive qu'à l'heure
 * du créneau, en demandant de recopier la légende à la main.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { listPosts, buildCaption } = require('./publish.js');

const slug = process.argv[2];
const posts = listPosts().filter((p) => p.pret);

if (!slug) {
  console.log('\n  node tiktok.js <slug>   presse-papier + dossier d\'images\n');
  const w = Math.max(...posts.map((p) => p.slug.length));
  for (const p of posts) {
    console.log(`    ${p.slug.padEnd(w)}  ${String(p.slides.length).padStart(2)} slides   ${p.titre}`);
  }
  console.log('');
  process.exit(0);
}

const post = posts.find((p) => p.slug === slug);
if (!post) {
  console.error(`\n  ✗ "${slug}" introuvable ou sans PNG. Disponibles : ${posts.map((p) => p.slug).join(', ')}\n`);
  process.exit(1);
}

const caption = buildCaption(post.md);

// Set-Clipboard préserve l'UTF-8 (accents, œ, emoji) — pas clip.exe.
const tmp = path.join(os.tmpdir(), `euphemisme-${slug}.txt`);
fs.writeFileSync(tmp, caption, 'utf8');
execFileSync('powershell', [
  '-NoProfile',
  '-Command',
  `Get-Content -Raw -Encoding UTF8 '${tmp}' | Set-Clipboard`,
]);
fs.unlinkSync(tmp);

const pngDir = path.join(post.dir, 'png');
try {
  execFileSync('explorer.exe', [pngDir], { stdio: 'ignore' });
} catch {
  // explorer.exe renvoie toujours 1, même quand la fenêtre s'ouvre.
}

console.log(`\n  ${post.titre}`);
console.log(`  ✓ légende copiée (${caption.length} caractères)`);
console.log(`  ✓ dossier ouvert — ${post.slides.length} images dans l'ordre :`);
console.log(`      ${post.slides.join('  ')}`);
console.log('\n  Dans TikTok Studio : glisse les images, colle la légende (Ctrl+V),');
console.log('  ajoute le son, puis programme.\n');
