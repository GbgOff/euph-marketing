#!/usr/bin/env node
/**
 * publish.js — envoie un carrousel dans la file d'attente Buffer.
 *
 *   node publish.js channels          liste les canaux connectés (pour BUFFER_CHANNEL_ID)
 *   node publish.js <slug>            publie le post déclaré dans posts.json
 *   node publish.js <slug> --dry      montre ce qui serait envoyé, sans rien envoyer
 *
 * Buffer n'accepte pas d'upload de fichier : les PNG doivent déjà être en ligne
 * (GitHub Pages) et le rester jusqu'à la publication. Le script le vérifie.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUTPUT = path.join(ROOT, 'output');
const API = 'https://api.buffer.com';

// ---------------------------------------------------------------- config

function loadEnv() {
  const file = path.join(ROOT, '.env');
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  }
}

function need(name) {
  const v = process.env[name];
  if (!v) die(`${name} manquant. Copie .env.example en .env et remplis-le.`);
  return v;
}

function die(msg) {
  console.error(`\n  ✗ ${msg}\n`);
  process.exit(1);
}

// ---------------------------------------------------------------- légende

/** Extrait la légende et les hashtags du .md pour en faire le texte du post. */
function buildCaption(mdPath) {
  const md = fs.readFileSync(mdPath, 'utf8');

  const section = (titre) => {
    const lines = md.split(/\r?\n/);
    const start = lines.findIndex((l) => l.trim().toLowerCase() === `## ${titre}`);
    if (start === -1) return [];
    const rest = lines.slice(start + 1);
    const end = rest.findIndex((l) => l.startsWith('## '));
    return end === -1 ? rest : rest.slice(0, end);
  };

  const legende = section('légende')
    .map((l) => l.replace(/^>\s?/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const hashtags = section('hashtags')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('#'))
    .join(' ')
    .trim();

  if (!legende) die(`Aucune section "## Légende" dans ${path.basename(mdPath)}`);
  return hashtags ? `${legende}\n\n${hashtags}` : legende;
}

// ---------------------------------------------------------------- slides

function findSlides(prefix) {
  const files = fs
    .readdirSync(OUTPUT)
    .filter((f) => f.startsWith(prefix) && f.endsWith('.png'))
    .sort(); // 01, 02, 03… l'ordre du carrousel est l'ordre alphabétique
  if (!files.length) die(`Aucun PNG "${prefix}*.png" dans output/. Lance ./render.sh d'abord.`);
  if (files.length > 10) die(`${files.length} images — TikTok en accepte 10 au maximum.`);
  return files;
}

/** Buffer va chercher l'image lui-même : si l'URL n'est pas publique, le post échoue. */
async function checkReachable(urls) {
  const bad = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      const type = res.headers.get('content-type') || '';
      if (!res.ok) bad.push(`${url} → HTTP ${res.status}`);
      else if (!type.startsWith('image/')) bad.push(`${url} → content-type "${type}"`);
    } catch (e) {
      bad.push(`${url} → injoignable (${e.message})`);
    }
  }
  return bad;
}

// ---------------------------------------------------------------- API

async function graphql(query, variables) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${need('BUFFER_TOKEN')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const body = await res.text();
  let json;
  try {
    json = JSON.parse(body);
  } catch {
    die(`Réponse illisible de Buffer (HTTP ${res.status}) :\n${body.slice(0, 500)}`);
  }
  if (json.errors) {
    die(`Buffer a refusé la requête :\n${JSON.stringify(json.errors, null, 2)}`);
  }
  return json.data;
}

async function listChannels() {
  const data = await graphql(`query { channels { id name service } }`);
  const channels = data.channels || [];
  if (!channels.length) die('Aucun canal connecté sur ce compte Buffer.');
  console.log('\n  Canaux connectés :\n');
  for (const c of channels) {
    console.log(`    ${c.service.padEnd(12)} ${c.name}`);
    console.log(`    ${''.padEnd(12)} ${c.id}\n`);
  }
  console.log('  Copie l\'id du canal TikTok dans BUFFER_CHANNEL_ID (.env).\n');
}

async function publish(slug, dry) {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'posts.json'), 'utf8'));
  const post = manifest[slug];
  if (!post) {
    die(`Slug "${slug}" inconnu. Disponibles : ${Object.keys(manifest).join(', ')}`);
  }

  const base = need('PAGES_BASE_URL').replace(/\/+$/, '');
  const slides = findSlides(post.slides);
  const urls = slides.map((f) => `${base}/output/${f}`);
  const text = buildCaption(path.join(OUTPUT, post.caption));

  console.log(`\n  ${post.titre}`);
  console.log(`  ${slides.length} slides :`);
  urls.forEach((u, i) => console.log(`    ${String(i + 1).padStart(2, '0')}. ${u}`));
  console.log(`\n  Légende (${text.length} caractères) :\n`);
  console.log(text.split('\n').map((l) => `    │ ${l}`).join('\n'));

  console.log('\n  Vérification que les images sont publiques…');
  const bad = await checkReachable(urls);
  if (bad.length) {
    die(
      'Ces images ne sont pas accessibles publiquement — Buffer ne pourra pas les récupérer :\n' +
        bad.map((b) => `      ${b}`).join('\n') +
        '\n\n    Vérifie que le commit est poussé et que GitHub Pages est activé.'
    );
  }
  console.log('  ✓ toutes les images répondent\n');

  if (dry) {
    console.log('  --dry : rien n\'a été envoyé à Buffer.\n');
    return;
  }

  const data = await graphql(
    `mutation CreatePost($input: CreatePostInput!) {
       createPost(input: $input) {
         __typename
         ... on PostActionSuccess { post { id text dueAt } }
       }
     }`,
    {
      input: {
        text,
        channelId: need('BUFFER_CHANNEL_ID'),
        schedulingType: 'automatic',
        mode: 'addToQueue',
        assets: urls.map((url) => ({ image: { url } })),
      },
    }
  );

  const result = data.createPost;
  if (result.__typename !== 'PostActionSuccess') {
    die(`Buffer a répondu "${result.__typename}" :\n${JSON.stringify(result, null, 2)}`);
  }
  console.log(`  ✓ ajouté à la file Buffer — post ${result.post.id}`);
  console.log(`    publication prévue : ${result.post.dueAt || 'prochain créneau du planning'}`);
  console.log('    relis-le dans Buffer avant qu\'il parte.\n');
}

// ---------------------------------------------------------------- main

(async () => {
  loadEnv();
  const args = process.argv.slice(2);
  const dry = args.includes('--dry');
  const cmd = args.find((a) => !a.startsWith('--'));

  if (!cmd) {
    const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'posts.json'), 'utf8'));
    console.log('\n  node publish.js channels        liste les canaux Buffer');
    console.log('  node publish.js <slug> [--dry]  envoie un post dans la file\n');
    console.log('  Posts déclarés :');
    for (const [k, v] of Object.entries(manifest)) console.log(`    ${k.padEnd(10)} ${v.titre}`);
    console.log('');
    return;
  }

  if (cmd === 'channels') await listChannels();
  else await publish(cmd, dry);
})().catch((e) => die(e.stack || e.message));
