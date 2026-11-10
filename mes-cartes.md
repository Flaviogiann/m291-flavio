# Mes cartes

Une ligne par texte écrit à la main dans **une** carte de mon `index.html`
(semaine 9). Les étiquettes viennent de `etiquettes.md` (semaine 10).

L'application est à la racine du dépôt : `index.html`, `app.js`, `data.json`
et `css/`. Les documents de conception restent dans
`Application - Watchlist/`.

## La carte

`li` puis `button.carte`.

Le `<li>` n'est là que pour la liste ; c'est le `<button>` qui porte la
carte entière, parce que la carte entière est cliquable et doit donc être
un vrai bouton — atteignable au clavier et annoncé comme bouton.

À l'intérieur, tout est en `<span>` : `<div>` est interdit dans un
`<button>`. La feuille de style les passe en `display: block`, sans quoi
`aspect-ratio` ne s'appliquerait pas sur l'affiche.

## Ce qu'elle montre

| Texte écrit à la main | Étiquette de `data.json` qui le remplace | Élément et classe |
| --- | --- | --- |
| `Dune` (sur l'affiche) | `titre` | `span.carte__titre` |
| `Dune` (sous l'affiche) | `titre` | `span.carte__nom` |
| `2021` | `date` | `span.carte__sous-titre` |
| `Science-fiction` | `genre` | `span.carte__sous-titre` |
| `Coup de cœur` | `recommande` | `span.badge.badge--coeur` |
| `À regarder` | *aucune* — vient du `localStorage` | `span.badge` |

Deux remarques sur ce tableau.

**Le titre apparaît deux fois**, une fois sur l'affiche et une fois en
dessous. C'est fidèle à la maquette, mais c'est la même étiquette affichée
deux fois dans la même carte. À trancher : garder, ou ne laisser que
`carte__nom`.

**`À regarder` n'est pas dans `data.json`**, et c'est volontaire. Le statut
appartient à l'utilisateur, pas au catalogue : il est enregistré dans le
`localStorage` sous la clé `wl-glass`. Le catalogue est en lecture seule,
identique pour tout le monde ; la watchlist est propre à chaque visiteur.
`date` et `genre` partagent la même ligne de texte, séparés par un point
médian ajouté par le JavaScript.

Les quatre étiquettes qui ne servent pas sur la carte servent sur la fiche :
`duree` et `note` dans les tags, `realisateur` sous « Réalisation »,
`pitch` en synopsis. `c1` et `c2` ne sont jamais du texte : le JavaScript
les pose en variables CSS et la feuille de style en fait le dégradé de
l'affiche.

## Les étiquettes vrai ou faux

| Étiquette | Si `true` : texte, classe | Si `false` : texte, classe |
| --- | --- | --- |
| `recommande` | `Coup de cœur`, `span.badge.badge--coeur` (et `span.tag.tag--coeur` sur la fiche) | rien du tout — aucun élément n'est créé |

Afficher « non recommandé » serait du bruit : l'absence de badge dit déjà
tout, et l'affiche respire. Le badge est en haut à **gauche**, parce que la
pastille de statut occupe déjà le coin droit ; les deux peuvent donc
cohabiter sur la même affiche.

## Le conteneur

`ul.grille`, `id="grille"`.

C'est lui que `app.js` appelle `conteneur`, et c'est `afficherLieux(liste)`
qui le remplit. Il part vide dans le HTML, avec l'attribut `hidden` : tant
que les données ne sont pas arrivées, il n'y a pas de cadre vide à l'écran.
Le paragraphe `p#etat` juste au-dessus porte les messages des quatre états.
