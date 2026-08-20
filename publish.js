#!/usr/bin/env node
/**
 * publish.js — envoie un carrousel dans la file d'attente Buffer.
 *
 *   node publish.js channels          liste les canaux connectés (pour BUFFER_CHANNEL_ID)
 *   node publish.js <slug>            publie le post du dossier posts/<slug>/
 *   node publish.js <slug> --dry      montre ce qui serait envoyé, sans rien envoyer
 *
 * Buffer n'accepte pas d'upload de fichier : les PNG doivent déjà être en ligne
 * (GitHub Pages) et le rester jusqu'à la publication. Le script le vérifie.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const POSTS = path.join(ROOT, 'posts');
const API = 'https://api.buffer.com';
const readLines = (txt) => txt.split(String.fromCharCode(10)).map((l) => l.replace(/\r$/, ''));

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

class Exit extends Error {}

function die(msg) {
  console.error(`\n  ✗ ${msg}\n`);
  throw new Exit(); // pas process.exit() : ça tue Node pendant un fetch en cours
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

// ---------------------------------------------------------------- posts

/** Un post = un sous-dossier de posts/. Pas de manifeste à tenir à jour. */
function listPosts() {
  if (!fs.existsSync(POSTS)) return [];
  return fs
    .readdirSync(POSTS, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const dir = path.join(POSTS, d.name);
      const md = path.join(dir, 'legende.md');
      const pngDir = path.join(dir, 'png');
      const slides = fs.existsSync(pngDir)
        ? fs.readdirSync(pngDir).filter((f) => f.endsWith('.png')).sort()
        : [];
      let titre = d.name;
      if (fs.existsSync(md)) {
        const h1 = readLines(fs.readFileSync(md, 'utf8')).find((l) => l.startsWith('# '));
        if (h1) titre = h1.replace(/^#\s*/, '').replace(/^[^—]*—\s*/, '');
      }
      return { slug: d.name, dir, md, titre, slides, pret: slides.length > 0 && fs.existsSync(md) };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Buffer récupère l'image au moment où le post part, parfois des jours plus tard.
 * On vérifie donc non seulement qu'elle est publique, mais qu'elle est bien la
 * version locale — sinon on programmerait un post pointant vers une vieille image.
 */
async function checkFresh(pairs) {
  const crypto = require('crypto');
  const bad = [];
  for (const { file, url } of pairs) {
    const local = crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) {
        bad.push(`${path.basename(file)} → HTTP ${res.status} (pas encore en ligne ?)`);
        continue;
      }
      const remote = crypto
        .createHash('md5')
        .update(Buffer.from(await res.arrayBuffer()))
        .digest('hex');
      if (remote !== local) bad.push(`${path.basename(file)} → en ligne mais périmée (commit non poussé ?)`);
    } catch (e) {
      bad.push(`${path.basename(file)} → injoignable (${e.message})`);
    }
  }
  return bad;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

/** channels() exige l'organizationId — on le résout depuis le compte. */
async function organizationId() {
  if (process.env.BUFFER_ORG_ID) return process.env.BUFFER_ORG_ID;
  const data = await graphql(`query { account { organizations { id name } } }`);
  const orgs = data.account?.organizations || [];
  if (!orgs.length) die('Aucune organisation sur ce compte Buffer.');
  return orgs[0].id;
}

async function listChannels() {
  const data = await graphql(
    `query Channels($input: ChannelsInput!) {
       channels(input: $input) { id name service }
     }`,
    { input: { organizationId: await organizationId() } }
  );
  const channels = data.channels || [];
  if (!channels.length) die('Aucun canal connecté sur ce compte Buffer.');
  console.log('\n  Canaux connectés :\n');
  for (const c of channels) {
    console.log(`    ${c.service.padEnd(12)} ${c.name}`);
    console.log(`    ${''.padEnd(12)} ${c.id}\n`);
  }
  console.log('  Copie l\'id du canal TikTok dans BUFFER_CHANNEL_ID (.env).\n');
}

async function publish(slug, dry, wait) {
  const posts = listPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    die(`Post "${slug}" introuvable. Dossiers : ${posts.map((p) => p.slug).join(', ')}`);
  }
  if (!post.slides.length) {
    die(`posts/${slug}/png/ est vide — c'est encore une idée. Lance d'abord : sh render.sh ${slug}`);
  }
  if (post.slides.length > 10) {
    die(`${post.slides.length} images — TikTok en accepte 10 au maximum.`);
  }
  if (!fs.existsSync(post.md)) die(`posts/${slug}/legende.md manquant.`);

  const base = need('PAGES_BASE_URL').replace(/\/+$/, '');
  const urls = post.slides.map((f) => `${base}/posts/${slug}/png/${f}`);
  const text = buildCaption(post.md);

  console.log(`\n  ${post.titre || slug}`);
  console.log(`  ${post.slides.length} slides :`);
  urls.forEach((u, i) => console.log(`    ${String(i + 1).padStart(2, '0')}. ${u}`));
  console.log(`\n  Légende (${text.length} caractères) :\n`);
  console.log(readLines(text).map((l) => `    │ ${l}`).join('\n'));

  const pairs = post.slides.map((f, i) => ({
    file: path.join(post.dir, 'png', f),
    url: urls[i],
  }));
  const deadline = Date.now() + (wait ? 5 * 60_000 : 0);
  let bad;
  process.stdout.write('\n  Vérification des images en ligne…');
  for (;;) {
    bad = await checkFresh(pairs);
    if (!bad.length || Date.now() > deadline) break;
    process.stdout.write(' GitHub Pages reconstruit, on patiente…');
    await sleep(15_000);
  }
  if (bad.length) {
    die(
      'Buffer ne pourra pas récupérer ces images :\n' +
        bad.map((b) => `      ${b}`).join('\n') +
        (wait
          ? "\n\n    Abandon après 5 min. Vérifie que GitHub Pages est activé sur le dépôt."
          : "\n\n    Pousse le commit, puis relance (ou utilise --wait pour attendre Pages).")
    );
  }
  console.log('\n  ✓ les images en ligne sont bien les versions locales\n');

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
    console.log('\n  sh go.sh <slug>                          tout : rend, pousse, envoie');
    console.log('  sh render.sh [slug]                      rend les PNG seulement');
    console.log('  node publish.js channels                 liste les canaux Buffer');
    console.log('  node publish.js <slug> [--dry] [--wait]  envoie seulement\n');
    const posts = listPosts();
    const w = Math.max(...posts.map((p) => p.slug.length));
    console.log('  Prêts :');
    for (const p of posts.filter((p) => p.pret)) {
      console.log(`    ${p.slug.padEnd(w)}  ${String(p.slides.length).padStart(2)} slides   ${p.titre}`);
    }
    const idees = posts.filter((p) => !p.pret);
    if (idees.length) {
      console.log('\n  Idées (pas encore de slides) :');
      for (const p of idees) console.log(`    ${p.slug.padEnd(w)}            ${p.titre}`);
    }
    console.log('');
    return;
  }

  if (cmd === 'channels') await listChannels();
  else await publish(cmd, dry, args.includes('--wait'));
})().catch((e) => {
  if (!(e instanceof Exit)) console.error(`\n  ✗ ${e.stack || e.message}\n`);
  process.exitCode = 1;
});
