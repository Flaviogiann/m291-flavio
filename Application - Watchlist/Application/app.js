// s9 : laissez ce fichier presque vide.
// s11 : vous collerez ici la recette fetch (e3-3).
// Ne créez pas un deuxième fichier JS. Ne passez pas en type="module".
//
// function async + fetch : voir e3-3 / recettes.js

/* ============================================================
   WATCHLIST — LOGIQUE DE L'APPLICATION

   Trois écrans dans un seul document :
     accueil  recherche + grille d'affiches
     fiche    toutes les infos d'un film + ajout / statut
     liste    la watchlist personnelle, filtrée par statut

   Deux stockages, tous les deux en JSON :
     1. LE CATALOGUE — data/films.json, lecture seule, chargé une
        fois au démarrage avec fetch().
     2. LA WATCHLIST — localStorage, clé "wl-glass". Un objet
        { idDuFilm: statut } sérialisé en JSON. C'est la seule
        chose qu'on enregistre.

   Pas de bibliothèque : du JavaScript natif, comme l'impose le
   brief. Le fichier est organisé en sept parties :
     1 · Données & outils   le catalogue et les petites fonctions
     2 · État               ce que l'application sait à un instant
     3 · Raccourcis         les éléments du HTML qu'on manipule
     4 · Fabrication        petites fonctions de mise en forme
     5 · Rendu              fabrication du HTML de chaque écran
     6 · Actions            ce qui se passe quand on touche un bouton
     7 · Démarrage          chargement du catalogue puis premier rendu
   ============================================================ */

(function () {
  "use strict";

  /* ==========================================================
     1 · DONNÉES & OUTILS
     ========================================================== */

  const WL = {

    /* Chemin du catalogue et clé du stockage local */
    SOURCE: "data/films.json",
    CLE: "wl-glass",

    /* Les trois statuts, dans l'ordre du cycle
       À regarder → En cours → Vu → À regarder */
    statuts: ["À regarder", "En cours", "Vu"],

    /* Rempli par charger(). Vide tant que le catalogue n'est pas arrivé. */
    films: [],

    /* Va chercher data/films.json et range le résultat dans WL.films.

       ATTENTION : fetch() refuse le protocole file://. En ouvrant
       index.html par un double-clic, le chargement échouera. Il faut
       passer par un petit serveur local. */
    async charger() {
      const reponse = await fetch(this.SOURCE);

      if (!reponse.ok) {
        throw new Error("Le fichier " + this.SOURCE + " a répondu " + reponse.status + ".");
      }

      const donnees = await reponse.json();

      if (!Array.isArray(donnees) || donnees.length === 0) {
        throw new Error("Le catalogue est vide ou mal formé.");
      }

      this.films = donnees;
    },

    /* La liste des genres présents dans le catalogue, sans doublon,
       précédée de « Tous ». */
    genres() {
      const vus = [];
      this.films.forEach(function (f) {
        if (!vus.includes(f.g)) { vus.push(f.g); }
      });
      return ["Tous"].concat(vus);
    },

    /* Retrouve un film par son identifiant. */
    parId(id) {
      return this.films.find(function (f) { return f.id === id; }) || null;
    },

    /* Met un texte à plat pour la recherche : sans accent, sans
       majuscule, sans espace inutile. Permet de trouver « Amelie »
       en tapant « amélie », et l'inverse. */
    normaliser(texte) {
      return String(texte)
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .trim();
    },

    /* Statut suivant dans le cycle. Sans statut, on entre par le premier. */
    suivant(statut) {
      const i = this.statuts.indexOf(statut);
      return this.statuts[(i + 1) % this.statuts.length];
    },

    /* Lecture du stockage. Renvoie toujours un objet, même si rien
       n'est enregistré ou si le JSON est illisible. */
    lire() {
      try {
        const brut = localStorage.getItem(this.CLE);
        const valeur = brut ? JSON.parse(brut) : null;
        return (valeur && typeof valeur === "object") ? valeur : {};
      } catch (e) {
        return {};
      }
    },

    /* Écriture. En navigation privée ou si le quota est plein,
       l'écriture échoue : l'application continue de fonctionner,
       simplement sans mémoire d'une visite à l'autre. */
    ecrire(valeur) {
      try {
        localStorage.setItem(this.CLE, JSON.stringify(valeur));
        return true;
      } catch (e) {
        return false;
      }
    }
  };


  /* ==========================================================
     2 · ÉTAT
     Une seule source de vérité. On la modifie, puis on redessine.
     ========================================================== */

  const etat = {
    ecran: "accueil",    // accueil | fiche | liste
    requete: "",         // texte tapé dans la recherche
    genre: "Tous",       // pilule de genre sélectionnée
    filmSel: null,       // id du film ouvert dans la fiche
    venantDe: "accueil", // écran d'où l'on a ouvert la fiche
    filtre: 0,           // index de l'onglet dans WL.statuts
    statuts: {},         // { idDuFilm: statut } — c'est ce qu'on enregistre
    recentes: []         // dernières recherches, 3 au maximum
  };

  let minuteurToast = null;
  let minuteurRecentes = null;


  /* ==========================================================
     3 · RACCOURCIS VERS LE HTML
     ========================================================== */

  function $(id) { return document.getElementById(id); }

  const ecrans = {
    accueil: $("ecran-accueil"),
    liste:   $("ecran-liste"),
    fiche:   $("ecran-fiche")
  };

  const el = {
    nav:           $("nav"),
    navAccueil:    $("nav-accueil"),
    navListe:      $("nav-liste"),

    champ:         $("champ-recherche"),
    effacer:       $("bouton-effacer"),
    filtres:       $("filtres"),
    recentes:      $("recentes"),
    recentesListe: $("recentes-liste"),
    grilleTitre:   $("grille-titre"),
    grilleCompte:  $("grille-compte"),
    aucunResultat: $("aucun-resultat"),
    erreur:        $("erreur-chargement"),
    grille:        $("grille"),

    onglets:       $("onglets"),
    listeCompte:   $("liste-compte"),
    listeVide:     $("liste-vide"),
    videTitre:     $("vide-titre"),
    lignes:        $("lignes"),

    ficheAffiche:  $("fiche-affiche"),
    ficheBadge:    $("fiche-badge"),
    ficheTitre:    $("fiche-titre"),
    ficheTags:     $("fiche-tags"),
    ficheRea:      $("fiche-realisation"),
    ficheSynopsis: $("fiche-synopsis"),
    ficheStatut:   $("fiche-statut"),
    fichePicker:   $("fiche-picker"),
    ficheCta:      $("fiche-cta"),
    ficheRetirer:  $("fiche-retirer"),
    retour:        $("bouton-retour"),

    toast:         $("toast")
  };


  /* ==========================================================
     4 · FABRICATION
     ========================================================== */

  /* Neutralise les caractères qui auraient un sens en HTML.
     Indispensable pour les recherches récentes : ce texte vient
     de l'utilisateur et on le réinjecte dans la page. */
  function echapper(texte) {
    return String(texte)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* « À regarder » → « a-regarder » : sert de suffixe de classe CSS. */
  function slug(statut) {
    return WL.normaliser(statut).replace(/\s+/g, "-");
  }

  /* « 3 films » / « 1 film » */
  function compter(n) {
    return n + (n > 1 ? " films" : " film");
  }

  /* Les deux couleurs d'un film, prêtes à poser sur un élément. */
  function couleurs(film) {
    return "--film-c1:" + film.c1 + ";--film-c2:" + film.c2;
  }

  /* Pastille de statut : le point coloré ET le libellé, jamais la
     couleur toute seule. */
  function pastille(statut) {
    if (!statut) { return ""; }
    return '<span class="badge verre verre--pastille">' +
             '<span class="point point--' + slug(statut) + '"></span>' +
             echapper(statut) +
           '</span>';
  }

  /* Affiche / masque un élément sans toucher à son contenu. */
  function montrer(element, visible) {
    if (visible) { element.removeAttribute("hidden"); }
    else { element.setAttribute("hidden", ""); }
  }

  /* Message de confirmation, qui disparaît tout seul. */
  function flash(message) {
    clearTimeout(minuteurToast);
    el.toast.textContent = message;
    montrer(el.toast, true);
    minuteurToast = setTimeout(function () {
      montrer(el.toast, false);
    }, 2400);
  }


  /* ==========================================================
     5 · RENDU
     ========================================================== */

  /* --- 5.1 · Écran visible et navigation -------------------- */

  function dessiner() {
    montrer(ecrans.accueil, etat.ecran === "accueil");
    montrer(ecrans.liste,   etat.ecran === "liste");
    montrer(ecrans.fiche,   etat.ecran === "fiche");

    /* La navigation disparaît sur la fiche : elle gênerait le
       bouton d'ajout, qui occupe déjà le bas de l'écran. */
    montrer(el.nav, etat.ecran !== "fiche");

    basculer(el.navAccueil, etat.ecran === "accueil");
    basculer(el.navListe, etat.ecran === "liste");

    if (etat.ecran === "accueil") { rendreAccueil(); }
    if (etat.ecran === "liste")   { rendreListe(); }
    if (etat.ecran === "fiche")   { rendreFiche(); }
  }

  function basculer(bouton, actif) {
    if (actif) { bouton.setAttribute("aria-current", "page"); }
    else { bouton.removeAttribute("aria-current"); }
  }


  /* --- 5.2 · Accueil ---------------------------------------- */

  function rendreFiltres() {
    el.filtres.innerHTML = WL.genres().map(function (g) {
      const actif = g === etat.genre;
      return '<button class="filtre verre verre--fin" type="button"' +
               ' data-genre="' + echapper(g) + '"' +
               ' aria-pressed="' + actif + '">' + echapper(g) + '</button>';
    }).join("");
  }

  function rendreAccueil() {
    const q = etat.requete.trim();
    const tousGenres = etat.genre === "Tous";

    /* Un film est retenu s'il passe le filtre de genre ET la recherche.
       La recherche porte sur le titre, la réalisation et le genre. */
    const resultats = WL.films.filter(function (f) {
      const okGenre = tousGenres || f.g === etat.genre;
      const okTexte = !q || WL.normaliser(f.t + " " + f.dir + " " + f.g)
                              .includes(WL.normaliser(q));
      return okGenre && okTexte;
    });

    /* Recherches récentes — seulement quand le champ est vide */
    const afficheRecentes = !q && etat.recentes.length > 0;
    montrer(el.recentes, afficheRecentes);
    if (afficheRecentes) {
      el.recentesListe.innerHTML = etat.recentes.map(function (r) {
        return '<button class="recente verre verre--fin" type="button"' +
                 ' data-recente="' + echapper(r) + '">' +
                 '<span class="recente__fleche" aria-hidden="true">↺</span>' +
                 echapper(r) +
               '</button>';
      }).join("");
    }

    /* Titre et compteur de la grille */
    el.grilleTitre.textContent = q ? "Résultats" : (tousGenres ? "À l'affiche" : etat.genre);
    el.grilleCompte.textContent = (q || !tousGenres) ? compter(resultats.length) : "";

    /* Message d'erreur quand rien ne correspond */
    montrer(el.aucunResultat, resultats.length === 0 && (!!q || !tousGenres));

    /* La croix d'effacement suit le contenu du champ */
    montrer(el.effacer, etat.requete.length > 0);

    /* La grille */
    el.grille.innerHTML = resultats.map(function (f) {
      const statut = etat.statuts[f.id] || "";
      return '<li>' +
        '<button class="carte" type="button" data-ouvrir="' + f.id + '"' +
                ' aria-label="Ouvrir la fiche de ' + echapper(f.t) + ', ' + f.y + '">' +
          '<span class="carte__affiche affiche-lumiere" style="' + couleurs(f) + '">' +
            pastille(statut) +
            '<span class="carte__titre">' + echapper(f.t) + '</span>' +
          '</span>' +
          '<span class="carte__infos">' +
            '<span class="carte__nom">' + echapper(f.t) + '</span>' +
            '<span class="carte__sous-titre">' + f.y + ' · ' + echapper(f.g) + '</span>' +
          '</span>' +
        '</button>' +
      '</li>';
    }).join("");
  }


  /* --- 5.3 · Ma Watchlist ----------------------------------- */

  function rendreOnglets() {
    el.onglets.innerHTML = WL.statuts.map(function (s, i) {
      const actif = i === etat.filtre;
      return '<button class="onglet" type="button" role="tab"' +
               ' data-filtre="' + i + '"' +
               ' aria-selected="' + actif + '">' + echapper(s) + '</button>';
    }).join("");
  }

  function rendreListe() {
    const statutActif = WL.statuts[etat.filtre];

    const retenus = WL.films.filter(function (f) {
      return etat.statuts[f.id] === statutActif;
    });

    el.listeCompte.textContent = compter(retenus.length);

    /* Liste vide : un message court qui renvoie vers la recherche */
    montrer(el.listeVide, retenus.length === 0);
    montrer(el.lignes, retenus.length > 0);

    if (retenus.length === 0) {
      el.videTitre.textContent =
        etat.filtre === 0 ? "Rien à regarder pour l'instant" :
        etat.filtre === 1 ? "Aucun film en cours" :
                            "Aucun film vu";
      el.lignes.innerHTML = "";
      return;
    }

    el.lignes.innerHTML = retenus.map(function (f) {
      return '<li class="ligne">' +
        '<button class="ligne__ouvrir" type="button" data-ouvrir="' + f.id + '"' +
                ' aria-label="Ouvrir la fiche de ' + echapper(f.t) + '">' +
          '<span class="ligne__affiche affiche-lumiere" style="' + couleurs(f) + '"></span>' +
          '<span class="ligne__texte">' +
            '<span class="ligne__titre">' + echapper(f.t) + '</span>' +
            '<span class="ligne__meta">' + f.y + ' · ' + echapper(f.d) + '</span>' +
          '</span>' +
        '</button>' +
        '<button class="ligne__action" type="button" data-cycler="' + f.id + '"' +
                ' aria-label="Passer ' + echapper(f.t) + ' au statut suivant">' +
          '<span aria-hidden="true">→</span></button>' +
        '<button class="ligne__action ligne__action--retirer" type="button"' +
                ' data-retirer="' + f.id + '"' +
                ' aria-label="Retirer ' + echapper(f.t) + ' de ma watchlist">' +
          '<span aria-hidden="true">×</span></button>' +
      '</li>';
    }).join("");
  }


  /* --- 5.4 · Fiche film ------------------------------------- */

  function rendreFiche() {
    const film = WL.parId(etat.filmSel);
    if (!film) { return; }

    const statut = etat.statuts[film.id] || "";

    /* Les deux couleurs du film sont posées sur l'écran : l'affiche
       et la lueur d'ambiance en héritent toutes les deux. */
    ecrans.fiche.setAttribute("style", couleurs(film));

    el.ficheTitre.textContent = film.t;
    el.ficheRea.textContent = film.dir;
    el.ficheSynopsis.textContent = film.s;

    el.ficheTags.innerHTML =
      '<span class="tag">' + film.y + '</span>' +
      '<span class="tag">' + echapper(film.d) + '</span>' +
      '<span class="tag">' + echapper(film.g) + '</span>' +
      '<span class="tag tag--note"><span aria-hidden="true">★</span>' +
        '<span class="u-lecteur">Note : </span>' + film.r.toFixed(1) + ' sur 10</span>';

    /* Pastille de statut en haut à droite de l'affiche */
    el.ficheBadge.innerHTML = statut
      ? '<span class="point point--' + slug(statut) + '"></span>' + echapper(statut)
      : "";
    montrer(el.ficheBadge, !!statut);

    /* Sélecteur de statut — seulement si le film est déjà enregistré */
    montrer(el.ficheStatut, !!statut);
    if (statut) {
      el.fichePicker.innerHTML = WL.statuts.map(function (s) {
        return '<button class="onglet" type="button" data-statut="' + echapper(s) + '"' +
                 ' aria-pressed="' + (s === statut) + '">' + echapper(s) + '</button>';
      }).join("");
    }

    /* Bouton principal : il confirme l'ajout et change de libellé */
    el.ficheCta.textContent = statut ? "✓  Dans ma Watchlist" : "Ajouter à ma Watchlist";
    el.ficheCta.setAttribute("data-ajoute", statut ? "oui" : "non");
    montrer(el.ficheRetirer, !!statut);
  }


  /* ==========================================================
     6 · ACTIONS
     ========================================================== */

  /* --- 6.1 · Changer d'écran -------------------------------- */

  /* Les View Transitions font glisser un écran vers l'autre. Si le
     navigateur ne connaît pas la fonctionnalité, l'écran change
     d'un coup : rien ne casse. */
  function allerA(nom) {
    function maj() {
      etat.ecran = nom;
      dessiner();
    }

    if (!document.startViewTransition) {
      maj();
      apresTransition(nom);
      return;
    }

    document.startViewTransition(maj)
      .finished.finally(function () { apresTransition(nom); });
  }

  /* Après un changement d'écran, le focus doit suivre : sinon il
     reste sur un bouton qui vient de disparaître et la navigation
     au clavier est perdue. On nettoie aussi le nom de transition,
     qui ne doit jamais être porté par deux éléments à la fois. */
  function apresTransition(nom) {
    const cible = ecrans[nom];
    if (cible) { cible.focus({ preventScroll: true }); }

    const ouverte = document.querySelector(".carte--ouverte");
    if (ouverte) { ouverte.classList.remove("carte--ouverte"); }
  }

  function ouvrirFiche(id, bouton) {
    etat.filmSel = id;
    etat.venantDe = etat.ecran;

    /* L'affiche touchée prend le même nom de transition que celle de
       la fiche : le navigateur fait grandir l'une vers l'autre. */
    if (bouton && bouton.classList.contains("carte")) {
      bouton.classList.add("carte--ouverte");
    }
    allerA("fiche");
  }


  /* --- 6.2 · Statuts (écriture dans le stockage) ------------- */

  function definirStatut(id, statut) {
    if (statut) { etat.statuts[id] = statut; }
    else { delete etat.statuts[id]; }

    WL.ecrire(etat.statuts);
  }


  /* --- 6.3 · Recherche -------------------------------------- */

  function chercher(texte) {
    etat.requete = texte;
    rendreAccueil();

    /* On n'enregistre une recherche récente qu'après une courte pause :
       sinon chaque lettre tapée créerait une entrée. */
    clearTimeout(minuteurRecentes);
    const q = texte.trim();
    if (q.length > 2) {
      minuteurRecentes = setTimeout(function () {
        const autres = etat.recentes.filter(function (r) {
          return WL.normaliser(r) !== WL.normaliser(q);
        });
        etat.recentes = [q].concat(autres).slice(0, 3);
      }, 900);
    }
  }


  /* --- 6.4 · Écoute des clics ------------------------------- */

  /* Un seul écouteur pour toute l'application : on regarde quel
     attribut data-… porte le bouton touché. Les boutons créés plus
     tard fonctionnent sans qu'on ait à les brancher un par un. */
  function brancherClics() {
    document.addEventListener("click", function (evenement) {
      const bouton = evenement.target.closest("button");
      if (!bouton) { return; }

      const d = bouton.dataset;

      /* Navigation */
      if (d.aller) { allerA(d.aller); return; }

      /* Ouvrir une fiche (depuis la grille ou depuis une ligne) */
      if (d.ouvrir) { ouvrirFiche(d.ouvrir, bouton); return; }

      /* Filtrer par genre */
      if (d.genre) {
        etat.genre = d.genre;
        rendreFiltres();
        rendreAccueil();
        return;
      }

      /* Relancer une recherche récente */
      if (d.recente) {
        el.champ.value = d.recente;
        chercher(d.recente);
        el.champ.focus();
        return;
      }

      /* Changer d'onglet dans Ma Watchlist.
         Attention : l'onglet 0 a data-filtre="0". La chaîne "0" est
         vraie en JavaScript, mais on teste quand même l'existence de
         la clé plutôt que sa valeur, pour ne pas dépendre de ça. */
      if (d.filtre !== undefined) {
        etat.filtre = Number(d.filtre);
        rendreOnglets();
        rendreListe();
        return;
      }

      /* Statut suivant depuis une ligne */
      if (d.cycler) {
        const suivant = WL.suivant(etat.statuts[d.cycler]);
        definirStatut(d.cycler, suivant);
        flash(WL.parId(d.cycler).t + " → " + suivant);
        rendreListe();
        return;
      }

      /* Retirer un film depuis une ligne */
      if (d.retirer) {
        const retire = WL.parId(d.retirer);
        definirStatut(d.retirer, null);
        flash(retire.t + " retiré de votre watchlist");
        rendreListe();
        return;
      }

      /* Choisir un statut depuis la fiche */
      if (d.statut) {
        definirStatut(etat.filmSel, d.statut);
        flash("Statut : " + d.statut);
        rendreFiche();
      }
    });

    /* Retour depuis la fiche vers l'écran d'où l'on vient */
    el.retour.addEventListener("click", function () {
      allerA(etat.venantDe === "liste" ? "liste" : "accueil");
      etat.filmSel = null;
    });

    /* Bouton principal de la fiche */
    el.ficheCta.addEventListener("click", function () {
      const film = WL.parId(etat.filmSel);
      if (!film) { return; }

      if (etat.statuts[film.id]) {
        /* Déjà enregistré : le bouton emmène vers la liste, à l'onglet
           correspondant au statut du film. */
        etat.filtre = WL.statuts.indexOf(etat.statuts[film.id]);
        rendreOnglets();
        allerA("liste");
        etat.filmSel = null;
      } else {
        definirStatut(film.id, WL.statuts[0]);
        flash("Ajouté à votre watchlist");
        rendreFiche();
      }
    });

    el.ficheRetirer.addEventListener("click", function () {
      const film = WL.parId(etat.filmSel);
      if (!film) { return; }
      definirStatut(film.id, null);
      flash(film.t + " retiré de votre watchlist");
      rendreFiche();
    });

    /* Recherche */
    el.champ.addEventListener("input", function (evenement) {
      chercher(evenement.target.value);
    });

    el.effacer.addEventListener("click", function () {
      el.champ.value = "";
      chercher("");
      el.champ.focus();
    });

    /* Le formulaire ne part nulle part : la recherche est instantanée. */
    el.champ.form.addEventListener("submit", function (evenement) {
      evenement.preventDefault();
    });
  }


  /* ==========================================================
     7 · DÉMARRAGE
     ========================================================== */

  /* Affiche une explication lisible si le catalogue n'a pas pu être
     chargé. C'est le cas le plus fréquent quand on ouvre index.html
     par un double-clic : fetch() refuse le protocole file://. */
  function echecChargement(erreur) {
    const surFichier = location.protocol === "file:";

    el.erreur.textContent = surFichier
      ? "Le catalogue n'a pas pu être chargé : ouvert directement depuis un "
        + "fichier, le navigateur bloque la lecture de data/films.json. Lancez "
        + "un petit serveur local dans le dossier Application, puis ouvrez "
        + "http://localhost:8000."
      : "Le catalogue n'a pas pu être chargé. " + erreur.message;

    montrer(el.erreur, true);
    montrer(el.aucunResultat, false);
    el.grilleTitre.textContent = "Catalogue indisponible";
    el.grilleCompte.textContent = "";
  }

  async function demarrer() {
    brancherClics();

    try {
      await WL.charger();
    } catch (erreur) {
      echecChargement(erreur);
      return;
    }

    /* On relit la watchlist enregistrée au passage précédent. Si c'est
       la première visite, on pose quelques films pour que l'application
       ne soit pas vide — à retirer pour une mise en production. */
    const sauvegarde = WL.lire();

    etat.statuts = Object.keys(sauvegarde).length
      ? sauvegarde
      : { dune: "À regarder", her: "En cours", chihiro: "Vu", parasite: "À regarder" };

    rendreFiltres();
    rendreOnglets();
    dessiner();
  }

  demarrer();

}());
