# M291 · Fiche d'atelier · Brief — WATCHLIST

## Pitch

Watchlist est une application mobile qui permet de sauvegarder les films qu'on veut voir et de suivre ceux qu'on a déjà regardés. Elle s'adresse aux jeunes spectateurs qui repèrent des films au fil de la journée et les oublient au moment de choisir quoi regarder le soir.

## Public

**Emma, 21 ans, étudiante en communication.**
Elle utilise l'app surtout chez elle le soir, pour choisir un film seule ou avec ses amis, et rapidement dans les transports pour noter un titre qu'on vient de lui conseiller.
Elle est presque exclusivement sur **téléphone** : gros boutons, tout accessible au pouce.
Elle choisit **par le visuel** : les affiches doivent être grandes et arriver avant le texte.
Elle ferme l'onglet si l'interface est compliquée, chargée de pub, ou si on lui demande de créer un compte avant de pouvoir consulter.

> « Je sais que j'avais vu un film qui avait l'air incroyable, mais impossible de me rappeler le nom… »

## Écrans

- **Écran 1 : Accueil / Recherche** — point d'entrée, barre de recherche et sélection de films
- **Écran 2 : Fiche film** — toutes les infos d'un film et l'ajout à la watchlist
- **Écran 3 : Ma Watchlist** — la liste personnelle, filtrée par statut

## Contenu de chaque écran

### Écran 1 — Accueil / Recherche

**On y voit :**
- Une barre de recherche en haut, visible immédiatement sans scroller
- Une grille d'affiches de films (2 colonnes sur mobile) avec le titre et l'année sous chaque affiche
- Une barre de navigation en bas : Accueil / Ma Watchlist
- Pendant une recherche : les résultats remplacent la grille, en direct
- Si rien ne correspond : « Aucun film trouvé. Vérifiez l'orthographe ou essayez un autre titre. »

**On peut y faire :**
- Taper le titre d'un film pour lancer la recherche
- Parcourir les films proposés en scrollant
- Toucher une affiche pour ouvrir la fiche du film
- Aller sur sa watchlist depuis la navigation du bas

**Bouton principal :** la barre de recherche (c'est le premier geste de la tâche n°1)

### Écran 2 — Fiche film

**On y voit :**
- L'affiche en grand, en haut de l'écran
- Le titre, l'année, la durée, le genre et la note
- Le nom du réalisateur
- Le synopsis
- Le statut actuel si le film est déjà dans la watchlist (À regarder / En cours / Vu)
- Une flèche de retour vers la recherche

**On peut y faire :**
- Lire les informations principales pour décider si le film l'intéresse
- Ajouter le film à sa watchlist
- Changer le statut du film s'il y est déjà
- Revenir en arrière vers les résultats de recherche

**Bouton principal :** « Ajouter à ma Watchlist » — large, en bas de l'écran, toujours atteignable au pouce. Après l'appui, il confirme l'ajout et devient « Dans ma Watchlist ».

### Écran 3 — Ma Watchlist

**On y voit :**
- Trois onglets de filtre : À regarder / En cours / Vu
- La liste des films enregistrés, en lignes : petite affiche à gauche, titre + année + durée à droite
- Le nombre de films dans l'onglet actif
- Si la liste est vide : un message court qui renvoie vers la recherche

**On peut y faire :**
- Filtrer ses films par statut
- Ouvrir la fiche d'un film enregistré
- Changer le statut d'un film (À regarder → En cours → Vu)
- Retirer un film de sa liste

**Bouton principal :** « Chercher un film » (retour vers l'écran 1, surtout utile quand la liste est vide)

## Ambiance visuelle

**Sombre, cinématographique, épurée.**

Comme le hall d'un cinéma le soir : lumière tamisée, les affiches sont éclairées et c'est tout ce qu'on regarde. L'interface disparaît derrière les films — pas de décoration, pas de cadres inutiles, juste des images qui ressortent sur un fond profond.

## Palette

- **Fond :** bleu nuit très sombre, presque noir
- **Texte :** blanc cassé pour les titres, gris clair pour les infos secondaires
- **Accent :** ambre doré (boutons, statut actif, note du film)
- **Attention / erreur :** rouge corail (message « aucun film trouvé », suppression d'un film)

*(Couleurs en mots pour l'instant ; hex en s7-s9.)*

## Interdits

- pas de Bootstrap, pas de React, pas de compte obligatoire pour consulter
- pas de publicité, ni de bannière, ni de pop-up
- pas de menu hamburger : la navigation reste visible en bas de l'écran
- pas de carrousel automatique sur l'accueil
- pas d'écran d'accueil vide : il y a toujours des films affichés avant même de chercher
- pas de bouton de moins de 44 px de haut (utilisation au pouce)
- pas de fiche film qui demande de scroller pour trouver le bouton d'ajout sur mobile
