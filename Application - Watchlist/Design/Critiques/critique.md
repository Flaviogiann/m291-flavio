# Critique comparative & arbitrage de direction artistique

**Projet :** Watchlist · **Module :** ICT 291 — Développer des interfaces utilisateurs (UI)
**Atelier :** e2-6 · **Auteur :** Flavio Giannattasio

**Persona de référence :** Emma, 21 ans, utilise son téléphone, choisit par le visuel, veut aller vite.
**Tâche de référence :** rechercher un film → consulter sa fiche → l'ajouter à sa Watchlist.

**Documents liés :** `fiche-critique.md` (fiches détaillées par piste) · `matrice-decision.md` (matrice pondérée) · `piste-hybride.md` (feuille de style retenue)

---

## 1. Les trois pistes évaluées

| Piste | Nom | Caractéristiques |
|---|---|---|
| **1** | Liquid Glass | Fond bleu nuit, cartes et filtres en verre dépoli, barre de navigation flottante, pastilles de statut colorées posées sur les affiches |
| **2** | Carte & badge | Onglets de navigation en haut (Films / Ma Watchlist), section « Sélection du moment », statut en capitales sur chaque carte |
| **3** | Éditorial | Fond crème, typographie serif, hero « Choix de la rédaction », filtres en onglets soulignés, navigation basse en texte seul |

---

## 2. Matrice d'évaluation comparative

Notation de 1 (insuffisant) à 5 (excellent), appliquée à la tâche n°1 et au persona.

| Critère | Piste 1 — Liquid Glass | Piste 2 — Carte & badge | Piste 3 — Éditorial |
|---|:---:|:---:|:---:|
| **Lisibilité** | 3 | 4 | 5 |
| **Navigation** | 4 | 2 | 3 |
| **Feedback** | 5 | 4 | 2 |
| **Cohérence** | 5 | 3 | 4 |
| **Accessibilité** | 3 | 3 | 4 |
| **TOTAL /25** | **20** | **16** | **18** |

### Justification des notes

**Lisibilité**
- Piste 1 (3) — les titres sont posés directement sur les affiches, donc le contraste dépend de l'image ; le titre est ensuite répété sous la carte, ce qui double l'information et allonge la grille.
- Piste 2 (4) — le statut en capitales se lit immédiatement, mais le genre n'apparaît pas sous le titre alors que le brief le prévoit.
- Piste 3 (5) — texte foncé sur fond crème, hiérarchie explicite : sur-titre, titre, puis réalisateur et durée.

**Navigation**
- Piste 1 (4) — filtres en pilules défilantes et barre flottante à deux entrées, tout est en bas de l'écran donc atteignable au pouce. Réserve : la barre flottante recouvre la dernière rangée de films pendant le défilement.
- Piste 2 (2) — les onglets Films / Ma Watchlist sont en haut de l'écran, hors de portée du pouce sur un téléphone.
- Piste 3 (3) — navigation basse présente mais en texte seul, sans icône ni fond contrasté ; les onglets de genre soulignés offrent des cibles tactiles fines.

**Feedback**
- Piste 1 (5) — pastille « À regarder » / « Vu » visible sur l'affiche et filtre actif en pilule blanche pleine : l'état du système est lisible sans ouvrir la fiche.
- Piste 2 (4) — badge de statut explicite sur chaque carte, mais aucun état visible sur les filtres de genre.
- Piste 3 (2) — aucun indicateur de statut sur l'accueil : le cœur fonctionnel de l'application devient invisible.

**Cohérence**
- Piste 1 (5) — même matière (verre dépoli), même rayon d'arrondi et même traitement de pilule sur les filtres, les pastilles et la navigation.
- Piste 2 (3) — onglets hauts, badges capitales et cartes ne partagent pas de langage visuel commun affirmé.
- Piste 3 (4) — système typographique serif tenu de bout en bout, mais la navigation basse ne reprend aucun code du reste de l'écran.

**Accessibilité**
- Piste 1 (3) — le fond sombre et le blanc cassé donnent un bon ratio, mais le texte posé sur affiche et le gris secondaire sont à vérifier ; la transparence du verre réduit le contraste réel.
- Piste 2 (3) — contrastes corrects, mais cibles tactiles hautes mal placées pour un usage à une main.
- Piste 3 (4) — meilleur contraste texte/fond du panel, mais onglets et navigation en texte seul produisent des cibles inférieures à 44 px.

---

## 3. Paragraphe d'arbitrage

Nous retenons la **Piste 1 « Liquid Glass »** pour la qualité de son feedback d'état et sa navigation entièrement accessible au pouce, qui répondent aux deux contraintes fortes du persona : un usage mobile à une main et le besoin de savoir immédiatement ce qui a déjà été vu. Elle obtient 20 points sur 25 contre 18 pour la Piste 3 et 16 pour la Piste 2, et elle est la seule à rendre visible, dès l'accueil, la donnée centrale de l'application — le statut du film. Nous lui intégrons la **hiérarchie typographique et l'exigence de contraste de la Piste 3** : suppression du titre redondant sous les cartes, titre unique posé sur l'affiche avec un bandeau dégradé opaque qui garantit le ratio, et métadonnées « année · genre » en gris clair sous la carte. Nous reprenons également de la **Piste 2 le libellé textuel du statut** plutôt qu'un code couleur seul, afin que l'information reste lisible pour une personne daltonienne.

La matrice pondérée (`matrice-decision.md`) confirme ce choix mais resserre l'écart à 49 contre 48 : c'est précisément pourquoi l'arbitrage est hybride et non un choix sec.

---

## 4. Corrections à appliquer à la piste retenue

1. Ajouter un dégradé sombre opaque sous chaque titre posé sur une affiche, pour garantir un contraste d'au moins 4.5:1 quelle que soit l'image.
2. Supprimer la répétition du titre sous la carte ; ne garder que « année · genre ».
3. Conserver le libellé texte à côté de la pastille de statut, jamais la couleur seule.
4. Prévoir une marge de défilement en bas de la grille pour que la barre flottante ne masque plus la dernière rangée.
5. Vérifier le gris secondaire sur fond bleu nuit et le remonter si le ratio descend sous 4.5:1.
6. Vérifier que chaque pilule de filtre et chaque entrée de navigation mesure au moins 44 px de haut.

---

## 5. Vérification

- [x] L'arbitrage repose sur cinq critères notés et sur des éléments observables dans les maquettes, pas sur une préférence esthétique.
- [x] Chaque élimination est justifiée par un fait du persona ou une étape de la tâche n°1.
- [x] La piste retenue est assortie de corrections vérifiables (contraste, taille de cible, redondance).

**Commit :** `Formalise la critique comparative et l'arbitrage de design dans design/critique.md`
