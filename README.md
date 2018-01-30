# covoiturage_s1

Le client et le serveur n'ont pas les répertoirs node_modules, il faut les installer pour chacun d'eux.

[ ] Le server node requiert nodemon (utilitaire qui détecte les changements de code et relance le server node)
    > chaque rafraichissement vide la variable de session (équivalent à un redémarrage du serveur)

[ ] Angular CLI se lance avec la commande : ng serve --aot

# Les fonctionnalités implémentées intégralement (client-server)

[1] -L'utilisateur anonyme peut consulter les annonces via le moteur de recherche .
    - Il peut trier les annonces par prix ou bien par date.
    - Il peut afficher les détails d'une annonce et tracer le trajet sur une carte.
    - Les information du conducteur lui sont cachées s'il n'est pas connecté.
    - L'utilisateur peut s'inscrire et s'enregistrer.
    - S'il est connecté il peut les afficher en cliquant sur le lien "afficher le profil".
    - L'utilisateur peut réserver son itinéraire qui peut être inclus ou égal à l'itinéraire d'une annonce. (décrémente le nombre de places)
    
    
[2] - Les annonces sont hiérarchisées de la façon suivante : 
        - une annonce est composée d'une ou plusieurs portions,
        - une portion est composée de deux adresses.
        - une annonce créée a comme conducteur son créateur, de plus elle figurera dans son historique

[3] - L'utilisateur enregistré peut créer une annonce dans son espace (accès via menu du panel)
        - L'annonce peut comporter plusieurs étapes (converties en portions en BDD)
        - L'utilisateur peut en ajouter 6 au maximum (et en enlever).
        - Une fois les villes validées, on lui affiche les distances, durée et durée total de son itinéraire.
        - L'utilisateur doit choisir un prix pour chacune des portions, si celui-ci ne figure pas dans un prix standard.
        - Une fois les prix saisis, l'utilisateur valide et l'annonce est créée.
        [ i ] en base de donnée, on conserve les informations fournies par l'api google map pour les distance, géolocalisation et      
              durées.
# Les fonctionnalités implémentées seulement du côté serveur et disposant d'url intérrogable        

[ADMIN] - Afficher les utilisateur ayant la meilleur note
        - afficher les portions standards
        - Créer ou mettre à jour une portion standard
        - Bannir un membre.
        - Afficher les villes les plus impliquées dans un trajet
        - Afficher les utilisateurs les plus "conducteurs" et les plus "voyageurs"
        
[MEMBRE] - Laisser un message au conducteur ainsi qu'une note (vérification historique en commun)
          -Laisser un message au passager ainsi qu'une note (vérification historique en commun)
          
# Les plus 

[ ] - Gestion de la session avec express-session.
[ ] - Une "page" annonce détient autant de version (prix, distance, durée) qu'elle offre de combinaison de ses étapes
[ ] - Routage interne fils pour l'espace membre.
[ ] - Autocompletion des villes avec toutes les villes de france (primeng autocomplete).
[ ] - Datepicker pour la date de départ (primeng)
[ ] - gestion des portions + affichage sur une carte avec @agm-direction.
[ ] - Jointures avec Mongodb.
[ ] - ng-bootstrap.

# Base de donnée MongoDB

![alt text](https://github.com/0ctober/covoiturage_s1/blob/master/uml%20.png?raw=true)
