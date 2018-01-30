let noCase = require('ignore-case')
var moment = require('moment')
let ObjectId = require('mongodb').ObjectID
moment.locale("fr")
let urlDateParser = require('../../middleware/urlDateParser')

class Test {

	static testXXX(db, param, callback){


		console.log('[test1]')

		let id = 'test_1'

		db.collection('test')
		.insert({'nom':id}, (err,doc)=>{

			callback([{'inseted':doc.ops[0]._id}])


			let pipeline = [
			{

			}
			]


		})
		
		console.log('[test1]')
		// callback([{'erreur':null}])
	}
	static test2(db, param, callback){

		// let cursor = 
		// db.
		// collection('annonce')
		// .find({}, {_id:1})
		// .toArray()
	}

	static test(db, param, callback){
		console.log("- [PIPELINE] ")

		// On passe les villes en majuscule
		// Pour éviter les erreur de match,
		// La BDD contient les adresse > villes en uppercase
		let depart = param.depart.toUpperCase()
		let arrivee = param.arrivee.toUpperCase()
		console.log(depart +' '+ arrivee)
		let order = param.order // ordonner par date : 0, par prix :1

		let depart_date = urlDateParser.urlToData(param.datetime)

		let pipeline = [
		{
			$project:
			{
				"itineraire":1,
				"conducteur":1,
				"infos":1,
				"match":1,
				"heure":1,
				"date":1,
				"prix":1
			}
		},
		{
			$lookup:
			{
				from:"portion",
				localField:"itineraire.portions",
				foreignField :"_id",
				as : "portions"
			},
		},
		{
			$lookup:
			{
				from:"adresse",
				localField:"portions.portion",
				foreignField :"_id",
				as : "portion"
			},
		},
		{
			$lookup:
			{
				from:"member",
				localField:"conducteur",
				foreignField :"_id",
				as : "conducteur"
			},
		},
		{
			"$group": {
				"_id": {
					"_id":"$_id",
					"conducteur":{
						"firstname":"$conducteur.firstname",
						"photo":"$conducteur.picture",
						"age":"$conducteur.age",
						"note":"$conducteur.note.conducteur"
					},
					"portions" : "$portions",
					"date":"$date",
					"villes":"$portion.ville",
					"prix":0,
					'adresses':"$portion",
					'a':{"$indexOfArray" :["$portion.ville", depart]},
					'b':{"$indexOfArray" :["$portion.ville", arrivee]},
					"match": {
						'$and':[
						{"$in":[depart, '$portion.ville']},
						{"$in":[arrivee, '$portion.ville']},
						{
							"$gte":[
							{"$indexOfArray" :["$portion.ville", arrivee]},
							{"$indexOfArray" :["$portion.ville", depart]}
							]
						}
						]
					},
					"prix":{
						"$sum": 
						"$portions.prix"
					}
				}
			}
		},
		{
			$match:{/*"_id.match":true ,*/ "_id.date":{'$gte':depart_date}}

		}
		]

		// Est ce qu'on souhaite ordonner par date ?
		if(order == 0)
			pipeline.push({$sort:{"_id.date":1}})

		let cursor = db.collection("annonce")
		.aggregate(pipeline)
		.toArray((err, documents)=>{
			if(err) callback(err, [])
				else if(documents !== undefined){

					// Cette boucle nous permet de parcourir les annoneces
					for(let annonce of documents){
						// Les champs 'a' et 'b' sont des index (int)
						// Ils permettent dans la collection d''adresses'
						// et la collection 'villes' de récupérer le départ et l'arrivée
						// algorithmiquement et via le template angular
						let a = annonce['_id'].a,
						b = annonce['_id'].b
						annonce['_id'].prix = 0
						annonce['_id'].places = 999

						// Ici on va parcourir les portions
						for(let i=a; i < b; i++){

							// On additionne les prix.
							annonce['_id'].prix += annonce['_id'].portions[i].prix

							// On s'occupe du nombre de place sur chaque portiion
							// On remplace le nombre de place s'il est plus petit
							// Si on atteint O, on supprime la collection <Annonce> 
							// du document entier.
							// console.log(typeof annonce['_id'].portions[i].placeLibre)
							if(annonce['_id'].portions[i].placeLibre<annonce['_id'].places)
								annonce['_id'].places=annonce['_id'].portions[i].placeLibre

							// À chque portion, on affecte à l'annonce la valeur la plus petite
							// Comme on initialise le nombre de place à 999, 
							// la première condition matchera.
						}
						console.log('-')
						// On converti la date dans un format agréable 
						// on passe du format ISO à 'mercredi 5 janvier 2018 à 14:30'
						annonce['_id'].date = urlDateParser.isoToPhrase(annonce['_id'].date)
					}
					// Si on souhaite trier par prix ascendant, on appel la méthode de trie
					if(order == 1){
						documents.sort(function(a, b) {
							return parseFloat(a._id.prix) - parseFloat(b._id.prix)
						})
					}
					callback(param["message"], documents)
				}
				else callback(param["message"], [])
			}
		)
	}
}
module.exports = Test

