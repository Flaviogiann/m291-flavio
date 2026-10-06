# Matrice de décision multicritère pondérée

**Projet :** Watchlist · **Module :** ICT 291 · **Atelier :** S07-AV2
**Objet :** arbitrage objectif entre les trois pistes graphiques de la semaine 7.

---

## 1. Critères et coefficients

| Critère | Coeff. | Ce qu'on mesure | Pourquoi ce poids |
|---|:---:|---|---|
| **Lisibilité** | ×3 | Hiérarchie de l'information, contraste du texte, absence de redondance | Emma scanne la grille en quelques secondes : si elle ne lit pas, elle ferme |
| **Accessibilité** | ×3 | Ratios WCAG AA (4.5:1), taille des cibles tactiles (≥ 44 px), information non portée par la couleur seule | Critère non négociable du module |
| **Ergonomie mobile** | ×3 | Position des actions dans la zone atteignable au pouce, usage à une main | Fait n°3 du persona : Emma est presque exclusivement sur téléphone |
| **Fidélité au pitch** | ×2 | Respect de l'ambiance définie dans le brief : sombre, cinématographique, épurée, affiches au premier plan | Le brief est le contrat de départ |
| **Facilité d'intégration** | ×2 | Faisabilité en HTML/CSS sans framework, en 4 semaines, avec le niveau actuel | Contrainte de projet : pas de Bootstrap, pas de React |

> Les quatre premiers coefficients proviennent de la fiche d'atelier. J'ai ajouté **Ergonomie mobile ×3** parce que la totalité du persona repose sur un usage téléphone à une main, et qu'aucun des quatre autres critères ne mesure la position physique des commandes à l'écran.

**Total des coefficients :** 13 → **score maximum théorique : 65 points**

---

## 2. Notes attribuées (1 à 5)

| Critère | Coeff. | Piste 1 Liquid Glass | Piste 2 Carte & badge | Piste 3 Éditorial |
|---|:---:|:---:|:---:|:---:|
| Lisibilité | ×3 | 3 | 4 | 5 |
| Accessibilité | ×3 | 3 | 3 | 4 |
| Ergonomie mobile | ×3 | 5 | 2 | 3 |
| Fidélité au pitch | ×2 | 5 | 3 | 2 |
| Facilité d'intégration | ×2 | 3 | 4 | 4 |

### Justification des notes

**Lisibilité** — Piste 3 (5) : hiérarchie typographique complète, contraste indépendant de l'image. Piste 2 (4) : statut très net mais genre absent sous les titres. Piste 1 (3) : titre dupliqué sur et sous la carte, contraste dépendant de l'affiche.

**Accessibilité** — Piste 3 (4) : meilleur ratio texte/fond, mais cibles tactiles en texte seul. Pistes 1 et 2 (3) : contrastes à vérifier pour la première (transparence du verre, texte sur affiche), cibles mal placées pour la seconde.

**Ergonomie mobile** — Piste 1 (5) : recherche, filtres et navigation tous dans la moitié basse de l'écran. Piste 3 (3) : navigation basse présente mais cibles fines. Piste 2 (2) : onglets principaux en haut, inatteignables au pouce.

**Fidélité au pitch** — Piste 1 (5) : fond bleu nuit, affiches mises en avant, exactement l'ambiance « hall de cinéma le soir » du brief. Piste 2 (3) : sombre mais sans direction affirmée. Piste 3 (2) : fond crème, l'inverse de la palette annoncée.

**Facilité d'intégration** — Pistes 2 et 3 (4) : CSS standard, aucune difficulté. Piste 1 (3) : `backdrop-filter` demande des fallbacks et coûte en performance sur mobile d'entrée de gamme.

---

## 3. Calcul pondéré

### Piste 1 — Liquid Glass

| Critère | Note | × Coeff. | Points |
|---|:---:|:---:|:---:|
| Lisibilité | 3 | ×3 | 9 |
| Accessibilité | 3 | ×3 | 9 |
| Ergonomie mobile | 5 | ×3 | 15 |
| Fidélité au pitch | 5 | ×2 | 10 |
| Facilité d'intégration | 3 | ×2 | 6 |
| **TOTAL** | | | **49 / 65** |

### Piste 2 — Carte & badge

| Critère | Note | × Coeff. | Points |
|---|:---:|:---:|:---:|
| Lisibilité | 4 | ×3 | 12 |
| Accessibilité | 3 | ×3 | 9 |
| Ergonomie mobile | 2 | ×3 | 6 |
| Fidélité au pitch | 3 | ×2 | 6 |
| Facilité d'intégration | 4 | ×2 | 8 |
| **TOTAL** | | | **41 / 65** |

### Piste 3 — Éditorial

| Critère | Note | × Coeff. | Points |
|---|:---:|:---:|:---:|
| Lisibilité | 5 | ×3 | 15 |
| Accessibilité | 4 | ×3 | 12 |
| Ergonomie mobile | 3 | ×3 | 9 |
| Fidélité au pitch | 2 | ×2 | 4 |
| Facilité d'intégration | 4 | ×2 | 8 |
| **TOTAL** | | | **48 / 65** |

---

## 4. Classement

| Rang | Piste | Score pondéré | Écart avec le 1er |
|:---:|---|:---:|:---:|
| 🥇 | **Liquid Glass** | **49 / 65** | — |
| 🥈 | Éditorial | 48 / 65 | −1 |
| 🥉 | Carte & badge | 41 / 65 | −8 |

---

## 5. Synthèse d'arbitrage

La pondération confirme le choix de la **Piste 1 « Liquid Glass »**, mais elle en révèle la vraie nature : l'écart avec la Piste Éditorial n'est que d'**un point sur 65**, soit 1.5 %. Mathématiquement, ces deux pistes sont à égalité ; elles gagnent simplement sur des terrains différents.

Liquid Glass l'emporte sur **Ergonomie mobile** (15 points contre 9) et sur **Fidélité au pitch** (10 contre 4), c'est-à-dire sur les deux dimensions qui touchent au contrat de départ du projet : un persona exclusivement mobile et une ambiance sombre et cinématographique annoncée dans le brief. Ces écarts sont structurels — ils tiennent à l'architecture de l'écran et au parti pris chromatique, et on ne peut pas les corriger sans refaire la piste.

Éditorial l'emporte sur **Lisibilité** (15 contre 9) et **Accessibilité** (12 contre 9). Mais ces deux écarts, eux, sont **corrigeables** : ils viennent d'un titre dupliqué et d'un contraste non garanti, pas d'une erreur de conception. En appliquant les six corrections listées dans `critique.md`, Liquid Glass remonterait à 4 sur ces deux critères, soit **55 / 65**, loin devant.

Le score de la Piste 2 (41) s'effondre presque entièrement sur un seul critère : 6 points sur 15 en ergonomie mobile. Une navigation placée hors de la zone du pouce coûte plus cher que tous ses autres avantages réunis.

**Décision :** nous retenons Liquid Glass comme direction de base et nous lui intégrons les forces mesurées de la Piste 3 — hiérarchie typographique et exigence de contraste — plutôt que de choisir entre deux pistes que les chiffres déclarent équivalentes. La feuille de style de ce compromis est détaillée dans `piste-hybride.md`.

---

## 6. Vérification

- [x] Les coefficients sont définis et justifiés avant l'attribution des notes.
- [x] Chaque note repose sur un élément observable dans les maquettes.
- [x] La supériorité de la proposition retenue est démontrée par le calcul, et sa fragilité (écart de 1 point) est explicitement reconnue.

**Commit :** `Ajoute l'atelier d'approfondissement s07-av2-matrice-decision-multicritere.`
