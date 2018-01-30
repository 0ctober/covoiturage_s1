class Villes {

	// Cette méthode permet d'autocompléter le champs
	// de recherche (départ et arrivée) lorsqu'on <input>
	// Elle retourne une collection de ville qui commencent 
	// par le préfixe passé en paramètre

	static getVillesOnInput(db, param, callback){
		// On créer une expression régulière :
		// -> les villes qui commencent par ce préfixe
		let prefix =  new RegExp('^'+param.prefix)
		// console.log(prefix)

		// Si le préfixe est vide, pas la peine de chercher
		// dans la base de données mongo > collection 'villes'
		if(prefix === undefined || prefix.length < 1){
			callback([{'villes': [] }])
		}else{

			let cursor = db.collection('villes')
			// l'option 'i' permet l'insensibilité à la casse.
			.find({'name':{'$regex' :prefix, '$options' : 'i'}},{'_id':0,'name':1})
			// On limite à 10
			.limit(10)
			.toArray((err, documents)=>{
				if(err){
					callback([{'error':'cant check the database'}])
				}else{
					// On va filtrer les villes en doubles : distinct
					// peu gourmand car la collection <= 10 
					// Ça évite un pipeline compliqué ...
					let villes = []

					// On va parcourir les villes
					for(let ville of documents){
						// On ajoute la première ville trouvé à la collection.
						if(villes.length == 0){
							villes.push(ville.name)
						}else{
							// Pour les autres villes, on va vérifier si
							// elles sont présente dans la collection.
							let i = 0;
							for(let tmp of villes){
								// Si elle est présente on quite la boucle.
								if(tmp == ville.name){
									break;
								}
								// Si pas présent on l'ajoute -> normiche.
								if(tmp !== ville.name){
									i++;
									if(i==villes.length){
										villes.push(ville.name)
									}
								}
								
							}
						}
					}
					callback({'villes':villes})
				}
			})
		}


	}
}
module.exports = Villes

