# covoiturage_s1

Le client et le serveur n'ont pas les répertoirs node_modules, il faut les installer pour chacun d'eux.

[ ] Le server node requiert nodemon (utilitaire qui détecte les changements de code et relance le server node)
    > chaque rafraichissement vide la variable de session (équivalent à un redémarrage du serveur)

[ ] Angular CLI se lance avec la commande : ng serve --aot

# Les fonctionnalités implémentées intégralement (client-server)

[1] <br />
    -L'utilisateur anonyme peut consulter les annonces via le moteur de recherche .<br />
    - Il peut trier les annonces par prix ou bien par date.<br />
    - Il peut afficher les détails d'une annonce et tracer le trajet sur une carte.<br />
    - Les information du conducteur lui sont cachées s'il n'est pas connecté.<br />
    - L'utilisateur peut s'inscrire et s'enregistrer.<br />
    - S'il est connecté il peut les afficher en cliquant sur le lien "afficher le profil".<br />
    - L'utilisateur peut réserver son itinéraire qui peut être inclus ou égal à l'itinéraire d'une annonce. (décrémente le nombre de places)<br />
    
    
[2] <br />
        - Les annonces sont hiérarchisées de la façon suivante : <br />
        - une annonce est composée d'une ou plusieurs portions,<br />
        - une portion est composée de deux adresses.<br />
        - une annonce créée a comme conducteur son créateur, de plus elle figurera dans son historique<br />

[3] <br />
        - L'utilisateur enregistré peut créer une annonce dans son espace (accès via menu du panel)<br />
        - L'annonce peut comporter plusieurs étapes (converties en portions en BDD)<br />
        - L'utilisateur peut en ajouter 6 au maximum (et en enlever).<br />
        - Une fois les villes validées, on lui affiche les distances, durée et durée total de son itinéraire.<br />
        - L'utilisateur doit choisir un prix pour chacune des portions, si celui-ci ne figure pas dans un prix standard.<br />
        - Une fois les prix saisis, l'utilisateur valide et l'annonce est créée.<br />
        [ i ] en base de donnée, on conserve les informations fournies par l'api google map pour les distance, géolocalisation et      
              durées.<br />
# Les fonctionnalités implémentées seulement du côté serveur et disposant d'url intérrogable        

[ADMIN] <br />
        - Afficher les utilisateur ayant la meilleur note<br />
        - afficher les portions standards<br />
        - Créer ou mettre à jour une portion standard<br />
        - Bannir un membre.<br />
        - Afficher les villes les plus impliquées dans un trajet<br />
        - Afficher les utilisateurs les plus "conducteurs" et les plus "voyageurs"<br />
        
[MEMBRE] <br />
        - Laisser un message au conducteur ainsi qu'une note (vérification historique en commun)<br />
        -Laisser un message au passager ainsi qu'une note (vérification historique en commun)<br />
          
# Les plus 

[+] - Gestion de la session avec express-session.<br />
[+] - Une "page" annonce détient autant de version (prix, distance, durée) qu'elle offre de combinaison de ses étapes<br />
[+] - Routage interne fils pour l'espace membre.<br />
[+] - Autocompletion des villes avec toutes les villes de france (primeng autocomplete).<br />
[+] - Datepicker pour la date de départ (primeng)<br />
[+] - gestion des portions + affichage sur une carte avec @agm-direction.<br />
[+] - Jointures avec Mongodb.<br />
[+] - ng-bootstrap.<br />

# Bon à savoir

[i] : Les objets du serveur node se trouvent : /SERVER/Models/Objects/<br />
[i] : Les <schémas> de collection de la BDD sont hard-codés dans ce dossier : /SERVER/Models/inserts/<br />
    * Ils ne sont pas utils mais peuvent aider à comprendre la hiérarchie des objets entre eux.<br />
    * Si vous voulez consulter la BDD mongo après opération CRUD via Angular : <br />
        * 1. commande : mongo<br />
        * 2. commande : use model <br />
        * 3. db.member.find({}).pretty()<br />
        
[i] : Une couche de liaison fait l'interface entre les routes et les méthodes de chaques objets : SERVER/View/routes.js<br />
[i] : Pour Angular n'hésitez pas à regarder l'arborescence des dossier pour observer la répartition modules -> features modules -> components <br />


# Base de donnée MongoDB 

![alt text](https://github.com/0ctober/covoiturage_s1/blob/master/uml%20.png?raw=true)
