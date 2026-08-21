# CLAUDE.md — Marketing Euphémisme

## Objectif

Produire des visuels promotionnels pour **Euphémisme** (PWA gratuite de révision du bac de
français, 1re générale) destinés à **TikTok** (déclinables Insta/stories). Le brief de référence
complet — app, cible, charte, features, œuvres au programme, leviers — est dans
`2026-08-20-brief-marketing-tiktok.md` : **le lire avant toute production**.

## Le principe directeur

**On donne des conseils, on ne fait pas de la pub.** Un post doit avoir de la valeur même si le
lecteur n'installe jamais l'app.

- Format type : *« N astuces pour… »*. Les slides 1 → N-1 sont de vrais conseils de méthode qui
  tiennent debout sans l'app ; chacune se termine par **une seule ligne** de mention produit
  (« Dans **Euphémisme**, … »), filet abricot, texte gris, **jamais de bouton**.
- **L'app doit être visible dès la slide 1.** C'est la slide la plus vue ; la dernière est la
  moins vue, donc **ne jamais y réserver la présentation de l'app**. La présence produit monte
  progressivement : signature discrète (renard + `euphemisme.fr`) dès la slide 1, mention d'une
  feature en slide 2, bloc produit un peu plus complet ensuite.
- La dernière slide reste une slide de contenu (quiz, chute, récap) qui porte le CTA — pas une
  bannière publicitaire collée à la fin.
- **Calendrier** : écrit **vers le 10 juin**, oral **fin juin** (estimation, cf. brief). Dans les
  visuels, écrire « mi-juin » / « fin juin », jamais une date précise non officielle.
- Interdits : promesse de note, dénigrement des profs, affiliation Duolingo, faute de français.
- **Tout se joue dans le visuel et la légende.** Pas de « réponse en commentaire épinglé » :
  la réponse d'un quiz, la chute, la précision — tout va dans la **légende**. Un commentaire à
  poster à la main est une étape manuelle de plus, et le lecteur ne le voit pas toujours.
- **Légendes courtes** : 200 à 450 caractères. Une accroche, le contenu utile, le CTA. Pas de
  reprise mot pour mot de ce qui est déjà écrit sur les slides.
- **Ne jamais inventer une citation** tirée des 12 œuvres au programme. Si elle n'est pas
  vérifiable, prendre un exemple canonique correctement attribué, ou pas d'exemple du tout.

## Règles de composition

- **Peu d'éléments, beaucoup d'air.** Chaque élément doit se justifier.
- **Pas de chrome de marque** : ni logo en coin, ni `©2026`, ni `®`, ni pagination `01/04`, ni
  « swipe », ni bandeau de saison. La numérotation d'une série passe par un fil de contenu en haut
  (`01 · 4 ASTUCES POUR…`) — c'est du contenu, pas de la décoration.
- **CTA discret** : `euphemisme.fr` en texte, pas de gros bouton criard.
- **Photos : optionnelles et non systématiques.** C'est un choix de composition, slide par slide —
  alterner photo / schéma / carte produit pour qu'une série ne se répète pas. `assets/` ne contient
  que les deux photos réellement utilisées ; pour une nouvelle, prendre une image libre de droits
  (Unsplash/Pexels) et l'enregistrer dans `assets/`.
- Toute photo passe par le **duotone abricot** de `.photo` (grayscale → sépia → voile
  `mix-blend-mode: color`) : c'est ce qui interdit au vert et aux gris froids d'entrer, et ce qui
  soude n'importe quelle image à la charte.

## Direction artistique

Mélange assumé de deux références :
- **éditorial** : titre display géant sur 2–3 lignes en haut, photo qui saigne au bord, blocs de
  texte étroits, grain papier ;
- **charte de l'app** : orange unique `#FF9857` sur fond crème `#FAF6EF`, Nunito 700–900, coins
  très arrondis, bordures basses épaisses, **aucun vert ni teal, aucune palette froide**.

Contrainte typographique : **interlignage des titres `.95` par défaut, `1.06` dès qu'une capitale
accentuée (É, À, Ç) est empilée sur une autre ligne** — sinon l'accent ou la cédille touche la
ligne voisine. Toujours vérifier le PNG rendu, pas seulement le HTML.

---

# Comment ça marche

## La chaîne complète

```
posts/<slug>/01.html  ──render.sh──>  posts/<slug>/png/*.png  ──git push──>  GitHub Pages
                                                                                  |
             posts/<slug>/legende.md ──┐                                          | URL publiques
                                       v                                          v
                                 publish.js  ──────────────────>  file d'attente Buffer
                                                                                  |
                                                                                  v
                                                                    TikTok (@euphemisme.fr)
```

**Une seule commande fait tout :**

```
sh go.sh figure-litote
```

1. rend les HTML du post en PNG 1080×1440,
2. commite et pousse sur GitHub Pages,
3. attend que Pages ait reconstruit, vérifie les images, crée le post dans Buffer.

Buffer place le post au prochain créneau de ton planning ; **rien n'est publié sans que tu l'aies
relu dans Buffer**.

## Les pièces

| Chemin | Rôle |
|---|---|
| `posts/<slug>/01.html`, `02.html`… | une slide = un HTML autonome |
| `posts/<slug>/legende.md` | angle, plan des slides, légende, hashtags |
| `posts/<slug>/png/` | les PNG rendus, générés |
| `design/euphemisme.css` | tout le système de design (couleurs, composants, duotone) |
| `assets/` | Nunito + les seules photos réellement utilisées |
| `render.sh [slug]` | Chrome headless → `posts/*/png/*.png` en 1080×1440 |
| `publish.js` | vérifie les images puis crée le post via l'API Buffer |
| `go.sh <slug>` | enchaîne les trois étapes |
| `tiktok.js <slug>` | prépare un dépôt manuel dans TikTok Studio (légende + images) |
| `.env` | les 3 clés — **jamais committé** |

**Un post = un dossier.** Il n'y a aucun manifeste à tenir à jour : `publish.js` découvre les posts
en listant `posts/`, et prend le titre dans le `# ` de `legende.md`. Un dossier sans `png/` est
affiché comme une **idée** ; le script refuse de le publier.

## Créer un nouveau post

1. `mkdir posts/<slug>` et y écrire `legende.md` (angle, plan des slides).
2. Copier des HTML existants selon la mise en page voulue :
   `astuces-revisions/01.html` (photo à droite) · `astuces-revisions/02.html` (schéma) ·
   `figure-litote/01.html` (typo seule) · `astuces-revisions/04.html` (carte produit).
   Depuis `posts/<slug>/`, les chemins sont `../../design/euphemisme.css` et `../../assets/`.
3. Changer le fil de série, le titre, `.lead`, `.feature`.
4. Compléter dans `legende.md` les sections `## Légende` et `## Hashtags` — c'est exactement ce
   que `publish.js` enverra à Buffer.
5. `sh go.sh <slug>`.

## L'API Buffer — ce qu'il faut savoir

- GraphQL sur `https://api.buffer.com`, clé personnelle en `Authorization: Bearer`.
  Disponible sur tous les plans, gratuit inclus.
  ⚠️ L'ancienne API REST est **retirée le 1er février 2027** — ne jamais suivre un tuto legacy.
- **Buffer n'accepte pas d'upload de fichier.** Les PNG doivent être servis en HTTPS public, en
  lien direct, et **rester joignables jusqu'à la publication** (Buffer les récupère au moment où
  le post part, parfois des jours plus tard). D'où GitHub Pages plutôt qu'une URL signée.
- `assets` est une **liste ordonnée** → l'ordre du carrousel = l'ordre alphabétique des fichiers
  (`01.png`, `02.png`, `03.png`). TikTok accepte **10 images maximum**.
- La requête `channels` exige un `organizationId` que la doc publique n'indique pas dans son
  exemple. `publish.js` le résout tout seul via `account { organizations }`.
- `publish.js` compare l'empreinte MD5 de chaque image locale à celle servie en ligne. Il refuse
  d'envoyer si elles diffèrent — sinon on programmerait un post pointant vers une vieille image,
  et l'erreur n'apparaîtrait que des jours plus tard, au moment de la publication.

## Deux voies de publication

**Automatique (Buffer)** — `sh go.sh <slug>`. Buffer publie seul au créneau. **Sans son** :
l'API TikTok n'expose aucun champ audio (`TikTokPostMetadataInput` = `title` + `isAiGenerated`),
et Buffer n'a pas accès à la bibliothèque musicale. Pas non plus de dépôt dans les brouillons
TikTok : ça n'existe ni côté Buffer ni côté API.

**Manuelle avec son** — `node tiktok.js <slug>`. Met la légende dans le presse-papier
(via `Set-Clipboard`, qui préserve l'UTF-8 — pas `clip.exe`) et ouvre `posts/<slug>/png/`.
Il ne reste qu'à glisser les images dans TikTok Studio, coller, choisir le son, programmer.
TikTok Studio programme jusqu'à **10 jours** à l'avance et ne permet aucune modification
après coup.

`publish.js` accepte aussi `--draft` (brouillon Buffer, rien de programmé) et `--notify`
(Buffer notifie au créneau, on finit dans TikTok). `--notify` n'arrive qu'à l'heure du
créneau et impose de recopier la légende : `tiktok.js` est plus direct.

## Secrets

`.env` contient `BUFFER_TOKEN`, `BUFFER_CHANNEL_ID`, `PAGES_BASE_URL` (modèle dans
`.env.example`). Le dépôt GitHub étant **public**, `.gitignore` exclut `.env` et le brief
marketing. Après toute modification du `.gitignore` : `git check-ignore -v .env`.
