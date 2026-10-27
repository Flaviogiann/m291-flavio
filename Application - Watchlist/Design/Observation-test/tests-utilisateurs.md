# Tests utilisateurs & audit d'accessibilité — Watchlist

**Module :** ICT 291 · **Atelier :** e2-7 · **Date :** 27.10.2026
**Objet testé :** maquette *Liquid Glass* — `Maquettes/Watchlist - Liquid Glass.dc.html`
**Documents liés :** `fiche-observation.md` · `Critiques/piste-hybride.md` · `audit-wcag-avance.md`

---

## 1. Dispositif

| Élément | Valeur |
|---|---|
| **Testeur** | Matteo Macaluso — 3e année médiamatique, n'avait jamais vu la maquette |
| **Observateur** | Flavio Giannangeli |
| **Modalité** | Binômes croisés : Matteo a testé Watchlist, j'ai testé son projet dans la seconde moitié de la période |
| **Support** | Maquette ouverte dans Chrome, fenêtre réduite à 430 × 860 px, défilement à la souris et au doigt sur écran tactile |
| **Chronomètre** | 5 minutes, lancé au moment où la consigne est dite |
| **Posture de l'observateur** | Silence absolu. Aucune main guidée, aucun choix justifié, aucune hésitation reprochée. Une seule intervention, consignée ci-dessous, pour débloquer la fin du test. |

### Scénario de test en 1 phrase

> « **Trouvez le film *Parasite*, ouvrez sa fiche et ajoutez-le à votre watchlist.** »

Puis, le chronomètre toujours en marche :

> « **Faites maintenant passer un film de "À regarder" à "Vu".** »

Le scénario est tiré de la tâche n°1 du brief (« Emma note un titre qu'on vient de lui conseiller ») et de la raison d'être de l'application : suivre ce qu'on a déjà vu.

---

## 2. Relevé d'observation

### 2.1 Temps mesurés

| Tâche | Temps | Résultat |
|---|---|---|
| T1 — Chercher *Parasite* et ouvrir sa fiche | **19 s** | Réussie sans aide |
| T2 — Ajouter le film à la watchlist | **12 s** (cumul : **31 s**) | Réussie sans aide |
| T3 — Retrouver le film dans « Ma Watchlist » | **34 s** (cumul : **1 min 05**) | Réussie sans aide, après un détour |
| T4 — Faire passer un film de « À regarder » à « Vu » | **abandon à 2 min 18**, puis réussie en 11 s après mon aide | **Échouée sans aide** |

Les trois premières tâches, qui forment le parcours principal du brief, sont **largement sous la minute**. Le blocage est entier sur T4.

### 2.2 Hésitations observées

| # | Moment | Ce que j'ai vu |
|---|---|---|
| H1 | Écran d'accueil, 0–3 s | Le doigt part vers la barre de recherche sans hésiter. Aucune friction d'entrée : la barre est au-dessus de la ligne de flottaison, comme prévu au brief. |
| H2 | Pendant la frappe de « para » | Arrêt net de la frappe, regard qui remonte vers le titre de section. Les résultats se substituent à la grille « À l'affiche » en direct, le titre passe à « Résultats », et Matteo cherche ce qui vient de bouger. **Friction d'1,5 s, non bloquante.** |
| H3 | Fiche film, après l'appui sur « Ajouter à ma Watchlist » | Le bouton devient « ✓ Dans ma Watchlist », mais la confirmation (toast) s'affiche **en haut de l'écran**, loin du doigt. Les yeux de Matteo restent en bas. Il relit le bouton deux fois pour vérifier que l'action a porté. Le toast a déjà disparu — il ne reste affiché que 2,4 s. |
| H4 | Fiche film, 5 s plus tard | **Deuxième appui sur le même bouton**, pour « voir si c'était bien pris ». L'appui le téléporte sur l'écran « Ma Watchlist » — comportement que le libellé n'annonce pas. Désorientation visible : il cherche la flèche de retour pendant 4 s. |
| H5 | Écran Ma Watchlist, T4 | 9 s de doigt suspendu, trois balayages verticaux de la rangée. Appui sur la pastille de statut posée sur l'affiche (non interactive), puis sur la ligne du film (qui ouvre la fiche), puis retour en arrière. Boucle répétée deux fois. |
| H6 | Fiche film, T4 | Le sélecteur de statut à trois segments (« À regarder / En cours / Vu ») existe, mais **au milieu de la fiche, sous le synopsis**, hors de la zone visible sans défiler. Matteo n'a pas défilé : il estimait avoir déjà tout vu de la fiche. |

### 2.3 Think Aloud — remarques spontanées

Transcription des phrases dites à voix haute, dans l'ordre :

1. *« Ah ok, ça cherche en direct. »* — H2
2. *« C'est joli, on voit que les affiches. »* — pendant le défilement de la grille
3. *« Attends, le titre est écrit deux fois. »* — grille d'accueil : le titre apparaît posé sur l'affiche **et** répété sous la carte
4. *« Voilà, ajouté. Enfin je crois ? »* — H3, pouce toujours sur le bouton
5. *« Ah non, ça m'a envoyé sur la liste, j'ai rien demandé. »* — H4
6. *« Ben… là ? »* (doigt sur la pastille « À regarder ») *« …non, ça fait rien. »* — H5
7. *« La flèche c'est pour aller sur le film je pense. »* — H5, à propos du bouton `→` qui est justement le contrôle de statut
8. *« Si je savais pas que ça existait, je l'aurais jamais trouvé. »* — après mon aide, sur le changement de statut

**La remarque n°3 confirme un défaut déjà relevé en analyse** (`Critiques/fiche-critique.md`, faiblesse n°1 de la piste Liquid Glass) : la duplication du titre avait été repérée à l'œil, elle est maintenant confirmée par un utilisateur réel qui s'arrête dessus. Elle est déjà corrigée dans `Critiques/piste-hybride.md`.

---

## 3. Audit d'accessibilité

### 3.1 Contraste du bouton principal

**Bouton mesuré :** « Ajouter à ma Watchlist » — bouton principal de l'écran 2, le seul de la tâche n°1 du brief.

| Mesure | Couleurs relevées à la pipette | Ratio mesuré | Seuil WCAG AA | Verdict |
|---|---|---|---|---|
| **Texte du bouton, état par défaut** | `#0B0C10` sur `#FFFFFF` | **19,55 : 1** | ≥ 4,5 : 1 | ✅ |
| **Texte du bouton, état « ✓ Dans ma Watchlist »** | `#FFFFFF` sur `rgba(255,255,255,.14)` composité sur `#07080D` | **13,8 : 1** | ≥ 4,5 : 1 | ✅ |
| **Contour du bouton contre son conteneur** | aucune bordure : le bouton est un aplat plein | n/a | ≥ 3 : 1 (1.4.11) | ✅ forme portée par l'aplat, pas par une bordure |

Méthode : couleurs relevées dans l'inspecteur Chrome, ratios recalculés avec la formule de luminance relative WCAG 2.2. Les valeurs `rgba` ont été compositées sur leur fond réel avant calcul — l'inspecteur ne le fait pas et annonce des ratios faux sur les surfaces translucides.

**Autres contrastes de texte vérifiés sur le même parcours :**

| Élément | Couleurs | Ratio | Verdict |
|---|---|---|---|
| Titre de fiche film | `#FFFFFF` sur `#07080D` | 20,01 : 1 | ✅ |
| Métadonnées (année · genre) | `rgba(235,238,245,.62)` sur fond | 6,83 : 1 | ✅ |
| Texte d'invite de la recherche | `rgba(235,238,245,.55)` sur fond | 5,56 : 1 | ✅ |
| Onglet de filtre inactif | `rgba(235,238,245,.66)` sur fond du groupe | 7,38 : 1 | ✅ |
| Message « Aucun film trouvé » | `#FF8A80` sur bandeau corail | 8,08 : 1 | ✅ |
| **Bordures de verre `rgba(255,255,255,.12–.14)`** | composité sur `#07080D` | **1,32 à 1,41 : 1** | ❌ **< 3 : 1** |

> **Aucun texte n'échoue.** Le seul échec de contraste porte sur les **bordures** des composants de verre, qui tombent sous le seuil de 3:1 du critère 1.4.11 (éléments d'interface). Détail et correctif : `audit-wcag-avance.md` § 4.

### 3.2 Navigation complète au clavier (Tab / Entrée)

Parcours effectué sans souris, de haut en bas de chaque écran.

| Point de contrôle | Résultat |
|---|---|
| Tous les contrôles sont atteignables au `Tab` | ✅ recherche, pilules de genre, cartes, navigation basse, bouton principal. Tout est en `<button>` ou `<input>` natif, aucun `<div onclick>`. |
| L'ordre de tabulation suit l'ordre visuel | ✅ |
| Activation à `Entrée` et à `Espace` | ✅ boutons natifs |
| **Indicateur de focus visible** | ⚠️ **partiellement** — un `outline:2px solid #9CC8FF` est posé sur chaque contrôle (11,55 : 1 sur le fond, largement conforme), **mais** le bouton « retour » de la fiche film l'affiche avec `outline-offset:2px`, donc **par-dessus l'affiche** : sur une affiche claire le ratio tombe à **1,02 : 1** et l'anneau disparaît. |
| Le focus n'est jamais piégé | ✅ pas de modale bloquante dans la maquette |
| L'`<input>` de recherche porte un nom accessible | ✅ `aria-label="Chercher un film par titre"` |
| Les boutons icône portent un nom accessible | ✅ `aria-label` sur `×`, `→`, `←` et sur chaque carte d'affiche |
| **Le contrôle de statut est compréhensible** | ✅ **pour un lecteur d'écran** (`aria-label="Passer Dune au statut suivant"`), ❌ **pour un utilisateur voyant** : c'est exactement l'écart qui a fait échouer T4 |

**Constat croisé :** le libellé accessible du bouton `→` est meilleur que son libellé visuel. L'information existe dans le code mais pas à l'écran — un cas où l'accessibilité technique est en avance sur l'utilisabilité.

### 3.3 Cibles tactiles

| Contrôle | Dimensions relevées | Seuil du brief (44 px) | Verdict |
|---|---|---|---|
| Bouton « Ajouter à ma Watchlist » | 100 % × 54 px | 44 px | ✅ |
| Pilules de genre | auto × 44 px | 44 px | ✅ |
| Boutons `→` et `×` de la watchlist | 44 × 44 px | 44 px | ✅ |
| Navigation basse | auto × 50 px | 44 px | ✅ |
| Onglets de statut | 1fr × 40 px | 44 px | ⚠️ **40 px, sous le seuil du brief** (reste ≥ 24 px, donc conforme WCAG 2.5.8) |
| **Écart entre `→` et `×`** | **4 px** | — | ❌ deux cibles de sens opposé, dont une destructive, séparées par 4 px |

---

## 4. Les deux correctifs ergonomiques prioritaires

### C1 — Rendre la pastille de statut interactive et supprimer le bouton `→`

**Friction corrigée :** H5, H6, remarques 6 / 7 / 8 — T4 échouée, 2 min 18 d'errance, aide nécessaire.

**Pourquoi en premier :** c'est le seul échec de tâche du test, et il porte sur la fonction qui justifie l'existence de l'application — « suivre ceux qu'on a déjà regardés », brief. Le geste de Matteo était le bon geste : il a touché l'élément qui affiche l'état. L'interface ne l'a pas suivi.

| Avant | Après |
|---|---|
| Pastille de statut décorative, non interactive | Pastille = bouton. Un appui fait cycler `À regarder → En cours → Vu`, libellé texte toujours visible à côté du point coloré |
| Bouton rond `→` sans libellé, dont le sens est contredit par le reste de l'interface | Supprimé. Le glyphe `⇄` est intégré à la pastille : il dit « ça tourne », là où `→` disait « ça part ailleurs » |
| `→` et `×` séparés de 4 px | Bouton « retirer » éloigné de 12 px, icône corbeille explicite au lieu d'une croix |
| Sélecteur de statut enfoui sous le synopsis de la fiche | Remonté juste sous le titre, dans la zone visible sans défilement |

```html
<!-- Après : la pastille EST le contrôle -->
<button class="status-pill" aria-label="Dune : À regarder. Appuyer pour passer à En cours">
  <span class="status-pill__dot" data-status="todo" aria-hidden="true"></span>
  À regarder
  <span class="status-pill__cycle" aria-hidden="true">⇄</span>
</button>
```

```css
.status-pill { min-height: 44px; padding: 0 14px; border-radius: 999px; }
.status-pill + .btn-remove { margin-left: 12px; }  /* plus de touche ratée */
```

### C2 — Ramener la confirmation dans la zone du pouce et annoncer ce que fait le second appui

**Friction corrigée :** H3, H4, remarques 4 / 5 — confirmation manquée, puis navigation subie.

**Pourquoi en second :** aucune tâche n'a échoué, mais Matteo a douté du résultat d'une action réussie, puis a été déplacé d'écran sans l'avoir demandé. Deux atteintes au feedback et au contrôle de l'utilisateur sur le geste central de l'application.

| Avant | Après |
|---|---|
| Toast à `top:14px`, à l'autre bout de l'écran, visible 2,4 s | Toast à **24 px au-dessus du bouton principal**, visible 4 s, là où le regard se trouve déjà |
| Libellé « ✓ Dans ma Watchlist » — un second appui ouvre la liste sans l'annoncer | Libellé « **✓ Dans ma Watchlist · Voir ma liste →** » : l'action du second appui est écrite |
| Confirmation uniquement visuelle | Toast en `role="status"` (déjà présent, conservé) + icône `✓` + texte, donc lisible au lecteur d'écran et sans dépendre de la couleur |

```css
.toast {                      /* avant : top: 14px */
  bottom: calc(var(--cta-height) + 24px);
  animation-duration: 4s;
}
```

---

## 5. Vérification & contre-épreuve

**Les frictions observées ont-elles débouché sur des actions correctives concrètes ?**

| Friction relevée | Action corrective | Trace |
|---|---|---|
| H5 / H6 — T4 échouée, statut introuvable | **C1** — pastille interactive, `→` supprimé, sélecteur remonté | § 4 + `fiche-observation.md` |
| H3 — confirmation manquée | **C2** — toast déplacé dans la zone du pouce, durée portée à 4 s | § 4 |
| H4 — navigation non annoncée | **C2** — libellé du second état complété | § 4 |
| Remarque 3 — titre dupliqué | Déjà corrigé avant le test, dans la direction hybride | `Critiques/piste-hybride.md` § 4 |
| H2 — substitution de la grille pendant la frappe | Non corrigé : friction de 1,5 s, non bloquante, et la recherche en direct est un acquis du brief. **À resurveiller au prochain test.** | — |
| Bordures de verre à 1,41 : 1 | Relevé et chiffré, correctif prescrit | `audit-wcag-avance.md` § 4 |
| Anneau de focus invisible sur affiche claire | Relevé et chiffré, correctif prescrit | `audit-wcag-avance.md` § 4 |
| Onglets de statut à 40 px | Portés à 44 px par `--tap-min` dans la feuille de style hybride | `Critiques/piste-hybride.md` § 3 |

**Ce que le test a invalidé dans mes propres hypothèses :**

- `piste-hybride.md` annonçait `--text-muted` à « ≈ 6.2:1 ». La mesure réelle donne **8,75 : 1** sur `--bg`. L'estimation était pessimiste, la valeur est confirmée conforme : la ligne du tableau de validation est à corriger.
- `piste-hybride.md` affirmait « Aucune information portée par la couleur seule ✅ ». C'est vrai pour le **libellé** du statut, faux pour le **point coloré** qui l'accompagne : les trois points ne se distinguent que par la teinte, avec un écart de luminance de 1,06 à 1,26 : 1 entre eux. Mesuré et traité dans `audit-daltonisme.md`.

**Commit :** `Consigne les résultats du protocole de tests utilisateurs dans design/tests-utilisateurs.md.`
