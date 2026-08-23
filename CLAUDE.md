# CLAUDE.md — Marketing Euphémisme

## Objectif

Le compte TikTok est **un compte de conseils pour le bac de français**, qui fait aussi la
promotion d'**Euphémisme** (PWA gratuite de révision, 1re générale). Dans cet ordre, et jamais
l'inverse.

C'est une stratégie, pas de la modestie : **rien ne devient viral parce que c'est une pub.** Ce
qui tourne, c'est le conseil qu'on a envie d'envoyer à quelqu'un de sa classe. L'app profite de
l'audience que le conseil a créée — elle ne la crée pas. Un post qui ne servirait à rien sans
l'app est un post raté, même s'il est joli.

Donc, dans l'ordre, pour chaque post :

1. **Est-ce un vrai conseil ?** Quelque chose qu'un élève de 1re ne sait pas et peut appliquer
   dès ce soir. Si la réponse est non, on ne le produit pas.
2. **Est-ce que ça peut tourner ?** Une accroche qui pose un problème que la cible reconnaît, un
   contenu qui se lit en 8 secondes par slide, une chute qui donne envie de commenter.
3. **Est-ce que l'app y trouve sa place ?** Discrètement, à sa place, sans jamais prendre celle
   du conseil.

Le brief de référence complet — app, cible, charte, features, œuvres au programme, leviers — est
dans `2026-08-20-brief-marketing-tiktok.md` : **le lire avant toute production**.

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

## Ce que doit contenir une slide

Une slide qui ne porte qu'une phrase et du vide se fait passer. **Chaque slide doit livrer une
chose que le lecteur ne savait pas** — sinon elle ne mérite pas d'être swipée.

Le gabarit d'une slide de conseil :

| | |
|---|---|
| **le titre** | le conseil en 2–4 mots, en display |
| **la raison** | `.lead`, 2 lignes : *pourquoi* ça marche. C'est ce qui distingue un conseil d'un slogan |
| **la preuve** | un exemple, un avant/après, une liste d'étapes, un mini-tableau, un chiffre — **du concret, pas une reformulation** |
| **la mention produit** | une ligne `.feature`, ou rien |

C'est la **preuve** qui manque le plus souvent. Un « relève les champs lexicaux » sans un relevé
montré n'apprend rien ; les deux blocs `.compare` (ko / ok) sur une même phrase, si.

- **Viser 6 à 9 lignes de texte utile par slide.** En dessous, la slide est creuse. Au-dessus, on
  ne la lit plus en 8 secondes.
- Pas de zone morte de plus de ~200 px entre deux blocs : c'est le signe qu'il manque un exemple.
- L'air se met **autour** des blocs et dans les marges, pas au milieu de la slide.
- Un mot difficile qui apparaît (litote, anaphore, registre) se glose en une incise. On écrit pour
  quelqu'un qui n'a pas encore compris le cours.

## Règles de composition

- **Peu d'éléments, beaucoup d'air** — mais chaque élément présent doit être plein. Peu de blocs
  bien remplis, pas beaucoup de blocs vides.
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

Tout est **local**. Aucun service tiers, aucune clé, aucune publication automatique : on produit
des PNG dans un dossier, et c'est toi qui les publies à la main depuis TikTok — c'est le seul
moyen d'ajouter un son.

## La chaîne complète

```
posts/<slug>/html/01.html  ──>  posts/<slug>/01.png          1080 × 1440
posts/<slug>/legende.md    ──>  posts/<slug>/description.txt
```

**Le rendu est automatique.** Le hook `PostToolUse` de `.claude/settings.json` lance
`.claude/hooks/auto-render.js` à chaque écriture :

| fichier modifié | ce qui est refait |
|---|---|
| `posts/<slug>/html/02.html` | `posts/<slug>/02.png` |
| `posts/<slug>/legende.md` | `posts/<slug>/description.txt` |
| `design/*.css`, `design/*.js` | **toutes** les slides du dépôt |

Il n'y a donc jamais de PNG en retard sur sa source, et il n'y a rien à lancer à la main. À la
main quand même, si besoin :

```
node render.js                    tous les posts
node render.js figure-litote      un post
node render.js figure-litote/02   une slide
```

Ensuite, dans TikTok : les PNG du dossier dans l'ordre (`01`, `02`, `03`…), le contenu de
`description.txt` en légende, le son choisi dans l'app.

## Les pièces

| Chemin | Rôle |
|---|---|
| `posts/<slug>/01.png`, `02.png`… | **les visuels finis**, à la racine du dossier du post |
| `posts/<slug>/html/01.html`, `02.html`… | la source : une slide = un HTML autonome |
| `posts/<slug>/legende.md` | angle, plan des slides, légende, hashtags |
| `posts/<slug>/description.txt` | le texte à coller dans TikTok, généré |
| `design/euphemisme.css` | tout le système de design (couleurs, composants, duotone) |
| `design/fox.js` | injecte le renard dans chaque `.foxbadge` vide |
| `assets/` | Nunito + les seules photos réellement utilisées |
| `render.js` | Chrome headless → les PNG, puis les `description.txt` |
| `.claude/hooks/auto-render.js` | le hook qui rend tout seul |

**Un post = un dossier.** Il n'y a aucun manifeste à tenir à jour. Un dossier sans PNG est une
idée pas encore produite.

`description.txt` est régénéré à chaque rendu : **ne jamais l'éditer à la main**, la source est
la section `## Légende` du `legende.md`.

## Créer un nouveau post

1. `mkdir -p posts/<slug>/html` et écrire `posts/<slug>/legende.md` (angle, plan des slides).
2. Copier des HTML existants dans `html/` selon la mise en page voulue :
   `astuces-revisions/html/01.html` (photo à droite) · `astuces-revisions/html/02.html` (schéma) ·
   `figure-litote/html/01.html` (typo seule) · `astuces-revisions/html/04.html` (carte produit).
   Depuis `posts/<slug>/html/`, les chemins sont `../../../design/euphemisme.css` et
   `../../../assets/`.
3. Changer le fil de série, le titre, `.lead`, la preuve, `.feature`.
4. Compléter dans `legende.md` les sections `## Légende` et `## Hashtags`.
5. **Regarder les PNG** — le hook les a déjà rendus. Les collisions d'accents, les débordements de
   titre et les slides creuses ne se voient pas dans le HTML.

## Publier

À la main, depuis le téléphone. Les PNG sont dans `posts/<slug>/`, la légende dans
`description.txt` du même dossier. TikTok accepte **10 images maximum** par carrousel, dans
l'ordre où on les sélectionne.

Le dépôt GitHub est **public** : `.gitignore` exclut le brief marketing. Vérifier après toute
modification du `.gitignore`.
