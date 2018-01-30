import { Component, TemplateRef, OnInit, ViewEncapsulation } from '@angular/core';
import { CatchSingleService } from './catch-single.service';
import { ActivatedRoute, Params, Router, Routes, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../../member/login/services.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import {GMapModule} from 'primeng/primeng';


@Component({
	selector: 'app-catch-annonce',
	templateUrl: './catch-annonce.component.html',
	styleUrls: ['./catch-annonce.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class CatchAnnonceComponent implements OnInit {

	constructor(
		private logginService: LoginService,
		private catchSingle: CatchSingleService,
		private route:ActivatedRoute,
		private router:Router, 
		private modalService: BsModalService
		) { 
		console.log("[CatchAnnonceComponent] > constructor > catchSingleAnnonce()");

		this.route.params.subscribe(
			(params: Params) => {

				this.catchSingle.catchSingleAnnonce(params.id, params.depart, params.arrivee,
					res=> {
						this.annonce = res[0];
						this.id_annonce = params.id;
						this.depart = params.depart;
						this.arrivee = params.arrivee;
					})
			})
	}

	// L'utilisateur veut réserver sa place, on vérifie qu'il soit connecté
	// S'il n'est pas connecté on le redirige vers /login
	reserver(){
		console.log("[CatchAnnonceComponent] > this.logginService.isLoggedIn");
		this.logginService.isLogged(res=>{
			if(res[0].connected){
				this.catchSingle.reserver(this.id_annonce, this.depart, this.arrivee, res2=>{
					console.log("[RESERVATION] > RES2")
					console.log(res2)
				})
				console.log("Vous venez de réserver votre place ! ");
				this.reserve = true;
			}
			else{
				this.router.navigate(['/login/'+this.id_annonce+'/'+this.depart+'/'+this.arrivee]);
			}
		})
	}
	// Afficher un modal bootstrap avec le profil du conducteur.
	// Si l'utilisateur n'est pas loggé on l'envoie au login
	openModal(template: TemplateRef<any>) {
		// Vérication logged ?
		this.logginService.isLogged(res=>{
			if(res[0].connected){
				this.catchSingle.getProfil(this.id_annonce,res=>{
					// init du profil conducteur
					this.conducteur=res[0].profil[0];
					// Affichage du profil
					this.modalRef = this.modalService.show(template);
				})
			}
			// Redirection vers login
			else{
				this.router.navigate(['/login/'+this.id_annonce+'/'+this.depart+'/'+this.arrivee]);
			}
		})
	}

	///
	lat: Number = 46.4497676;
	lng: Number = 2.7368444;
	zoom: Number = 6;

	dir = undefined;

	public getDirection() {
		this.dir = {
			origin: {lat: this.annonce._id.villes[this.depart].lat, lng: this.annonce._id.villes[this.depart].lng},
			destination: {lat: this.annonce._id.villes[this.arrivee].lat, lng: this.annonce._id.villes[this.arrivee].lng}
		};
	}

	/// Informations pour la map

	// title: string = 'My first AGM project';
	// lat: number = 51.678418;
	// lng: number = 7.809007;


	modalRef: BsModalRef;
	reserve: boolean = false;
	logged: boolean = false;
	annonce: any = null;
	id_annonce: string = "";
	depart: number ;
	arrivee: number ;
	conducteur: any = null;

	ngOnInit() {
		console.log("[CatchAnnonceComponent] > ngOnInit()");

	}

}
