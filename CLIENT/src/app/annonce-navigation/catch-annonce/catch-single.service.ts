import { Injectable } from '@angular/core';
import { AjaxSettingsService } from '../../settings/ajax-settings.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';


@Injectable()
export class CatchSingleService {

	constructor(private http: Http, private cfg : AjaxSettingsService){	}
	private options = {withCredentials : true};

	// On récupère l'annonce avec son '_id' en BDD
	// Le départ et l'arrivée sont les étapes du trajet 
	// qui intéresse l'internaute.
	catchSingleAnnonce(annonce, depart, arrivee, callback):void {
		let furl = this.cfg.Server + '/annonce/' + annonce + '/' + depart + '/' + arrivee;

		this.http.get(furl, this.options)
		.map((res:Response) =>  res.json())
		.subscribe(
			res => {
				console.log(res);
				callback(res);
			},
			error => callback([{'error':'cant check the server'}])
			);
	}

	// Si l'utilisateur est connecté et qu'il veut voir le profil
	// du conducteur. Le server re-vérifie qu'il soit  authentifié
	// La méthode prend en paramètre l'id de l'annonce
	getProfil(annonce, callback):void {
		let furl = this.cfg.Server + '/profil/' + annonce;

		this.http.get(furl, this.options)
		.map((res:Response) =>  res.json())
		.subscribe(
			res => {
				console.log(res);
				callback(res);
			},
			error => callback([{'error':'cant check the server'}])
			);
	}

	// Permet de reserver sa place pour un ensemble de portion (une ou plusieurs)
	reserver(annonce, depart, arrivee, callback):void {
		let furl = this.cfg.Server + '/annonce/join/' + annonce + '/' + depart + '/' + arrivee;

		this.http.get(furl, this.options)
		.map((res:Response) =>  res.json())
		.subscribe(
			res => {
				console.log(res);
				callback(res);
			},
			error => callback([{'error':'cant check the server'}])
			);
	}
}
