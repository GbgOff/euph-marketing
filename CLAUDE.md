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

Tout est **local**. Aucun service tiers, aucune clé, aucune publication automatique : on produit
des PNG dans un dossier, et c'est toi qui les publies à la main depuis TikTok — c'est le seul
moyen d'ajouter un son.

## La chaîne complète

```
posts/<slug>/html/01.html  ──render.sh──>  posts/<slug>/01.png
posts/<slug>/legende.md    ──render.sh──>  posts/<slug>/description.txt
```

Une seule commande :

```
sh render.sh figure-litote      un post
sh render.sh                    tous les posts
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
| `render.sh [slug]` | Chrome headless → les PNG en 1080×1440, puis les descriptions |
| `descriptions.js` | écrit `posts/*/description.txt` (appelé par `render.sh`) |

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
3. Changer le fil de série, le titre, `.lead`, `.feature`.
4. Compléter dans `legende.md` les sections `## Légende` et `## Hashtags`.
5. `sh render.sh <slug>`, puis **regarder les PNG** — les collisions d'accents et les
   débordements de titre ne se voient pas dans le HTML.

## Publier

À la main, depuis le téléphone. Les PNG sont dans `posts/<slug>/`, la légende dans
`description.txt` du même dossier. TikTok accepte **10 images maximum** par carrousel, dans
l'ordre où on les sélectionne.

Le dépôt GitHub est **public** : `.gitignore` exclut le brief marketing. Vérifier après toute
modification du `.gitignore`.
