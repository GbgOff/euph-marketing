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
- Interdits : promesse de note, dénigrement des profs, affiliation Duolingo, faute de français.

## Règles de composition

- **Peu d'éléments, beaucoup d'air.** Chaque élément doit se justifier.
- **Pas de chrome de marque** : ni logo en coin, ni `©2026`, ni `®`, ni pagination `01/04`, ni
  « swipe », ni bandeau de saison. La numérotation d'une série passe par un fil de contenu en haut
  (`01 · 4 ASTUCES POUR…`) — c'est du contenu, pas de la décoration.
- **CTA discret** : `euphemisme.fr` en texte, pas de gros bouton criard.
- **Photos : optionnelles et non systématiques.** C'est un choix de composition, slide par slide —
  alterner photo / schéma / carte produit pour qu'une série ne se répète pas. Les photos de
  `assets/` ne sont pas obligatoires ; on peut en chercher une sur le web (source libre de droits
  type Unsplash/Pexels, à enregistrer dans `assets/`).
- Toute photo passe par le **duotone abricot** de `.photo` (grayscale → sépia → voile
  `mix-blend-mode: color`) : c'est ce qui interdit au vert et aux gris froids d'entrer, et ce qui
  soude n'importe quelle image à la charte.

## Direction artistique

Mélange assumé de deux références :
- **éditorial** (cf. `output/slide-*.png`, ancienne série MEMORA) : titre display géant sur 3
  lignes en haut, photo qui saigne au bord, blocs de texte étroits, grain papier ;
- **charte de l'app** : orange unique `#FF9857` sur fond crème `#FAF6EF`, Nunito 700–900, coins
  très arrondis, bordures basses épaisses, **aucun vert ni teal, aucune palette froide**.

## Technique

- Un post = un ou plusieurs HTML autonomes dans `slides/`, tout le style dans
  `slides/euphemisme.css` (`euphemisme.css` = système 3:4 actuel ; `styles.css` = ancien système
  1:1 MEMORA, ne pas y toucher).
- Canvas **1080 × 1440 px** (3:4). Nunito est embarquée en local (`assets/nunito-var.ttf`).
- **Interlignage des titres** : `.95` par défaut, mais `1.06` dès qu'une capitale accentuée
  (É, À, Ç) est empilée sur une autre ligne — sinon l'accent ou la cédille touche la ligne
  voisine. Toujours vérifier le rendu, pas seulement le HTML.
- Rendu : `./render.sh` → PNG dans `output/`. (Chrome headless, chemin de sortie en absolu Windows.)
- Chaque post s'accompagne d'un `.md` dans `output/` : légende, hashtags, angle, plan de la série.
- Nouvelle astuce : dupliquer `astuce-01.html` (mise en page photo) ou `astuce-02.html`
  (mise en page schéma).

## Publication (Buffer)

Chaîne complète : `slides/*.html` → `render.sh` → `output/*.png` → GitHub Pages → `publish.js` →
file d'attente Buffer.

- **API Buffer** : GraphQL sur `https://api.buffer.com`, clé personnelle en
  `Authorization: Bearer`. Dispo sur tous les plans, gratuit inclus.
  ⚠️ L'ancienne API REST est **retirée le 1er février 2027** — ne jamais suivre un tuto legacy.
- **Buffer n'accepte pas d'upload de fichier.** Les PNG doivent être servis en HTTPS public,
  en lien direct, et **rester joignables jusqu'à la publication** (Buffer les récupère au moment
  où le post part, parfois des jours plus tard). D'où GitHub Pages plutôt qu'une URL signée.
- `assets` est une **liste ordonnée** → l'ordre du carrousel = l'ordre alphabétique des fichiers
  (`figure-01`, `-02`, `-03`). TikTok accepte **10 images maximum**.
- Un post se déclare dans `posts.json` : préfixe des slides + fichier de légende. La légende
  envoyée est la section `## Légende` du `.md`, suivie de la section `## Hashtags`.

```
node publish.js channels        # récupérer BUFFER_CHANNEL_ID
node publish.js figure --dry    # vérifie images + légende, n'envoie rien
node publish.js figure          # ajoute à la file Buffer
```

- **Secrets** : `.env` (jamais committé, voir `.env.example`). Le dépôt étant public,
  `.gitignore` exclut aussi le brief marketing. Vérifier `git check-ignore -v .env` après toute
  modification du `.gitignore`.
- `publish.js` fait un HEAD sur chaque image avant d'envoyer : si une URL n'est pas publique,
  il refuse plutôt que de créer un post qui échouera silencieusement chez Buffer.
