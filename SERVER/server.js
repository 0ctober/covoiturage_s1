// [i] Express
let express = require('express')
let app = express()
app.use('/assets', express.static('public'))	// Réglage des dossiers
let cors = require('cors')
app.use(cors())
// [i] Mangodb
let MongoClient = require('mongodb').MongoClient
let url = "mongodb://localhost:27017/model"
// [i] Les Routes
let routes = require('./View/routes')
// [i] Session 
let session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
	secret: '5a1c7d0066bc4a3647c74f4e',
	resave: true,
	saveUninitialized: false,
	cookie: { 
		path:'/',
		secure:false,
		httpOnly:false,
		maxAge: null // Expire jamais
		// maxAge:1000 * 60 * 24
	}
}))
// GoogleMap API
let googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCm4g3sRwhhJBCtW2of8ta8VXpqNHEbb_Y'
})
/* Configuration du cooki en mode développement pour accepter les requêtes xHTTP et localhost:4200*/
app.use(function(req, res, next ){
	res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:4200')
	res.setHeader('Access-Control-Allow-Methods','OPTIONS,GET,PUT,POST,DELETE')
	res.setHeader('Access-Control-Allow-Credentials', true)
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
	next()
})

/* Mongo Connection & Routes */
MongoClient.connect(url, (err, db)=>{
	/* Annonce */
	//--------------------------- Cherche une annonce
	app.get('/annonces/search/:depart/:arrivee/:datetime/:order', (req,res)=>{
		routes.findAnnonce(req, res, db)
	})
	//--------------------------- Cherche une annonce
	app.get('/annonce/new/:formulaires', (req,res)=>{
		routes.newAnnonce(req, res, db)
	})
	//--------------------------- Input une ville
	app.get('/villes/input/:prefix', (req,res)=>{
		routes.getVillesOnInput(req, res, db)
	})
	//--------------------------- affiche une annonce
	app.get('/annonce/:id/:pa/:pb', (req,res)=>{
		routes.showOne(req, res, db)
	})
	app.get('/api-map/:itineraire', (req,res)=>{
		routes.apiMapDirection(req, res, googleMapsClient)
	})
	/* Utilisateur */
	//--------------------------- Se connecter
	app.get('/login/:id/:password', (req,res)=>{
		routes.login(req, res, db)
	})
	//--------------------------- Se déconnecter
	app.get('/logout', (req,res)=>{
		routes.logout(req, res, db)
	})
	//--------------------------- S'enregistrer
	// app.get('/register/:id/:password1/:password2', (req,res)=>{
	app.get('/register/:form', (req,res)=>{
		routes.register(req, res, db)
	})
	//--------------------------- Demander si on est connecté
	app.get('/member/logged', (req,res)=>{
		routes.isLogged(req, res, db)
	})
	//--------------------------- Voir le profil d'un utilisateur
	app.get('/profil/:annonce', (req,res)=>{
		routes.getProfil(req, res, db)
	})
	//--------------------------- Laisser un message au conducteur
	app.get('/member/sendmessage/conducteur/:to/:message/', (req,res)=>{
		routes.sendMessageToConductor(req, res, db)
	})
	//--------------------------- Laisser un message au passager
	app.get('/member/sendmessage/passager/:to/:message/', (req,res)=>{
		routes.sendMessageToPassenger(req, res, db)
	})
	//--------------------------- Rejoindre une annonce
	app.get('/annonce/join/:annonce/:depart/:arrivee', (req,res)=>{
		routes.joinAnnonce(req, res, db)
	})
	//--------------------------- Fonctionnalités Administrateur
	app.get('/administration/bannir/:membre', (req,res)=>{
		routes.bannisMembre(req, res, db)
	})
	app.get('/administration/register/annonceStandard/:depart/:arrivee/:prix',(req,res)=>{
		routes.registerAnonceStandard(req, res, db)
	})
	//--------------------------- verifie les prix standard
	app.get('/check/portion/standard/:collectionPortion', (req,res)=>{
		routes.checkPortionStandard(req, res, db)
	})
	app.get('/administration/search/order/membre/best/note',(req,res)=>{
		routes.adminSearchOrderMembreBestNote(req, res, db)
	})
	app.get('/administration/stats',(req,res)=>{
		routes.adminStats(req, res, db)
	})

	app.get('/test/:depart/:arrivee/:datetime/:order',(req,res)=>{
		routes.test(req, res, db)
	})
	// app.get('/test2',(req,res)=>{
	// 	routes.test2(req, res, db)
	// })

	console.log("--------------------------------------------")

	
	// app.get('/annonce/publi', routes.index)

	// app.get('/annonce/comment', routes.index)
	// app.get('/member', routes.index)
})
app.listen(1333)