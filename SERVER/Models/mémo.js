sudo rm /var/lib/mongodb/mongod.lock
sudo service mongod restart
/**
*	Ajouter un ID Dans une nestead Collection d'un autre objet
*	@OPERATOR $addToSet
**/

db.member.update(
	{"_id":"henrique.dos@gmail.com"},
	{$addToSet: {"historique.conducteur":ObjectId("5a1c7d0066bc4a3647c74f4e")}});

/**
*	Supprimer un élément d'un tableau 
* 	@OPERATOR $put
**/

collection.update(
  { _id: id },
  { $pull: { 'contact.phone': { number: '+1786543589455' } } }
);
/* ou */
db.stores.update(
    { }, /// Pas d'id, donc on peut supprimer dans plusieurs collections :)
    { $pull: { fruits: { $in: [ "apples", "oranges" ] }, vegetables: "carrots" } },
    { multi: true } // Plusieurs suppréssions !!
/* Suppression d'un élément du tableau "annulation" qui s'appel "@annulation" */
db.member.update({"_id":"henrique.dos@gmail.com"},
	{$pull: {"historique.annulation":"@annulation"}}
);
/* Suppression avec un "and" dans un tableau d'oblet "result":[{item:"B", score 8},{...}] */
db.survey.update(
  { },
  { $pull: { results: { score: 8 , item: "B" } } },
  { multi: true }
)


/ db.products.update(
   { _id: 100 },
   { $set:
      {
        quantity: 500,
        details: { model: "14Q3", make: "xyz" },
        tags: [ "coats", "outerwear", "clothing" ]
      }
   }
)

https://maps.googleapis.com/maps/api/geocode/json?address=34000+montpellier&key=AIzaSyCm4g3sRwhhJBCtW2of8ta8VXpqNHEbb_Y

https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood4&key=AIzaSyCm4g3sRwhhJBCtW2of8ta8VXpqNHEbb_Y