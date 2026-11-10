# Étiquettes

Les étiquettes de `data.json`, telles qu'elles sont écrites dans le fichier.
**Les majuscules et les accents comptent** : `realisateur` n'est pas
`Realisateur`, et une clé mal orthographiée renvoie `undefined` sans
prévenir — le navigateur n'affiche aucune erreur, juste une case vide.

Le catalogue est un tableau de 30 objets. Chaque objet est un film et porte
exactement ces onze étiquettes.

| Étiquette | Type | Exemple | Ce que c'est |
| --- | --- | --- | --- |
| `id` | texte | `"dune"` | Identifiant court et unique. Sert de clé dans le stockage de la watchlist et dans `data-ouvrir`. Jamais affiché. |
| `titre` | texte | `"Dune"` | Le titre du film. |
| `date` | nombre | `2021` | L'année de sortie. Un nombre, pas une chaîne : pas de guillemets. |
| `genre` | texte | `"Science-fiction"` | Un seul genre par film. C'est lui qui remplit les pilules de filtre. |
| `duree` | texte | `"2h35"` | Une chaîne, pas un nombre : `2h35` ne se calcule pas. |
| `realisateur` | texte | `"Denis Villeneuve"` | Peut contenir deux noms (`"Lana et Lilly Wachowski"`). |
| `note` | nombre | `8.5` | De 0 à 10, avec une décimale. |
| `recommande` | **vrai / faux** | `true` | La seule étiquette booléenne. `true` affiche un badge « Coup de cœur », `false` n'affiche rien. |
| `pitch` | texte | `"Paul Atréides quitte…"` | Deux ou trois phrases. Affiché seulement sur la fiche. |
| `c1` | texte | `"#6B4A2A"` | Couleur sombre de l'affiche, en hexadécimal. |
| `c2` | texte | `"#E3B274"` | Couleur claire de l'affiche. Avec `c1`, elle forme le dégradé. |

## Pourquoi pas d'accent dans les noms d'étiquettes

`duree` et non `durée`, `realisateur` et non `réalisateur`.

Une clé accentuée est du JSON parfaitement valide, mais le même « é » peut
être enregistré de deux façons différentes en Unicode : soit un seul
caractère, soit un « e » suivi d'un accent combinant. Les deux s'affichent
pareil à l'écran. Si le fichier `.json` est enregistré d'une façon et le
`.js` de l'autre, `film.durée` renvoie `undefined` et rien ne le signale.

Les noms sans accent ne peuvent pas avoir ce problème. C'est aussi la
convention du fichier d'exemple du cours, qui écrit `resume` et non
`résumé`.

## Trois pièges déjà rencontrés

- **Une virgule en trop** avant une accolade fermante casse tout le fichier,
  pas seulement la fiche concernée. Le message du navigateur donne la ligne.
- **Un tableau vide `[]`** est valide. Ce n'est pas une erreur : c'est l'état
  « vide », qui mérite son propre message.
- **`'` n'est pas `"`** : JSON n'accepte que les guillemets droits doubles.

## Où est le fichier

`data.json`, à la racine du dépôt, à côté de `index.html` et `app.js`.

Les documents de conception (la maquette, le brief, le dossier Design)
restent dans `Application - Watchlist/`.
