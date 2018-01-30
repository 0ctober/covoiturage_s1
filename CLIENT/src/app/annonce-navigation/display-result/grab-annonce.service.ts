import { Injectable } from '@angular/core';
import { AjaxSettingsService } from '../../settings/ajax-settings.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';



@Injectable()
export class GrabAnnonceService {

	constructor(private http: Http, private cfg : AjaxSettingsService){	}
	private options = {withCredentials : true};

	search(depart, arrivee, datetime, order, callback): void {
		let furl = this.cfg.Server + '/annonces/search/' + depart + '/' + arrivee + '/' + datetime + '/' + order;

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
