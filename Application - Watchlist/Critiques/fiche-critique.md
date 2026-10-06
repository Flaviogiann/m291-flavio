# Fiches critiques — Watchlist

**Module :** ICT 291 · **Atelier :** e2-6
**Persona :** Emma, 21 ans, téléphone, choisit par le visuel, veut aller vite.
**Tâche :** rechercher un film → consulter sa fiche → l'ajouter à sa Watchlist.

---

## Fiche critique — design **1** · direction **Liquid Glass**

### 2 forces

1. **Critère :** Feedback — **preuve :** une pastille « À regarder » / « Vu » est posée directement sur l'affiche dans la grille d'accueil, et le filtre actif est un aplat blanc plein parmi des pilules translucides. L'état du système se lit sans ouvrir aucune fiche.
2. **Critère :** Cohérence — **preuve :** une seule matière (verre dépoli) et un seul rayon d'arrondi sont déclinés sur les pilules de filtre, les pastilles de statut et la barre de navigation flottante.

### 2 faiblesses

1. **Critère :** Lisibilité — **preuve :** le titre du film apparaît deux fois, posé sur l'affiche puis répété juste en dessous de la carte. L'information est doublée et chaque rangée occupe plus de hauteur que nécessaire.
2. **Critère :** Accessibilité — **preuve :** le texte blanc est posé sur une affiche dont la luminosité varie d'un film à l'autre, sans bandeau opaque pour garantir le ratio ; la barre flottante recouvre la dernière rangée de la grille.

### Verdict

Je garde ce design parce que : Emma utilise son téléphone à une main (fait n°3 du persona) et cette piste place la recherche, les filtres et la navigation dans la zone du pouce. Elle est aussi la seule à afficher le statut dès l'accueil, qui est la raison d'être de l'application — Emma veut savoir ce qu'elle a déjà vu sans ouvrir chaque fiche. Les deux faiblesses relevées sont corrigeables sans toucher à la direction artistique.

---

## Fiche critique — design **2** · direction **Carte & badge**

### 2 forces

1. **Critère :** Lisibilité — **preuve :** le statut est écrit en capitales sur chaque carte (« À REGARDER », « VU », « EN COURS »), c'est l'affichage le plus net des trois pistes et il ne dépend d'aucun code couleur.
2. **Critère :** Feedback — **preuve :** chaque carte de la section « Sélection du moment » porte son état, donc aucune ambiguïté sur ce qui a déjà été ajouté à la liste.

### 2 faiblesses

1. **Critère :** Navigation — **preuve :** les onglets principaux « Films » et « Ma Watchlist » sont placés tout en haut de l'écran, hors de portée du pouce sur un téléphone tenu à une main.
2. **Critère :** Cohérence — **preuve :** onglets hauts, badges en capitales et cartes ne partagent aucun traitement visuel commun — ni arrondi, ni matière, ni famille de composant identifiable.

### Verdict

J'élimine ce design parce que : sa navigation haute contredit frontalement le fait n°3 du persona, et sa seule force réelle (le statut explicite) existe déjà dans la piste 1 sous une forme plus intégrée. Il n'apporte rien que je ne puisse récupérer ailleurs. Je retiens toutefois son **libellé texte du statut**, à conserver à côté de la pastille colorée pour les personnes daltoniennes.

---

## Fiche critique — design **3** · direction **Éditorial**

### 2 forces

1. **Critère :** Lisibilité — **preuve :** hiérarchie typographique complète sur le hero — sur-titre « CHOIX DE LA RÉDACTION », titre en serif, puis réalisateur et durée en petites capitales bleues. L'œil sait dans quel ordre lire.
2. **Critère :** Accessibilité — **preuve :** texte foncé sur fond crème, c'est le contraste texte/fond le plus élevé des trois pistes, et il ne dépend pas de l'image d'affiche.

### 2 faiblesses

1. **Critère :** Feedback — **preuve :** aucun indicateur de statut n'apparaît sur les cartes de l'accueil. Emma doit ouvrir chaque fiche pour savoir si le film est déjà dans sa liste.
2. **Critère :** Navigation — **preuve :** les onglets de genre sont de simples mots soulignés et la navigation basse est en texte seul, sans fond ni icône : les cibles tactiles sont bien en dessous des 44 px recommandés.

### Verdict

J'élimine ce design comme direction principale parce que : le statut du film est la donnée centrale de l'application et cette piste le fait disparaître de l'écran d'accueil. Le fond crème s'éloigne aussi de l'ambiance définie dans le brief (sombre, cinématographique). Je lui emprunte en revanche sa **hiérarchie typographique** et son **exigence de contraste**, intégrées dans `piste-hybride.md`.

---

## Synthèse

| Design | Direction | Verdict |
|---|---|---|
| 1 | Liquid Glass | **Gardé** — base de la direction finale |
| 2 | Carte & badge | Éliminé — libellé texte du statut récupéré |
| 3 | Éditorial | Éliminé — hiérarchie typo et contraste récupérés |
