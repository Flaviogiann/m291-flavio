# Les quatre états de Phare

Remplissez une ligne par test, avec ce que vous **voyez**, pas ce que vous attendiez. Recopiez les messages de la console tels quels, même en anglais.

| Test | Ce que montre la page | Ce que dit la console | Onglet Réseau : fichier et code |
| --- | --- | --- | --- |
| 1. `data.json`, réseau lent (3G) | Le titre « Phare », et dessous le message « Chargement des lieux… ». Aucune carte pendant ~4 s. Puis le message disparaît et les 30 cartes apparaissent d'un coup. | Rien. Aucun message. | `data.json` — **200 OK**, 4017 ms, 7365 octets |
| 2. `data-absent.json`, sans `.catch` | Le message « Chargement des lieux… » reste affiché **indéfiniment**. Aucune carte, et rien ne change plus jamais. | `Failed to load resource: the server responded with a status of 404 (Not Found)` puis `Uncaught (in promise) SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON` | `data-absent.json` — **404 Not Found** |
| 3. `data-absent.json`, avec `.catch` | « Impossible de charger les lieux. Rechargez la page dans un moment. » Aucune carte. | `Failed to load resource: the server responded with a status of 404 (Not Found)` puis `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON` — cette fois **sans** le préfixe `Uncaught (in promise)` | `data-absent.json` — **404 Not Found** |
| 4. `data-absent.json`, avec le contrôle `reponse.ok` | « Impossible de charger les lieux. Rechargez la page dans un moment. » Identique au test 3 : l'utilisateur ne voit aucune différence. | `Failed to load resource: the server responded with a status of 404 (Not Found)` puis `Error: Fichier introuvable : code 404` suivi de `at http://localhost:8922/app.js:50:13` | `data-absent.json` — **404 Not Found** |
| 5. `casse.json` | « Impossible de charger les lieux. Rechargez la page dans un moment. » Aucune carte. | `SyntaxError: Expected double-quoted property name in JSON at position 673 (line 28 column 3)` | `casse.json` — **200 OK** |
| 6. `vide.json`, avant le contrôle de la liste vide | Le titre « Phare » seul. **Rien** en dessous : ni carte, ni message, ni erreur. Une page qui a l'air finie et qui ne dit rien. | Rien. Aucun message. | `vide.json` — **200 OK** |

## Deux questions

1. Dans quel test l'onglet Réseau dit-il `200` alors que la page échoue ? Pourquoi ?

   Réponse : **Au test 5, avec `casse.json`.** Le code de statut ne parle que du transport, pas du contenu : `200` veut dire « j'ai trouvé ce fichier et je te l'ai envoyé en entier », rien de plus. Et c'est vrai — `casse.json` est bien arrivé, les 7 ko au complet. Le problème est à l'intérieur : une virgule en trop ligne 27 fait que `.json()` n'arrive pas à le relire, et c'est elle qui lance l'erreur. Ni `fetch` ni l'onglet Réseau n'ont d'avis sur la validité d'un JSON ; ils ne savent que si l'enveloppe est arrivée. C'est pour ça que `reponse.ok` ne protège pas de ce cas-là : la réponse *est* `ok`. Seul le `.catch` rattrape celui-ci.

   Le test 6 montre la même chose autrement : `200 OK` et une page vide, sauf qu'ici rien n'est cassé — le fichier est valide, il est juste vide.

2. Au test 2, que devient le message « Chargement des lieux… » ? Qu'est-ce que la personne qui attend en conclut ?

   Réponse : **Il ne part jamais.** Il n'est effacé qu'à la première ligne du second `.then`, et ce second `.then` n'est jamais atteint : la chaîne s'est interrompue avant, au moment où `.json()` a échoué. Sans `.catch`, personne ne prend le relais — l'erreur part dans la console et la page reste figée sur sa dernière phrase.

   La personne qui attend en conclut que **ça charge encore**. Elle accuse sa connexion, elle patiente, elle recharge, elle patiente encore. La page lui ment : elle affiche un état d'activité alors que plus rien ne se passe. C'est pire qu'un message d'erreur, parce qu'un message d'erreur donne quelque chose à faire — alors qu'une attente sans fin ne donne que de la patience à perdre.

## Conditions des relevés

- Navigateur : Chromium 152 (Windows 11).
- Serveur : un petit serveur statique local, comme Live Server.
- Test 1 : la lenteur a été obtenue en faisant retarder la réponse de `data.json` de 4 s par le serveur, plutôt qu'avec la limitation 3G de Chrome. Ce que voit la page est le même : une attente assez longue pour lire le message de chargement.
- Les messages de console sont recopiés tels quels. Le texte exact d'un `404` peut varier d'un serveur à l'autre : ici le serveur répond par une page HTML, d'où le `Unexpected token '<'` des tests 2 et 3. Avec un serveur qui répondrait autre chose, le début du message changerait, mais la cause resterait la même.
