let noCase = require('ignore-case')
var moment = require('moment')
let ObjectId = require('mongodb').ObjectID
moment.locale("fr")

let urlDateParser = require('../../middleware/urlDateParser')
class Annonce {


	static timeAdd(t1,t2){

		// let t1_ = t1.split(':')
		// let t2_ = t2.split(':')

		// let h = parseInt(t1_[0]) + parseInt(t2_[0])
		// let m = parseInt(t1_[1]) + parseInt(t2_[1])

		// if(m>59){
		// 	h++
		// 	m = m - 60
		// }
		// console.log(String(h) + ":" + String(m))
		return t1+t2;//String(h) + ":" + String(m)
	}

	// Cette méthode va récupérer une annonce sur deux étapes de son trajet.
	// On va pouvoir l'appeler pour que l'annonce nous affiche deux points intermédiaires
	// de son itinéraire total. Imaginez ! 
	// On fait un pipeline sur la requête, puis on ajuste les informations telle que : 
	// Le prix sur la portion choisie, le nombre de place, le kilométrage total ainsi que la durée.
	static showOne(db, param, callback){
		let id = param.query._id
		let depart = param.query.a
		let arrivee = param.query.b

		if(typeof id === 'string')
			id = new ObjectId(id)

		let pipeline = [
		{
			$match: {
				"_id": id
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
		{ $unwind : '$conducteur' },
		{
			"$group": {
				"_id": {
					"_id":"$_id",
					"conducteur":{
						"firstname":"$conducteur.firstname",
						"pîcture":"$conducteur.picture",
						"pets":"$conducteur.pets",
						"smoking":"$conducteur.smoking",
						"music":"$conducteur.music",
					},
					"date_depart":"$date",

					"portions":"$portions",
					"villes":"$portion",
					"depart":"",
					"arrivee":"",
					"distance":"",
					"prix":null,
					"places":null,
					"duree":null
				}
			}
		}
		]


		let cursor = db.collection("annonce")
		.aggregate(pipeline)
		.toArray((err, documents)=>{
			if(err) callback(err, [])
				else if(documents[0] !== undefined){
					// init document
					documents[0].prix = 0
					documents[0].places = 100
					documents[0].distance = 0
					documents[0].duree = 0

					// On va ajouter l'heure du point de rendez-vous à la date
					// de l'annonce car chaque portion a une heure différente
					// -- 
					// On va mettre à zéro l'heure, les minutes et les secondes de la date
					let date = documents[0].date
					date = moment(date).hour(0)
					date = moment(date).minute(0)
					date = moment(date).seconds(0)

					// init locals
					let depart_index = documents[0]._id.villes[depart]
					let arrivee_index = documents[0]._id.villes[arrivee]
					let place = true
					let next = false
					let timeToSet = false

					// Ici nous disposons que d'une seule portion 
					// On récupère le prix, la distance, la durée
					// Les valeurs vont de la portion au document entier
					if( documents[0]._id.portions.length == 1){
						console.log("toto")
						documents[0].prix += documents[0]._id.portions[0].prix
						documents[0].places = documents[0]._id.portions[0].placeLibre
						documents[0].distance += documents[0]._id.portions[0].distance
						documents[0]._id.date_depart = urlDateParser.isoToPhrase(documents[0]._id.date_depart)
						// documents[0].duree = this.timeAdd("00:00",documents[0]._id.portions[0].duree)
						documents[0].duree = this.timeAdd(0,documents[0]._id.portions[0].duree)
					}else{

						console.log(documents[0])
						
						let tmp =  new Date(documents[0]._id.date_depart)
						// Ici on sait que le trajet comport plusieurs étapes,
						// On va donc additionner les prix, les distances, les durées
						// et calculer le nombre minimal de places dispo sur l'ensemble des portions
						for(let i of documents[0]._id.portions){

							console.log('+++++++')
								console.log(i)

							// documents[0]._id._id.date_depart = tmp

							if( i.portion[0].toString() == depart_index._id.toString() ){
								next = true
								// tmp = new Date(tmp).setSeconds(i.duree)
							}
							if(next /*&& i.placeLibre > 0*/){
								// TODO
								// On est dans les portions qui sont concernées par la recherche
								// if(timeToSet){
								// 	let hh_mm_rdv_portion = i.heure.split(':')
								// 	date = moment(date).hour(hh_mm_rdv_portion[0])
								// 	date = moment(date).minute(hh_mm_rdv_portion[1])
								// 	console.log('+++')
								// 	console.log(date)
								// 	console.log('+++')
								// 	// Maintenant on peut ajouter l'heure et les minutes de la portion
								// 	documents[0].date = date
								// 	timeToSet=false
								// }


								//
								documents[0].prix += i.prix
								documents[0].places = Math.min(i.placeLibre, documents[0].places)
								documents[0].distance += i.distance
								documents[0].duree = this.timeAdd(documents[0].duree,i.duree)
								
								if(i.portion[1].toString()==arrivee_index._id.toString()){
									documents[0]._id.date_depart = urlDateParser.isoToPhrase(tmp)//documents[0]._id.date_depart)
									break;
								}
							}else{
								tmp = new Date(tmp).setSeconds(i.duree)
							}
						}

					}
					console.log("-----depart_index")
					console.log(depart_index)
					console.log("------arrivee_index")
					console.log(arrivee_index)
					
					callback(param["message"], documents)
				}
				else callback(param["message"], [{"error":"Le trajet que vous cherchez n'existe pas !"}])
			}
		)
	}

	// Cette méthode permet d'enregistrer un utilisateur sur une portion
	// Elle est appelée par la méthode joinAnnonce(..)
	static subscribePortion(db, portion, user){
		
		db.collection("portion")
		.update({"_id":portion},
		{	
			$addToSet: {"accepted":user},
			$inc:{'placeLibre':-1}
		}
		)
	}
	// @param : annonce, depart, arrivee, session
	// Cette méthode inscrit un utilisateur connecté à un trajet.
	// On va donc parcourir les portions concernées par son itinéraire
	// et rajouter son id aux membres 'accepted' de la portion.
	static joinAnnonce(db, param, callback){

		let annonce = param.id//.toString()
		let depart = param.depart
		let arrivee = param.arrivee
		let user = param.session.user

		console.log("000000000")
		console.log(annonce)
		let cursor = db.collection("annonce")
		.find({
			'_id': new ObjectId(annonce)
		},{
			'itineraire.portions':1,
			'_id':0
		})
		.toArray((err, documents1)=>{
			if(err) callback(err, [])
				else if(documents1 !== undefined){
					// Ici on dispose des portions du trajet entier, 
					// on sait qu'un trajet à une portion va d'un départ à un arrivé
					// Deux cas se présente : 
					// Cas 1 : le trajet n'a qu'une portion => on inscrit l'utilisateur sur cette portion
					// Cas 2 : le trajet a plus d'une portion => p1:{a->b}, p2:{b->c}, p3:{c->d} ... etc
					//			On récupère les portions dans l'interval ouvert <]départ, arrivé[>

					console.log(documents1)

					let portions = documents1[0].itineraire.portions
					// Cas 1 :
					if(portions.length == 1){
						// On ajoute l'utilisateur à la réservation de la portion
						this.subscribePortion(db, portions[0], user)
						this.addToPassengerHistory(db, 
													{
														'user':	user,
														'annonce': annonce
													})
						callback([{'success':"vous avez été ajouté à l'annonce"}])
					}
					// Cas 2 :
					else if(portions.length > 1){
						let tmp = [],
						result = [],
						dep = false,
						arr = false
						for(let i = 0; i < portions.length; i++){
							tmp.push([i,i+1])
						}
						for(let i = 0; i < tmp.length; i++){
							if(tmp[i][0]==depart)
								dep = true
							if(tmp[i][1]==arrivee)
								arr = true
							if(dep && result.indexOf(portions[i]) == -1)
								result.push(portions[i])
							if(arr && result.indexOf(portions[i]) == -1)
								result.push(portions[i])
							if(dep&&arr)
								break
						}
						// On ajoute l'utilisateur à la réservation des portions
						for(let portion of result)
							this.subscribePortion(db, portion, user)
						callback(result)
					}
					else callback([{"error":"Le trajet que vous cherchez n'existe pas !"}])
				}
			else callback([{"error":"Le trajet que vous cherchez n'existe pas !"}])
		})
	}
	static findAnnonce(db, param, callback){
		console.log("- [PIPELINE] ")
		console.log("- db " + db)

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
			$match:{"_id.match":true, "_id.date":{'$gte':depart_date}}

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
	static checkPortionStandard(db, param, callback){

		let portions = JSON.parse(param.portions)

		let userConnected = param.userConnected
		let userSession = param.userSession
		let userRight = param.userRight

		if(userConnected !== undefined &&
			userSession !== undefined &&
			userRight !== undefined &&
			portions !== undefined &&
			userConnected === true &&
			(userRight === 0 || userRight === 1)){


			console.log("---------PORTION")
		console.log("portions : "+portions )
		console.log("a : "+portions[0][0] + "b : "+portions[0][1])
		console.log("---------PORTION")

		let i = 0
		for (let ville in portions){
			db.collection('portion_standard')
			.find({"a":portions[ville][0].toUpperCase(),"b":portions[ville][1].toUpperCase()})
			.toArray((err, documents)=>{
				if(err)
					callback([{'error':'internal error'}])
				else{
					console.log("---------documents")
					console.log(documents)
					console.log("---------documents")
					if(documents.lenth == 0 || documents[0] == undefined)
						portions[ville].push({'prix':0})
					else
						portions[ville].push({'prix':documents[0].prix})
					i++
					if(i==portions.length)
						callback(portions)

				}
			})
		}

		}else{
			callback([{'error':'internal error 255'}])
		}
	}

	// L'administrateur modifie un prix standard
	static modificationPrixStandardAnnonce(db, param, callback){
			// let portions = [
			// 	{"a":"MONTPELLIER","b":"TOULOUSE","prix":0},
			// 	{"a":"TOULOUSE","b":"BORDEAUX","prix":0}
			// ]

			let portions = param.portions
			let userConnected = param.userConnected
			let userSession = param.userSession
			let userRight = param.userRight

			if(userConnected !== undefined &&
				userSession !== undefined &&
				userRight !== undefined &&
				portions !== undefined &&
				userConnected === true &&
				(userRight === 0 || userRight === 1)){

				let i = 0
			for (let x in portions){
				db.collection('portion_standard')
				.find({"a":x.a,"b":x.b})
				.toArray((err,documents)=>{
					if(err)	callback([{"error":"erreur du serveur"}])
						else{
							if(documents.length == 0) 
								x[0].prix = 0
							else{
								x.prix = documents[0].prix
							}
							i++
							if(i==portions.length)
								callback(portions)
						}
					})
			}
		}else{
			callback([])
		}
	}

	// Création d'une annonce
	static newAnnonce(db, param, callback){

		let formulaires = JSON.parse(param.formulaires)
		let tarifUser = formulaires.tarifUser,
			geoCodes = formulaires.geoCodes,
			tarifStandards = formulaires.tarifStandards,
			date = formulaires.datetime

		console.log('tarifUser')
		console.log(tarifUser)

		// let userConnected = param.userConnected
		// let userSession = param.userSession
		// let userRight = param.userRight

		let villes = []
		let portions = []

		if(/*userConnected !== undefined &&
			userSession !== undefined &&
			userRight !== undefined &&
			portions !== undefined &&
			userConnected === true &&
			(userRight === 0 || userRight === 1)*/true){

			let annonce = {
				// "_id": new ObjectId(),
				"dispo" : true,
				"fini" : false,
				"voiture" : "XXXXXXX",
				"direct" : geoCodes.length === 1,
				"itineraire" : {
					"nbPlaces" : 3,
					"portions" : []
				},
				"date" : new Date(date),  //DATE
				"durée" : 0,
				"distance" : 0,
				"conducteur" : param.userSession
			}

			console.log('geoCodes.length : ' + geoCodes.length)
			console.log('prix user : ' + tarifUser)
			console.log('prix standards : ' + tarifStandards)
			console.log('$$$$$$$$$$$$$$$$$$$$$$$$$')
			console.log('$$$$$$$$$$$$$$$$$$$$$$$$$')
			console.log('$$$$$$$$$$$$$$$$$$$$$$$$$')
			let prix = 0
			// Version o`u il n'y a que deux villes
			if(geoCodes.length == 1){

				// test si le tarif dtandard existe 
				if(/*tarifStandards[0] !== undefined  && tarifStandards[0][2] !== undefined && */tarifStandards[0][2].prix == 0){

					console.log('IF VERIFIED ')
					prix = tarifUser[0]
				}
				else {

					console.log('ELSE VERIFIED ')
					prix = tarifStandards[0][2].prix
				}
					console.log('END ')

				portions.push({
					"placeLibre":3,
					"booking" : [],
					"accepted" : [],
					"portion" : [],
					"heure" : "00:00:00",    //DATE
					"duree" : Math.floor(parseInt(geoCodes[0][2][0].duration.value)),
					"prix" : prix,
					"distance" : Math.floor(parseInt(geoCodes[0][2][0].distance.value)/1000),
					"prixKM" : 0
				})
				villes.push({
					"voie" : "là",
					"numero" : 0,
					"departement" : 0,
					"ville" : geoCodes[0][0].toUpperCase(),
					"lat" : geoCodes[0][2][0].start_location.lat,
					"lng" : geoCodes[0][2][0].start_location.lng
				})
				villes.push({
					"voie" : "là",
					"numero" : 0,
					"departement" : 0,
					"ville" : geoCodes[0][1].toUpperCase(),
					"lat" : geoCodes[0][2][0].end_location.lat,
					"lng" : geoCodes[0][2][0].end_location.lng
				})
			console.log('villes : ' + villes.length)

			}else{

				// Ici on retrouve plusieurs trajets
				// On regroupe les villes avec leurs données géographiques
				for(let i = 0; i< geoCodes.length  ; i++){
					let ville = []

					// test si le tarif dtandard existe 
					if(tarifStandards[i] !== undefined  && tarifStandards[i][2] !== undefined && tarifStandards[i][2].prix > 0)
						prix = tarifStandards[i][2].prix
					else 
						prix = tarifUser[i]

					if(i==0){
						prix = tarifUser[1]
						portions.push({
							"placeLibre":3,
							"booking" : [],
							"accepted" : [],
							"portion" : [],
							"heure" : "00:00:00",    //DATE
							"duree" : Math.floor(parseInt(geoCodes[i][2][0].duration.value)),
							"prix" : prix,
							"distance" : Math.floor(parseInt(geoCodes[i][2][0].distance.value)/1000),
							"prixKM" : 0
						})
						villes.push({
							"voie" : "là",
							"numero" : 0,
							"departement" : 0,
							"ville" : geoCodes[i][0].toUpperCase(),
							"lat" : geoCodes[i][2][0].start_location.lat,
							"lng" : geoCodes[i][2][0].start_location.lng
						})
					}
					else if(i==geoCodes.length-1){
						portions.push({
							"placeLibre":3,
							"booking" : [],
							"accepted" : [],
							"portion" : [],
							"heure" : "00:00:00",
							"duree" : Math.floor(parseInt(geoCodes[i][2][0].duration.value)),
							"prix" : prix,
							"distance" : Math.floor(parseInt(geoCodes[i][2][0].distance.value)/1000),
							"prixKM" : 0
						})
						villes.push({
							"voie" : "ok",
							"numero" : 0,
							"departement" : 0,
							"ville" : geoCodes[i][0].toUpperCase(),
							"lat" : geoCodes[i][2][0].start_location.lat,
							"lng" : geoCodes[i][2][0].start_location.lng
						})
						villes.push({
							"voie" : "ok",
							"numero" : 0,
							"departement" : 0,
							"ville" : geoCodes[i][1].toUpperCase(),
							"lat" : geoCodes[i][2][0].end_location.lat,
							"lng" : geoCodes[i][2][0].end_location.lng
						})
					}
					else{
						portions.push({
							"placeLibre":3,
							"booking" : [],
							"accepted" : [],
							"portion" : [],
							"heure" : "00:00:00",
							"duree" : Math.floor(parseInt(geoCodes[i][2][0].duration.value)),
							"prix" : prix,
							"distance" : Math.floor(parseInt(geoCodes[i][2][0].distance.value)/1000),
							"prixKM" : 0
						})	
						villes.push({
							"voie" : "",
							"numero" : 0,
							"departement" : 0,
							"ville" : geoCodes[i][0].toUpperCase(),
							"lat" : geoCodes[i][2][0].start_location.lat,
							"lng" : geoCodes[i][2][0].start_location.lng
						})
					}
					console.log('prix : ' + prix)
				}
			}

			console.log('DEBUG')
			

			console.log('DEBUG')
			let idVilles = []
			let id1 = 0
			for(let ville of villes){

				db.collection('adresse')
				.insert(ville, (err,doc1)=>{

					console.log(doc1)
					idVilles.push(doc1.ops[0]._id)

					id1++
					if(id1==villes.length){
						for(let portion = 0;portion < portions.length; portion++){
							portions[portion].portion.push(ObjectId(idVilles[portion]))
							portions[portion].portion.push(ObjectId(idVilles[portion+1]))
						}

						let id2 = 0
						let idPortions = []
						for(let p of portions){

							db.collection('portion')
							.insert(p, (err,doc2)=>{

								idPortions.push(ObjectId(doc2.ops[0]._id))

								id2++
								if(id2 == portions.length){

									let id3=0
									for(let idportion of idPortions){
										id3++
										annonce.itineraire.portions.push(idportion)
										if(id3==idPortions.length)

										db.collection('annonce')
										.insert(annonce, (err,doc3)=>{

											if(err) callback([{'error':'BDD error'}])
											else{

												this.addToCondutcorHistory(db, 
													{
														'user':	param.userSession,
														'annonce': doc3.ops[0]._id
													})

												callback([
												{
													'annonces':doc3.ops[0],
													'idPortions':idPortions,
													'portions':portions,
													'Adresses':idVilles,
													'villes':villes,
													// 'prixUser':tarifUser,
													// 'tarifStandards':tarifStandards,
													// 'conducteur':'jc.idjell@gmail.com',
													// 'positionGéographiques':geoCodes
												}
												])
											}
										})
									}
								}
							})
						}
					}

				})
			}

		}else{
			callback([{'error':'internal error 255'}])
		}
	}


	// Ajout de l'annonce dans l'historique du conducteur
	static addToCondutcorHistory(db, param){
		
		let annonce = param.annonce
		let user = param.user

		console.log('-- annonce -- ' + annonce )
		console.log('-- user -- ' + user )

		db.collection('member').update(
			{'_id':  user},
			{$addToSet: {"historique.conducteur":  annonce}});

	}

	// Ajout de l'annonce dans l'historique du passager
	static addToPassengerHistory(db, param){

		let annonce = param.annonce
		let user = param.user
		 
		db.collection('member').update(
			{'_id':new ObjectId(user)},
			{$addToSet: {"historique.passager":ObjectId(annonce)}});

	}	

}
module.exports = Annonce

