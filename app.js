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
     1. LE CATALOGUE — data.json, lecture seule, chargé une fois au
        démarrage avec fetch().
     2. LA WATCHLIST — localStorage, clé "wl-glass". Un objet
        { idDuFilm: statut } sérialisé en JSON. C'est la seule
        chose qu'on enregistre.

   AUCUNE CHAÎNE DE HTML DANS CE FICHIER (semaine 11).
   Tout le rendu passe par document.createElement() et textContent.
   La propriété qui injecte du HTML brut dans un élément n'apparaît
   nulle part, pas même en commentaire : voir la partie 4.

   Pas de bibliothèque : du JavaScript natif, comme l'impose le
   brief. Le fichier est organisé en sept parties :
     1 · Données & outils   le catalogue et les petites fonctions
     2 · État               ce que l'application sait à un instant
     3 · Raccourcis         les éléments du HTML qu'on manipule
     4 · Fabrication        créer des éléments, poser du texte
     5 · Rendu              remplir chaque écran
     6 · Actions            ce qui se passe quand on touche un bouton
     7 · Démarrage          les quatre états du chargement
   ============================================================ */

(function () {
  "use strict";

  /* ==========================================================
     1 · DONNÉES & OUTILS
     ========================================================== */

  /* Le catalogue complet, tel qu'il arrive de data.json. Vide tant
     que le fichier n'est pas chargé.

     Le nom vient de l'énoncé de la semaine 11, qui demande de garder
     ceux du modèle « Phare » : là-bas ce sont des lieux, ici des
     films. Même rôle, même nom. */
  let tousLesLieux = [];

  const WL = {

    /* Chemin du catalogue et clé du stockage local */
    SOURCE: "data.json",
    CLE: "wl-glass",

    /* Les trois statuts, dans l'ordre du cycle
       À regarder → En cours → Vu → À regarder */
    statuts: ["À regarder", "En cours", "Vu"],

    /* Va chercher data.json et RENVOIE le tableau. Elle ne décide pas
       quoi afficher : c'est demarrer() qui choisit l'état.

       Trois façons d'échouer, toutes relancées en Error :
         · le fichier est introuvable          → reponse.ok est faux
         · le fichier n'est pas du JSON valide → .json() relance
         · le JSON n'est pas un tableau        → on le teste

       En revanche un tableau VIDE n'est pas une erreur : [] est du
       JSON parfaitement valide. C'est l'état « vide », pas l'état
       « erreur ». La différence compte : un fichier cassé demande
       une correction, un fichier vide demande du contenu.

       ATTENTION : fetch() refuse le protocole file://. En ouvrant
       index.html par un double-clic, le chargement échouera. Il faut
       passer par un petit serveur local. */
    async charger() {
      const reponse = await fetch(this.SOURCE);

      if (!reponse.ok) {
        throw new Error(this.SOURCE + " a répondu " + reponse.status + ".");
      }

      const donnees = await reponse.json();

      if (!Array.isArray(donnees)) {
        throw new Error(this.SOURCE + " ne contient pas un tableau JSON.");
      }

      return donnees;
    },

    /* La liste des genres présents dans le catalogue, sans doublon,
       précédée de « Tous ». */
    genres() {
      const vus = [];
      tousLesLieux.forEach(function (f) {
        if (!vus.includes(f.genre)) { vus.push(f.genre); }
      });
      return ["Tous"].concat(vus);
    },

    /* Retrouve un film par son identifiant. */
    parId(id) {
      return tousLesLieux.find(function (f) { return f.id === id; }) || null;
    },

    /* Met un texte à plat pour la recherche : sans accent, sans
       majuscule, sans espace inutile. Permet de trouver « Amélie »
       en tapant « amelie », et l'inverse. */
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
    phase: "chargement", // chargement | affichee | erreur | vide
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

  /* Les deux éléments que l'énoncé de la semaine 11 nomme :
       conteneur  celui qui reçoit les cartes
       zoneEtat   le paragraphe qui porte les messages des 4 états */
  const conteneur = $("grille");
  const zoneEtat  = $("etat");

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

     Tout le rendu passe par ces quelques fonctions. Aucune chaîne
     de HTML n'est écrite dans ce fichier.

     POURQUOI PAS D'INJECTION DE HTML BRUT : la propriété qui remplace
     le contenu d'un élément par du HTML reçoit du texte et en fait du
     balisage. Tout ce qui ressemble à une balise dans une donnée
     devient donc une vraie balise. Un film qui s'appellerait
     « <i>Nope</i> » s'afficherait en italique au lieu de montrer
     son titre, et une recherche tapée à la main — du texte qui
     vient de l'utilisateur et qu'on réinjecte dans la page — peut
     contenir n'importe quoi.

     textContent, lui, pose du TEXTE : les chevrons restent des
     chevrons. C'est ce qui remplace la fonction echapper() de la
     version précédente, qui n'a plus de raison d'être.
     ========================================================== */

  /* Crée un élément, avec ses classes et son texte s'il y en a. */
  function creer(balise, classes, texte) {
    const element = document.createElement(balise);
    if (classes) { element.className = classes; }
    if (texte !== undefined && texte !== null) { element.textContent = texte; }
    return element;
  }

  /* Vide un élément de tous ses enfants. replaceChildren() sans
     argument fait en un appel ce qu'une boucle « tant qu'il reste un
     premier enfant, le retirer » ferait à la main. */
  function vider(element) {
    element.replaceChildren();
  }

  /* Pose les deux couleurs du film en variables CSS. Le dégradé de
     l'affiche est écrit dans la feuille de style et lit ces deux
     variables : le JavaScript donne les couleurs, le CSS décide de
     la forme. */
  function peindre(element, film) {
    element.style.setProperty("--film-c1", film.c1);
    element.style.setProperty("--film-c2", film.c2);
  }

  /* « À regarder » → « a-regarder » : sert de suffixe de classe CSS. */
  function slug(statut) {
    return WL.normaliser(statut).replace(/\s+/g, "-");
  }

  /* « 3 films » / « 1 film » */
  function compter(n) {
    return n + (n > 1 ? " films" : " film");
  }

  /* Pastille de statut : le point coloré ET le libellé, jamais la
     couleur toute seule — un point vert ne dit rien à qui ne
     distingue pas les couleurs.

     append() accepte des éléments et des chaînes ; les chaînes
     deviennent du texte, jamais du balisage. */
  function pastille(statut, classes) {
    const badge = creer("span", classes || "badge verre verre--pastille");
    badge.append(creer("span", "point point--" + slug(statut)), statut);
    return badge;
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

  /* --- 5.1 · Les quatre états de l'écran --------------------

     Un écran qui va chercher ses données passe toujours par l'un de
     ces quatre états, et jamais par deux à la fois :

       chargement  la requête est partie, rien n'est encore arrivé
       affichee    les données sont là, les cartes sont dans la page
       erreur      fichier introuvable, illisible, ou pas un tableau
       vide        fichier valide, mais aucune fiche à montrer

     Un seul endroit écrit dans zoneEtat : impossible de laisser
     deux messages se contredire à l'écran. */
  function montrerEtat(phase, message) {
    etat.phase = phase;

    const texte =
      phase === "chargement" ? "Chargement du catalogue…" :
      phase === "erreur"     ? message :
      phase === "vide"       ? message :
                               "";

    zoneEtat.textContent = texte;
    zoneEtat.className = "etat" + (phase === "erreur" ? " etat--erreur" : "");
    montrer(zoneEtat, texte !== "");

    /* La grille reste masquée tant qu'il n'y a rien de bon à y voir :
       pas de cadre vide pendant le chargement, pas de grille vide
       sous un message d'erreur. */
    montrer(conteneur, phase === "affichee");
  }


  /* --- 5.2 · Écran visible et navigation -------------------- */

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


  /* --- 5.3 · Accueil : la grille d'affiches -----------------

     afficherLieux() est la fonction que l'énoncé demande : elle
     reçoit une liste et la met dans le conteneur. Elle ne décide
     rien — ni du filtre, ni du message d'état, ni de ce qu'il faut
     faire quand la liste est vide. Elle dessine, c'est tout. */
  function afficherLieux(liste) {
    vider(conteneur);

    /* On construit tout dans un fragment, posé dans la page en une
       seule fois : le navigateur ne recalcule la mise en page qu'une
       fois au lieu de trente. */
    const lot = document.createDocumentFragment();

    liste.forEach(function (film) {
      const statut = etat.statuts[film.id] || "";

      /* <div> est interdit à l'intérieur d'un <button> : on empile
         des <span>, que la feuille de style passe en display:block
         (sans quoi aspect-ratio ne s'appliquerait pas). */
      const affiche = creer("span", "carte__affiche affiche-lumiere");
      peindre(affiche, film);
      if (statut) { affiche.appendChild(pastille(statut)); }

      /* recommande est la seule étiquette qui vaut true ou false.
         true pose un badge « Coup de cœur » en haut à gauche ; false
         ne pose rien. Afficher « non recommandé » serait du bruit :
         l'absence de badge dit déjà tout, et laisse l'affiche
         respirer. */
      if (film.recommande) {
        /* Sur une affiche de 180 px de large, « Coup de cœur » en toutes
           lettres vient buter contre la pastille de statut, posée en face.
           Le cœur seul suffit à l'œil ; le libellé complet reste présent
           pour les lecteurs d'écran, qui n'ont pas de place à économiser.
           Sur la fiche, où la place ne manque pas, le texte est visible. */
        const signe = creer("span", null, "♥");
        signe.setAttribute("aria-hidden", "true");

        const coeur = creer("span", "badge badge--coeur verre verre--pastille");
        coeur.append(signe, creer("span", "u-lecteur", "Coup de cœur"));

        affiche.appendChild(coeur);
      }

      affiche.appendChild(creer("span", "carte__titre", film.titre));

      const infos = creer("span", "carte__infos");
      infos.append(
        creer("span", "carte__nom", film.titre),
        creer("span", "carte__sous-titre", film.date + " · " + film.genre)
      );

      const bouton = creer("button", "carte");
      bouton.type = "button";
      bouton.dataset.ouvrir = film.id;
      bouton.setAttribute("aria-label",
        "Ouvrir la fiche de " + film.titre + ", " + film.date);
      bouton.append(affiche, infos);

      const item = creer("li");
      item.appendChild(bouton);
      lot.appendChild(item);
    });

    conteneur.appendChild(lot);
  }

  function rendreFiltres() {
    vider(el.filtres);

    const lot = document.createDocumentFragment();

    WL.genres().forEach(function (g) {
      const bouton = creer("button", "filtre verre verre--fin", g);
      bouton.type = "button";
      bouton.dataset.genre = g;
      bouton.setAttribute("aria-pressed", String(g === etat.genre));
      lot.appendChild(bouton);
    });

    el.filtres.appendChild(lot);
  }

  function rendreRecentes() {
    vider(el.recentesListe);

    const lot = document.createDocumentFragment();

    etat.recentes.forEach(function (r) {
      const fleche = creer("span", "recente__fleche", "↺");
      fleche.setAttribute("aria-hidden", "true");

      const bouton = creer("button", "recente verre verre--fin");
      bouton.type = "button";
      bouton.dataset.recente = r;
      bouton.append(fleche, r);

      lot.appendChild(bouton);
    });

    el.recentesListe.appendChild(lot);
  }

  function rendreAccueil() {
    /* Le catalogue n'a pas pu être lu : le message d'erreur reste à
       l'écran, il n'y a rien à filtrer. */
    if (etat.phase === "erreur") { return; }

    const q = etat.requete.trim();
    const tousGenres = etat.genre === "Tous";

    /* Un film est retenu s'il passe le filtre de genre ET la recherche.
       La recherche porte sur le titre, la réalisation et le genre. */
    const resultats = tousLesLieux.filter(function (f) {
      const okGenre = tousGenres || f.genre === etat.genre;
      const okTexte = !q || WL.normaliser(f.titre + " " + f.realisateur + " " + f.genre)
                              .includes(WL.normaliser(q));
      return okGenre && okTexte;
    });

    /* Recherches récentes — seulement quand le champ est vide */
    const afficheRecentes = !q && etat.recentes.length > 0;
    montrer(el.recentes, afficheRecentes);
    if (afficheRecentes) { rendreRecentes(); }

    /* Titre et compteur de la grille */
    el.grilleTitre.textContent = q ? "Résultats" : (tousGenres ? "À l'affiche" : etat.genre);
    el.grilleCompte.textContent = (q || !tousGenres) ? compter(resultats.length) : "";

    /* La croix d'effacement suit le contenu du champ */
    montrer(el.effacer, etat.requete.length > 0);

    /* Rien à montrer : c'est l'état « vide », avec la phrase qui dit
       pourquoi. Trois raisons possibles, trois phrases. */
    if (resultats.length === 0) {
      afficherLieux([]);

      if (tousLesLieux.length === 0) {
        montrerEtat("vide", "Le catalogue est vide : data.json ne contient aucune fiche.");
      } else if (q) {
        montrerEtat("vide", "Aucun film ne correspond à « " + q + " ». "
                          + "Vérifiez l'orthographe ou essayez un autre titre.");
      } else {
        montrerEtat("vide", "Aucun film dans le genre « " + etat.genre + " ».");
      }
      return;
    }

    afficherLieux(resultats);
    montrerEtat("affichee");
  }


  /* --- 5.4 · Ma Watchlist ----------------------------------- */

  function rendreOnglets() {
    vider(el.onglets);

    const lot = document.createDocumentFragment();

    WL.statuts.forEach(function (s, i) {
      const bouton = creer("button", "onglet", s);
      bouton.type = "button";
      bouton.setAttribute("role", "tab");
      bouton.dataset.filtre = String(i);
      bouton.setAttribute("aria-selected", String(i === etat.filtre));
      lot.appendChild(bouton);
    });

    el.onglets.appendChild(lot);
  }

  /* Un des trois boutons d'action d'une ligne. */
  function actionLigne(classes, attribut, id, symbole, etiquette) {
    const signe = creer("span", null, symbole);
    signe.setAttribute("aria-hidden", "true");

    const bouton = creer("button", classes);
    bouton.type = "button";
    bouton.dataset[attribut] = id;
    bouton.setAttribute("aria-label", etiquette);
    bouton.appendChild(signe);

    return bouton;
  }

  function rendreListe() {
    const statutActif = WL.statuts[etat.filtre];

    const retenus = tousLesLieux.filter(function (f) {
      return etat.statuts[f.id] === statutActif;
    });

    el.listeCompte.textContent = compter(retenus.length);

    /* Liste vide : un message court qui renvoie vers la recherche */
    montrer(el.listeVide, retenus.length === 0);
    montrer(el.lignes, retenus.length > 0);

    vider(el.lignes);

    if (retenus.length === 0) {
      el.videTitre.textContent =
        etat.filtre === 0 ? "Rien à regarder pour l'instant" :
        etat.filtre === 1 ? "Aucun film en cours" :
                            "Aucun film vu";
      return;
    }

    const lot = document.createDocumentFragment();

    retenus.forEach(function (f) {
      const affiche = creer("span", "ligne__affiche affiche-lumiere");
      peindre(affiche, f);

      const texte = creer("span", "ligne__texte");
      texte.append(
        creer("span", "ligne__titre", f.titre),
        creer("span", "ligne__meta", f.date + " · " + f.duree)
      );

      const ouvrir = creer("button", "ligne__ouvrir");
      ouvrir.type = "button";
      ouvrir.dataset.ouvrir = f.id;
      ouvrir.setAttribute("aria-label", "Ouvrir la fiche de " + f.titre);
      ouvrir.append(affiche, texte);

      const item = creer("li", "ligne");
      item.append(
        ouvrir,
        actionLigne("ligne__action", "cycler", f.id, "→",
          "Passer " + f.titre + " au statut suivant"),
        actionLigne("ligne__action ligne__action--retirer", "retirer", f.id, "×",
          "Retirer " + f.titre + " de ma watchlist")
      );

      lot.appendChild(item);
    });

    el.lignes.appendChild(lot);
  }


  /* --- 5.5 · Fiche film ------------------------------------- */

  function rendreTags(film) {
    vider(el.ficheTags);

    const etoile = creer("span", null, "★");
    etoile.setAttribute("aria-hidden", "true");

    /* « Note : » n'est lu que par les lecteurs d'écran : à l'œil,
       l'étoile suffit ; à l'oreille, « 8.5 sur 10 » tout seul ne
       dirait pas de quoi on parle. */
    const note = creer("span", "tag tag--note");
    note.append(
      etoile,
      creer("span", "u-lecteur", "Note : "),
      film.note.toFixed(1) + " sur 10"
    );

    el.ficheTags.append(
      creer("span", "tag", String(film.date)),
      creer("span", "tag", film.duree),
      creer("span", "tag", film.genre),
      note
    );

    /* Même étiquette booléenne que sur les cartes, même règle :
       un tag de plus si true, rien si false. */
    if (film.recommande) {
      el.ficheTags.appendChild(creer("span", "tag tag--coeur", "Coup de cœur"));
    }
  }

  function rendrePicker(statut) {
    vider(el.fichePicker);

    const lot = document.createDocumentFragment();

    WL.statuts.forEach(function (s) {
      const bouton = creer("button", "onglet", s);
      bouton.type = "button";
      bouton.dataset.statut = s;
      bouton.setAttribute("aria-pressed", String(s === statut));
      lot.appendChild(bouton);
    });

    el.fichePicker.appendChild(lot);
  }

  function rendreFiche() {
    const film = WL.parId(etat.filmSel);
    if (!film) { return; }

    const statut = etat.statuts[film.id] || "";

    /* Les deux couleurs du film sont posées sur l'écran : l'affiche
       et la lueur d'ambiance en héritent toutes les deux. */
    peindre(ecrans.fiche, film);

    el.ficheTitre.textContent = film.titre;
    el.ficheRea.textContent = film.realisateur;
    el.ficheSynopsis.textContent = film.pitch;

    rendreTags(film);

    /* Pastille de statut en haut à droite de l'affiche */
    vider(el.ficheBadge);
    if (statut) {
      el.ficheBadge.append(
        creer("span", "point point--" + slug(statut)),
        statut
      );
    }
    montrer(el.ficheBadge, !!statut);

    /* Sélecteur de statut — seulement si le film est déjà enregistré */
    montrer(el.ficheStatut, !!statut);
    if (statut) { rendrePicker(statut); }

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
        flash(WL.parId(d.cycler).titre + " → " + suivant);
        rendreListe();
        return;
      }

      /* Retirer un film depuis une ligne */
      if (d.retirer) {
        const retire = WL.parId(d.retirer);
        definirStatut(d.retirer, null);
        flash(retire.titre + " retiré de votre watchlist");
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
      flash(film.titre + " retiré de votre watchlist");
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

     C'est ici que les quatre états se décident, dans cet ordre :
     chargement d'abord, puis erreur / vide / affichée selon ce que
     le fichier a donné.
     ========================================================== */

  /* Phrase d'erreur utile plutôt que « une erreur est survenue ».
     Le cas le plus fréquent est le double-clic sur index.html :
     fetch() refuse le protocole file://, et le message doit dire
     quoi faire, pas seulement que ça a raté. */
  function messageErreur(erreur) {
    if (location.protocol === "file:") {
      return "Le catalogue n'a pas pu être chargé : la page est ouverte "
           + "directement depuis un fichier, et le navigateur bloque la "
           + "lecture de data.json. Lancez un petit serveur local dans ce "
           + "dossier, puis ouvrez http://localhost:8000.";
    }
    return "Le catalogue n'a pas pu être chargé : " + erreur.message;
  }

  async function demarrer() {
    brancherClics();

    /* 1 · CHARGEMENT — affiché avant d'attendre quoi que ce soit. */
    montrerEtat("chargement");

    /* 2 · ERREUR — une seule sortie pour les trois façons d'échouer. */
    try {
      tousLesLieux = await WL.charger();
    } catch (erreur) {
      montrerEtat("erreur", messageErreur(erreur));
      el.grilleTitre.textContent = "Catalogue indisponible";
      el.grilleCompte.textContent = "";
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

    /* 3 · VIDE et 4 · AFFICHÉE — rendreAccueil() tranche entre les
       deux : il connaît le nombre de films retenus. */
    dessiner();
  }

  demarrer();

}());
