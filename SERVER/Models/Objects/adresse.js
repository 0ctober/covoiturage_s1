var moment = require('moment')
moment.locale("fr")
let urlDateParser = require('../../middleware/urlDateParser')

class Adresse {


	// Cette méthode calcul les données distance, durée, lat-lng
	// sur les villes passées en paramètre.
	// @Param l'api googlemap-Client
	// @param Itineraire sous la forme : 
	// 		[{'villeA':'Montpellier', 'villeB':'Toulouse'}, {'villeA':'Toulouse', 'villeB':'Cahors'}]
	// @return Le même itinéraire mais avec les informations : distance, durée, lat-lng en plus dans chaque objet.
	static apiMapDirection(API, param, callback){

		let itineraire = JSON.parse(param.itineraire)

		console.log(itineraire);

		let i = 0, error = false
		for(let portion of itineraire){

			API.directions({
				origin: portion[0] + ', France',
				destination: portion[1] + ', France'
			}, (err, response)=> {
				if (err) error = true
				else{
					let res = response.json.routes[0].legs
					delete res[0].steps
					delete res[0].traffic_speed_entry
					delete res[0].via_waypoint

					portion.push(res)

					console.log("i : "  + i)
					i++
					if(i==itineraire.length)
						callback(itineraire)
				}
			})
		}
		if(itineraire.length == 0 || error)
			callback([{'error':'Une erreur est survenue du côté server'}])
	}

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

}
module.exports = Adresse

