# Fiche d'observation — e2-7

**Module :** ICT 291 · **Atelier :** e2-7 · **Date :** 27.10.2026
**Documents liés :** `tests-utilisateurs.md` · `Critiques/piste-hybride.md`

| Champ | Relevé |
|---|---|
| **App testée** | Watchlist — maquette *Liquid Glass* (`Maquettes/Watchlist - Liquid Glass.dc.html`) |
| **Testeur** | Matteo Macaluso, 3e année médiamatique — n'avait jamais vu la maquette |
| **Observateur** | Flavio Giannattasio — silence complet, aucune aide pendant les 5 minutes |
| **Tâche donnée** | « Trouvez le film *Parasite*, ouvrez sa fiche et ajoutez-le à votre watchlist. » |

---

## Test 5 secondes

**« C'est une appli pour… »** (phrase de Matteo, mot pour mot) :

> « …pour chercher des films et les mettre de côté. Genre t'as les affiches, tu tapes un titre en haut et tu les gardes dans une liste. »

**Écart avec l'intention :** **faible.** Le pitch du brief dit « sauvegarder les films qu'on veut voir et suivre ceux qu'on a déjà regardés ». Matteo a vu la moitié *sauvegarde* en 5 secondes, mais pas la moitié *suivi* : il n'a pas cité les statuts « À regarder / En cours / Vu », alors que deux pastilles de statut étaient visibles sur les affiches de la grille. Il les a prises pour « des petits labels de genre ».

> Conclusion : la pastille se voit, mais elle ne se *comprend* pas comme un état modifiable.

---

## Test de localisation (sur image — une tâche)

**Consigne dite :** « Montrez où vous tapoteriez pour **faire passer un film de "À regarder" à "Vu"**. »

| Point | Relevé |
|---|---|
| **Le doigt est allé au bon contrôle** | **à côté** |
| **Hésitation** | 9 secondes, doigt suspendu au-dessus de l'écran, regard qui balaie trois fois la rangée de haut en bas |
| **Dit à voix haute** | « Ben… là ? » (il pose le doigt sur la pastille « À regarder » posée sur l'affiche) — puis : « …non, ça fait rien. Alors je sais pas. La flèche c'est pour aller sur le film je pense. » |
| **J'ai aidé** | **oui** — après 1 min 20 au total, j'ai dit « ouvre la fiche du film » pour débloquer la suite du test |

**Ce que ça révèle :** le contrôle réel est le bouton rond `→` placé à droite de chaque rangée de la watchlist. Il est correctement dimensionné (44 × 44 px) et correctement étiqueté pour un lecteur d'écran (`aria-label="Passer Dune au statut suivant"`), mais **rien ne le dit visuellement** : une flèche droite signifie « aller à » dans tout le reste de l'interface. Matteo a d'abord touché l'élément qui *porte* l'information (la pastille) — ce qui est le comportement attendu : on tapote ce qu'on veut changer.

---

## 1 changement que je ferai

**Avant :**
Dans `Ma Watchlist`, le changement de statut passe par un bouton rond `→` sans libellé, collé au bouton rouge `×` (retirer). La pastille de statut, elle, n'est pas interactive.

```
[affiche]  Dune            ( → ) ( × )
           2021 · 2h35
```

**Après (prévu) :**
La **pastille de statut devient le contrôle** : on tapote « À regarder » et elle cycle vers « En cours » puis « Vu », avec le libellé texte toujours affiché. La flèche disparaît, le bouton « retirer » est éloigné de 12 px et reçoit une icône corbeille au lieu d'une croix.

```
[affiche]  Dune            [ ● À regarder ⇄ ]     (🗑)
           2021 · 2h35
```

- L'élément qui affiche l'état est l'élément qui le change → plus d'écart entre ce qu'on voit et ce qu'on touche.
- Le glyphe `⇄` dit « ça tourne », la flèche `→` disait « ça part ailleurs ».
- Hauteur de cible : 44 px conservée ; l'écart de 12 px avec le bouton destructif supprime le risque de touche ratée relevé pendant le test.

---

*Relevé complet des temps, du Think Aloud et des correctifs priorisés : `tests-utilisateurs.md`.*
