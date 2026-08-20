# Carrousel — « 4 astuces pour accélérer tes révisions »

**Format** : 4 images TikTok 1080 × 1440 (3:4)
**Stratégie** : le post donne d'abord de la valeur. Les slides 01→03 sont des conseils de méthode
qui tiennent debout sans l'app ; chacune se termine par une mention produit d'une ligne, filet
abricot, jamais de bouton. La slide 04 présente l'app frontalement — et elle est légitime parce
qu'elle est la synthèse exacte des trois conseils précédents.

| Slide | Conseil | Feature glissée |
|---|---|---|
| 01 | Relire, c'est du temps perdu → rappel actif | 12 types d'exercices |
| 02 | Révise juste avant d'oublier → J+1 / J+7 / J+30 | révision mémoire (SRS) |
| 03 | L'oral se travaille tout haut | entraînement à l'entretien toute l'année |
| 04 | « Ou tu fais les trois en 5 minutes » | l'app + gratuit / sans pub / programme 2026 |

## Légende

> 4 astuces pour accélérer tes révisions de français 👇
>
> 1. Relire ne sert à rien : ferme le cours et restitue de mémoire.
> 2. Trois rappels courts (J+1, J+7, J+30) battent trois heures d'affilée.
> 3. L'oral se travaille tout haut, debout, chronomètre en main — pas la veille.
> 4. Ou tu fais les trois en 5 min par jour, gratuitement → euphemisme.fr
>
> Programme officiel 2026, les 12 œuvres, l'écrit ET l'oral. Sans pub, sans carte bancaire.

## Hashtags

#bac2026 #bacdefrancais #premiere #revisions #methode #pourtoi #oraldefrancais #lycee

## Réutiliser le gabarit

Chaque slide est un HTML autonome dans `slides/`, tout le style vient de `slides/euphemisme.css`.
Pour une nouvelle astuce : dupliquer `astuce-01.html` (mise en page photo) ou `astuce-02.html`
(mise en page schéma), changer le numéro de série, le titre, `.lead` et `.feature`.
`./render.sh` réexporte tous les PNG.
