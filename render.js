#!/usr/bin/env node
/**
 * render.js [slug…] — la seule commande de la chaîne.
 *
 *   posts/<slug>/html/01.html  ->  posts/<slug>/01.png     (1080 × 1440)
 *   posts/<slug>/legende.md    ->  posts/<slug>/description.txt
 *
 * Arguments : rien = tous les posts · <slug> = un post · <slug>/02 = une slide
 * seule · --description = ne refait que le texte.
 *
 * Écrit en Node plutôt qu'en shell pour être appelable par le hook qui rend
 * automatiquement chaque slide dès qu'elle est modifiée.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = __dirname;
const POSTS = path.join(ROOT, 'posts');

// ---------------------------------------------------------------- Chrome

function chrome() {
  const candidats = [
    process.env.CHROME,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
  ].filter(Boolean);
  const trouve = candidats.find((c) => fs.existsSync(c));
  if (!trouve) {
    console.error('  ✗ Chrome introuvable. Renseigne le chemin dans la variable CHROME.');
    process.exit(1);
  }
  return trouve;
}

function shot(html, png) {
  fs.rmSync(png, { force: true });
  spawnSync(
    chrome(),
    [
      '--headless',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1080,1440',
      '--virtual-time-budget=4000',
      `--screenshot=${png}`,
      'file:///' + html.split(path.sep).join('/'),
    ],
    { stdio: 'ignore' }
  );
  return fs.existsSync(png);
}

// ---------------------------------------------------------------- légende

/** Extrait une section « ## titre » du legende.md. */
function section(md, titre) {
  const lines = md.split(/\r?\n/);
  const start = lines.findIndex((l) => l.trim().toLowerCase() === `## ${titre}`);
  if (start === -1) return [];
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => l.startsWith('## '));
  return end === -1 ? rest : rest.slice(0, end);
}

/** Le texte exact à coller dans TikTok : légende + hashtags, rien d'autre. */
function caption(md) {
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

  if (!legende || /^à écrire$/i.test(legende)) return null;
  return hashtags ? `${legende}\n\n${hashtags}` : legende;
}

// ---------------------------------------------------------------- rendu

function rendre(slug, seulement) {
  const dir = path.join(POSTS, slug);
  const htmlDir = path.join(dir, 'html');
  let slides = fs.existsSync(htmlDir)
    ? fs.readdirSync(htmlDir).filter((f) => /^\d.*\.html$/.test(f)).sort()
    : [];
  if (seulement) slides = slides.filter((f) => path.basename(f, '.html') === seulement);
  if (descSeule) slides = [];

  if (slides.length || descSeule) console.log(`  ${slug}`);
  {
    for (const f of slides) {
      const name = path.basename(f, '.html');
      const ok = shot(path.join(htmlDir, f), path.join(dir, `${name}.png`));
      console.log(`    ${ok ? 'ok   ' : 'ECHEC'} ${name}.png`);
    }
  }

  const mdPath = path.join(dir, 'legende.md');
  if (fs.existsSync(mdPath)) {
    const txt = caption(fs.readFileSync(mdPath, 'utf8'));
    if (txt) {
      fs.writeFileSync(path.join(dir, 'description.txt'), txt + '\n', 'utf8');
      if (slides.length || descSeule) console.log(`    ok    description.txt  (${txt.length} car.)`);
    }
  }
}

const argv = process.argv.slice(2);
const descSeule = argv.includes('--description'); // ne refait que le description.txt
const demandes = argv.filter((a) => !a.startsWith('--'));
const tous = fs
  .readdirSync(POSTS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

for (const cible of demandes.length ? demandes : tous) {
  // « figure-litote » = tout le post · « figure-litote/02 » = cette slide seule
  const [slug, slide] = cible.split('/');
  if (!tous.includes(slug)) {
    console.error(`  ✗ posts/${slug} n'existe pas`);
    process.exitCode = 1;
    continue;
  }
  rendre(slug, slide);
}
