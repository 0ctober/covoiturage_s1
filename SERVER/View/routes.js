let Annonce = require('../Models/Objects/annonce')
let Membre = require('../Models/Objects/membre')
let Villes = require('../Models/Objects/villes')
let Adresse = require('../Models/Objects/adresse')
let Test = require('../Models/Objects/test')

exports.getVillesOnInput = (req, res, db)=>{

	Villes.getVillesOnInput(
		db,
		{'prefix':req.params.prefix},
		result=>{
			let json=JSON.stringify(result, null, 2)
			res.send(json)
		})
}
exports.sendMessageToPassenger = (req, res, db)=>{

	Membre.sendMessageToPassenger(
		db,
		{
			"message":"sendMessageToPassenger",
			"to":req.params.to,
			"userSessionConnected":req.session.connected,
			"userSession":req.session.user,
			"message":req.params.message
		}
		,
		(etape, result)=>{
			console.log("- " + etape + ", " + result.length +" document(s) -- ")

			console.log(req.session.connected)
			console.log(req.session.user)
			console.log(req.session.user_right)

			let annonce =[]
			for(let e of result)
				annonce.push(e)
			let json=JSON.stringify(annonce, null, 2)
			json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')			
			res.send("<pre>"+json+"</pre>")
		})
}
exports.getProfil = (req, res, db)=>{
	Membre.getProfil (
		db,
		{
			"annonce":req.params.annonce,
			"userConnected":req.session.connected,
			"userSession":req.session.user,
		}
		,
		(result)=>{

			let o = []
			for(let e of result)
				o.push(e)

			let json=JSON.stringify(o, null, 2)
			// json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')			
			res.send(json)
		})	
}
exports.register = (req, res, db)=>{

	Membre.register(
		db,
		{"message":"Register", "form":req.params.form, "session":req.session},
		// {"message":"Register", "newUser":req.params.id,"pwd_1":req.params.password1,"pwd_2":req.params.password2,"session":req.session},
		(etape, result)=>{
			console.log("- " + etape + ", " + result.length +" document(s) -- ")

			console.log(req.session.connected)
			console.log(req.session.user)
			console.log(req.session.user_right)

			let annonce =[]
			for(let e of result)
				annonce.push(e)
			let json=JSON.stringify(annonce, null, 2)
			res.send(json)
		})
}

exports.login = (req, res, db)=>{

	Membre.login(
		db,
		{"message":"login", "id":req.params.id,"password":req.params.password,"session":req.session},
		(etape, result)=>{
			console.log("- " + etape + ", " + result.length +" document(s) -- ")

			console.log(req.session.connected)
			console.log(req.session.user)
			console.log(req.session.user_right)

			let o =[]
			for(let e of result)
				o.push(e)
			let json=JSON.stringify(o, null, 2)
			res.send(json)
		})
}
exports.joinAnnonce = (req, res, db)=>{

	Annonce.joinAnnonce(
		db,
		{"id":req.params.annonce,"depart":req.params.depart,"arrivee":req.params.arrivee,"session":req.session},
		(result)=>{

			let o =[]
			for(let e of result)
				o.push(e)
			let json=JSON.stringify(o, null, 2)
			json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')			
			res.send("<pre>"+json+"<pre>")
		})
}

exports.logout = (req, res, db)=>{

	Membre.logout(
		{"message":"logout", "session":req.session},
		(etape, result)=>{
			console.log("- " + etape + ", " + result.length +" document(s) -- ")
			
			console.log(req.session.connected)
			console.log(req.session.user)
			console.log(req.session.user_right)

			let annonce = []
			for(let e of result)
				annonce.push(e)
			let json=JSON.stringify(annonce, null, 2)
			json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')			
			res.send(json)
		})
}

exports.isLogged = function(req, res, db){

	let o = []
	
	if(req.session.connected)
		o.push({
			'connected' : req.session.connected,
			'user' : req.session.user,
			'right' : req.session.user_right
		})
	else
		o.push({'connected':false})

	let json=JSON.stringify(o)
	console.log(json)
	json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
	res.send(json)
}

exports.findAnnonce = function(req, res, db){

	Annonce.findAnnonce(
		db,
		{"message":"/Annonce/all", "filterObject":{"dispo":true}, "depart":req.params.depart,"datetime":req.params.datetime,"arrivee":req.params.arrivee, "order":req.params.order},
		(etape, result)=>{
			console.log("etape :" + etape + ", " + result.length +" annonces selectionnés")
			let annonce =[]
			for(let e of result)
				annonce.push(e)
			console.log(new Date())
			let json=JSON.stringify(annonce, null, 2)
			res.send(json)
			// json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')			
			// res.send("<pre>"+json+"<pre>")
		})
}
exports.newAnnonce = function(req, res, db){

	console.log('PUPUPUTE ')

	Annonce.newAnnonce(
		db,
		{
			"formulaires":req.params.formulaires,
			"userConnected":req.session.connected,
			"userSession":req.session.user,
			"userRight":req.session.user_right
		},
		(result)=>{
		
			let annonce =[]
			for(let e of result)
				annonce.push(e)
			console.log(new Date())
			let json=JSON.stringify(annonce, null, 2)
			json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')			
			res.send("<pre>"+json+"<pre>")
			// res.send(json)
		})
}

exports.showOne = function(req, res, db){

	Annonce.showOne(
		db,
		{"message":"/Annonce/showOneV2", "filterObject":{"dispo":true}, "query":{"_id":req.params.id,"a":req.params.pa,"b":req.params.pb}},
		(etape, result)=>{
			console.log("etape :" + etape + ", " + result.length +" annonces selectionnés")
			let annonce =[]
			for(let e of result)
				annonce.push(e)
			let json=JSON.stringify(annonce, null, 2)
			res.send(json)
		})

}
exports.apiMapDirection = function(req, res, API){

	Adresse.apiMapDirection(
		API, 
		{'itineraire': req.params.itineraire},
		(result)=>{
			let json=JSON.stringify(result, null, 2)
			// json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')			
			// res.send("<pre>"+json+"<pre>")
			res.send(json)
			
		}
		)
}
//
exports.bannisMembre = (req, res, db)=>{
	Membre.bannisMembre(
		db,
		{
			"membre2Ban":req.params.membre,
			"userConnected":req.session.connected,
			"userSession":req.session.user,
			"userRight":req.session.user_right,
		}
		,
		(result)=>{

			let o = []
			for(let e of result)
				o.push(e)

			let json=JSON.stringify(o, null, 2)
			res.send(json)
		})
}
exports.registerAnonceStandard = (req, res, db)=>{
	Membre.registerAnonceStandard(
		db,
		{
			"depart":req.params.depart,
			"arrivee":req.params.arrivee,
			"prix":req.params.prix,
			"userConnected":req.session.connected,
			"userSession":req.session.user,
			"userRight":req.session.user_right,
		}
		,
		(result)=>{

			let o = []
			for(let e of result)
				o.push(e)

			let json=JSON.stringify(o, null, 2)
			json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')			
			res.send("<pre>"+json+"<pre>")
		})
}


exports.checkPortionStandard = (req, res, db)=>{
	Annonce.checkPortionStandard(
		db,
		{
			"portions":req.params.collectionPortion,
			"userConnected":req.session.connected,
			"userSession":req.session.user,
			"userRight":req.session.user_right,
		}
		,
		(result)=>{

			let o = []
			for(let e of result)
				o.push(e)

			let json=JSON.stringify(o, null, 2)
			res.send(json)
		})
}

exports.adminSearchOrderMembreBestNote = (req, res, db)=>{
	Membre.adminSearchOrderMembreBestNote(
		db,
		{
			"userConnected":req.session.connected,
			"userSession":req.session.user,
			"userRight":req.session.user_right,
		}
		,
		(result)=>{

			let o = []
			for(let e of result)
				o.push(e)

			let json=JSON.stringify(o, null, 2)
			json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')			
			res.send("<pre>"+json+"<pre>")
		})
}
exports.adminStats = (req, res, db)=>{
	Membre.adminStats(
		db,
		{
			"userConnected":req.session.connected,
			"userSession":req.session.user,
			"userRight":req.session.user_right,
		}
		,
		(result)=>{

			let o = []
			for(let e of result)
				o.push(e)

			let json=JSON.stringify(o, null, 2)
			json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')			
			res.send("<pre>"+json+"<pre>")
		})
}

exports.test = (req, res, db)=>{
	Test.test(
		db,
		{"message":"/Annonce/all", "filterObject":{"dispo":true}, "depart":req.params.depart,"datetime":req.params.datetime,"arrivee":req.params.arrivee, "order":req.params.order},
		(etape, result)=>{
			console.log("etape :" + etape + ", " + result.length +" annonces selectionnés")
			let annonce =[]
			for(let e of result)
				annonce.push(e)
			console.log(new Date())
			let json=JSON.stringify(annonce, null, 2)
			// res.send(json)
			json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')			
			res.send("<pre>"+json+"<pre>")
		})
}
// exports.test2 = (req, res, db)=>{
// 	Test.test2(db,{},
// 		(result)=>{
// 			let o = []
// 			for(let e of result)
// 				o.push(e)
// 			let json=JSON.stringify(o, null, 2)
// 			json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')			
// 			res.send("<pre>"+json+"<pre>")
// 		})
// }
