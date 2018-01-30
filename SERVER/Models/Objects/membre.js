let urlDateParser = require('../../middleware/urlDateParser')
let md5 = require('md5')
let ObjectId = require('mongodb').ObjectID

class Member {

static login(db, param, callback){

		let id = param.id
		let password = param.password

		console.log("param.session")
		console.log(param.session)
		if(param.session !== undefined && param.session.connected !== undefined && param.session.connected == true){

			callback(param['message'],[{"error":"vous êtes déjà connecté. Veuillez vous déconnecter si vous voulez changer d'utilisateur."}])

		}else{

			if(password!== '' && password!== undefined){
				password = md5(password)

				let cursor = db.collection("member")
				.find({"_id":id,"password":password})
				.toArray((err, documents)=>{
					if(err){
						callback(err, [])
					}
					else if(documents !== undefined){

						if(documents.length === 0){
							callback(param["message"], [{"error":"Identifiant ou mot de passe incorrect."}])
						}else{

							if(documents[0].fermeture){
								callback(param["message"], [{"error":"Votre compte a été temporairement fermé suite à des avis jugés trop faibles." }])
								param.session.connected = false
								param.session.user = undefined
								param.session.user_right = -1
							}else{
								param.session.connected = true
								param.session.user = id
								param.session.user_right = documents[0].user
								callback(param["message"], [{
									"success":"Connection réussie",
									'connected' : true,
									'user' : id,
									'right' : documents[0].user
								}])
							}
						}	
					}else callback(param["message"], [{"error":"Erreur de connction"}])
				})
			}
			else callback(param["message"], [{"error":"Erreur de connction"}])
		}

}

static logout(param, callback){
	if(param.session.connected == true){
		param.session.connected = false
		param.session.user = undefined
		param.session.user_right = -1
		callback(param['message'], [{"success":"Déconnexion réussie"}])
	}else
	callback(param['message'], [{"error":"Échec de déconnexion"}])

}

static register(db, param, callback){
	// On récupère le formulaire entier, 
	// et on le parse proprement.
	let form = JSON.parse(param.form)

	let login = form.login,
	pass1 = form.pass1,
	pass2 = form.pass2,
	nom = form.nom,
	prenom = form.prenom,
	dd = form.dd,
	mm = form.mm,
	yyyy = form.yyyy,
	adresse = form.adresse,
	phone = form.phone

	if(login == undefined)
		callback(param["message"], [{"error":"Identifiant incorrect"}])
	else if(login == "")
		callback(param["message"], [{"error":"Identifiant incorrect"}])
	else if(pass1 == undefined)
		callback(param["message"], [{"error":"Mot de passe 1 incorrect"}])
	else if(pass2 == undefined)
		callback(param["message"], [{"error":"Mot de passe 2 incorrect"}])
	else if(pass1 == "" || pass1.length < 6)
		callback(param["message"], [{"error":"Le mot de passde doit contenir 6 caractères minimum"}])
	else if(pass2 == "" || pass1.length < 6)
		callback(param["message"], [{"error":"Mot de passe incorrect"}])
	else if(pass1 !== pass2)
		callback(param["message"], [{"error":"Mots de passe pas identiques"}])
	else{

		let cursor = db.collection("member")
		.find({"_id":login})
		.toArray((err, documents)=>{
			if(err) callback(err, [])
				else if(documents !== undefined){
						// if(documents.length)
						if(documents.length > 0)
							callback(param["message"], [{"error":"L'identifiant "+login+" existe déjà."}])
						else{

							
							let dateAnniversaire = new Date(yyyy + '-' + mm + '-' + dd+'T00:00:00.000Z'),
							hash = md5(pass1)
							db.collection("member")
							.insert({
								"_id":login,
								"password":hash,
								"user":1,
								"name": nom,
								"firstname": prenom,
								"birthday": dateAnniversaire,
								"adress": adresse,
								"phone": phone,
								"fermeture":false,
								"gender": "",
								"age":0,
								"picture": "assets/avatar.png",
								"registered": new Date(),
								"description":"Bonjour, je suis nouveau sur la plateforme !",
								"note":{
									"conducteur":-1,
									"passager":-1
								},
								"pets":false,
								"smoking":false,
								"music":false,
								"vehicule":[],
								"historique":{
									"annulation":[],
									"passager":	[],
									"conducteur": []
								}, 
								"avis":{
									"passager":[]
								}
							})
							param.session.connected = true
							param.session.user = login
							param.session.user_right = 1
							callback(param["message"], [{"success":"Enregistrement réussi."}])
						}	
					}
					else callback(param["message"], [{"error":"Problème de connection"}])
				}
			)
		}
	}


	static sendMessageToConductor(db, param, callback){

		let message = JSON.parse(param.message)
		if(param.userSessionConnected !== undefined &&
			param.userSession !== undefined &&
			param.userSessionConnected === true){

			// On vérifie que l'utilisateur 'FROM' 
			// a été passsager de 'TO'
			// Récupération de l'historique passager de l'utilisateur
			// en session
			db.collection('member').
			find({'_id':param.userSession},{"historique.passager":1}).
			toArray((err, documents1)=>{
				if(err) 
					callback(err,[])
				else if(documents1 !== undefined){

					let FROM_USER_HISTORIQUE = documents1[0].historique.passager

					db.collection('member').
					find({'_id':param.to},{"historique.conducteur":1}).
					toArray((err, documents2)=>{
						if(err) 
							callback(err,[])
						else if(documents2 !== undefined){

							let TO_CONDUCTOR_HISTORIQUE = documents2[0].historique.conducteur
							let match = false
							for(let i of FROM_USER_HISTORIQUE){
								for(let j of TO_CONDUCTOR_HISTORIQUE){
									if(i===j){
										match = true;
										break;
									}
								}
							}
							if(match == true){
								db.collection('member').
								update(
									{"_id":param.to},
									{$addToSet: 
										{
											"avis.conducteur":
											{
												"vue":false,
												"user":param.userSession,
												"note" : parseInt(message.note),
												"com" : String(message.com)
											}
										}
									},(err,result)=>{
										callback(param['message'],[{"success":"le message a bien été envoyé"}, {"message":param.message}])
									})
								console.log("---param.message")
								// callback(param['message'],[{"success":"le message a bien été envoyé"}, {"message":param.message}])
							}else
							callback(param['message'],[{"error":"Vous n'avez pas été passager de ce conducteur"}])

						}
						else
							callback(param['message'],[{"success":"le message a bien été envoyé"}])
					})
				}else
				callback(param['message'],[{"success":"le message a bien été envoyé"}])
			})

		}else{
			callback(param['message'],[{"error":"Vous n'êtes pas connecté."}])
		}
	}
	static sendMessageToPassenger(db, param, callback){

		let message = JSON.parse(param.message)
		if(param.userSessionConnected !== undefined &&
			param.userSession !== undefined &&
			param.userSessionConnected === true){

			// On vérifie que l'utilisateur 'FROM' 
			// a été passsager de 'TO'
			// Récupération de l'historique passager de l'utilisateur
			// en session
			db.collection('member').
			find({'_id':param.userSession},{"historique.conducteur":1}).
			toArray((err, documents1)=>{
				if(err) 
					callback(err,[])
				else if(documents1 !== undefined){

					let FROM_USER_HISTORIQUE = documents1[0].historique.conducteur

					db.collection('member').
					find({'_id':param.to},{"historique.passager":1}).
					toArray((err, documents2)=>{
						if(err) 
							callback(err,[])
						else if(documents2 !== undefined){

							let TO_CONDUCTOR_HISTORIQUE = documents2[0].historique.passager
							let match = false
							for(let i of FROM_USER_HISTORIQUE){
								for(let j of TO_CONDUCTOR_HISTORIQUE){
									if(i===j){
										match = true;
										break;
									}
								}
							}
							if(match == true){
								db.collection('member').
								update(
									{"_id":param.to},
									{$addToSet: 
										{
											"avis.passager":
											{
												"vue":false,
												"user":param.userSession,
												"note" : parseInt(message.note),
												"com" : String(message.com)
											}
										}
									},(err,result)=>{
										callback(param['message'],[{"success":"le message a bien été envoyé"}, {"message":param.message}])
									})
								console.log("---param.message")
								// callback(param['message'],[{"success":"le message a bien été envoyé"}, {"message":param.message}])
							}else
							callback(param['message'],[{"error":"Vous n'avez pas été passager de ce conducteur"}])

						}
						else
							callback(param['message'],[{"success":"le message a bien été envoyé"}])
					})
				}else
				callback(param['message'],[{"success":"le message a bien été envoyé"}])
			})

		}else{
			callback(param['message'],[{"error":"Vous n'êtes pas connecté."}])
		}
	}

	// Un utilisateur veut regarder le profil 
	// d'un conducteur. Ce qui sera retourné SSI:
	// L'utilisateur est connecté
	static getProfil(db, param, callback){

		let annonce = param.annonce
		let user_connected = param.userConnected
		let user_viewer = param.userSsesison

		// Si la session n'étblie aucune connection
		// alors on retourne un message d'erreur
		if(/*user_connected !== undefined && user_connected == */false)
			callback([{'profil':null}])
		else{

			db.collection('member')
			.find({'historique.conducteur': new ObjectId(annonce)},{
				"historique.conducteur":1,
				'_id':0,
				'birthday':1,
				"name":1,
				"firstname":1,
				"age":1,
				"gender":1,
				"picture":1,
				"registered":1,
				"description":1,
				"note":1,
				"pets":1,
				"smoking":1,
				"music":1,
				"historique":1,
				"avis.passager.note":1,
				"avis.passager.com":1,
				"avis.conducteur.note":1,
				"avis.conducteur.com":1
			})
			.toArray((err, documents)=>{
				if(err) 
					callback([{'error': "can't connect to DB"}])
				else if(documents !== undefined){

					let age = new Date().getFullYear() - documents[0].birthday.getFullYear()
					documents[0].age = age
					callback([{'profil': documents}])

				}else{
					callback([{'profil': null}])
				}
			})
		}
	}
	static adminSearchOrderMembreBestNote(db, param, callback){
		let userConnected = param.userConnected
		let userSession = param.userSession
		let userRight = param.userRight
		if(userConnected !== undefined &&
			userSession !== undefined &&
			userRight !== undefined &&
			userConnected === true &&
			userRight === 0){
			db.collection('member').find({}).toArray((err,documents)=>{
				if(err) callback([])
					else{
						for (let x of documents){
							x.note.avg = (parseFloat(x.note.conducteur) + parseFloat(x.note.passager))/2;
						}
						callback([documents.sort(function(a, b) {
							return parseFloat(a.note.avg) - parseFloat(b.note.avg)
						})
						])
					}
				})
	}else{
		callback([])
	}
}

static adminStatsPlusCom(db, callback){
	db.collection('member')
	.find({},{"avis":1})
	.toArray((err,documents)=>{
		if(err) 
			callback([])
		else{
			for (let x of documents){
				if(x.avis.length === undefined){
					let passager = x.avis.passager
					let conducteur =x.avis.conducteurs
					if (passager === undefined && conducteurs === undefined){
						x.cpt = 0
					}else if(passager === undefined){
						x.cpt = x.avis.conducteurs.length
					}else{
						x.cpt = x.avis.passager.length
					}
				}else{
					x.cpt = x.avis.length
				}
			}
			let res = documents.sort(function(a, b) {
				return parseFloat(b.cpt) - parseFloat(a.cpt)
			})
			callback(res)
		}
	})
}

static adminNbConducteurPassagerAnnulation(db, callback){
	db.collection('member')
	.find({},{"historique":1})
	.toArray((err,documents)=>{
		if(err) 
			callback([])
		else{
			let conducteurs = 0;
			let passagers = 0;
			let annulations = 0;
			for(let x of documents){
				if(x.historique.annulation != undefined)
					annulations += x.historique.annulation.length
				if(x.historique.passager != undefined)
					passagers += x.historique.passager.length
				if(x.historique.conducteur != undefined)
					conducteurs += x.historique.conducteur.length
			}
			let res = {"conducteurs":conducteurs,"passagers":passagers,"annulations":annulations}
			callback(res)
		}
	})
}

static adminNbAnnonce(db, callback){
	db.collection('annonce')
	.find({})
	.toArray((err,documents)=>{
		if(err) 
			callback([])
		else{			
			let annonces = documents.length
			let res = {"annonces":annonces}
			callback(res)
		}
	})
}


static adminNbVilles(db, callback){
	
	let pipeline = [
	{
		$project:
		{
			"itineraire":1
		}

	},
	{
		$lookup:
		{
			from:"portion",
			localField:"itineraire.portions",
			foreignField :"_id",
			as : "portions"
		}
	},
	{
		$lookup:
		{
			from:"adresse",
			localField:"portions.portion",
			foreignField :"_id",
			as : "portion"
		}
	},
	{
		$project:
		{
			"portion.ville":1,
			"_id":0
		}

	},
	]

	db.collection('annonce')
	.aggregate(pipeline)
	.toArray((err,documents)=>{
		if(err) 
			callback([{"erreur":"Erreur"}])
		else{
			let dico = []
			for (let portion of documents){
				for (let ville of portion.portion){

					if (dico[ville.ville] === undefined)
						dico[ville.ville] = 1
					else
						dico[ville.ville] += 1
				}
			}
			console.log(dico)
			console.log(JSON.stringify(dico))
			let res = JSON.stringify(dico)
			console.log(res)
			callback(res)
		}
	})
}

static adminStats(db, param, callback){
	let userConnected = param.userConnected
	let userSession = param.userSession
	let userRight = param.userRight
	if(/*userConnected !== undefined &&
		userSession !== undefined &&
		userRight !== undefined &&
		userConnected === true &&
		userRight === 0*/true){
		this.adminStatsPlusCom(db, (resCom)=>{
			this.adminNbConducteurPassagerAnnulation(db, (resCon)=>{
				this.adminNbAnnonce(db, (resAnn)=>{
					this.adminNbVilles(db, (resVil)=>{
						callback([/*resCom,*/{'resCon':resCon},{'resAnn':resAnn},{'resVil':resVil}])
					})
				})
			})
		})
	}else{
		callback([])
	}
}

static bannisMembre (db, param, callback){
	let membre2Ban = param.membre2Ban
	let userConnected = param.userConnected
	let userSession = param.userSession
	let userRight = param.userRight
	if(userConnected !== undefined &&
		userSession !== undefined &&
		userRight !== undefined &&
		userConnected === true &&
		userRight === 0){
		db.collection('member').update({"_id":membre2Ban},{$set: {"fermeture":true}})
		callback([])
	}else{
		callback([])
	}
}
static registerAnonceStandard (db, param, callback){

	let depart = param.depart.toUpperCase()
	let arrivee = param.arrivee.toUpperCase()
	let prix = parseInt(param.prix)
	let userConnected = param.userConnected
	let userSession = param.userSession
	let userRight = param.userRight
	if(userConnected !== undefined &&
		userSession !== undefined &&
		userRight !== undefined &&
		depart !== undefined &&
		arrivee !== undefined &&
		prix !== undefined &&
		userConnected === true &&
		userRight === 0 
		){
		db.collection('portion_standard')
		.find({"a":depart,"b":arrivee})
		.toArray((err,documents)=>{
			if(err) callback([])
				if(documents.length>0){
					db.collection('portion_standard').update({"a":depart,"b":arrivee},{$set: {
						"prix" : prix,
					}})
				}else{
					db.collection('portion_standard').insert({
						"a" : depart,
						"b" : arrivee,
						"prix" : prix,
					})
				}
			})
			callback([])
		}else{
			callback([])
		}
	}
}
module.exports = Member