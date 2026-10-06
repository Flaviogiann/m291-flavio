# Piste hybride — Watchlist

**Module :** ICT 291 · **Atelier :** S07-AV1
**Objet :** fusionner les forces mesurées de la Piste 1 (Liquid Glass) et de la Piste 3 (Éditorial) en une direction unique.

**Documents liés :** `critique.md` · `fiche-critique.md` · `matrice-decision.md`

---

## 1. Pourquoi une hybridation

La matrice pondérée place Liquid Glass à 49 / 65 et Éditorial à 48 / 65. Un point d'écart : les chiffres ne départagent pas les deux pistes, ils disent simplement qu'elles gagnent ailleurs.

- **Liquid Glass** gagne sur ce qui ne se corrige pas : l'architecture de l'écran (tout dans la zone du pouce) et la fidélité à l'ambiance du brief.
- **Éditorial** gagne sur ce qui se corrige : la hiérarchie typographique et le contraste.

Assembler les deux est donc la décision rationnelle : on garde la structure et la matière de la piste 1, on y importe le système typographique de la piste 3.

---

## 2. Forces respectives et ce qu'on en garde

| Source | Force identifiée | Repris dans l'hybride | Écarté |
|---|---|---|---|
| **Piste 1 — Liquid Glass** | Matière verre dépoli cohérente | ✅ pilules, pastilles, barre de navigation | — |
| | Navigation flottante basse | ✅ conservée, avec marge de défilement | — |
| | Pastille de statut sur l'affiche | ✅ conservée | — |
| | Fond bleu nuit, affiches au premier plan | ✅ conservé | — |
| | Titre dupliqué sur et sous la carte | — | ❌ supprimé |
| **Piste 3 — Éditorial** | Hiérarchie sur-titre / titre / métadonnées | ✅ appliquée à la carte et à la fiche film | — |
| | Contraste garanti indépendant de l'image | ✅ via bandeau dégradé opaque | — |
| | Typographie serif | — | ❌ incompatible avec l'ambiance sombre du brief |
| | Fond crème | — | ❌ contredit le pitch |
| **Piste 2 — Carte & badge** | Libellé texte du statut | ✅ texte conservé à côté de la pastille | — |

---

## 3. Feuille de style unifiée

```css
:root {
  /* Fonds */
  --bg:            #0A0D16;  /* bleu nuit profond */
  --bg-elevated:   #141926;  /* fiche film, feuilles */
  --glass:         rgba(255, 255, 255, 0.07);
  --glass-border:  rgba(255, 255, 255, 0.14);

  /* Texte */
  --text:          #F4F2ED;  /* blanc cassé — titres */
  --text-muted:    #A8AEBE;  /* métadonnées — ratio 6.2:1 sur --bg */
  --text-on-glass: #FFFFFF;

  /* Accent & états */
  --accent:        #E8A64C;  /* ambre — filtre actif, note */
  --accent-ink:    #0A0D16;  /* texte posé sur l'ambre */
  --status-todo:   #5B9BD5;  /* À regarder */
  --status-doing:  #E8A64C;  /* En cours */
  --status-seen:   #5FBF8F;  /* Vu */
  --danger:        #E0685A;  /* erreur, retrait d'un film */

  /* Typographie — sans serif, hiérarchie empruntée à l'Éditorial */
  --font: "Inter", system-ui, -apple-system, sans-serif;
  --fs-overline: 0.6875rem;  /* 11px — sur-titre, capitales, letter-spacing 0.08em */
  --fs-meta:     0.8125rem;  /* 13px — année · genre */
  --fs-body:     0.9375rem;  /* 15px — synopsis */
  --fs-title:    1.0625rem;  /* 17px — titre sur carte */
  --fs-h1:       1.75rem;    /* 28px — titre de fiche film */

  --lh-tight: 1.25;
  --lh-body:  1.6;

  /* Arrondis — une seule échelle, héritée de Liquid Glass */
  --r-pill:  999px;   /* filtres, pastilles, navigation */
  --r-card:  16px;    /* affiches, cartes */
  --r-sheet: 24px;    /* fiche film, feuilles modales */

  /* Espacement */
  --sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px;
  --sp-4: 16px; --sp-6: 24px; --sp-8: 32px;

  /* Cible tactile minimale */
  --tap-min: 44px;
}

/* Matière verre — composant unique réutilisé partout */
.glass {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
}

/* Fallback : sans backdrop-filter, on passe à un aplat opaque */
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: #1C2230; }
}

/* Bandeau de garantie de contraste sous les titres posés sur affiche */
.card__scrim {
  background: linear-gradient(to top,
    rgba(10, 13, 22, 0.92) 0%,
    rgba(10, 13, 22, 0.75) 45%,
    rgba(10, 13, 22, 0) 100%);
  padding: var(--sp-6) var(--sp-3) var(--sp-3);
}

/* Toute cible interactive respecte le minimum tactile */
.filter-pill,
.nav__item,
.btn { min-height: var(--tap-min); }
```

---

## 4. Composants de l'hybride

### Carte de film (grille d'accueil)

- Affiche en `--r-card`, ratio 2:3.
- **Pastille de statut** en haut à droite, `.glass` + `--r-pill`, pastille colorée **et** libellé texte (« À regarder »).
- **Titre** posé en bas de l'affiche, sur `.card__scrim` — une seule occurrence, plus de répétition sous la carte.
- **Métadonnées** sous l'affiche : `année · genre` en `--text-muted`, `--fs-meta`.

### Filtres de genre

- Rangée défilante horizontale de pilules `.glass` + `--r-pill`.
- Pilule active : fond `--accent`, texte `--accent-ink` — l'ambre remplace le blanc plein de la maquette d'origine, pour relier le filtre actif au reste du système de couleur.

### Barre de navigation

- Flottante, `.glass`, `--r-pill`, deux entrées (Accueil / Ma Watchlist).
- Entrée active : texte `--text`, point ambre dessous. Entrée inactive : `--text-muted`.
- La grille reçoit `padding-bottom: 96px` pour que la barre ne masque plus la dernière rangée.

### Fiche film

- Affiche en grand avec `.card__scrim` étendu.
- Hiérarchie empruntée à l'Éditorial : sur-titre en capitales (`--fs-overline`, le genre), titre (`--fs-h1`), puis `réalisateur · durée` en `--text-muted`.
- Bouton principal « Ajouter à ma Watchlist » : fond `--accent`, pleine largeur moins les marges, `--r-pill`, collé en bas de la zone visible.

---

## 5. Validation de la cohérence

| Point vérifié | Résultat |
|---|---|
| Une seule famille typographique, cinq tailles définies | ✅ |
| Une seule échelle d'arrondis (pill / card / sheet) | ✅ |
| Une seule matière de surface (`.glass`) réutilisée sur tous les composants flottants | ✅ |
| Fallback prévu si `backdrop-filter` n'est pas supporté | ✅ |
| Contraste `--text` sur `--bg` | ✅ ≈ 16:1 |
| Contraste `--text-muted` sur `--bg` | ✅ ≈ 6.2:1 |
| Contraste `--accent-ink` sur `--accent` | ✅ ≈ 9:1 |
| Texte sur affiche protégé par un bandeau opaque | ✅ |
| Aucune information portée par la couleur seule | ✅ libellé texte sur chaque statut |
| Toutes les cibles interactives ≥ 44 px | ✅ via `--tap-min` |
| Palette conforme au brief (fond bleu nuit, accent ambre, erreur corail) | ✅ |

---

## 6. Ce qu'il reste à faire

- Mesurer les ratios réels avec un vérificateur de contraste une fois les couleurs posées en HTML, et ajuster `--text-muted` s'il descend sous 4.5:1.
- Tester la lisibilité de la pastille de statut sur une affiche claire et sur une affiche sombre.
- Vérifier la performance de `backdrop-filter` sur un téléphone d'entrée de gamme ; si le défilement saccade, basculer sur l'aplat opaque du fallback.

**Commit :** `Ajoute l'atelier d'approfondissement s07-av1-hybridation-design-system.`
